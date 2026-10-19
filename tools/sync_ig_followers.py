#!/usr/bin/env python3
"""Sync the Instagram follower count onto the Sonali Sarode Makeover site.

Reads the live follower count for @sonalisarode_makeover via instagram-cli,
formats it the way Instagram displays it (truncated, e.g. 10978 -> 10.9K),
and if it differs from what's on the site: updates every occurrence in
index.html, commits + pushes to GitHub, and redeploys to Vercel.

Exits 0 quietly when nothing changed. Exits non-zero with a message on error
(never deploys on error).
"""
import json
import os
import re
import subprocess
import sys

ACCOUNT_ID = "17841409298352384"
WS = os.path.expanduser("~/workspace/sonali-sarode-makeover")
INDEX = os.path.join(WS, "index.html")


def run(cmd, **kw):
    r = subprocess.run(cmd, capture_output=True, text=True, **kw)
    if r.returncode != 0:
        print(f"COMMAND FAILED: {' '.join(cmd)}\n{r.stderr[-2000:]}", file=sys.stderr)
        sys.exit(1)
    return r


def fmt_followers(n: int) -> str:
    # Match Instagram's display: truncate (not round) to 1 decimal
    if n >= 1000:
        v = int(n / 100) / 10
        s = f"{v:.1f}".rstrip("0").rstrip(".")
        return f"{s}K"
    return str(n)


def main() -> None:
    r = run(["/opt/hatch/bin/instagram-cli", "profile",
             "--account-id", ACCOUNT_ID])
    try:
        data = json.loads(r.stdout)
        count = int(data["profiles"][0]["follower_count"])
    except (json.JSONDecodeError, KeyError, IndexError, TypeError, ValueError) as e:
        print(f"Could not parse follower count: {e}\n{r.stdout[:500]}",
              file=sys.stderr)
        sys.exit(1)

    new_val = fmt_followers(count)

    with open(INDEX) as f:
        html = f.read()
    m = re.search(r"<strong>([\d.]+K?)</strong> followers", html)
    if not m:
        print("Current follower value not found in index.html", file=sys.stderr)
        sys.exit(1)
    old_val = m.group(1)

    print(f"live={count} formatted={new_val} site={old_val}")
    if new_val == old_val:
        print("No change — nothing to do.")
        return

    occurrences = html.count(old_val)
    html = html.replace(old_val, new_val)
    with open(INDEX, "w") as f:
        f.write(html)
    print(f"Replaced {occurrences} occurrences of {old_val} with {new_val}")

    # Commit + push to GitHub
    run(["git", "-C", WS, "add", "-A"])
    run(["git", "-C", WS, "commit", "-q", "-m",
         f"Sync Instagram followers: {old_val} -> {new_val}"])
    paths_file = "/tmp/sonali_sync_paths.txt"
    r2 = subprocess.run(
        ["git", "-C", WS, "ls-files", "--cached", "--others",
         "--exclude-standard", "-z", "--", ".",
         ":(glob,exclude)**/*.muse-github-snapshot-sync.json"],
        capture_output=True)
    if r2.returncode != 0:
        print(r2.stderr.decode()[-2000:], file=sys.stderr)
        sys.exit(1)
    with open(paths_file, "wb") as f:
        f.write(r2.stdout)
    run(["/opt/hatch/bin/github", "push-files",
         "--owner", "atharvas07", "--repo", "sonali-sarode-makeover",
         "--branch", "main",
         "--message", f"Sync Instagram followers: {old_val} -> {new_val}",
         "--source-dir", WS, "--paths-file", paths_file])

    # Redeploy to Vercel
    deploy_script = os.path.join(WS, "tools", "deploy_vercel.py")
    run([sys.executable, deploy_script])
    print("Sync complete: site updated and redeployed.")


if __name__ == "__main__":
    main()
