# User Instruction Memory

This file records user instructions, preferences, and teachings for reference in future interactions.

## Format

### User Instruction Entry
User instruction entries should follow this format:

[User Instruction Summary]
- Date: [YYYY-MM-DD]
- Context: [Mentioned scenario or time]
- Instructions:
  - [Content of user teaching or instruction, described line by line]

### Project Knowledge Entry
Entries discovered by the Agent during task execution should follow this format:

[Project Knowledge Summary]
- Date: [YYYY-MM-DD]
- Context: Discovered by Agent while performing [specific task description]
- Category: [Operations & Deployment|Build Methods|Testing Methods|Troubleshooting & Debugging|Workflow & Collaboration|Environment Configuration]
- Instructions:
  - [Specific knowledge points, described line by line]

## Deduplication Strategy
- Before adding a new entry, check for similar or identical instructions.
- If a duplicate is found, skip the new entry or merge it with the existing one.
- When merging, update the context or date information.
- This helps avoid redundant entries and keeps the memory file tidy.

## Entries

[Project Knowledge Summary]
- Date: 2026-08-01
- Context: Discovered by Agent while adding danmu-count enrichment to the DRPY project
- Category: Environment Configuration
- Instructions:
  - The DRPY project requires Node.js version 17-23 (package.json engines). This sandbox did not pre-install Node; it was installed to /opt/monkeycode/nodejs/bin (already on PATH) as v20.20.2.
  - Install project dependencies with: `npm install --no-audit --no-fund` (263 packages, ~24s).

[Project Knowledge Summary]
- Date: 2026-08-01
- Context: Discovered by Agent while implementing danmu-count enrichment against the external danmu_api2 service
- Category: Troubleshooting & Debugging
- Instructions:
  - The external danmu service (http://8.130.134.173:9321) API structure: `GET /api/v2/search/anime?keyword=剧名` returns `animes[].animeId`; `GET /api/v2/bangumi/{animeId}` returns `bangumi.episodes` array whose length is the danmu count.
  - This service intermittently times out under the sandbox network (observed 5s timeouts on bursts of requests). All calls must use a timeout + graceful degradation (return 0 / "暂无弹幕") and cache results for ~10 minutes.

[Project Knowledge Summary]
- Date: 2026-08-03
- Context: Discovered by Agent while converting DRPY2 JS source (豆瓣) into a TVBox JAR spider class
- Category: Build Methods
- Instructions:
  - TVBox spider jar `public/jar/custom_spider.jar` is APK/DEX format (one `classes.dex`). Converted spider classes are named `com.github.catvod.spider.merge.x1.csp_XXX` and merged into this jar.
  - HTTP GET util inside the jar: `com.github.catvod.spider.merge.k.b.l(String url, Map headers)` returns String (OkHttp wrapper).
  - Android build chain installed at `/opt/android-sdk` (cmdline-tools/latest, platforms/android-34, build-tools/34.0.0):
    1) `javac -encoding UTF-8 -source 8 -target 8 -bootclasspath /opt/android-sdk/platforms/android-34/android.jar -d out <stub Spider.java> <merge/k/b stub> <csp_X.java>`
    2) `/opt/android-sdk/build-tools/34.0.0/d8 --lib /opt/android-sdk/platforms/android-34/android.jar --min-api 21 --output out public/jar/custom_spider.jar csp_X.class` (merges old dex + new class into a new classes.dex)
    3) rebuild jar: keep original entries, replace `classes.dex` with d8 output; sync `public/jar/custom_spider.jar.md5`.
  - Stub classes (`Spider.java`, `merge/k/b.java`) are compile-time only and must NOT be packaged; the runtime jar provides the real classes.
  - The original `classes.dex` in custom_spider.jar has a corrupted checksum and out-of-order string_ids (dexdump refuses it). d8 rebuild fixes the checksum; to inspect the dex use a custom Python parser instead of dexdump.

[Project Knowledge Summary]
- Date: 2026-08-03
- Context: Discovered by Agent while reverse-engineering TVBox danmu JARs and optimizing `controllers/danmu.js`
- Category: Troubleshooting & Debugging
- Instructions:
  - TVBox danmu API full chain (from `CvM2Hn685UPi.jar` dexdump): search `{base}/api/v2/search/episodes?anime=剧名&episode=集数` (empty response falls back to no-prefix `{base}/search/episodes`), danmu data `{base}/api/v2/comment/{epId}?format=xml` returns raw XML (`<d>` tags) directly — prefer `format=xml`, keep `format=json` only as JSON-to-XML fallback.
  - Search response accepts top-level JSON array OR `episodes`/`animes` arrays; matching = strict year containment + multiple episode-number candidates (`第N集/期/话/章/回`, `_%d`, `_%02d`, `[N]`, `(N)`, `E/EP` prefix) + edit-distance similarity threshold 0.85; movie fallback when only a movie matches.
  - `danmuapi-1-nu.vercel.app` backup source is unreachable from this sandbox (TLS handshake hangs ~10s). Do not rely on it during local tests.
  - `controllers/danmu.js` uses a 25s overall timeout wrapper (Promise.race) so the route always returns a valid empty XML ("暂无弹幕") even when external sources hang; retries are applied only to timeout-class errors (ECONNABORTED), connection failures break immediately; search endpoints use 6s timeout with 1 retry, comment/bangumi use 20s with 2 retries.
  - Keep `req.query.episode` as a raw string (e.g. "第3集"), do NOT `parseInt` it — candidate matching needs the string; `extractNumber` pulls the digit.
  - A 10-minute result cache (`danmuResultCache`) dedupes identical `base+name+episode` lookups.

[Project Knowledge Summary]
- Date: 2026-08-05
- Context: Discovered by Agent while debugging "弹幕没了" on the production deploy of moli-drpy
- Category: Operations & Deployment
- Instructions:
  - Production servers: `http://8.130.134.173:5757` is the drpy main service (danmu routes live here); `http://8.130.134.173:9321` is the danmu-api instance and is publicly reachable. Both health checks via `curl`.
  - danmu-api `/api/v2/search/episodes` (multi-platform aggregation) takes ~10s EVERY time for a title with no danmu results (no-result responses are NOT cached); results ARE cached (2nd identical call ~0.1s). The un-prefixed `/search/episodes` is only fast because it hits that same cache.
  - Prefer `/api/v2/fongmi/danmaku?name=剧名&episode=集数` as the fast path: ~0.2s for indexed titles, returns `[{name, url}]` (absolute comment URL), empty `[]` when no hit; then fetch the comment URL (rewrite host to the local base) with `?format=xml` to get Bilibili `<d>` XML in ~0.6s.
  - An 8s axios timeout on search + BUILTIN_MAX_RETRY=1 + multiple query modes stacked to 50s+ hangs; the fix (commit 5e7582b) is fongmi-first + a 10s overall Promise.race budget so the route always returns within budget.
