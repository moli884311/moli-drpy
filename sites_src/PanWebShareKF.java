package com.github.catvod.spider;

/* loaded from: classes.dex */
public class PanWebShareKF extends com.github.catvod.spider.Pan {
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
        java.util.Iterator<com.github.catvod.spider.merge.G.i> it = fVar.n0("div.message > div > div.alert, div.message > div.alert, div.message > section > div.alert, div.message > h5 > div.alert").iterator();
        while (it.hasNext()) {
            arrayList.add(it.next().t0().replace("您已通过回复满足要求，内容已解锁", "").replaceAll("\\s+", ""));
        }
        if (arrayList.size() == 1 && !((java.lang.String) arrayList.get(0)).contains("http")) {
            java.lang.String str = (java.lang.String) arrayList.get(0);
            java.util.Iterator<com.github.catvod.spider.merge.G.i> it2 = fVar.n0("a").iterator();
            while (it2.hasNext()) {
                java.lang.String filterCloudDiskLinks = com.github.catvod.spider.merge.a.C0731a.filterCloudDiskLinks(it2.next().d("href"));
                if (filterCloudDiskLinks.contains("/s/") || filterCloudDiskLinks.contains("/t/")) {
                    if (filterCloudDiskLinks.contains(".123") && !str.contains("码")) {
                        str = com.github.catvod.spider.merge.a.C0733c.a("提取码：", str);
                    }
                    if (filterCloudDiskLinks.contains("cloud.") && !str.contains("码")) {
                        str = com.github.catvod.spider.merge.a.C0733c.a("访问码：", str);
                    }
                    arrayList.set(0, filterCloudDiskLinks + str);
                }
            }
        }
        com.github.catvod.crawler.SpiderDebug.log(arrayList.toString());
        return arrayList;
    }

    private void d(java.lang.String str) {
        java.lang.String str2 = j;
        if (!str2.contains("https://www.kfjwzz.com") || !str2.contains("www.kfzy.cc")) {
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
                    if (!t0.contains("福利")) {
                        java.lang.String a2 = next.n0("a > img").a("src");
                        if (!a2.startsWith("http")) {
                            a2 = j + "/" + a2;
                        }
                        arrayList.add(new com.github.catvod.spider.merge.c.C0758e(d, t0, a2, next.n0("div > div.subject > a.badge,div > div.style3_subject > a.badge").c()));
                    }
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
                if (!fVar.n0("div.message").c().contains("<立即回复>")) {
                    break;
                }
                d(list.get(0));
            }
            java.util.List<java.lang.String> c = c(fVar);
            com.github.catvod.spider.merge.c.C0758e c0758e = new com.github.catvod.spider.merge.c.C0758e();
            c0758e.j(list.get(0));
            c0758e.k(fVar.n0("h4").c());
            c0758e.l("https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/LX2y/1200X800/quark.jpg/webp");
            java.lang.StringBuilder sb = new java.lang.StringBuilder();
            sb.append("资源id:");
            sb.append(list.get(0));
            sb.append(">>");
            c0758e.h(c.toString().replace("[", "").replace("]", "").replace("网盘链接：", "").replace(",", "\n"));
            com.github.catvod.spider.PanOrder.sort(c);
            c0758e.m(detailContentVodPlayFrom(c));
            c0758e.n(detailContentVodPlayUrl(c));
            return com.github.catvod.spider.merge.a.C0731a.processVodData(com.github.catvod.spider.merge.c.C0756c.m(c0758e));
        } catch (java.lang.Exception unused) {
            return "";
        }
    }

    public java.lang.String homeContent(boolean z) {
        try {
            org.json.JSONArray jSONArray = new org.json.JSONArray();
            org.json.JSONObject jSONObject = new org.json.JSONObject();
            jSONObject.put("type_id", "1");
            jSONObject.put("type_name", "剧集");
            jSONArray.put(jSONObject);
            org.json.JSONObject jSONObject2 = new org.json.JSONObject();
            jSONObject2.put("type_id", "2");
            jSONObject2.put("type_name", "短剧");
            jSONArray.put(jSONObject2);
            org.json.JSONObject jSONObject3 = new org.json.JSONObject();
            jSONObject3.put("type_id", "3");
            jSONObject3.put("type_name", "动漫");
            jSONArray.put(jSONObject3);
            org.json.JSONObject jSONObject4 = new org.json.JSONObject();
            jSONObject4.put("type_id", "4");
            jSONObject4.put("type_name", "综艺");
            jSONArray.put(jSONObject4);
            org.json.JSONObject jSONObject5 = new org.json.JSONObject();
            jSONObject5.put("type_id", "9");
            jSONObject5.put("type_name", "电影");
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
        org.json.JSONObject jSONObject;
        org.json.JSONArray jSONArray;
        int length;
        try {
            if (str.isEmpty() || (length = (jSONArray = (jSONObject = new org.json.JSONObject(str)).getJSONArray("site")).length()) == 0) {
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
            k = jSONObject.optString("cookie");
        } catch (java.lang.Exception e) {
            e.printStackTrace();
        }
    }

    public java.lang.String searchContent(java.lang.String str, boolean z) {
        try {
            java.util.ArrayList arrayList = new java.util.ArrayList();
            java.util.Iterator<com.github.catvod.spider.merge.G.i> it = com.github.catvod.spider.merge.D.a.a(b(j + "/search-" + str + "-1.htm")).n0("ul.threadlist > li").iterator();
            while (it.hasNext()) {
                com.github.catvod.spider.merge.G.i next = it.next();
                if (!next.n0("i").a("data-placement").contains("top")) {
                    java.lang.String d = next.n0("div > div.subject > a,div > div.style3_subject > a").b().d("href");
                    java.lang.String t0 = next.n0("div > div.subject > a,div > div.style3_subject > a").b().t0();
                    java.lang.String a = next.n0("a > img").a("src");
                    if (!a.startsWith("http")) {
                        a = j + "/" + a;
                    }
                    arrayList.add(new com.github.catvod.spider.merge.c.C0758e(d, t0, a, next.n0("div > div.subject > a.badge,div > div.style3_subject > a.badge").c()));
                }
            }
            com.github.catvod.spider.merge.c.C0756c c0756c = new com.github.catvod.spider.merge.c.C0756c();
            c0756c.i(1, 0, 0, 0);
            c0756c.w(arrayList);
            return c0756c.toString();
        } catch (java.lang.Exception unused) {
            return "";
        }
    }
}
