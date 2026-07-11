package com.github.catvod.spider;

/* loaded from: classes.dex */
public class Wogg extends com.github.catvod.spider.Pan {
    private java.lang.String f;

    static {
        new okhttp3.OkHttpClient();
    }

    public static java.lang.String d(java.lang.String str) {
        if (!str.contains("douban")) {
            return str;
        }
        try {
            java.lang.StringBuilder sb = new java.lang.StringBuilder();
            sb.append(str);
            sb.append("@Headers=");
            org.json.JSONObject jSONObject = new org.json.JSONObject();
            jSONObject.put("User-Agent", "Mozilla/5.0 (Linux; Android 13; V2049A Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/116.0.0.0 Mobile Safari/537.36");
            jSONObject.put("Referer", "https://www.douban.com");
            sb.append(jSONObject.toString());
            return sb.toString();
        } catch (java.lang.Exception e) {
            e.printStackTrace();
            return str;
        }
    }

    private java.util.Map<java.lang.String, java.lang.String> g() {
        java.util.HashMap hashMap = new java.util.HashMap();
        hashMap.put("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36");
        hashMap.put("Referer", this.f + "/");
        return hashMap;
    }

    private java.lang.String h(com.github.catvod.spider.merge.FM.K.h hVar, java.lang.String str) {
        java.util.Iterator<com.github.catvod.spider.merge.FM.K.m> it = hVar.o0(".video-info-item").iterator();
        while (it.hasNext()) {
            com.github.catvod.spider.merge.FM.K.m next = it.next();
            if (next.n0().v0().contains(str)) {
                java.util.List<java.lang.String> c = next.o0("a").c();
                java.lang.StringBuilder sb = new java.lang.StringBuilder();
                java.util.Iterator it2 = ((java.util.ArrayList) c).iterator();
                if (it2.hasNext()) {
                    while (true) {
                        sb.append((java.lang.CharSequence) it2.next());
                        if (!it2.hasNext()) {
                            break;
                        }
                        sb.append((java.lang.CharSequence) ",");
                    }
                }
                return sb.toString();
            }
        }
        return "";
    }

    private java.lang.String j(java.lang.String str, java.lang.String str2) {
        java.lang.StringBuilder sb = new java.lang.StringBuilder();
        sb.append(this.f);
        com.github.catvod.spider.merge.FM.M.C0476g o0 = com.github.catvod.spider.merge.FM.A.l.g(com.github.catvod.spider.merge.FM.m.C0580c.n(com.github.catvod.spider.merge.FM.b.v.a("/index.php/vodsearch/%s----------%s---.html", new java.lang.Object[]{java.net.URLEncoder.encode(str), str2}, sb), g())).o0(".module-search-item");
        java.util.ArrayList arrayList = new java.util.ArrayList();
        java.util.Iterator<com.github.catvod.spider.merge.FM.K.m> it = o0.iterator();
        while (it.hasNext()) {
            com.github.catvod.spider.merge.FM.K.m next = it.next();
            java.lang.String a = next.o0(".video-serial").a("href");
            java.lang.String a2 = next.o0(".video-serial").a("title");
            java.lang.String a3 = next.o0(".module-item-pic > img").a("data-src");
            int lastIndexOf = a3.lastIndexOf("http");
            if (lastIndexOf >= 0) {
                a3 = d(a3.substring(lastIndexOf));
            }
            com.github.catvod.spider.merge.FM.M.C0476g o02 = next.o0(".video-info-header a.video-serial");
            com.github.catvod.spider.merge.FM.n.C0586b.a(a, a2, a3, !o02.isEmpty() ? o02.e().v0() : "", arrayList);
        }
        return com.github.catvod.spider.merge.FM.c.C0531g.q(arrayList);
    }

    public java.lang.String categoryContent(java.lang.String str, java.lang.String str2, boolean z, java.util.HashMap<java.lang.String, java.lang.String> hashMap) {
        if (hashMap.get("cateId") != null) {
            str = hashMap.get("cateId");
        }
        java.lang.String str3 = hashMap.get("area") == null ? "" : hashMap.get("area");
        java.lang.String str4 = hashMap.get("year") == null ? "" : hashMap.get("year");
        java.lang.String str5 = hashMap.get("by") == null ? "" : hashMap.get("by");
        java.lang.String str6 = hashMap.get("class") != null ? hashMap.get("class") : "";
        java.lang.StringBuilder sb = new java.lang.StringBuilder();
        sb.append(this.f);
        java.util.List<com.github.catvod.spider.merge.FM.c.C0534j> parseVodList = parseVodList(com.github.catvod.spider.merge.FM.A.l.g(com.github.catvod.spider.merge.FM.m.C0580c.n(com.github.catvod.spider.merge.FM.b.v.a("/vodshow/%s-%s-%s-%s-----%s---%s.html", new java.lang.Object[]{str, str3, str5, str6, str2, str4}, sb), g())).o0(".module-item"));
        com.github.catvod.spider.merge.FM.c.C0531g c0531g = new com.github.catvod.spider.merge.FM.c.C0531g();
        c0531g.z(parseVodList);
        return c0531g.toString();
    }

    @Override // com.github.catvod.spider.Pan
    public java.lang.String detailContent(java.util.List<java.lang.String> list) {
        com.github.catvod.spider.merge.FM.K.h g = com.github.catvod.spider.merge.FM.A.l.g(com.github.catvod.spider.merge.FM.m.C0580c.n(this.f + list.get(0), g()));
        com.github.catvod.spider.merge.FM.c.C0534j c0534j = new com.github.catvod.spider.merge.FM.c.C0534j();
        java.util.List<java.lang.String> b = g.o0(".module-row-text").b("data-clipboard-text");
        java.util.ArrayList arrayList = new java.util.ArrayList();
        java.util.ArrayList arrayList2 = new java.util.ArrayList();
        int i = 0;
        while (true) {
            java.util.ArrayList arrayList3 = (java.util.ArrayList) b;
            if (i >= arrayList3.size()) {
                break;
            }
            if (com.github.catvod.spider.Pan.f10a.matcher((java.lang.CharSequence) arrayList3.get(i)).find()) {
                arrayList.add((java.lang.String) arrayList3.get(i));
            }
            if (com.github.catvod.spider.Pan.b.matcher((java.lang.CharSequence) arrayList3.get(i)).find()) {
                arrayList.add((java.lang.String) arrayList3.get(i));
            }
            if (com.github.catvod.spider.Pan.c.matcher((java.lang.CharSequence) arrayList3.get(i)).find()) {
                arrayList.add((java.lang.String) arrayList3.get(i));
            }
            if (com.github.catvod.spider.Pan.f.matcher((java.lang.CharSequence) arrayList3.get(i)).find()) {
                arrayList2.add((java.lang.String) arrayList3.get(i));
            }
            i++;
        }
        java.lang.String v0 = com.github.catvod.spider.merge.FM.M.S.a(".video-info-header > .page-title", g).v0();
        java.util.ArrayList arrayList4 = new java.util.ArrayList(arrayList);
        arrayList4.addAll(arrayList2);
        com.github.catvod.spider.PanOrder.sort(arrayList4);
        c0534j.j(detailContentVodPlayFrom(arrayList4));
        c0534j.k(detailContentVodPlayUrl(arrayList4));
        java.lang.String c = com.github.catvod.spider.merge.FM.M.S.a(".module-item-pic img", g).c("data-src");
        int lastIndexOf = c.lastIndexOf("http");
        if (lastIndexOf >= 0) {
            c = d(c.substring(lastIndexOf));
        }
        java.lang.String v02 = g.o0(".video-info-header a.tag-link").g().v0();
        java.util.List<java.lang.String> c2 = g.o0(".video-info-header div.tag-link a").c();
        java.lang.StringBuilder sb = new java.lang.StringBuilder();
        java.util.Iterator it = ((java.util.ArrayList) c2).iterator();
        if (it.hasNext()) {
            while (true) {
                sb.append((java.lang.CharSequence) it.next());
                if (!it.hasNext()) {
                    break;
                }
                sb.append((java.lang.CharSequence) ",");
            }
        }
        java.lang.String sb2 = sb.toString();
        java.lang.String i2 = g.o0("p.sqjj_a").i();
        java.lang.String h = h(g, "导演");
        java.lang.String h2 = h(g, "主演");
        java.lang.String h3 = h(g, "年代");
        java.lang.String h4 = h(g, "备注");
        c0534j.g(list.get(0));
        c0534j.i(c);
        c0534j.n(h3);
        c0534j.h(v0);
        c0534j.d(v02);
        c0534j.c(h2);
        c0534j.l(h4);
        c0534j.e(i2);
        c0534j.f(h);
        c0534j.b(sb2);
        return com.github.catvod.spider.merge.a.C0731a.processVodData(com.github.catvod.spider.merge.FM.c.C0531g.p(c0534j));
    }

    public java.lang.String homeContent(boolean z) {
        java.util.ArrayList arrayList = new java.util.ArrayList();
        java.util.List asList = java.util.Arrays.asList("44", "1", "2", "3", "4", "5", "6");
        java.util.List asList2 = java.util.Arrays.asList("臻彩视觉", "玩偶电影", "玩偶剧集", "动漫", "综艺", "音乐", "短剧");
        for (int i = 0; i < asList.size(); i++) {
            arrayList.add(new com.github.catvod.spider.merge.FM.c.C0525a((java.lang.String) asList.get(i), (java.lang.String) asList2.get(i)));
        }
        com.github.catvod.spider.merge.FM.M.C0476g o0 = com.github.catvod.spider.merge.FM.A.l.g(com.github.catvod.spider.merge.FM.m.C0580c.n(this.f, g())).o0(".module-item");
        return com.github.catvod.spider.merge.FM.c.C0531g.u(arrayList, parseVodList(new com.github.catvod.spider.merge.FM.M.C0476g(o0.subList(0, java.lang.Math.min(o0.size(), 12)))), new org.json.JSONObject("{\"1\": [{\"key\": \"class\", \"name\": \"剧情\", \"value\": [{\"n\": \"全部\", \"v\": \"\"}, {\"n\": \"喜剧\", \"v\": \"喜剧\"}, {\"n\": \"爱情\", \"v\": \"爱情\"}, {\"n\": \"恐怖\", \"v\": \"恐怖\"}, {\"n\": \"动作\", \"v\": \"动作\"}, {\"n\": \"科幻\", \"v\": \"科幻\"}, {\"n\": \"剧情\", \"v\": \"剧情\"}, {\"n\": \"战争\", \"v\": \"战争\"}, {\"n\": \"警匪\", \"v\": \"警匪\"}, {\"n\": \"犯罪\", \"v\": \"犯罪\"}, {\"n\": \"古装\", \"v\": \"古装\"}, {\"n\": \"奇幻\", \"v\": \"奇幻\"}, {\"n\": \"武侠\", \"v\": \"武侠\"}, {\"n\": \"冒险\", \"v\": \"冒险\"}, {\"n\": \"枪战\", \"v\": \"枪战\"}, {\"n\": \"恐怖\", \"v\": \"恐怖\"}, {\"n\": \"悬疑\", \"v\": \"悬疑\"}, {\"n\": \"惊悚\", \"v\": \"惊悚\"}, {\"n\": \"历史\", \"v\": \"历史\"}]}, {\"key\": \"area\", \"name\": \"地区\", \"value\": [{\"n\": \"全部\", \"v\": \"\"}, {\"n\": \"中国大陆\", \"v\": \"中国大陆\"}, {\"n\": \"中国香港\", \"v\": \"中国香港\"}, {\"n\": \"中国台湾\", \"v\": \"中国台湾\"}, {\"n\": \"美国\", \"v\": \"美国\"}, {\"n\": \"法国\", \"v\": \"法国\"}, {\"n\": \"英国\", \"v\": \"英国\"}, {\"n\": \"日本\", \"v\": \"日本\"}, {\"n\": \"韩国\", \"v\": \"韩国\"}, {\"n\": \"德国\", \"v\": \"德国\"}, {\"n\": \"泰国\", \"v\": \"泰国\"}, {\"n\": \"印度\", \"v\": \"印度\"}, {\"n\": \"意大利\", \"v\": \"意大利\"}, {\"n\": \"西班牙\", \"v\": \"西班牙\"}, {\"n\": \"加拿大\", \"v\": \"加拿大\"}, {\"n\": \"其他\", \"v\": \"其他\"}]}, {\"key\": \"year\", \"name\": \"年份\", \"value\": [{\"n\": \"全部\", \"v\": \"\"}, {\"n\": \"2026\", \"v\": \"2026\"}, {\"n\": \"2025\", \"v\": \"2025\"}, {\"n\": \"2024\", \"v\": \"2024\"}, {\"n\": \"2023\", \"v\": \"2023\"}, {\"n\": \"2022\", \"v\": \"2022\"}, {\"n\": \"2021\", \"v\": \"2021\"}, {\"n\": \"2020\", \"v\": \"2020\"}, {\"n\": \"2019\", \"v\": \"2019\"}, {\"n\": \"2018\", \"v\": \"2018\"}, {\"n\": \"2017\", \"v\": \"2017\"}, {\"n\": \"2016\", \"v\": \"2016\"}, {\"n\": \"2015\", \"v\": \"2015\"}, {\"n\": \"2014\", \"v\": \"2014\"}, {\"n\": \"2013\", \"v\": \"2013\"}, {\"n\": \"2012\", \"v\": \"2012\"}, {\"n\": \"2011\", \"v\": \"2011\"}, {\"n\": \"2010\", \"v\": \"2010\"}]}, {\"key\": \"by\", \"name\": \"排序\", \"value\": [{\"n\": \"时间\", \"v\": \"time\"}, {\"n\": \"人气\", \"v\": \"hits\"}, {\"n\": \"评分\", \"v\": \"score\"}]}], \"2\": [{\"key\": \"class\", \"name\": \"剧情\", \"value\": [{\"n\": \"全部\", \"v\": \"\"}, {\"n\": \"喜剧\", \"v\": \"喜剧\"}, {\"n\": \"爱情\", \"v\": \"爱情\"}, {\"n\": \"恐怖\", \"v\": \"恐怖\"}, {\"n\": \"动作\", \"v\": \"动作\"}, {\"n\": \"科幻\", \"v\": \"科幻\"}, {\"n\": \"剧情\", \"v\": \"剧情\"}, {\"n\": \"战争\", \"v\": \"战争\"}, {\"n\": \"警匪\", \"v\": \"警匪\"}, {\"n\": \"犯罪\", \"v\": \"犯罪\"},  {\"n\": \"古装\", \"v\": \"古装\"}, {\"n\": \"奇幻\", \"v\": \"奇幻\"}, {\"n\": \"武侠\", \"v\": \"武侠\"}, {\"n\": \"冒险\", \"v\": \"冒险\"}, {\"n\": \"枪战\", \"v\": \"枪战\"}, {\"n\": \"悬疑\", \"v\": \"悬疑\"}, {\"n\": \"惊悚\", \"v\": \"惊悚\"}, {\"n\": \"历史\", \"v\": \"历史\"}]}, {\"key\": \"area\", \"name\": \"地区\", \"value\": [{\"n\": \"全部\", \"v\": \"\"}, {\"n\": \"中国大陆\", \"v\": \"中国大陆\"}, {\"n\": \"中国香港\", \"v\": \"中国香港\"}, {\"n\": \"中国台湾\", \"v\": \"中国台湾\"}, {\"n\": \"美国\", \"v\": \"美国\"}, {\"n\": \"法国\", \"v\": \"法国\"}, {\"n\": \"英国\", \"v\": \"英国\"}, {\"n\": \"日本\", \"v\": \"日本\"}, {\"n\": \"韩国\", \"v\": \"韩国\"}, {\"n\": \"德国\", \"v\": \"德国\"}, {\"n\": \"泰国\", \"v\": \"泰国\"}, {\"n\": \"印度\", \"v\": \"印度\"}, {\"n\": \"意大利\", \"v\": \"意大利\"}, {\"n\": \"西班牙\", \"v\": \"西班牙\"}, {\"n\": \"加拿大\", \"v\": \"加拿大\"}, {\"n\": \"其他\", \"v\": \"其他\"}]}, {\"key\": \"year\", \"name\": \"年份\", \"value\": [{\"n\": \"全部\", \"v\": \"\"}, {\"n\": \"2026\", \"v\": \"2026\"}, {\"n\": \"2025\", \"v\": \"2025\"}, {\"n\": \"2024\", \"v\": \"2024\"}, {\"n\": \"2023\", \"v\": \"2023\"}, {\"n\": \"2022\", \"v\": \"2022\"}, {\"n\": \"2021\", \"v\": \"2021\"}, {\"n\": \"2020\", \"v\": \"2020\"}, {\"n\": \"2019\", \"v\": \"2019\"}, {\"n\": \"2018\", \"v\": \"2018\"}, {\"n\": \"2017\", \"v\": \"2017\"}, {\"n\": \"2016\", \"v\": \"2016\"}, {\"n\": \"2015\", \"v\": \"2015\"}, {\"n\": \"2014\", \"v\": \"2014\"}, {\"n\": \"2013\", \"v\": \"2013\"}, {\"n\": \"2012\", \"v\": \"2012\"}, {\"n\": \"2011\", \"v\": \"2011\"}, {\"n\": \"2010\", \"v\": \"2010\"}]}, {\"key\": \"by\", \"name\": \"排序\", \"value\": [{\"n\": \"时间\", \"v\": \"time\"}, {\"n\": \"人气\", \"v\": \"hits\"}, {\"n\": \"评分\", \"v\": \"score\"}]}], \"3\": [{\"key\": \"area\", \"name\": \"地区\", \"value\": [{\"n\": \"全部\", \"v\": \"\"}, {\"n\": \"大陆\", \"v\": \"大陆\"}, {\"n\": \"美国\", \"v\": \"美国\"}, {\"n\": \"英国\", \"v\": \"英国\"}, {\"n\": \"日本\", \"v\": \"日本\"}]}, {\"key\": \"year\", \"name\": \"年份\", \"value\": [{\"n\": \"全部\", \"v\": \"\"}, {\"n\": \"2026\", \"v\": \"2026\"}, {\"n\": \"2025\", \"v\": \"2025\"}, {\"n\": \"2024\", \"v\": \"2024\"}, {\"n\": \"2023\", \"v\": \"2023\"}, {\"n\": \"2022\", \"v\": \"2022\"}, {\"n\": \"2021\", \"v\": \"2021\"}, {\"n\": \"2020\", \"v\": \"2020\"}, {\"n\": \"2019\", \"v\": \"2019\"}, {\"n\": \"2018\", \"v\": \"2018\"}, {\"n\": \"2017\", \"v\": \"2017\"}, {\"n\": \"2016\", \"v\": \"2016\"}, {\"n\": \"2015\", \"v\": \"2015\"}, {\"n\": \"2014\", \"v\": \"2014\"}, {\"n\": \"2013\", \"v\": \"2013\"}, {\"n\": \"2012\", \"v\": \"2012\"}, {\"n\": \"2011\", \"v\": \"2011\"}, {\"n\": \"2010\", \"v\": \"2010\"}, {\"n\": \"2009\", \"v\": \"2009\"}, {\"n\": \"2008\", \"v\": \"2008\"}, {\"n\": \"2007\", \"v\": \"2007\"}, {\"n\": \"2006\", \"v\": \"2006\"}, {\"n\": \"2005\", \"v\": \"2005\"}, {\"n\": \"2004\", \"v\": \"2004\"}]}, {\"key\": \"by\", \"name\": \"排序\", \"value\": [{\"n\": \"时间\", \"v\": \"time\"}, {\"n\": \"人气\", \"v\": \"hits\"}, {\"n\": \"评分\", \"v\": \"score\"}]}], \"44\": [{\"key\": \"area\", \"name\": \"地区\", \"value\": [{\"n\": \"全部\", \"v\": \"\"}, {\"n\": \"中国大陆\", \"v\": \"中国大陆\"}, {\"n\": \"中国香港\", \"v\": \"中国香港\"}, {\"n\": \"中国台湾\", \"v\": \"中国台湾\"}, {\"n\": \"美国\", \"v\": \"美国\"}, {\"n\": \"法国\", \"v\": \"法国\"}, {\"n\": \"英国\", \"v\": \"英国\"}, {\"n\": \"日本\", \"v\": \"日本\"}, {\"n\": \"韩国\", \"v\": \"韩国\"}]}, {\"key\": \"year\", \"name\": \"年份\", \"value\": [{\"n\": \"全部\", \"v\": \"\"}, {\"n\": \"2026\", \"v\": \"2026\"}, {\"n\": \"2025\", \"v\": \"2025\"}, {\"n\": \"2024\", \"v\": \"2024\"}, {\"n\": \"2023\", \"v\": \"2023\"}, {\"n\": \"2022\", \"v\": \"2022\"}, {\"n\": \"2021\", \"v\": \"2021\"}, {\"n\": \"2020\", \"v\": \"2020\"}, {\"n\": \"2019\", \"v\": \"2019\"}, {\"n\": \"2018\", \"v\": \"2018\"}, {\"n\": \"2017\", \"v\": \"2017\"}, {\"n\": \"2016\", \"v\": \"2016\"}, {\"n\": \"2015\", \"v\": \"2015\"}, {\"n\": \"2014\", \"v\": \"2014\"}, {\"n\": \"2013\", \"v\": \"2013\"}, {\"n\": \"2012\", \"v\": \"2012\"}, {\"n\": \"2011\", \"v\": \"2011\"}, {\"n\": \"2010\", \"v\": \"2010\"}, {\"n\": \"2009\", \"v\": \"2009\"}, {\"n\": \"2008\", \"v\": \"2008\"}, {\"n\": \"2007\", \"v\": \"2007\"}, {\"n\": \"2006\", \"v\": \"2006\"}, {\"n\": \"2005\", \"v\": \"2005\"}, {\"n\": \"2004\", \"v\": \"2004\"}]}, {\"key\": \"by\", \"name\": \"排序\", \"value\": [{\"n\": \"时间\", \"v\": \"time\"}, {\"n\": \"人气\", \"v\": \"hits\"}, {\"n\": \"评分\", \"v\": \"score\"}]}], \"4\": [{\"key\": \"area\", \"name\": \"地区\", \"value\": [{\"n\": \"全部\", \"v\": \"\"}, {\"n\": \"中国大陆\", \"v\": \"中国大陆\"}, {\"n\": \"中国香港\", \"v\": \"中国香港\"}, {\"n\": \"中国台湾\", \"v\": \"中国台湾\"}, {\"n\": \"美国\", \"v\": \"美国\"}, {\"n\": \"法国\", \"v\": \"法国\"}, {\"n\": \"英国\", \"v\": \"英国\"}, {\"n\": \"日本\", \"v\": \"日本\"}, {\"n\": \"韩国\", \"v\": \"韩国\"}]}, {\"key\": \"year\", \"name\": \"年份\", \"value\": [{\"n\": \"全部\", \"v\": \"\"}, {\"n\": \"2026\", \"v\": \"2026\"}, {\"n\": \"2025\", \"v\": \"2025\"}, {\"n\": \"2024\", \"v\": \"2024\"}, {\"n\": \"2023\", \"v\": \"2023\"}, {\"n\": \"2022\", \"v\": \"2022\"}, {\"n\": \"2021\", \"v\": \"2021\"}, {\"n\": \"2020\", \"v\": \"2020\"}, {\"n\": \"2019\", \"v\": \"2019\"}, {\"n\": \"2018\", \"v\": \"2018\"}, {\"n\": \"2017\", \"v\": \"2017\"}, {\"n\": \"2016\", \"v\": \"2016\"}, {\"n\": \"2015\", \"v\": \"2015\"}, {\"n\": \"2014\", \"v\": \"2014\"}, {\"n\": \"2013\", \"v\": \"2013\"}, {\"n\": \"2012\", \"v\": \"2012\"}, {\"n\": \"2011\", \"v\": \"2011\"}, {\"n\": \"2010\", \"v\": \"2010\"}, {\"n\": \"2009\", \"v\": \"2009\"}, {\"n\": \"2008\", \"v\": \"2008\"}, {\"n\": \"2007\", \"v\": \"2007\"}, {\"n\": \"2006\", \"v\": \"2006\"}, {\"n\": \"2005\", \"v\": \"2005\"}, {\"n\": \"2004\", \"v\": \"2004\"}]}, {\"key\": \"by\", \"name\": \"排序\", \"value\": [{\"n\": \"时间\", \"v\": \"time\"}, {\"n\": \"人气\", \"v\": \"hits\"}, {\"n\": \"评分\", \"v\": \"score\"}]}],\"6\": [{\"key\": \"year\", \"name\": \"年份\", \"value\": [{\"n\": \"全部\", \"v\": \"\"}, {\"n\": \"2026\", \"v\": \"2026\"}, {\"n\": \"2025\", \"v\": \"2025\"}, {\"n\": \"2024\", \"v\": \"2024\"}, {\"n\": \"2023\", \"v\": \"2023\"}, {\"n\": \"2022\", \"v\": \"2022\"}, {\"n\": \"2021\", \"v\": \"2021\"}, {\"n\": \"2020\", \"v\": \"2020\"}, {\"n\": \"2019\", \"v\": \"2019\"}, {\"n\": \"2018\", \"v\": \"2018\"}, {\"n\": \"2017\", \"v\": \"2017\"}, {\"n\": \"2016\", \"v\": \"2016\"}, {\"n\": \"2015\", \"v\": \"2015\"}, {\"n\": \"2014\", \"v\": \"2014\"}, {\"n\": \"2013\", \"v\": \"2013\"}, {\"n\": \"2012\", \"v\": \"2012\"}, {\"n\": \"2011\", \"v\": \"2011\"}, {\"n\": \"2010\", \"v\": \"2010\"}]}, {\"key\": \"by\", \"name\": \"排序\", \"value\": [{\"n\": \"时间\", \"v\": \"time\"}, {\"n\": \"人气\", \"v\": \"hits\"}, {\"n\": \"评分\", \"v\": \"score\"}]}]}"));
    }

    @Override // com.github.catvod.spider.Pan
    public void init(android.content.Context context, java.lang.String str) {
        org.json.JSONArray jSONArray;
        int length;
        if (str.isEmpty() || (length = (jSONArray = new org.json.JSONObject(str).getJSONArray("site")).length()) == 0) {
            return;
        }
        for (int i = 0; i < length; i++) {
            java.lang.String trim = jSONArray.getString(i).trim();
            if (!trim.isEmpty()) {
                try {
                    java.net.HttpURLConnection httpURLConnection = (java.net.HttpURLConnection) new java.net.URL(trim).openConnection();
                    httpURLConnection.setInstanceFollowRedirects(true);
                    httpURLConnection.setConnectTimeout(10000);
                    httpURLConnection.setReadTimeout(10000);
                    httpURLConnection.setRequestMethod("HEAD");
                    int responseCode = httpURLConnection.getResponseCode();
                    if (responseCode >= 200 && responseCode < 400) {
                        this.f = trim;
                        httpURLConnection.disconnect();
                        return;
                    }
                    httpURLConnection.disconnect();
                } catch (java.lang.Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    public java.util.List<com.github.catvod.spider.merge.FM.c.C0534j> parseVodList(com.github.catvod.spider.merge.FM.M.C0476g c0476g) {
        java.util.ArrayList arrayList = new java.util.ArrayList();
        java.util.Iterator<com.github.catvod.spider.merge.FM.K.m> it = c0476g.iterator();
        while (it.hasNext()) {
            com.github.catvod.spider.merge.FM.K.m next = it.next();
            java.lang.String a = next.o0(".module-item-titlebox >a").a("href");
            java.lang.String a2 = next.o0(".module-item-titlebox >a").a("title");
            if (!"臻彩".equals(a2)) {
                java.lang.String a3 = next.o0(".module-item-pic img").a("data-src");
                int lastIndexOf = a3.lastIndexOf("http");
                if (lastIndexOf >= 0) {
                    a3 = d(a3.substring(lastIndexOf));
                }
                com.github.catvod.spider.merge.FM.n.C0586b.a(a, a2, a3, next.o0(".module-item-text").i(), arrayList);
            }
        }
        return arrayList;
    }

    public java.lang.String searchContent(java.lang.String str, boolean z) {
        return j(str, "1");
    }

    public java.lang.String searchContent(java.lang.String str, boolean z, java.lang.String str2) {
        return j(str, str2);
    }
}
