// Vercel serverless function: live Instagram data for sonali-sarode-makeover.
// The __IG_TOKEN__ and __IG_USER_ID__ placeholders are replaced with real
// values at deploy time by tools/deploy_vercel.py (read from
// tools/.ig-token and tools/.ig-user-id, which are never committed).
// Without them the function answers 503 and the page keeps its
// hardcoded fallback content.
const IG_TOKEN = "__IG_TOKEN__";
const IG_USER_ID = "__IG_USER_ID__";
const API = "https://graph.facebook.com/v21.0";

function fmt(n) {
  if (typeof n !== "number" || isNaN(n)) return null;
  if (n >= 1000) {
    // Truncate (not round) to match Instagram's own display, e.g. 10978 -> 10.9K
    const v = Math.floor(n / 100) / 10;
    return (v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)) + "K";
  }
  return String(n);
}

async function g(path) {
  const r = await fetch(`${API}${path}${path.includes("?") ? "&" : "?"}access_token=${IG_TOKEN}`);
  const j = await r.json();
  if (j.error) throw new Error(j.error.message || "graph api error");
  return j;
}

module.exports = async (req, res) => {
  // Edge-cache successful responses for an hour; serve stale for a day on failure.
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
  if (!IG_TOKEN || IG_TOKEN.indexOf("__IG_") === 0) {
    res.status(503).json({ error: "instagram not configured" });
    return;
  }
  const q = req.query || {};
  const what = q.what || "stats";
  try {
    if (what === "stats") {
      const j = await g(`/${IG_USER_ID}?fields=followers_count,follows_count,media_count,username`);
      res.status(200).json({
        followers: j.followers_count,
        followers_display: fmt(j.followers_count),
        following: j.follows_count,
        media_count: j.media_count,
        username: j.username,
      });
    } else if (what === "reels") {
      const limit = Math.min(parseInt(q.limit || "6", 10) || 6, 12);
      const j = await g(
        `/${IG_USER_ID}/media?fields=id,caption,media_type,permalink,thumbnail_url,timestamp&limit=${limit * 2}`
      );
      const reels = (j.data || [])
        .filter((m) => m.media_type === "VIDEO" && m.permalink && m.thumbnail_url)
        .slice(0, limit)
        .map((m) => ({
          id: m.id,
          permalink: m.permalink,
          thumbnail_url: m.thumbnail_url,
          caption: (m.caption || "").slice(0, 90),
          timestamp: m.timestamp,
        }));
      res.status(200).json({ reels });
    } else {
      res.status(400).json({ error: "unknown what" });
    }
  } catch (e) {
    res.status(502).json({ error: "instagram fetch failed" });
  }
};
