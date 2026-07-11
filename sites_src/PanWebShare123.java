package com.github.catvod.spider;

/* loaded from: classes.dex */
public class PanWebShare123 extends com.github.catvod.spider.Pan {
    private static java.lang.String j = "";
    private static java.lang.String k = "";
    private long i;

    private java.lang.String b(java.lang.String str) {
        java.util.HashMap b = com.github.catvod.spider.merge.b.v.b("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36");
        b.put("Referer", j);
        b.put("Cookie", k);
        b.put("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6");
        return com.github.catvod.spider.merge.k.C0779b.l(str, b);
    }

    private java.util.List<java.lang.String> c(com.github.catvod.spider.merge.G.f fVar) {
        java.util.ArrayList arrayList = new java.util.ArrayList();
        java.util.Iterator<com.github.catvod.spider.merge.G.i> it = fVar.n0("div.message > div > div.alert,div.message > div.alert,div.message > section > div.alert,div.message").iterator();
        while (it.hasNext()) {
            java.lang.String t0 = it.next().t0();
            java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("www\\.123\\w{3}\\.com/s/([^/]+)?").matcher(t0);
            java.util.regex.Matcher matcher2 = java.util.regex.Pattern.compile("(https?://[^\\s]+(?:\\.html)?)").matcher(t0);
            if (matcher.find() || matcher2.find()) {
                java.lang.String replace = t0.replace("请您务必转存保存后再进行下载，以免消耗分享者的免登流量", "").replaceAll("\\s+", "").replace(".html", "");
                if (matcher.find()) {
                    arrayList.add(processExtractionCode((java.lang.Object) replace));
                } else if (matcher2.find()) {
                    java.lang.String replace2 = matcher2.group().replace(".html", "");
                    java.util.regex.Matcher matcher3 = java.util.regex.Pattern.compile("提取码[:：]\\s*([a-zA-Z0-9]{4})").matcher(replace);
                    if (matcher3.find()) {
                        replace2 = replace2 + "?pwd=" + matcher3.group(1);
                    }
                    java.lang.String str = (java.lang.String) processExtractionCode((java.lang.Object) replace2);
                    if (!str.isEmpty() && str.contains("http")) {
                        arrayList.add(str);
                    }
                }
            }
        }
        if (arrayList.size() == 1 && !((java.lang.String) arrayList.get(0)).contains("http")) {
            java.lang.String str2 = (java.lang.String) arrayList.get(0);
            java.util.Iterator<com.github.catvod.spider.merge.G.i> it2 = fVar.n0("a").iterator();
            while (it2.hasNext()) {
                java.lang.String filterCloudDiskLinks = com.github.catvod.spider.merge.a.C0731a.filterCloudDiskLinks(it2.next().d("href"));
                if (filterCloudDiskLinks.contains("/s/") || filterCloudDiskLinks.contains("/t/")) {
                    if (filterCloudDiskLinks.contains(".123") && !str2.contains("码")) {
                        str2 = com.github.catvod.spider.merge.a.C0733c.a("提取码：", str2);
                    }
                    if (filterCloudDiskLinks.contains("cloud.") && !str2.contains("码")) {
                        str2 = com.github.catvod.spider.merge.a.C0733c.a("访问码：", str2);
                    }
                    arrayList.set(0, filterCloudDiskLinks + str2);
                }
            }
        }
        com.github.catvod.crawler.SpiderDebug.log(arrayList.toString());
        return arrayList;
    }

    private void d(java.lang.String str) {
        java.lang.String str2 = j;
        if (!str2.contains("123panfx.com") || !str2.contains("pan1.me")) {
            long currentTimeMillis = java.lang.System.currentTimeMillis() - this.i;
            if (currentTimeMillis < 21000) {
                try {
                    java.lang.Thread.sleep(21000 - currentTimeMillis);
                } catch (java.lang.InterruptedException unused) {
                    java.lang.Thread.currentThread().interrupt();
                }
            }
        }
        java.lang.String str3 = new java.lang.String[]{"感谢楼主分享！", "这个资源太棒了！", "已收藏，谢谢！", "不错的资源，支持一下", "楼主辛苦了！", "内容很有用，感谢分享"}[new java.util.Random().nextInt(6)];
        java.lang.String str4 = j + "/post-create-" + com.github.catvod.spider.merge.y.f.l(str, "thread-", ".") + "-1.htm";
        java.util.HashMap b = com.github.catvod.spider.merge.b.v.b("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.90 Safari/537.36");
        b.put("Referer", j);
        b.put("Cookie", k);
        b.put("Accept-Language", "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6");
        b.put("X-Requested-With", "XMLHttpRequest");
        b.put("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        java.util.HashMap hashMap = new java.util.HashMap();
        hashMap.put("doctype", "1");
        hashMap.put("return_html", "0");
        hashMap.put("quotepid", "");
        hashMap.put("message", str3);
        hashMap.put("quick_reply_message", "4");
        com.github.catvod.spider.merge.k.C0779b.g(str4, hashMap, b).a();
        this.i = java.lang.System.currentTimeMillis();
    }

    public static java.lang.Object processExtractionCode(java.lang.Object obj) {
        java.lang.String replaceAll;
        if (!(obj instanceof java.lang.String)) {
            return obj;
        }
        java.lang.String replaceAll2 = java.util.regex.Pattern.compile("(\\?pwd=[a-zA-Z0-9]+)(.*?)\\?pwd=[a-zA-Z0-9]+").matcher(java.util.regex.Pattern.compile("链接：").matcher((java.lang.String) obj).replaceAll("")).replaceAll("$1$2");
        java.util.regex.Pattern.compile("\\?").matcher(replaceAll2).find();
        if (java.util.regex.Pattern.compile("\\?pwd=[a-zA-Z0-9]{4}").matcher(replaceAll2).find()) {
            replaceAll = java.util.regex.Pattern.compile("(提取码[\\s:：]*[a-zA-Z0-9]{4}|密码[\\s:：]*[a-zA-Z0-9]{4}|码[\\s:：]*[a-zA-Z0-9]{4})").matcher(replaceAll2).replaceAll("").trim();
        } else {
            java.util.regex.Pattern.compile("(提取码[\\s:：]*)([a-zA-Z0-9]{4})").matcher(replaceAll2);
            replaceAll = java.util.regex.Pattern.compile("(https?://[^\\s]+)(提取码[\\s:：]*)([a-zA-Z0-9]{4})").matcher(replaceAll2).replaceAll("$1?pwd=$3");
        }
        return java.util.regex.Pattern.compile("#$").matcher(java.util.regex.Pattern.compile("\\?\\?pwd=").matcher(replaceAll).replaceAll("?pwd=")).replaceAll("");
    }

    public java.lang.String categoryContent(java.lang.String str, java.lang.String str2, boolean z, java.util.HashMap<java.lang.String, java.lang.String> hashMap) {
        try {
            com.github.catvod.spider.merge.G.f a = com.github.catvod.spider.merge.D.a.a(b(j + "/forum-" + str + "-" + str2 + ".htm"));
            java.util.ArrayList arrayList = new java.util.ArrayList();
            java.util.Iterator<com.github.catvod.spider.merge.G.i> it = a.n0("ul.threadlist > li").iterator();
            while (it.hasNext()) {
                com.github.catvod.spider.merge.G.i next = it.next();
                if (!next.n0("i").a("data-placement").contains("top")) {
                    java.lang.String d = next.n0("div > div.subject > a,div > div.style3_subject > a").b().d("href");
                    java.lang.String t0 = next.n0("div > div.subject > a,div > div.style3_subject > a").b().t0();
                    java.lang.String a2 = next.n0("a > img").a("src");
                    if (!a2.startsWith("http")) {
                        a2 = j + "/" + a2;
                    }
                    arrayList.add(new com.github.catvod.spider.merge.c.C0758e(d, t0, a2, next.n0("div > div.subject > a.badge,div > div.style3_subject > a.badge").c()));
                }
            }
            com.github.catvod.spider.merge.c.C0756c c0756c = new com.github.catvod.spider.merge.c.C0756c();
            c0756c.i(java.lang.Integer.valueOf(str2).intValue(), 0, 0, 0);
            c0756c.w(arrayList);
            return c0756c.toString();
        } catch (java.lang.Exception unused) {
            return "";
        }
    }

    @Override // com.github.catvod.spider.Pan
    public java.lang.String detailContent(java.util.List<java.lang.String> list) {
        try {
            java.lang.String str = j + "/" + list.get(0);
            com.github.catvod.spider.merge.G.f fVar = new com.github.catvod.spider.merge.G.f("");
            for (int i = 1; i < 3; i++) {
                fVar = com.github.catvod.spider.merge.H.g.d(b(str));
                if (!fVar.n0("div.message").c().contains("请回复后再查看")) {
                    break;
                }
                d(list.get(0));
            }
            java.util.List<java.lang.String> c = c(fVar);
            java.util.HashSet hashSet = new java.util.HashSet();
            java.util.Iterator<java.lang.String> it = c.iterator();
            while (it.hasNext()) {
                hashSet.add(it.next());
            }
            java.util.ArrayList arrayList = new java.util.ArrayList(hashSet);
            if (arrayList.size() == 2) {
                java.util.ArrayList arrayList2 = new java.util.ArrayList();
                if (arrayList.get(0).contains("pwd")) {
                    arrayList2.add(arrayList.get(0));
                }
                if (arrayList.get(1).contains("pwd")) {
                    arrayList2.add(arrayList.get(1));
                }
                if (!arrayList2.isEmpty()) {
                    arrayList = arrayList2;
                }
            }
            java.util.ArrayList arrayList3 = arrayList;
            com.github.catvod.spider.merge.c.C0758e c0758e = new com.github.catvod.spider.merge.c.C0758e();
            c0758e.j(list.get(0));
            c0758e.k(fVar.n0("h4").c());
            c0758e.l("https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/N1l5/1200X800/123.jpg/webp");
            java.lang.StringBuilder sb = new java.lang.StringBuilder();
            sb.append("资源id:");
            sb.append(list.get(0));
            sb.append(">>");
            c0758e.h(arrayList3.toString().replace("[", "").replace("]", "").replace(",", "\n"));
            com.github.catvod.spider.PanOrder.sort(arrayList3);
            c0758e.m(detailContentVodPlayFrom(arrayList3));
            c0758e.n(detailContentVodPlayUrl(arrayList3));
            return com.github.catvod.spider.merge.a.C0731a.processVodData(com.github.catvod.spider.merge.c.C0756c.m(c0758e));
        } catch (java.lang.Exception unused) {
            return "";
        }
    }

    public java.lang.String homeContent(boolean z) {
        try {
            org.json.JSONArray jSONArray = new org.json.JSONArray();
            org.json.JSONObject jSONObject = new org.json.JSONObject();
            jSONObject.put("type_id", "2");
            jSONObject.put("type_name", "电影");
            jSONArray.put(jSONObject);
            org.json.JSONObject jSONObject2 = new org.json.JSONObject();
            jSONObject2.put("type_id", "48");
            jSONObject2.put("type_name", "剧集");
            jSONArray.put(jSONObject2);
            org.json.JSONObject jSONObject3 = new org.json.JSONObject();
            jSONObject3.put("type_id", "56");
            jSONObject3.put("type_name", "4K原盘");
            jSONArray.put(jSONObject3);
            org.json.JSONObject jSONObject4 = new org.json.JSONObject();
            jSONObject4.put("type_id", "52");
            jSONObject4.put("type_name", "综艺");
            jSONArray.put(jSONObject4);
            org.json.JSONObject jSONObject5 = new org.json.JSONObject();
            jSONObject5.put("type_id", "37");
            jSONObject5.put("type_name", "动漫");
            jSONArray.put(jSONObject5);
            org.json.JSONObject jSONObject6 = new org.json.JSONObject();
            jSONObject6.put("class", jSONArray);
            return jSONObject6.toString();
        } catch (java.lang.Exception unused) {
            return "{\"class\":[]}";
        }
    }

    @Override // com.github.catvod.spider.Pan
    public void init(android.content.Context context, java.lang.String str) {
        org.json.JSONArray jSONArray;
        int length;
        try {
            if (str.isEmpty() || (length = (jSONArray = new org.json.JSONObject(str).getJSONArray("site")).length()) == 0) {
                return;
            }
            int i = 0;
            while (true) {
                if (i >= length) {
                    break;
                }
                java.lang.String trim = jSONArray.getString(i).trim();
                if (!trim.isEmpty()) {
                    java.net.HttpURLConnection httpURLConnection = (java.net.HttpURLConnection) new java.net.URL(trim).openConnection();
                    httpURLConnection.setInstanceFollowRedirects(true);
                    httpURLConnection.setConnectTimeout(10000);
                    httpURLConnection.setReadTimeout(10000);
                    httpURLConnection.setRequestMethod("HEAD");
                    int responseCode = httpURLConnection.getResponseCode();
                    if (responseCode >= 200 && responseCode < 400) {
                        j = trim;
                        httpURLConnection.disconnect();
                        break;
                    }
                    httpURLConnection.disconnect();
                }
                i++;
            }
            java.lang.String a = com.github.catvod.spider.merge.m.C0806k.a(com.github.catvod.spider.merge.m.C0806k.b("/diy_cookie.txt"));
            if (android.text.TextUtils.isEmpty(a)) {
                return;
            }
            k = new org.json.JSONObject(a).optString("123panfx_cookie");
        } catch (java.lang.Exception e) {
            e.printStackTrace();
        }
    }

    public java.lang.String searchContent(java.lang.String str, boolean z) {
        try {
            java.util.ArrayList arrayList = new java.util.ArrayList();
            java.lang.String str2 = j + "/search.htm?keyword=" + str;
            java.util.HashMap hashMap = new java.util.HashMap();
            hashMap.put("User-Agent", "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1");
            hashMap.put("Referer", j);
            hashMap.put("x-requested-with", "XMLHttpRequest");
            org.json.JSONObject jSONObject = new org.json.JSONObject(com.github.catvod.spider.merge.k.C0779b.l(str2, hashMap));
            com.github.catvod.crawler.SpiderDebug.log(jSONObject.toString());
            org.json.JSONArray optJSONArray = jSONObject.optJSONArray("message");
            for (int i = 0; i < optJSONArray.length(); i++) {
                org.json.JSONObject optJSONObject = optJSONArray.optJSONObject(i);
                java.lang.String optString = optJSONObject.optString("url");
                java.lang.String replaceAll = optJSONObject.optString("subject").replaceAll("<[^>]+>|&(?:#\\d+;|#x[\\da-fA-F]+;|[a-z]+;)", "");
                java.lang.String optString2 = optJSONObject.optString("user_avatar_url");
                if (!optString2.startsWith("http")) {
                    optString2 = j + "/" + optString2;
                }
                arrayList.add(new com.github.catvod.spider.merge.c.C0758e(optString, replaceAll, optString2, ""));
            }
            return com.github.catvod.spider.merge.c.C0756c.n(arrayList);
        } catch (java.lang.Exception unused) {
            return "";
        }
    }
}
