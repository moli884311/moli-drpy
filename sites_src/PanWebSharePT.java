package com.github.catvod.spider;

/* loaded from: classes.dex */
public class PanWebSharePT extends com.github.catvod.spider.Pan {
    private static org.json.JSONObject a;
    private java.lang.String c;

    private static java.lang.String filter139Content(java.lang.String str) {
        return (new org.json.JSONObject(com.github.catvod.spider.merge.m.C0806k.a(com.github.catvod.spider.merge.m.C0806k.c("/config.json"))).optString("panBlock").contains("移动云盘") && java.util.regex.Pattern.compile("https?://(?:[a-zA-Z0-9.-]+\\.)?139\\.com/(?:[a-zA-Z0-9/#?=&_-]+)").matcher(str).find()) ? "" : str;
    }

    public java.lang.String categoryContent(java.lang.String str, java.lang.String str2, boolean z, java.util.HashMap<java.lang.String, java.lang.String> hashMap) {
        java.util.HashMap m77b = com.github.catvod.spider.merge.A.a.m77b();
        if (hashMap != null && hashMap.size() > 0) {
            m77b.putAll(hashMap);
        }
        java.lang.String l = java.lang.Long.toString(java.lang.System.currentTimeMillis());
        if (m77b.get("cateId") != null) {
            str = (java.lang.String) m77b.get("cateId");
        }
        java.lang.StringBuilder sb = new java.lang.StringBuilder();
        sb.append("https://www.91panta.cn");
        java.lang.String a2 = com.github.catvod.spider.merge.A.a.a("/queryTopicList?tagId=%s&page=%s&_=" + l, new java.lang.Object[]{str, str2}, sb);
        java.util.HashMap hashMap2 = new java.util.HashMap();
        hashMap2.put("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1");
        hashMap2.put("referer", "https://www.91panta.cn");
        java.lang.String l2 = com.github.catvod.spider.merge.k.C0779b.l(a2, hashMap2);
        int parseInt = java.lang.Integer.parseInt(str2);
        com.github.catvod.spider.merge.c.C0756c c0756c = new com.github.catvod.spider.merge.c.C0756c();
        java.util.ArrayList arrayList = new java.util.ArrayList();
        org.json.JSONArray m78c = com.github.catvod.spider.merge.A.a.m78c(l2, "records");
        int i = 0;
        while (i < m78c.length()) {
            org.json.JSONObject jSONObject = m78c.getJSONObject(i);
            i = com.github.catvod.spider.merge.b.C0750k.c(jSONObject.getString("id"), jSONObject.getString("title"), "https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/D9nT/1200X800/139.jpg/webp", jSONObject.getString("tagName"), arrayList, i, 1);
        }
        c0756c.w(arrayList);
        c0756c.i(parseInt, 5000, 30, 0);
        return c0756c.toString();
    }

    @Override // com.github.catvod.spider.Pan
    public java.lang.String detailContent(java.util.List<java.lang.String> list) {
        java.lang.String str = list.get(0);
        java.lang.String str2 = "https://www.91panta.cn/queryTopicContent?topicId=" + str + "&_=" + java.lang.Long.toString(java.lang.System.currentTimeMillis());
        java.util.HashMap hashMap = new java.util.HashMap();
        hashMap.put("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1");
        hashMap.put("referer", "https://www.91panta.cn");
        org.json.JSONObject jSONObject = new org.json.JSONObject(com.github.catvod.spider.merge.k.C0779b.l(str2, hashMap));
        com.github.catvod.spider.merge.c.C0758e b = com.github.catvod.spider.merge.A.a.b(str);
        b.k(jSONObject.getString("title"));
        b.q(jSONObject.getString("postTime"));
        b.e(jSONObject.getString("tagName"));
        jSONObject.getString("summary");
        java.lang.String string = jSONObject.getString("content");
        java.util.HashSet hashSet = new java.util.HashSet();
        java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("https?://(?:[a-zA-Z0-9.-]+\\.)?139\\.com/(?:[a-zA-Z0-9/#?=&_-]+)").matcher(filter139Content(string.replaceAll("<[^>]+>", "").replaceAll("amp;", "")));
        while (matcher.find()) {
            java.lang.String group = matcher.group();
            if (!group.contains("139.com")) {
                break;
            }
            java.lang.String decode = java.net.URLDecoder.decode(group);
            b.h(decode);
            hashSet.add(decode);
        }
        java.util.ArrayList arrayList = new java.util.ArrayList(hashSet);
        com.github.catvod.spider.PanOrder.sort(arrayList);
        b.m(detailContentVodPlayFrom(arrayList));
        b.n(detailContentVodPlayUrl(arrayList));
        org.json.JSONObject jSONObject2 = new org.json.JSONObject(com.github.catvod.spider.merge.c.C0756c.m(b));
        org.json.JSONArray optJSONArray = jSONObject2.optJSONArray("list");
        if (optJSONArray != null) {
            for (int i = 0; i < optJSONArray.length(); i++) {
                org.json.JSONObject jSONObject3 = optJSONArray.getJSONObject(i);
                if (jSONObject3 != null && jSONObject3.optString("vod_play_url").isEmpty()) {
                    jSONObject3.put("vod_play_from", "");
                    jSONObject3.put("vod_play_url", "");
                }
            }
        }
        return com.github.catvod.spider.merge.a.C0731a.processVodData(jSONObject2.toString());
    }

    public java.lang.String homeContent(boolean z) {
        java.util.ArrayList arrayList = new java.util.ArrayList();
        java.util.List asList = java.util.Arrays.asList("39765285016165", "39765284616164", "39724838540291", "44732560408431", "39724839640293", "39724837340289", "39983744385926", "39956600861068", "000");
        java.util.List asList2 = java.util.Arrays.asList("电影", "剧集", "动漫", "短剧", "综艺", "音乐", "少儿", "记录", "其它");
        for (int i = 0; i < asList.size(); i++) {
            arrayList.add(new com.github.catvod.spider.merge.c.C0754a((java.lang.String) asList.get(i), (java.lang.String) asList2.get(i), null));
        }
        return com.github.catvod.spider.merge.A.a.a("{}", arrayList);
    }

    @Override // com.github.catvod.spider.Pan
    public void init(android.content.Context context, java.lang.String str) {
        try {
            super.init(context, str);
        } catch (java.lang.Exception e) {
            e.printStackTrace();
        }
    }

    public java.lang.String searchContent(java.lang.String str, java.lang.String str2) {
        java.util.ArrayList arrayList = new java.util.ArrayList();
        java.lang.String str3 = "https://www.91panta.cn/search?keyword=" + str + "&page=" + str2 + "&_=" + java.lang.Long.toString(java.lang.System.currentTimeMillis());
        java.util.HashMap hashMap = new java.util.HashMap();
        hashMap.put("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1");
        hashMap.put("referer", "https://www.91panta.cn");
        hashMap.put("x-requested-with", "XMLHttpRequest");
        org.json.JSONArray b = com.github.catvod.spider.merge.A.a.b(com.github.catvod.spider.merge.k.C0779b.l(str3, hashMap), "searchResultPage", "records");
        int i = 0;
        while (i < b.length()) {
            org.json.JSONObject jSONObject = b.getJSONObject(i).getJSONObject("topic");
            i = com.github.catvod.spider.merge.b.C0750k.c(jSONObject.getString("id"), jSONObject.getString("title").replaceAll("<[^>]+>", ""), "https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/D9nT/1200X800/139.jpg/webp", jSONObject.getString("tagName"), arrayList, i, 1) + 1;
        }
        return com.github.catvod.spider.merge.c.C0756c.n(arrayList);
    }

    public java.lang.String searchContent(java.lang.String str, boolean z) {
        return searchContent(str, "1");
    }

    public java.lang.String searchContent(java.lang.String str, boolean z, java.lang.String str2) {
        return searchContent(str, str2);
    }
}
