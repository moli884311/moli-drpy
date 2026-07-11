package com.github.catvod.spider;

/* loaded from: classes.dex */
public class Gz360 extends com.github.catvod.crawler.Spider {
    private static final java.lang.String a = "97630f5f85d9f3c639fb7790ca881ef2.4cccf48dc340fe8bded39cfe4ef9ac2adb27425a9069e6cd121210fc7ba518ea8c1cc5629261e94bb6ccb66d8548449c72076c956a2fb46c253008909a6c66347eb458fe3c06d1fcc993ca03a298328f9229f1994a608250c7d1ae124c4520e6e14ce8bf9f4404119a6bbf53cf592a8df2e9145de92ec43ec87cf4bdc563f6e919fe32861b0e93b118ec37d8035fbb3c.473433979755ccd5ec1b4581ccef76e8209b9e0c6ff819917f12dffad47d0d5e";
    private static final java.lang.String b = "https://api.w32z7vtd.com";
    private static final java.util.HashMap c = new java.util.HashMap();

    private java.lang.String a(java.lang.String str, java.lang.String str2) {
        try {
            java.util.HashMap hashMap = new java.util.HashMap();
            hashMap.put("Version", "2406025");
            hashMap.put("PackageName", "com.j64f4b21072.ha69699879.dfea0a9826ba.ibf50c9b1d");
            hashMap.put("Ver", "1.9.2");
            java.lang.String str3 = b;
            hashMap.put("Referer", str3);
            hashMap.put("Content-Type", "application/x-www-form-urlencoded");
            hashMap.put("User-Agent", "okhttp/3.12.0");
            java.lang.String str4 = (java.lang.System.currentTimeMillis() / 1000) + "";
            java.lang.String e = com.github.catvod.spider.merge.m.C0796a.e(str2, "U823n8pKnAAbWOST".getBytes(), "wgr8N6BCs7426wf1".getBytes());
            java.lang.String upperCase = com.github.catvod.spider.merge.m.C0794I.a("token_id=,token=97630f5f85d9f3c639fb7790ca881ef2.4cccf48dc340fe8bded39cfe4ef9ac2adb27425a9069e6cd121210fc7ba518ea8c1cc5629261e94bb6ccb66d8548449c72076c956a2fb46c253008909a6c66347eb458fe3c06d1fcc993ca03a298328f9229f1994a608250c7d1ae124c4520e6e14ce8bf9f4404119a6bbf53cf592a8df2e9145de92ec43ec87cf4bdc563f6e919fe32861b0e93b118ec37d8035fbb3c.473433979755ccd5ec1b4581ccef76e8209b9e0c6ff819917f12dffad47d0d5e,phone_type=1,request_key=" + e + ",app_id=1,time=" + str4 + ",keys=bMTqITVqBsbq9UjLufsQuBvRiIyfqHLqAWUx0gj0ZUe9DMNDTmJDVZzAh45AZ5LtkC39Y0DU4Ufqm/9gliIJaj7cI/dhmoM5fib5HcslzyGONEwZY5fHBvokBreGaT8bPoaxmnWdTRjRfJzYZV6T06O7GsYVa6DuKTVArb0g48Q=*&zvdvdvddbfikkkumtmdwqppp?|4Y!s!2br").toUpperCase();
            java.net.URLEncoder.encode("bMTqITVqBsbq9UjLufsQuBvRiIyfqHLqAWUx0gj0ZUe9DMNDTmJDVZzAh45AZ5LtkC39Y0DU4Ufqm/9gliIJaj7cI/dhmoM5fib5HcslzyGONEwZY5fHBvokBreGaT8bPoaxmnWdTRjRfJzYZV6T06O7GsYVa6DuKTVArb0g48Q=");
            java.util.HashMap hashMap2 = new java.util.HashMap();
            hashMap2.put("token", a);
            hashMap2.put("token_id", "");
            hashMap2.put("phone_type", "1");
            hashMap2.put("time", str4);
            hashMap2.put("phone_model", "xiaomi-2206123sc");
            hashMap2.put("keys", "bMTqITVqBsbq9UjLufsQuBvRiIyfqHLqAWUx0gj0ZUe9DMNDTmJDVZzAh45AZ5LtkC39Y0DU4Ufqm/9gliIJaj7cI/dhmoM5fib5HcslzyGONEwZY5fHBvokBreGaT8bPoaxmnWdTRjRfJzYZV6T06O7GsYVa6DuKTVArb0g48Q=");
            hashMap2.put("request_key", e);
            hashMap2.put("signature", upperCase);
            hashMap2.put("app_id", "1");
            hashMap2.put("ad_version", "1");
            java.lang.String a2 = com.github.catvod.spider.merge.k.C0779b.g(str3 + str, hashMap2, hashMap).a();
            com.github.catvod.crawler.SpiderDebug.log("result:" + a2);
            org.json.JSONObject optJSONObject = new org.json.JSONObject(a2).optJSONObject("data");
            com.github.catvod.crawler.SpiderDebug.log(optJSONObject.toString());
            org.json.JSONObject jSONObject = new org.json.JSONObject(com.github.catvod.spider.merge.A.a.c(optJSONObject.optString("keys"), "RSA/None/PKCS1Padding"));
            com.github.catvod.crawler.SpiderDebug.log(jSONObject.toString());
            return com.github.catvod.spider.merge.A.a.a(optJSONObject.optString("response_key"), jSONObject.optString("key"), jSONObject.optString("iv"));
        } catch (java.lang.Exception e2) {
            com.github.catvod.crawler.SpiderDebug.log(e2.toString());
            e2.printStackTrace();
            return "";
        }
    }

    public java.lang.String categoryContent(java.lang.String str, java.lang.String str2, boolean z, java.util.HashMap<java.lang.String, java.lang.String> hashMap) {
        com.google.gson.JsonObject jsonObject = new com.google.gson.JsonObject();
        jsonObject.addProperty("tid", str);
        jsonObject.addProperty("page", str2);
        jsonObject.addProperty("sort", (hashMap == null || !hashMap.containsKey("sort")) ? "d_id" : hashMap.get("sort"));
        jsonObject.addProperty("area", (hashMap == null || !hashMap.containsKey("area")) ? "0" : hashMap.get("area"));
        jsonObject.addProperty("sub", (java.lang.String) ((hashMap == null || !hashMap.containsKey("sub")) ? c.get(str) : hashMap.get("sub")));
        jsonObject.addProperty("year", (hashMap == null || !hashMap.containsKey("year")) ? "0" : hashMap.get("year"));
        jsonObject.addProperty("pageSize", "30");
        java.lang.String a2 = a("/App/IndexList/indexList", jsonObject.toString());
        java.util.ArrayList arrayList = new java.util.ArrayList();
        org.json.JSONArray optJSONArray = new org.json.JSONObject(a2).optJSONArray("list");
        for (int i = 0; i < optJSONArray.length(); i++) {
            org.json.JSONObject optJSONObject = optJSONArray.optJSONObject(i);
            arrayList.add(new com.github.catvod.spider.merge.c.C0758e(optJSONObject.optString("vod_id"), optJSONObject.optString("vod_name"), optJSONObject.optString("vod_pic"), optJSONObject.optString("vod_scroe")));
        }
        com.github.catvod.spider.merge.c.C0756c c0756c = new com.github.catvod.spider.merge.c.C0756c();
        c0756c.i(java.lang.Integer.valueOf(str2).intValue(), 0, 0, 0);
        c0756c.w(arrayList);
        return c0756c.toString();
    }

    public java.lang.String detailContent(java.util.List<java.lang.String> list) {
        com.google.gson.JsonObject jsonObject = new com.google.gson.JsonObject();
        jsonObject.addProperty("token_id", "1009464");
        jsonObject.addProperty("vod_id", list.get(0));
        jsonObject.addProperty("mobile_time", (java.lang.System.currentTimeMillis() / 1000) + "");
        jsonObject.addProperty("token", a);
        java.lang.String a2 = a("/App/IndexPlay/playInfo", jsonObject.toString());
        com.github.catvod.spider.merge.c.C0758e c0758e = new com.github.catvod.spider.merge.c.C0758e();
        org.json.JSONObject optJSONObject = new org.json.JSONObject(a2).optJSONObject("vodInfo");
        c0758e.j(list.get(0));
        c0758e.k(optJSONObject.optString("vod_name"));
        c0758e.l(optJSONObject.optString("vod_pic"));
        c0758e.h(optJSONObject.optString("vod_use_content"));
        c0758e.f(optJSONObject.optString("vod_actor"));
        c0758e.i(optJSONObject.optString("vod_director"));
        c0758e.g(optJSONObject.optString("vod_area"));
        c0758e.q(optJSONObject.optString("vod_year"));
        com.google.gson.JsonObject jsonObject2 = new com.google.gson.JsonObject();
        jsonObject2.addProperty("vurl_cloud_id", "2");
        jsonObject2.addProperty("vod_d_id", list.get(0));
        java.lang.String a3 = a("/App/Resource/Vurl/show", jsonObject2.toString());
        java.util.HashMap hashMap = new java.util.HashMap();
        java.util.ArrayList arrayList = new java.util.ArrayList();
        java.util.ArrayList arrayList2 = new java.util.ArrayList();
        org.json.JSONArray optJSONArray = new org.json.JSONObject(a3).optJSONArray("list");
        int i = 0;
        while (true) {
            int i2 = i;
            if (i2 >= optJSONArray.length()) {
                break;
            }
            org.json.JSONObject optJSONObject2 = optJSONArray.optJSONObject(i2);
            org.json.JSONObject optJSONObject3 = optJSONObject2.optJSONObject("play");
            java.util.Iterator<java.lang.String> keys = optJSONObject3.keys();
            while (keys.hasNext()) {
                java.lang.String next = keys.next();
                if (!"2".equals(optJSONObject3.optJSONObject(next).optString("show_type"))) {
                    java.util.List arrayList3 = hashMap.containsKey(next) ? (java.util.List) hashMap.get(next) : new java.util.ArrayList();
                    arrayList3.add(optJSONObject2.optString("title") + "$" + optJSONObject3.optJSONObject(next).optString("param"));
                    hashMap.put(next, arrayList3);
                }
            }
            i = i2 + 1;
        }
        for (java.lang.String str : hashMap.keySet()) {
            arrayList2.add(str);
            arrayList.add(android.text.TextUtils.join("#", (java.lang.Iterable) hashMap.get(str)));
        }
        c0758e.m(android.text.TextUtils.join("$$$", arrayList2));
        c0758e.n(android.text.TextUtils.join("$$$", arrayList));
        return com.github.catvod.spider.merge.c.C0756c.m(c0758e);
    }

    public java.lang.String homeContent(boolean z) {
        org.json.JSONArray jSONArray = new org.json.JSONArray("[{\"type_id\":\"1\",\"type_name\":\"电影\"},{\"type_id\":\"2\",\"type_name\":\"国产剧\"},{\"type_id\":\"3\",\"type_name\":\"动漫\"},{\"type_id\":\"4\",\"type_name\":\"综艺\"},{\"type_id\":\"64\",\"type_name\":\"短剧\"}]");
        org.json.JSONObject jSONObject = new org.json.JSONObject("{\"1\":[{\"key\":\"area\",\"name\":\"地区\",\"value\":[{\"n\":\"地区\",\"v\":\"0\"},{\"n\":\"大陆\",\"v\":\"大陆\"},{\"n\":\"香港\",\"v\":\"香港\"},{\"n\":\"台湾\",\"v\":\"台湾\"},{\"n\":\"欧美\",\"v\":\"俄罗斯,加拿大,德国,意大利,法国,欧美,美国,英国,西班牙\"},{\"n\":\"日本\",\"v\":\"日本\"},{\"n\":\"韩国\",\"v\":\"韩国\"},{\"n\":\"泰国\",\"v\":\"泰国\"},{\"n\":\"其他\",\"v\":\"其他,印度,新加坡,马来西亚\"}]},{\"key\":\"year\",\"name\":\"年份\",\"value\":[{\"n\":\"年份\",\"v\":\"0\"},{\"n\":\"2026\",\"v\":\"2026\"},{\"n\":\"2025\",\"v\":\"2025\"},{\"n\":\"2024\",\"v\":\"2024\"},{\"n\":\"2023\",\"v\":\"2023\"},{\"n\":\"2022\",\"v\":\"2022\"},{\"n\":\"2021\",\"v\":\"2021\"},{\"n\":\"2020\",\"v\":\"2020\"},{\"n\":\"2019\",\"v\":\"2019\"},{\"n\":\"2018\",\"v\":\"2018\"},{\"n\":\"2017\",\"v\":\"2017\"},{\"n\":\"2016\",\"v\":\"2016\"},{\"n\":\"10-15年\",\"v\":\"2015,2014,2013,2012,2011,2010\"},{\"n\":\"00年代\",\"v\":\"2000,2001,2002,2003,2004,2005,2006,2007,2008,2009\"},{\"n\":\"90年代\",\"v\":\"1990,1991,1992,1993,1994,1995,1996,1997,1998,1999\"},{\"n\":\"80年代\",\"v\":\"1980,1981,1982,1983,1984,1985,1986,1987,1988,1989\"},{\"n\":\"更早\",\"v\":\"2\"}]},{\"key\":\"sub\",\"name\":\"类型\",\"value\":[{\"n\":\"动作片\",\"v\":\"5\"},{\"n\":\"悬疑片\",\"v\":\"29\"},{\"n\":\"喜剧片\",\"v\":\"6\"},{\"n\":\"爱情片\",\"v\":\"7\"},{\"n\":\"科幻片\",\"v\":\"8\"},{\"n\":\"恐怖片\",\"v\":\"9\"},{\"n\":\"剧情片\",\"v\":\"10\"},{\"n\":\"战争片\",\"v\":\"11\"},{\"n\":\"动画片\",\"v\":\"36\"},{\"n\":\"纪录片\",\"v\":\"20\"},{\"n\":\"灾难片\",\"v\":\"38\"},{\"n\":\"犯罪片\",\"v\":\"61\"}]},{\"key\":\"sort\",\"name\":\"排序\",\"value\":[{\"n\":\"综合\",\"v\":\"d_id\"},{\"n\":\"最新\",\"v\":\"d_addtime\"},{\"n\":\"最热\",\"v\":\"d_score\"},{\"n\":\"高分\",\"v\":\"d_score\"}]}],\"2\":[{\"key\":\"area\",\"name\":\"地区\",\"value\":[{\"n\":\"地区\",\"v\":\"0\"},{\"n\":\"大陆\",\"v\":\"大陆\"},{\"n\":\"香港\",\"v\":\"香港\"},{\"n\":\"台湾\",\"v\":\"台湾\"},{\"n\":\"欧美\",\"v\":\"俄罗斯,加拿大,德国,意大利,法国,欧美,美国,英国,西班牙\"},{\"n\":\"日本\",\"v\":\"日本\"},{\"n\":\"韩国\",\"v\":\"韩国\"},{\"n\":\"泰国\",\"v\":\"泰国\"},{\"n\":\"其他\",\"v\":\"其他,印度,新加坡,马来西亚\"}]},{\"key\":\"year\",\"name\":\"年份\",\"value\":[{\"n\":\"年份\",\"v\":\"0\"},{\"n\":\"2026\",\"v\":\"2026\"},{\"n\":\"2025\",\"v\":\"2025\"},{\"n\":\"2024\",\"v\":\"2024\"},{\"n\":\"2023\",\"v\":\"2023\"},{\"n\":\"2022\",\"v\":\"2022\"},{\"n\":\"2021\",\"v\":\"2021\"},{\"n\":\"2020\",\"v\":\"2020\"},{\"n\":\"2019\",\"v\":\"2019\"},{\"n\":\"2018\",\"v\":\"2018\"},{\"n\":\"2017\",\"v\":\"2017\"},{\"n\":\"2016\",\"v\":\"2016\"},{\"n\":\"10-15年\",\"v\":\"2015,2014,2013,2012,2011,2010\"},{\"n\":\"00年代\",\"v\":\"2000,2001,2002,2003,2004,2005,2006,2007,2008,2009\"},{\"n\":\"90年代\",\"v\":\"1990,1991,1992,1993,1994,1995,1996,1997,1998,1999\"},{\"n\":\"80年代\",\"v\":\"1980,1981,1982,1983,1984,1985,1986,1987,1988,1989\"},{\"n\":\"更早\",\"v\":\"2\"}]},{\"key\":\"sub\",\"name\":\"类型\",\"value\":[{\"n\":\"国产剧\",\"v\":\"12\"},{\"n\":\"香港剧\",\"v\":\"13\"},{\"n\":\"台湾剧\",\"v\":\"14\"},{\"n\":\"欧美剧\",\"v\":\"15\"},{\"n\":\"日本剧\",\"v\":\"16\"},{\"n\":\"韩国剧\",\"v\":\"17\"},{\"n\":\"海外剧\",\"v\":\"18\"},{\"n\":\"泰国剧\",\"v\":\"19\"},{\"n\":\"新加坡\",\"v\":\"69\"}]},{\"key\":\"sort\",\"name\":\"排序\",\"value\":[{\"n\":\"综合\",\"v\":\"d_id\"},{\"n\":\"最新\",\"v\":\"d_addtime\"},{\"n\":\"最热\",\"v\":\"d_score\"},{\"n\":\"高分\",\"v\":\"d_score\"}]}],\"3\":[{\"key\":\"area\",\"name\":\"地区\",\"value\":[{\"n\":\"地区\",\"v\":\"0\"},{\"n\":\"大陆\",\"v\":\"大陆\"},{\"n\":\"香港\",\"v\":\"香港\"},{\"n\":\"台湾\",\"v\":\"台湾\"},{\"n\":\"欧美\",\"v\":\"俄罗斯,加拿大,德国,意大利,法国,欧美,美国,英国,西班牙\"},{\"n\":\"日本\",\"v\":\"日本\"},{\"n\":\"韩国\",\"v\":\"韩国\"},{\"n\":\"泰国\",\"v\":\"泰国\"},{\"n\":\"其他\",\"v\":\"其他,印度,新加坡,马来西亚\"}]},{\"key\":\"year\",\"name\":\"年份\",\"value\":[{\"n\":\"年份\",\"v\":\"0\"},{\"n\":\"2026\",\"v\":\"2026\"},{\"n\":\"2025\",\"v\":\"2025\"},{\"n\":\"2024\",\"v\":\"2024\"},{\"n\":\"2023\",\"v\":\"2023\"},{\"n\":\"2022\",\"v\":\"2022\"},{\"n\":\"2021\",\"v\":\"2021\"},{\"n\":\"2020\",\"v\":\"2020\"},{\"n\":\"2019\",\"v\":\"2019\"},{\"n\":\"2018\",\"v\":\"2018\"},{\"n\":\"2017\",\"v\":\"2017\"},{\"n\":\"2016\",\"v\":\"2016\"},{\"n\":\"10-15年\",\"v\":\"2015,2014,2013,2012,2011,2010\"},{\"n\":\"00年代\",\"v\":\"2000,2001,2002,2003,2004,2005,2006,2007,2008,2009\"},{\"n\":\"90年代\",\"v\":\"1990,1991,1992,1993,1994,1995,1996,1997,1998,1999\"},{\"n\":\"80年代\",\"v\":\"1980,1981,1982,1983,1984,1985,1986,1987,1988,1989\"},{\"n\":\"更早\",\"v\":\"2\"}]},{\"key\":\"sub\",\"name\":\"类型\",\"value\":[{\"n\":\"中国动漫\",\"v\":\"30\"},{\"n\":\"日本动漫\",\"v\":\"31\"},{\"n\":\" 欧美动漫\",\"v\":\"33\"}]},{\"key\":\"sort\",\"name\":\"排序\",\"value\":[{\"n\":\"综合\",\"v\":\"d_id\"},{\"n\":\"最新\",\"v\":\"d_addtime\"},{\"n\":\"最热\",\"v\":\"d_score\"},{\"n\":\"高分\",\"v\":\"d_score\"}]}],\"4\":[{\"key\":\"area\",\"name\":\"地区\",\"value\":[{\"n\":\"地区\",\"v\":\"0\"},{\"n\":\"大陆\",\"v\":\"大陆\"},{\"n\":\"香港\",\"v\":\"香港\"},{\"n\":\"台湾\",\"v\":\"台湾\"},{\"n\":\"欧美\",\"v\":\"俄罗斯,加拿大,德国,意大利,法国,欧美,美国,英国,西班牙\"},{\"n\":\"日本\",\"v\":\"日本\"},{\"n\":\"韩国\",\"v\":\"韩国\"},{\"n\":\"泰国\",\"v\":\"泰国\"},{\"n\":\"其他\",\"v\":\"其他,印度,新加坡,马来西亚\"}]},{\"key\":\"year\",\"name\":\"年份\",\"value\":[{\"n\":\"年份\",\"v\":\"0\"},{\"n\":\"2026\",\"v\":\"2026\"},{\"n\":\"2025\",\"v\":\"2025\"},{\"n\":\"2024\",\"v\":\"2024\"},{\"n\":\"2023\",\"v\":\"2023\"},{\"n\":\"2022\",\"v\":\"2022\"},{\"n\":\"2021\",\"v\":\"2021\"},{\"n\":\"2020\",\"v\":\"2020\"},{\"n\":\"2019\",\"v\":\"2019\"},{\"n\":\"2018\",\"v\":\"2018\"},{\"n\":\"2017\",\"v\":\"2017\"},{\"n\":\"2016\",\"v\":\"2016\"},{\"n\":\"10-15年\",\"v\":\"2015,2014,2013,2012,2011,2010\"},{\"n\":\"00年代\",\"v\":\"2000,2001,2002,2003,2004,2005,2006,2007,2008,2009\"},{\"n\":\"90年代\",\"v\":\"1990,1991,1992,1993,1994,1995,1996,1997,1998,1999\"},{\"n\":\"80年代\",\"v\":\"1980,1981,1982,1983,1984,1985,1986,1987,1988,1989\"},{\"n\":\"更早\",\"v\":\"2\"}]},{\"key\":\"sub\",\"name\":\"类型\",\"value\":[{\"n\":\"大陆综艺\",\"v\":\"22\"},{\"n\":\"港台综艺\",\"v\":\"23\"},{\"n\":\"日韩综艺\",\"v\":\"24\"},{\"n\":\"欧美综艺\",\"v\":\"25\"}]},{\"key\":\"sort\",\"name\":\"排序\",\"value\":[{\"n\":\"综合\",\"v\":\"d_id\"},{\"n\":\"最新\",\"v\":\"d_addtime\"},{\"n\":\"最热\",\"v\":\"d_score\"},{\"n\":\"高分\",\"v\":\"d_score\"}]}],\"64\":[{\"key\":\"sort\",\"name\":\"排序\",\"value\":[{\"n\":\"综合\",\"v\":\"d_id\"},{\"n\":\"最新\",\"v\":\"d_addtime\"},{\"n\":\"最热\",\"v\":\"d_score\"},{\"n\":\"高分\",\"v\":\"d_score\"}]}]}");
        org.json.JSONObject jSONObject2 = new org.json.JSONObject();
        jSONObject2.put("class", jSONArray);
        jSONObject2.put("filters", jSONObject);
        jSONObject2.put("list", new org.json.JSONArray());
        return jSONObject2.toString();
    }

    public void init(android.content.Context context, java.lang.String str) {
        super.init(context, str);
        java.util.HashMap hashMap = c;
        hashMap.put("1", "5");
        hashMap.put("2", "12");
        hashMap.put("3", "30");
        hashMap.put("4", "22");
        hashMap.put("64", "");
    }

    public java.lang.String playerContent(java.lang.String str, java.lang.String str2, java.util.List<java.lang.String> list) {
        com.google.gson.JsonObject jsonObject = new com.google.gson.JsonObject();
        for (java.lang.String str3 : str2.split("&")) {
            int indexOf = str3.indexOf("=");
            jsonObject.addProperty(str3.substring(0, indexOf), str3.substring(indexOf + 1));
        }
        java.lang.String optString = new org.json.JSONObject(a("/App/Resource/VurlDetail/showOne", jsonObject.toString())).optString("url");
        if (!com.github.catvod.spider.merge.a.C0731a.m1137a(optString)) {
            return com.github.catvod.spider.merge.c.C0756c.l("播放链接解析失败");
        }
        org.json.JSONObject jSONObject = new org.json.JSONObject();
        jSONObject.put("parse", 0);
        jSONObject.put("url", optString);
        org.json.JSONObject jSONObject2 = new org.json.JSONObject();
        jSONObject2.put("User-Agent", "Lavf/57.83.100");
        jSONObject.put("header", jSONObject2);
        return com.github.catvod.spider.merge.a.C0731a.addDanmaku(jSONObject.toString());
    }

    public java.lang.String searchContent(java.lang.String str, boolean z) {
        com.google.gson.JsonObject jsonObject = new com.google.gson.JsonObject();
        jsonObject.addProperty("keywords", str);
        jsonObject.addProperty("order_val", "1");
        java.lang.String a2 = a("/App/Index/findMoreVod", jsonObject.toString());
        java.util.ArrayList arrayList = new java.util.ArrayList();
        org.json.JSONArray optJSONArray = new org.json.JSONObject(a2).optJSONArray("list");
        for (int i = 0; i < optJSONArray.length(); i++) {
            org.json.JSONObject optJSONObject = optJSONArray.optJSONObject(i);
            arrayList.add(new com.github.catvod.spider.merge.c.C0758e(optJSONObject.optString("vod_id"), optJSONObject.optString("vod_name"), optJSONObject.optString("vod_pic"), optJSONObject.optString("vod_scroe")));
        }
        return com.github.catvod.spider.merge.c.C0756c.n(arrayList);
    }
}
