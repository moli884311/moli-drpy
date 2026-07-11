package com.github.catvod.spider;

/* loaded from: classes.dex */
public class Jike extends com.github.catvod.spider.Pan {
    public static java.lang.String E(java.lang.String str) {
        java.lang.String str2 = "https://api.uuuka.com/api/search?keyword=" + java.net.URLEncoder.encode(str) + "&page=1&limit=20";
        java.util.HashMap hashMap = new java.util.HashMap();
        hashMap.put("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36");
        org.json.JSONObject jSONObject = new org.json.JSONObject(com.github.catvod.spider.merge.k.C0779b.l(str2, hashMap));
        if (!jSONObject.getBoolean("success")) {
            return "[]";
        }
        org.json.JSONArray jSONArray = jSONObject.getJSONObject("data").getJSONArray("items");
        java.util.ArrayList arrayList = new java.util.ArrayList();
        for (int i = 0; i < jSONArray.length(); i++) {
            org.json.JSONObject jSONObject2 = jSONArray.getJSONObject(i);
            com.github.catvod.spider.merge.c.C0758e c0758e = new com.github.catvod.spider.merge.c.C0758e();
            java.lang.String string = jSONObject2.getString("source_link");
            c0758e.j(string);
            java.lang.String string2 = jSONObject2.getString("title");
            java.lang.String str3 = "";
            if (string.contains("pan.quark.cn")) {
                str3 = "https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/LX2y/1200X800/quark.jpg/webp";
            } else if (string.contains("drive.uc.cn")) {
                str3 = "https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/kbEn/1200X800/uc.jpg/webp";
            } else if (string.contains("pan.baidu.com")) {
                str3 = "https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/dyXZ/1200X800/baidu.jpg/webp";
            } else if (string.contains("www.123")) {
                str3 = "https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/N1l5/1200X800/123.jpg/webp";
            } else if (string.contains("cloud.189.cn")) {
                str3 = "https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/n1b9/1200X800/189.jpg/webp";
            } else if (string.contains("aliyundrive.com") && string.contains("alipan.com")) {
                str3 = "https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/8Yr6/1200X800/aliyun.jpg/webp";
            }
            int indexOf = string2.indexOf("《");
            int indexOf2 = string2.indexOf("》");
            if (indexOf == -1) {
                c0758e.k(string2);
            } else if (indexOf2 == -1 || indexOf >= indexOf2) {
                int length = string2.length();
                int i2 = indexOf + 1;
                if (i2 < length) {
                    c0758e.k(string2.substring(i2, length));
                } else {
                    c0758e.k(string2);
                }
            } else {
                c0758e.k(string2.substring(indexOf + 1, indexOf2));
            }
            c0758e.o(jSONObject2.getString("update_time"));
            if (android.text.TextUtils.isEmpty(str3)) {
                c0758e.l("https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/LX2y/1200X800/quark.jpg/webp");
            } else {
                c0758e.l(str3);
            }
            arrayList.add(c0758e);
        }
        return com.github.catvod.spider.merge.c.C0756c.n(arrayList);
    }

    public java.lang.String categoryContent(java.lang.String str, java.lang.String str2, boolean z, java.util.HashMap<java.lang.String, java.lang.String> hashMap) {
        org.json.JSONObject jSONObject = new org.json.JSONObject();
        org.json.JSONArray jSONArray = new org.json.JSONArray();
        java.util.HashMap hashMap2 = new java.util.HashMap();
        hashMap2.put("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36");
        org.json.JSONObject jSONObject2 = new org.json.JSONObject(com.github.catvod.spider.merge.k.C0779b.l("https://api.uuuka.com/api/contents/" + str + "?page=" + str2 + "&limit=20", hashMap2));
        if (!jSONObject2.getBoolean("success")) {
            jSONObject.put("list", jSONArray);
            jSONObject.put("page", 1);
            jSONObject.put("pagecount", 1);
            jSONObject.put("limit", 20);
            jSONObject.put("total", 0);
            return jSONObject.toString();
        }
        org.json.JSONObject jSONObject3 = jSONObject2.getJSONObject("data");
        org.json.JSONArray jSONArray2 = jSONObject3.getJSONArray("items");
        int i = jSONObject3.getInt("total");
        int i2 = jSONObject3.getInt("page");
        int i3 = jSONObject3.getInt("total_pages");
        for (int i4 = 0; i4 < jSONArray2.length(); i4++) {
            org.json.JSONObject jSONObject4 = jSONArray2.getJSONObject(i4);
            java.lang.String string = jSONObject4.getString("source_link");
            java.lang.String string2 = jSONObject4.getString("title");
            java.lang.String string3 = jSONObject4.getString("update_time");
            java.lang.String str3 = "";
            if (string.contains("pan.quark.cn")) {
                str3 = "https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/LX2y/1200X800/quark.jpg/webp";
            } else if (string.contains("drive.uc.cn")) {
                str3 = "https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/kbEn/1200X800/uc.jpg/webp";
            } else if (string.contains("pan.baidu.com")) {
                str3 = "https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/dyXZ/1200X800/baidu.jpg/webp";
            } else if (string.contains("www.123")) {
                str3 = "https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/N1l5/1200X800/123.jpg/webp";
            } else if (string.contains("cloud.189.cn")) {
                str3 = "https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/n1b9/1200X800/189.jpg/webp";
            } else if (string.contains("aliyundrive.com")) {
                str3 = "https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/8Yr6/1200X800/aliyun.jpg/webp";
            } else if (string.contains("alipan.com")) {
                str3 = "https://pic7.fukit.cn/autoupload/gE6Y0Af2tjXBCNig6CtNDI12_FRYNb81z6UPhMWD8iI/20260503/8Yr6/1200X800/aliyun.jpg/webp";
            }
            int indexOf = string2.indexOf("《");
            if (indexOf != -1) {
                int indexOf2 = string2.indexOf("》", indexOf);
                if (indexOf2 == -1 || indexOf2 <= indexOf) {
                    int length = string2.length();
                    int i5 = indexOf + 1;
                    if (i5 < length) {
                        string2 = string2.substring(i5, length);
                    }
                } else {
                    string2 = string2.substring(indexOf + 1, indexOf2);
                }
            }
            org.json.JSONObject jSONObject5 = new org.json.JSONObject();
            jSONObject5.put("vod_id", string);
            jSONObject5.put("vod_name", string2);
            jSONObject5.put("vod_pic", str3);
            jSONObject5.put("vod_remarks", string3);
            jSONArray.put(jSONObject5);
        }
        jSONObject.put("list", jSONArray);
        jSONObject.put("page", i2);
        jSONObject.put("pagecount", i3);
        jSONObject.put("limit", 20);
        jSONObject.put("total", i);
        return jSONObject.toString();
    }

    public java.lang.String homeContent(boolean z) {
        org.json.JSONArray jSONArray = new org.json.JSONArray();
        java.util.List asList = java.util.Arrays.asList("movie", "tv", "dongman", "post");
        java.util.List asList2 = java.util.Arrays.asList("电影", "电视剧", "动漫", "短剧");
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
        com.github.catvod.spider.merge.m.C0807l.a("searchvodname", str);
        return E(str);
    }

    public java.lang.String searchContent(java.lang.String str, boolean z, java.lang.String str2) {
        return E(str);
    }
}
