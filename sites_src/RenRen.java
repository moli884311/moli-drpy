package com.github.catvod.spider;

/* loaded from: classes.dex */
public class RenRen extends com.github.catvod.spider.Pan {
    public java.lang.String categoryContent(java.lang.String str, java.lang.String str2, boolean z, java.util.HashMap<java.lang.String, java.lang.String> hashMap) {
        int i;
        int indexOf;
        java.lang.String substring;
        java.lang.String substring2;
        int indexOf2;
        int indexOf3;
        int indexOf4;
        int indexOf5;
        java.lang.String substring3;
        org.json.JSONObject jSONObject = new org.json.JSONObject();
        org.json.JSONArray jSONArray = new org.json.JSONArray();
        java.lang.StringBuilder sb = new java.lang.StringBuilder();
        sb.append("https://www.rrdynb.com/");
        sb.append(str);
        if (!str.endsWith("/")) {
            sb.append("/");
        }
        if (!str2.equals("1")) {
            java.lang.String sb2 = sb.toString();
            if (sb2.endsWith("/")) {
                sb2 = sb2.substring(0, sb2.length() - 1);
            }
            sb = new java.lang.StringBuilder();
            sb.append(sb2);
            if (str.contains("movie")) {
                sb.append("/list_2_");
                sb.append(str2);
                sb.append(".html");
            } else if (str.contains("dianshiju")) {
                sb.append("/list_6_");
                sb.append(str2);
                sb.append(".html");
            } else if (str.contains("zongyi")) {
                sb.append("/list_10_");
                sb.append(str2);
                sb.append(".html");
            } else if (str.contains("dongman")) {
                sb.append("/list_13_");
                sb.append(str2);
                sb.append(".html");
            }
        }
        java.lang.String sb3 = sb.toString();
        java.util.HashMap hashMap2 = new java.util.HashMap();
        hashMap2.put("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36");
        java.lang.String l = com.github.catvod.spider.merge.k.C0779b.l(sb3, hashMap2);
        if (android.text.TextUtils.isEmpty(l)) {
            jSONObject.put("list", jSONArray);
            jSONObject.put("page", 1);
            jSONObject.put("pagecount", 1);
            jSONObject.put("limit", 20);
            jSONObject.put("total", 0);
            return jSONObject.toString();
        }
        int indexOf6 = l.indexOf("<ul id=\"movielist\"");
        if (indexOf6 == -1) {
            jSONObject.put("list", jSONArray);
            jSONObject.put("page", 1);
            jSONObject.put("pagecount", 1);
            jSONObject.put("limit", 20);
            jSONObject.put("total", 0);
            return jSONObject.toString();
        }
        int indexOf7 = l.indexOf("</ul>", indexOf6);
        if (indexOf7 == -1) {
            jSONObject.put("list", jSONArray);
            jSONObject.put("page", 1);
            jSONObject.put("pagecount", 1);
            jSONObject.put("limit", 20);
            jSONObject.put("total", 0);
            return jSONObject.toString();
        }
        java.lang.String[] split = l.substring(indexOf6, indexOf7).split("<li class=\"pure-g shadow\"");
        if (split.length <= 1) {
            jSONObject.put("list", jSONArray);
            jSONObject.put("page", 1);
            jSONObject.put("pagecount", 1);
            jSONObject.put("limit", 20);
            jSONObject.put("total", 0);
            return jSONObject.toString();
        }
        for (int i2 = 1; i2 < split.length; i2++) {
            java.lang.String str3 = split[i2];
            int indexOf8 = str3.indexOf("href=\"");
            if (indexOf8 != -1 && (indexOf = str3.indexOf("\"", (i = indexOf8 + 6))) != -1) {
                java.lang.String substring4 = str3.substring(i, indexOf);
                int indexOf9 = str3.indexOf("data-original=\"");
                if (indexOf9 == -1) {
                    substring = "";
                } else {
                    int i3 = indexOf9 + 15;
                    int indexOf10 = str3.indexOf("\"", i3);
                    substring = indexOf10 == -1 ? "" : str3.substring(i3, indexOf10);
                }
                int indexOf11 = str3.indexOf("title=\"");
                if (indexOf11 == -1) {
                    substring2 = "";
                } else {
                    int i4 = indexOf11 + 7;
                    int indexOf12 = str3.indexOf("\"", i4);
                    substring2 = indexOf12 == -1 ? "" : str3.substring(i4, indexOf12);
                }
                if (android.text.TextUtils.isEmpty(substring2) && (indexOf3 = str3.indexOf("<h2")) != -1 && (indexOf4 = str3.indexOf(">", indexOf3)) != -1 && (indexOf5 = str3.indexOf("</a>", indexOf4)) != -1 && (substring3 = str3.substring(indexOf4 + 1, indexOf5)) != null) {
                    substring2 = substring3.replace("<i>", "").replace("</i>", "").trim();
                }
                if (android.text.TextUtils.isEmpty(substring2)) {
                    substring2 = "";
                } else {
                    java.lang.String str4 = substring2;
                    int indexOf13 = str4.indexOf("《");
                    if (indexOf13 != -1 && (indexOf2 = str4.indexOf("》", indexOf13)) != -1) {
                        substring2 = str4.substring(indexOf13 + 1, indexOf2);
                    }
                }
                if (!android.text.TextUtils.isEmpty(substring2) && !android.text.TextUtils.isEmpty(substring4)) {
                    org.json.JSONObject jSONObject2 = new org.json.JSONObject();
                    jSONObject2.put("vod_id", substring4);
                    jSONObject2.put("vod_name", substring2);
                    jSONObject2.put("vod_pic", substring);
                    jSONObject2.put("vod_remarks", "");
                    jSONArray.put(jSONObject2);
                }
            }
        }
        jSONObject.put("list", jSONArray);
        jSONObject.put("page", java.lang.Integer.parseInt(str2));
        jSONObject.put("pagecount", 100);
        jSONObject.put("limit", 20);
        jSONObject.put("total", 20);
        return jSONObject.toString();
    }

    @Override // com.github.catvod.spider.Pan
    public java.lang.String detailContent(java.util.List<java.lang.String> list) {
        java.lang.String substring;
        java.lang.String str;
        int indexOf;
        int indexOf2;
        int i;
        int indexOf3;
        int indexOf4;
        int indexOf5;
        int indexOf6;
        org.json.JSONObject jSONObject = new org.json.JSONObject();
        java.lang.String str2 = "https://www.rrdynb.com" + list.get(0);
        java.util.HashMap hashMap = new java.util.HashMap();
        hashMap.put("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36");
        java.lang.String l = com.github.catvod.spider.merge.k.C0779b.l(str2, hashMap);
        if (android.text.TextUtils.isEmpty(l)) {
            jSONObject.put("msg", "获取详情页失败");
            return jSONObject.toString();
        }
        org.json.JSONObject jSONObject2 = new org.json.JSONObject();
        jSONObject2.put("vod_id", "");
        jSONObject2.put("vod_name", "");
        jSONObject2.put("vod_pic", "");
        jSONObject2.put("vod_remarks", "");
        jSONObject2.put("vod_content", "");
        int indexOf7 = l.indexOf("movie-des shadow");
        if (indexOf7 == -1) {
            indexOf7 = l.indexOf("movie-des");
        }
        if (indexOf7 == -1) {
            jSONObject.put("msg", "无法定位电影信息区域");
            return jSONObject.toString();
        }
        int indexOf8 = l.indexOf("</div>", indexOf7);
        if (indexOf8 != -1) {
            int indexOf9 = l.indexOf("<!--网友评论", indexOf8 + 6);
            if (indexOf9 != -1) {
                indexOf8 = indexOf9 + 9;
            }
            substring = l.substring(indexOf7, indexOf8);
        } else {
            substring = l.substring(indexOf7);
        }
        int indexOf10 = substring.indexOf("<h1>");
        if (indexOf10 == -1 || (indexOf4 = substring.indexOf("</h1>", indexOf10)) == -1) {
            str = "";
        } else {
            java.lang.String replace = substring.substring(indexOf10 + 4, indexOf4).replace("&amp;", "&").replace("&quot;", "\"");
            str = (android.text.TextUtils.isEmpty(replace) || (indexOf5 = replace.indexOf("《")) == -1 || (indexOf6 = replace.indexOf("》", indexOf5)) == -1) ? replace : replace.substring(indexOf5 + 1, indexOf6).replaceAll("<.*?>", "").trim();
        }
        if (!android.text.TextUtils.isEmpty(str)) {
            jSONObject2.put("vod_name", str);
        }
        int indexOf11 = substring.indexOf("<div class=\"movie-txt\"");
        if (indexOf11 != -1 && (indexOf2 = substring.indexOf("src=\"", indexOf11)) != -1 && (indexOf3 = substring.indexOf("\"", (i = indexOf2 + 5))) != -1) {
            java.lang.String substring2 = substring.substring(i, indexOf3);
            if (substring2.startsWith("http") && (substring2.contains(".jpg") || substring2.contains(".png"))) {
                jSONObject2.put("vod_pic", substring2);
            }
        }
        int indexOf12 = substring.indexOf("剧情简介：");
        if (indexOf12 != -1 && (indexOf = substring.indexOf("资源：", indexOf12)) != -1) {
            jSONObject2.put("vod_content", substring.substring(indexOf12 + 5, indexOf).replaceAll("<[^>]+>", "").replace("&nbsp;", " ").trim());
        }
        java.util.ArrayList arrayList = new java.util.ArrayList();
        int indexOf13 = substring.indexOf("href=\"");
        while (indexOf13 != -1) {
            int i2 = indexOf13 + 6;
            int indexOf14 = substring.indexOf("\"", i2);
            if (indexOf14 == -1) {
                break;
            }
            java.lang.String substring3 = substring.substring(i2, indexOf14);
            if (substring3.contains("pan.baidu.com") || substring3.contains("pan.quark.cn") || substring3.contains("www.aliyundrive.com")) {
                int indexOf15 = substring3.indexOf("#");
                if (indexOf15 != -1) {
                    substring3 = substring3.substring(0, indexOf15);
                }
                arrayList.add(com.github.catvod.spider.merge.a.C0731a.filterCloudDiskLinks(substring3.replace("&amp;", "&").replace("?entry=nmmecc", "")));
            }
            indexOf13 = substring.indexOf("href=\"", indexOf14 + 1);
        }
        if (arrayList.size() > 0) {
            com.github.catvod.spider.PanOrder.sort(arrayList);
            jSONObject2.put("vod_play_from", detailContentVodPlayFrom(arrayList));
            jSONObject2.put("vod_play_url", detailContentVodPlayUrl(arrayList));
        }
        org.json.JSONArray jSONArray = new org.json.JSONArray();
        jSONArray.put(jSONObject2);
        jSONObject.put("list", jSONArray);
        return com.github.catvod.spider.merge.a.C0731a.processVodData(jSONObject.toString());
    }

    public java.lang.String homeContent(boolean z) {
        org.json.JSONArray jSONArray = new org.json.JSONArray();
        java.util.List asList = java.util.Arrays.asList("movie", "dianshiju", "zongyi", "dongman");
        java.util.List asList2 = java.util.Arrays.asList("电影", "电视剧", "老电影", "动漫");
        for (int i = 0; i < asList.size(); i++) {
            org.json.JSONObject jSONObject = new org.json.JSONObject();
            jSONObject.put("type_id", asList.get(i));
            jSONObject.put("type_name", asList2.get(i));
            jSONArray.put(jSONObject);
        }
        org.json.JSONObject jSONObject2 = new org.json.JSONObject();
        org.json.JSONObject jSONObject3 = new org.json.JSONObject();
        jSONObject3.put("class", jSONArray);
        jSONObject3.put("filters", jSONObject2);
        return jSONObject3.toString();
    }

    @Override // com.github.catvod.spider.Pan
    public void init(android.content.Context context, java.lang.String str) {
        try {
            super.init(context, str);
        } catch (java.lang.Exception e) {
            e.printStackTrace();
        }
    }

    public java.lang.String searchContent(java.lang.String str, boolean z) {
        int i;
        int indexOf;
        java.lang.String substring;
        int indexOf2;
        int indexOf3;
        int indexOf4;
        int indexOf5;
        int indexOf6;
        java.lang.String substring2;
        int i2;
        int indexOf7;
        org.json.JSONObject jSONObject = new org.json.JSONObject();
        org.json.JSONArray jSONArray = new org.json.JSONArray();
        if (android.text.TextUtils.isEmpty(str)) {
            jSONObject.put("list", jSONArray);
            jSONObject.put("page", 1);
            jSONObject.put("pagecount", 1);
            jSONObject.put("limit", 20);
            jSONObject.put("total", 0);
            return jSONObject.toString();
        }
        java.lang.String str2 = "https://www.rrdynb.com/plus/search.php?q=" + java.net.URLEncoder.encode(str);
        java.util.HashMap hashMap = new java.util.HashMap();
        hashMap.put("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36");
        java.lang.String l = com.github.catvod.spider.merge.k.C0779b.l(str2, hashMap);
        if (android.text.TextUtils.isEmpty(l)) {
            jSONObject.put("list", jSONArray);
            jSONObject.put("page", 1);
            jSONObject.put("pagecount", 1);
            jSONObject.put("limit", 20);
            jSONObject.put("total", 0);
            return jSONObject.toString();
        }
        int indexOf8 = l.indexOf("<ul id=\"movielist\"");
        if (indexOf8 == -1) {
            jSONObject.put("list", jSONArray);
            jSONObject.put("page", 1);
            jSONObject.put("pagecount", 1);
            jSONObject.put("limit", 20);
            jSONObject.put("total", 0);
            return jSONObject.toString();
        }
        int indexOf9 = l.indexOf("</ul>", indexOf8);
        if (indexOf9 == -1) {
            jSONObject.put("list", jSONArray);
            jSONObject.put("page", 1);
            jSONObject.put("pagecount", 1);
            jSONObject.put("limit", 20);
            jSONObject.put("total", 0);
            return jSONObject.toString();
        }
        java.lang.String[] split = l.substring(indexOf8, indexOf9).split("<li class=\"pure-g shadow\"");
        if (split.length <= 1) {
            jSONObject.put("list", jSONArray);
            jSONObject.put("page", 1);
            jSONObject.put("pagecount", 1);
            jSONObject.put("limit", 20);
            jSONObject.put("total", 0);
            return jSONObject.toString();
        }
        for (int i3 = 1; i3 < split.length; i3++) {
            java.lang.String str3 = split[i3];
            int indexOf10 = str3.indexOf("href=\"");
            if (indexOf10 != -1 && (indexOf = str3.indexOf("\"", (i = indexOf10 + 6))) != -1) {
                java.lang.String substring3 = str3.substring(i, indexOf);
                int indexOf11 = str3.indexOf("data-original=\"");
                java.lang.String str4 = "";
                if (indexOf11 == -1) {
                    substring = "";
                } else {
                    int i4 = indexOf11 + 15;
                    int indexOf12 = str3.indexOf("\"", i4);
                    substring = indexOf12 == -1 ? "" : str3.substring(i4, indexOf12);
                }
                int indexOf13 = str3.indexOf("title=\"");
                if (indexOf13 != -1 && (indexOf7 = str3.indexOf("\"", (i2 = indexOf13 + 7))) != -1) {
                    str4 = str3.substring(i2, indexOf7);
                }
                if (android.text.TextUtils.isEmpty(str4) && (indexOf4 = str3.indexOf("<h2")) != -1 && (indexOf5 = str3.indexOf(">", indexOf4)) != -1 && (indexOf6 = str3.indexOf("</a>", indexOf5)) != -1 && (substring2 = str3.substring(indexOf5 + 1, indexOf6)) != null) {
                    str4 = substring2.replace("<i>", "").replace("</i>", "").trim();
                }
                java.lang.String trim = (android.text.TextUtils.isEmpty(str4) || (indexOf2 = str4.indexOf("《")) == -1 || (indexOf3 = str4.indexOf("》", indexOf2)) == -1) ? str4 : str4.substring(indexOf2 + 1, indexOf3).replaceAll("<.*?>", "").trim();
                if (android.text.TextUtils.isEmpty(trim) && !android.text.TextUtils.isEmpty(str4)) {
                    trim = str4.replaceAll("<.*?>", "").trim();
                }
                if (!android.text.TextUtils.isEmpty(trim) && !android.text.TextUtils.isEmpty(substring3)) {
                    org.json.JSONObject jSONObject2 = new org.json.JSONObject();
                    jSONObject2.put("vod_id", substring3);
                    jSONObject2.put("vod_name", trim);
                    jSONObject2.put("vod_pic", substring);
                    jSONObject2.put("vod_remarks", "");
                    jSONArray.put(jSONObject2);
                }
            }
        }
        jSONObject.put("list", jSONArray);
        jSONObject.put("page", 1);
        jSONObject.put("pagecount", 1);
        jSONObject.put("limit", 20);
        jSONObject.put("total", 20);
        return jSONObject.toString();
    }
}
