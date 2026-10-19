#!/usr/bin/env python3
"""Deploy the Sonali Sarode Makeover static site to Vercel production.

Uploads each JPG via upload_file (registered by SHA-1), then creates a
production deployment with text files inline. In the deployed copy,
.svg image refs in index.html are swapped to .jpg (the repo keeps
UTF-8 base64-SVG wrappers because the GitHub connector rejects binary).
"""
import base64
import hashlib
import json
import os
import re
import subprocess
import sys

WS = os.path.expanduser("~/workspace/sonali-sarode-makeover")
IMGS = os.path.join(WS, "assets/images")
PROJECT = "prj_ArxtUgeozgZSt9f29ESTUo93sXED"


def vcall(name, arguments):
    r = subprocess.run(
        ["/opt/hatch/bin/vercel", "call-tool", "--name", name,
         "--arguments-json", json.dumps(arguments)],
        capture_output=True, text=True)
    if r.returncode != 0 or '"ok":true' not in r.stdout:
        print(f"vercel {name} failed:\n{r.stdout[-2000:]}\n{r.stderr[-2000:]}",
              file=sys.stderr)
        sys.exit(1)
    return r.stdout


def main() -> None:
    uploads = {}
    for f in sorted(os.listdir(IMGS)):
        if not f.endswith(".jpg"):
            continue
        raw = open(os.path.join(IMGS, f), "rb").read()
        # NOTE: the vercel CLI takes base64 via argv (MAX_ARG_STRLEN=128KB),
        # so keep every JPG <= 90KB or upload_file fails with E2BIG.
        assert len(raw) <= 90 * 1024, f"{f} is {len(raw)//1024}KB - recompress under 90KB"
        sha = hashlib.sha1(raw).hexdigest()
        vcall("upload_file", {
            "xVercelDigest": sha,
            "requestBody": base64.b64encode(raw).decode(),
        })
        uploads[f"assets/images/{f}"] = {"sha": sha, "size": len(raw)}
    print(f"images uploaded: {len(uploads)}")

    files = []

    def add_text(arc):
        with open(os.path.join(WS, arc)) as fh:
            raw = fh.read()
        if arc == "index.html":
            raw = raw.replace(".svg", ".jpg")
        if arc == "api/ig.js":
            tok_file = os.path.join(WS, "tools", ".ig-token")
            uid_file = os.path.join(WS, "tools", ".ig-user-id")
            if os.path.exists(tok_file) and os.path.exists(uid_file):
                with open(tok_file) as fh:
                    token = fh.read().strip()
                with open(uid_file) as fh:
                    uid = fh.read().strip()
                if token and uid:
                    raw = raw.replace("__IG_TOKEN__", token)
                    raw = raw.replace("__IG_USER_ID__", uid)
                    print("Instagram token baked into api/ig.js")
                else:
                    print("Token files empty - deploying api/ig.js unconfigured (fallbacks stay)")
            else:
                print("No Instagram token files - deploying api/ig.js unconfigured (fallbacks stay)")
        files.append({"file": arc, "data": raw, "encoding": "utf-8"})

    for arc in ["index.html", "css/styles.css", "js/main.js", "robots.txt",
                "sitemap.xml", "assets/images/favicon.svg", "api/ig.js"]:
        add_text(arc)
    for arc, u in uploads.items():
        files.append({"file": arc, "sha": u["sha"], "size": u["size"]})

    out = vcall("create_deployment", {"requestBody": {
        "name": "sonali-sarode-makeover",
        "project": PROJECT,
        "target": "production",
        "projectSettings": {"framework": None},
        "files": files,
    }})
    m = re.search(r'\\"id\\":\s*\\"(dpl_[^\\"]+)\\"', out)
    print("deployment:", m.group(1) if m else out[:300])


if __name__ == "__main__":
    main()
