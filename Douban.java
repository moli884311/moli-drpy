package com.github.catvod.spider;

/* loaded from: classes.dex */
public class Douban extends com.github.catvod.crawler.Spider {
    private final java.lang.String a = "?apikey=0ac44ae016490db2204ce0a042db2916";

    private java.util.Map<java.lang.String, java.lang.String> a() {
        java.util.HashMap hashMap = new java.util.HashMap();
        hashMap.put("Host", "frodo.douban.com");
        hashMap.put("Connection", "Keep-Alive");
        hashMap.put("Referer", "https://servicewechat.com/wx2f9b06c1de1ccfca/84/page-frame.html");
        hashMap.put("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2785.143 Safari/537.36 MicroMessenger/7.0.9.501 NetType/WIFI MiniProgramEnv/Windows WindowsWechat");
        return hashMap;
    }

    private java.lang.String b(java.util.HashMap<java.lang.String, java.lang.String> hashMap) {
        try {
            java.lang.StringBuilder sb = new java.lang.StringBuilder();
            for (java.lang.String str : hashMap.keySet()) {
                if (!str.equals("sort")) {
                    sb.append(hashMap.get(str));
                    sb.append(",");
                }
            }
            return com.github.catvod.spider.merge.FM.o.z.q(sb.toString());
        } catch (java.lang.Exception unused) {
            return "";
        }
    }

    private java.util.List<com.github.catvod.spider.merge.FM.c.C0534j> c(org.json.JSONArray jSONArray) {
        java.lang.String str;
        java.lang.String str2;
        java.util.ArrayList arrayList = new java.util.ArrayList();
        for (int i = 0; i < jSONArray.length(); i++) {
            org.json.JSONObject jSONObject = jSONArray.getJSONObject(i);
            java.lang.String str3 = "msearch:" + jSONObject.optString("id");
            java.lang.String optString = jSONObject.optString("title");
            try {
                str = jSONObject.getJSONObject("pic").optString("normal") + "@Referer=https://api.douban.com/@User-Agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36";
            } catch (java.lang.Exception unused) {
                str = "";
            }
            try {
                str2 = "评分：" + jSONObject.getJSONObject("rating").optString("value");
            } catch (java.lang.Exception unused2) {
                str2 = "";
            }
            arrayList.add(new com.github.catvod.spider.merge.FM.c.C0534j(str3, optString, str, str2));
        }
        return arrayList;
    }

    public static java.lang.String filterItemsWithoutPic(java.lang.String str) {
        try {
            org.json.JSONObject jSONObject = new org.json.JSONObject(str);
            org.json.JSONArray jSONArray = jSONObject.getJSONArray("list");
            org.json.JSONArray jSONArray2 = new org.json.JSONArray();
            for (int i = 0; i < jSONArray.length(); i++) {
                org.json.JSONObject jSONObject2 = jSONArray.getJSONObject(i);
                if (!android.text.TextUtils.isEmpty(jSONObject2.optString("vod_pic", ""))) {
                    jSONArray2.put(jSONObject2);
                }
            }
            jSONObject.put("list", jSONArray2);
            return jSONObject.toString();
        } catch (java.lang.Exception e) {
            e.printStackTrace();
            return str;
        }
    }

    private java.lang.String processAnimeContent(java.lang.String str, java.util.HashMap<java.lang.String, java.lang.String> hashMap) throws org.json.JSONException {
        org.json.JSONObject jSONObject = new org.json.JSONObject();
        org.json.JSONArray jSONArray = new org.json.JSONArray();
        java.lang.StringBuilder sb = new java.lang.StringBuilder();
        sb.append("https://frodo.douban.com/api/v2/tv/recommend?apikey=0ac44ae016490db2204ce0a042db2916&sort=T&tags=动画&start=0&count=20");
        if (!android.text.TextUtils.isEmpty(str)) {
            int parseInt = java.lang.Integer.parseInt(str);
            java.lang.String replace = sb.toString().replace("start=0", "start=" + (parseInt > 1 ? (parseInt - 1) * 20 : 0));
            sb = new java.lang.StringBuilder();
            sb.append(replace);
        }
        if (hashMap != null) {
            java.lang.String str2 = hashMap.get("sort");
            if (str2 != null && !str2.isEmpty()) {
                java.lang.String replace2 = sb.toString().replace("sort=T", "sort=" + str2);
                sb = new java.lang.StringBuilder();
                sb.append(replace2);
            }
            java.lang.StringBuilder sb2 = new java.lang.StringBuilder();
            java.lang.String str3 = hashMap.get("类型");
            java.lang.String str4 = hashMap.get("地区");
            java.lang.String str5 = hashMap.get("年代");
            sb2.append("动画");
            if (str3 != null && !str3.isEmpty()) {
                sb2.append(",");
                sb2.append(str3);
            }
            if (str4 != null && !str4.isEmpty()) {
                sb2.append(",");
                sb2.append(str4);
            }
            if (str5 != null && !str5.isEmpty()) {
                sb2.append(",");
                sb2.append(str5);
            }
            java.lang.String replace3 = sb.toString().replace("tags=动画", "tags=" + sb2.toString());
            sb = new java.lang.StringBuilder();
            sb.append(replace3);
        }
        org.json.JSONArray optJSONArray = new org.json.JSONObject(com.github.catvod.spider.merge.k.C0779b.l(sb.toString(), a())).optJSONArray("items");
        if (optJSONArray != null) {
            for (int i = 0; i < optJSONArray.length(); i++) {
                org.json.JSONObject jSONObject2 = optJSONArray.getJSONObject(i);
                java.lang.String optString = jSONObject2.optString("title");
                java.lang.String str6 = "msearch:" + jSONObject2.optString("id");
                org.json.JSONObject optJSONObject = jSONObject2.optJSONObject("pic");
                java.lang.String str7 = optJSONObject != null ? optJSONObject.optString("normal") + "@Referer=https://api.douban.com/@User-Agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36" : "";
                org.json.JSONObject optJSONObject2 = jSONObject2.optJSONObject("rating");
                java.lang.StringBuilder sb3 = new java.lang.StringBuilder();
                sb3.append("评分：");
                if (optJSONObject2 != null) {
                    sb3.append(optJSONObject2.optDouble("value"));
                }
                java.lang.String sb4 = sb3.toString();
                org.json.JSONObject jSONObject3 = new org.json.JSONObject();
                jSONObject3.put("vod_id", str6);
                jSONObject3.put("vod_name", optString);
                jSONObject3.put("vod_pic", str7);
                jSONObject3.put("vod_remarks", sb4);
                jSONArray.put(jSONObject3);
            }
        }
        jSONObject.put("list", jSONArray);
        int length = jSONArray.length();
        jSONObject.put("page", java.lang.Integer.parseInt(str));
        jSONObject.put("pagecount", 999);
        jSONObject.put("limit", 20);
        jSONObject.put("total", length);
        return jSONObject.toString();
    }

    /* JADX WARN: Can't fix incorrect switch cases order, some code will duplicate */
    public java.lang.String categoryContent(java.lang.String str, java.lang.String str2, boolean z, java.util.HashMap<java.lang.String, java.lang.String> hashMap) {
        char c;
        java.lang.String str3;
        java.lang.StringBuilder sb;
        java.lang.String str4;
        if ("anime_hot".equals(str)) {
            return processAnimeContent(str2, hashMap);
        }
        java.lang.String str5 = hashMap.get("sort") == null ? "T" : hashMap.get("sort");
        java.lang.String encode = java.net.URLEncoder.encode(b(hashMap));
        int parseInt = (java.lang.Integer.parseInt(str2) - 1) * 20;
        java.lang.String str6 = "items";
        switch (str.hashCode()) {
            case -1224615358:
                if (str.equals("rank_list_movie")) {
                    c = 4;
                    break;
                }
                c = 65535;
                break;
            case -862076656:
                if (str.equals("tv_hot")) {
                    c = 1;
                    break;
                }
                c = 65535;
                break;
            case -338503669:
                if (str.equals("show_hot")) {
                    c = 2;
                    break;
                }
                c = 65535;
                break;
            case -290777052:
                if (str.equals("hot_gaia")) {
                    c = 0;
                    break;
                }
                c = 65535;
                break;
            case 3714:
                if (str.equals("tv")) {
                    c = 3;
                    break;
                }
                c = 65535;
                break;
            case 1599380656:
                if (str.equals("rank_list_tv")) {
                    c = 5;
                    break;
                }
                c = 65535;
                break;
            default:
                c = 65535;
                break;
        }
        if (c == 0) {
            java.lang.String str7 = hashMap.get("sort") == null ? "recommend" : hashMap.get("sort");
            java.lang.String str8 = hashMap.get("area") == null ? "全部" : hashMap.get("area");
            java.lang.StringBuilder b = com.github.catvod.spider.merge.FM.L.P.b(str7);
            b.append("&area=");
            b.append(java.net.URLEncoder.encode(str8));
            str3 = "https://frodo.douban.com/api/v2/movie/hot_gaia?apikey=0ac44ae016490db2204ce0a042db2916&sort=" + b.toString() + "&start=" + parseInt + "&count=20";
        } else if (c == 1) {
            str3 = "https://frodo.douban.com/api/v2/subject_collection/" + (hashMap.get("type") == null ? "tv_hot" : hashMap.get("type")) + "/items" + this.a + "&start=" + parseInt + "&count=20";
            str6 = "subject_collection_items";
        } else if (c != 2) {
            if (c == 3) {
                sb = new java.lang.StringBuilder();
                sb.append("https://frodo.douban.com/api/v2/tv/recommend?apikey=0ac44ae016490db2204ce0a042db2916&sort=");
                sb.append(str5);
                sb.append("&tags=");
                sb.append(encode);
                sb.append("&start=");
                sb.append(parseInt);
                str4 = "&count=20";
            } else if (c == 4) {
                str3 = "https://frodo.douban.com/api/v2/subject_collection/" + (hashMap.get("榜单") == null ? "movie_real_time_hotest" : hashMap.get("榜单")) + "/items" + this.a + "&start=" + parseInt + "&count=20";
                str6 = "subject_collection_items";
            } else if (c != 5) {
                sb = new java.lang.StringBuilder();
                sb.append("https://frodo.douban.com/api/v2/movie/recommend?apikey=0ac44ae016490db2204ce0a042db2916&sort=");
                sb.append(str5);
                sb.append("&tags=");
                sb.append(encode);
                sb.append("&start=");
                sb.append(parseInt);
                str4 = "&count=20";
            } else {
                str3 = "https://frodo.douban.com/api/v2/subject_collection/" + (hashMap.get("榜单") == null ? "tv_real_time_hotest" : hashMap.get("榜单")) + "/items" + this.a + "&start=" + parseInt + "&count=20";
                str6 = "subject_collection_items";
            }
            sb.append(str4);
            str3 = sb.toString();
        } else {
            str3 = "https://frodo.douban.com/api/v2/subject_collection/" + (hashMap.get("type") == null ? "show_hot" : hashMap.get("type")) + "/items" + this.a + "&start=" + parseInt + "&count=20";
            str6 = "subject_collection_items";
        }
        java.util.List<com.github.catvod.spider.merge.FM.c.C0534j> c2 = c(new org.json.JSONObject(com.github.catvod.spider.merge.FM.m.C0580c.n(str3, a())).getJSONArray(str6));
        int parseInt2 = java.lang.Integer.parseInt(str2);
        com.github.catvod.spider.merge.FM.c.C0531g e = com.github.catvod.spider.merge.FM.c.C0531g.e();
        e.z(c2);
        e.k(parseInt2, Integer.MAX_VALUE, 20, Integer.MAX_VALUE);
        return filterItemsWithoutPic(e.o());
    }

    public java.lang.String homeContent(boolean z) {
        java.lang.String optString = new org.json.JSONObject(com.github.catvod.spider.merge.m.C0806k.a(com.github.catvod.spider.merge.m.C0806k.c("/config.json"))).optString("homePage", "");
        java.util.HashSet hashSet = new java.util.HashSet();
        if (!android.text.TextUtils.isEmpty(optString)) {
            hashSet.addAll(java.util.Arrays.asList(optString.split(",")));
        }
        java.util.ArrayList arrayList = new java.util.ArrayList();
        java.util.List asList = java.util.Arrays.asList("hot_gaia", "tv_hot", "anime_hot", "show_hot", "movie", "tv", "rank_list_movie", "rank_list_tv");
        java.util.List asList2 = java.util.Arrays.asList("热门电影", "热播剧集", "热门动漫", "热播综艺", "电影筛选", "电视筛选", "电影榜单", "电视剧榜单");
        for (int i = 0; i < asList.size(); i++) {
            java.lang.String str = (java.lang.String) asList2.get(i);
            if (hashSet.isEmpty() || hashSet.contains(str)) {
                arrayList.add(new com.github.catvod.spider.merge.FM.c.C0525a((java.lang.String) asList.get(i), (java.lang.String) asList2.get(i)));
            }
        }
        return com.github.catvod.spider.merge.FM.c.C0531g.u(arrayList, c(new org.json.JSONObject(com.github.catvod.spider.merge.FM.m.C0580c.n("http://api.douban.com/api/v2/subject_collection/subject_real_time_hotest/items?apikey=0ac44ae016490db2204ce0a042db2916", a())).optJSONArray("subject_collection_items")), new org.json.JSONObject("{\"hot_gaia\":[{\"key\":\"sort\",\"name\":\"排序\",\"value\":[{\"n\":\"热度\",\"v\":\"recommend\"},{\"n\":\"最新\",\"v\":\"time\"},{\"n\":\"评分\",\"v\":\"rank\"}]},{\"key\":\"area\",\"name\":\"地区\",\"value\":[{\"n\":\"全部\",\"v\":\"全部\"},{\"n\":\"华语\",\"v\":\"华语\"},{\"n\":\"欧美\",\"v\":\"欧美\"},{\"n\":\"韩国\",\"v\":\"韩国\"},{\"n\":\"日本\",\"v\":\"日本\"}]}],\"tv_hot\":[{\"key\":\"type\",\"name\":\"分类\",\"value\":[{\"n\":\"综合\",\"v\":\"tv_hot\"},{\"n\":\"国产剧\",\"v\":\"tv_domestic\"},{\"n\":\"欧美剧\",\"v\":\"tv_american\"},{\"n\":\"日剧\",\"v\":\"tv_japanese\"},{\"n\":\"韩剧\",\"v\":\"tv_korean\"},{\"n\":\"动画\",\"v\":\"tv_animation\"}]}],\"anime_hot\":[{\"key\":\"类型\",\"name\":\"类型\",\"value\":[{\"n\":\"全部\",\"v\":\"\"},{\"n\":\"热血\",\"v\":\"热血\"},{\"n\":\"搞笑\",\"v\":\"搞笑\"},{\"n\":\"恋爱\",\"v\":\"恋爱\"},{\"n\":\"校园\",\"v\":\"校园\"},{\"n\":\"科幻\",\"v\":\"科幻\"},{\"n\":\"奇幻\",\"v\":\"奇幻\"},{\"n\":\"悬疑\",\"v\":\"悬疑\"},{\"n\":\"治愈\",\"v\":\"治愈\"},{\"n\":\"运动\",\"v\":\"运动\"},{\"n\":\"机甲\",\"v\":\"机甲\"},{\"n\":\"少女\",\"v\":\"少女\"},{\"n\":\"少年\",\"v\":\"少年\"}]},{\"key\":\"地区\",\"name\":\"地区\",\"value\":[{\"n\":\"全部\",\"v\":\"\"},{\"n\":\"日本\",\"v\":\"日本\"},{\"n\":\"中国大陆\",\"v\":\"中国大陆\"},{\"n\":\"美国\",\"v\":\"美国\"},{\"n\":\"韩国\",\"v\":\"韩国\"},{\"n\":\"英国\",\"v\":\"英国\"},{\"n\":\"法国\",\"v\":\"法国\"}]},{\"key\":\"sort\",\"name\":\"排序\",\"value\":[{\"n\":\"近期热度\",\"v\":\"T\"},{\"n\":\"首播时间\",\"v\":\"R\"},{\"n\":\"高分优先\",\"v\":\"S\"}]},{\"key\":\"年代\",\"name\":\"年代\",\"value\":[{\"n\":\"全部\",\"v\":\"\"},{\"n\":\"2026\",\"v\":\"2026\"},{\"n\":\"2025\",\"v\":\"2025\"},{\"n\":\"2024\",\"v\":\"2024\"},{\"n\":\"2023\",\"v\":\"2023\"},{\"n\":\"2022\",\"v\":\"2022\"},{\"n\":\"2021\",\"v\":\"2021\"},{\"n\":\"2020\",\"v\":\"2020\"},{\"n\":\"2019\",\"v\":\"2019\"},{\"n\":\"2010年代\",\"v\":\"2010年代\"},{\"n\":\"2000年代\",\"v\":\"2000年代\"},{\"n\":\"90年代\",\"v\":\"90年代\"},{\"n\":\"更早\",\"v\":\"更早\"}]}],\"show_hot\":[{\"key\":\"type\",\"name\":\"分类\",\"value\":[{\"n\":\"综合\",\"v\":\"show_hot\"},{\"n\":\"国内\",\"v\":\"show_domestic\"},{\"n\":\"国外\",\"v\":\"show_foreign\"}]}],\"movie\":[{\"key\":\"类型\",\"name\":\"类型\",\"value\":[{\"n\":\"全部类型\",\"v\":\"\"},{\"n\":\"喜剧\",\"v\":\"喜剧\"},{\"n\":\"爱情\",\"v\":\"爱情\"},{\"n\":\"动作\",\"v\":\"动作\"},{\"n\":\"科幻\",\"v\":\"科幻\"},{\"n\":\"动画\",\"v\":\"动画\"},{\"n\":\"悬疑\",\"v\":\"悬疑\"},{\"n\":\"犯罪\",\"v\":\"犯罪\"},{\"n\":\"惊悚\",\"v\":\"惊悚\"},{\"n\":\"冒险\",\"v\":\"冒险\"},{\"n\":\"音乐\",\"v\":\"音乐\"},{\"n\":\"历史\",\"v\":\"历史\"},{\"n\":\"奇幻\",\"v\":\"奇幻\"},{\"n\":\"恐怖\",\"v\":\"恐怖\"},{\"n\":\"战争\",\"v\":\"战争\"},{\"n\":\"传记\",\"v\":\"传记\"},{\"n\":\"歌舞\",\"v\":\"歌舞\"},{\"n\":\"武侠\",\"v\":\"武侠\"},{\"n\":\"情色\",\"v\":\"情色\"},{\"n\":\"灾难\",\"v\":\"灾难\"},{\"n\":\"西部\",\"v\":\"西部\"},{\"n\":\"纪录片\",\"v\":\"纪录片\"},{\"n\":\"短片\",\"v\":\"短片\"}]},{\"key\":\"地区\",\"name\":\"地区\",\"value\":[{\"n\":\"全部地区\",\"v\":\"\"},{\"n\":\"华语\",\"v\":\"华语\"},{\"n\":\"欧美\",\"v\":\"欧美\"},{\"n\":\"中国\",\"v\":\"中国\"},{\"n\":\"美国\",\"v\":\"美国\"},{\"n\":\"中国香港\",\"v\":\"中国香港\"},{\"n\":\"中国台湾\",\"v\":\"中国台湾\"},{\"n\":\"韩国\",\"v\":\"韩国\"},{\"n\":\"日本\",\"v\":\"日本\"},{\"n\":\"英国\",\"v\":\"英国\"},{\"n\":\"法国\",\"v\":\"法国\"},{\"n\":\"菲律宾\",\"v\":\"菲律宾\"},{\"n\":\"德国\",\"v\":\"德国\"},{\"n\":\"意大利\",\"v\":\"意大利\"},{\"n\":\"西班牙\",\"v\":\"西班牙\"},{\"n\":\"印度\",\"v\":\"印度\"},{\"n\":\"泰国\",\"v\":\"泰国\"},{\"n\":\"俄罗斯\",\"v\":\"俄罗斯\"},{\"n\":\"加拿大\",\"v\":\"加拿大\"},{\"n\":\"澳大利亚\",\"v\":\"澳大利亚\"},{\"n\":\"爱尔兰\",\"v\":\"爱尔兰\"},{\"n\":\"瑞典\",\"v\":\"瑞典\"},{\"n\":\"巴西\",\"v\":\"巴西\"},{\"n\":\"丹麦\",\"v\":\"丹麦\"}]},{\"key\":\"sort\",\"name\":\"排序\",\"value\":[{\"n\":\"近期热度\",\"v\":\"T\"},{\"n\":\"首映时间\",\"v\":\"R\"},{\"n\":\"高分优先\",\"v\":\"S\"}]},{\"key\":\"年代\",\"name\":\"年代\",\"value\":[{\"n\":\"全部年代\",\"v\":\"\"},{\"n\":\"2026\",\"v\":\"2026\"},{\"n\":\"2025\",\"v\":\"2025\"},{\"n\":\"2024\",\"v\":\"2024\"},{\"n\":\"2023\",\"v\":\"2023\"},{\"n\":\"2022\",\"v\":\"2022\"},{\"n\":\"2021\",\"v\":\"2021\"},{\"n\":\"2020\",\"v\":\"2020\"},{\"n\":\"2019\",\"v\":\"2019\"},{\"n\":\"2010年代\",\"v\":\"2010年代\"},{\"n\":\"2000年代\",\"v\":\"2000年代\"},{\"n\":\"90年代\",\"v\":\"90年代\"},{\"n\":\"80年代\",\"v\":\"80年代\"},{\"n\":\"70年代\",\"v\":\"70年代\"},{\"n\":\"60年代\",\"v\":\"60年代\"},{\"n\":\"更早\",\"v\":\"更早\"}]}],\"tv\":[{\"key\":\"类型\",\"name\":\"类型\",\"value\":[{\"n\":\"不限\",\"v\":\"\"},{\"n\":\"电视剧\",\"v\":\"电视剧\"},{\"n\":\"综艺\",\"v\":\"综艺\"}]},{\"key\":\"电视剧形式\",\"name\":\"电视剧形式\",\"value\":[{\"n\":\"不限\",\"v\":\"\"},{\"n\":\"喜剧\",\"v\":\"喜剧\"},{\"n\":\"爱情\",\"v\":\"爱情\"},{\"n\":\"悬疑\",\"v\":\"悬疑\"},{\"n\":\"动画\",\"v\":\"动画\"},{\"n\":\"武侠\",\"v\":\"武侠\"},{\"n\":\"古装\",\"v\":\"古装\"},{\"n\":\"家庭\",\"v\":\"家庭\"},{\"n\":\"犯罪\",\"v\":\"犯罪\"},{\"n\":\"科幻\",\"v\":\"科幻\"},{\"n\":\"恐怖\",\"v\":\"恐怖\"},{\"n\":\"历史\",\"v\":\"历史\"},{\"n\":\"战争\",\"v\":\"战争\"},{\"n\":\"动作\",\"v\":\"动作\"},{\"n\":\"冒险\",\"v\":\"冒险\"},{\"n\":\"传记\",\"v\":\"传记\"},{\"n\":\"剧情\",\"v\":\"剧情\"},{\"n\":\"奇幻\",\"v\":\"奇幻\"},{\"n\":\"惊悚\",\"v\":\"惊悚\"},{\"n\":\"灾难\",\"v\":\"灾难\"},{\"n\":\"歌舞\",\"v\":\"歌舞\"},{\"n\":\"音乐\",\"v\":\"音乐\"}]},{\"key\":\"综艺形式\",\"name\":\"综艺形式\",\"value\":[{\"n\":\"不限\",\"v\":\"\"},{\"n\":\"真人秀\",\"v\":\"真人秀\"},{\"n\":\"脱口秀\",\"v\":\"脱口秀\"},{\"n\":\"音乐\",\"v\":\"音乐\"},{\"n\":\"歌舞\",\"v\":\"歌舞\"}]},{\"key\":\"地区\",\"name\":\"地区\",\"value\":[{\"n\":\"全部地区\",\"v\":\"\"},{\"n\":\"华语\",\"v\":\"华语\"},{\"n\":\"欧美\",\"v\":\"欧美\"},{\"n\":\"中国\",\"v\":\"中国\"},{\"n\":\"美国\",\"v\":\"美国\"},{\"n\":\"中国香港\",\"v\":\"中国香港\"},{\"n\":\"韩国\",\"v\":\"韩国\"},{\"n\":\"日本\",\"v\":\"日本\"},{\"n\":\"英国\",\"v\":\"英国\"},{\"n\":\"泰国\",\"v\":\"泰国\"},{\"n\":\"中国台湾\",\"v\":\"中国台湾\"},{\"n\":\"意大利\",\"v\":\"意大利\"},{\"n\":\"法国\",\"v\":\"法国\"},{\"n\":\"德国\",\"v\":\"德国\"},{\"n\":\"西班牙\",\"v\":\"西班牙\"},{\"n\":\"俄罗斯\",\"v\":\"俄罗斯\"},{\"n\":\"瑞典\",\"v\":\"瑞典\"},{\"n\":\"巴西\",\"v\":\"巴西\"},{\"n\":\"丹麦\",\"v\":\"丹麦\"},{\"n\":\"印度\",\"v\":\"印度\"},{\"n\":\"加拿大\",\"v\":\"加拿大\"},{\"n\":\"爱尔兰\",\"v\":\"爱尔兰\"},{\"n\":\"澳大利亚\",\"v\":\"澳大利亚\"}]},{\"key\":\"sort\",\"name\":\"排序\",\"value\":[{\"n\":\"近期热度\",\"v\":\"T\"},{\"n\":\"首播时间\",\"v\":\"R\"},{\"n\":\"高分优先\",\"v\":\"S\"}]},{\"key\":\"年代\",\"name\":\"年代\",\"value\":[{\"n\":\"全部\",\"v\":\"\"},{\"n\":\"2026\",\"v\":\"2026\"},{\"n\":\"2025\",\"v\":\"2025\"},{\"n\":\"2024\",\"v\":\"2024\"},{\"n\":\"2023\",\"v\":\"2023\"},{\"n\":\"2022\",\"v\":\"2022\"},{\"n\":\"2021\",\"v\":\"2021\"},{\"n\":\"2020\",\"v\":\"2020\"},{\"n\":\"2019\",\"v\":\"2019\"},{\"n\":\"2010年代\",\"v\":\"2010年代\"},{\"n\":\"2000年代\",\"v\":\"2000年代\"},{\"n\":\"90年代\",\"v\":\"90年代\"},{\"n\":\"80年代\",\"v\":\"80年代\"},{\"n\":\"70年代\",\"v\":\"70年代\"},{\"n\":\"60年代\",\"v\":\"60年代\"},{\"n\":\"更早\",\"v\":\"更早\"}]},{\"key\":\"平台\",\"name\":\"平台\",\"value\":[{\"n\":\"全部\",\"v\":\"\"},{\"n\":\"腾讯视频\",\"v\":\"腾讯视频\"},{\"n\":\"爱奇艺\",\"v\":\"爱奇艺\"},{\"n\":\"优酷\",\"v\":\"优酷\"},{\"n\":\"湖南卫视\",\"v\":\"湖南卫视\"},{\"n\":\"Netflix\",\"v\":\"Netflix\"},{\"n\":\"HBO\",\"v\":\"HBO\"},{\"n\":\"BBC\",\"v\":\"BBC\"},{\"n\":\"NHK\",\"v\":\"NHK\"},{\"n\":\"CBS\",\"v\":\"CBS\"},{\"n\":\"NBC\",\"v\":\"NBC\"},{\"n\":\"tvN\",\"v\":\"tvN\"}]}],\"rank_list_movie\":[{\"key\":\"榜单\",\"name\":\"榜单\",\"value\":[{\"n\":\"实时热门电影\",\"v\":\"movie_real_time_hotest\"},{\"n\":\"一周口碑电影榜\",\"v\":\"movie_weekly_best\"},{\"n\":\"豆瓣电影Top250\",\"v\":\"movie_top250\"}]}],\"rank_list_tv\":[{\"key\":\"榜单\",\"name\":\"榜单\",\"value\":[{\"n\":\"实时热门电视\",\"v\":\"tv_real_time_hotest\"},{\"n\":\"华语口碑剧集榜\",\"v\":\"tv_chinese_best_weekly\"},{\"n\":\"全球口碑剧集榜\",\"v\":\"tv_global_best_weekly\"},{\"n\":\"国内口碑综艺榜\",\"v\":\"show_chinese_best_weekly\"},{\"n\":\"国外口碑综艺榜\",\"v\":\"show_global_best_weekly\"}]}]}"));
    }

    public void init(android.content.Context context, java.lang.String str) {
    }
}
