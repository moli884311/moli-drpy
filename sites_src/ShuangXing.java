package com.github.catvod.spider;

/* loaded from: classes.dex */
public class ShuangXing extends com.github.catvod.spider.Pan {
    private java.lang.String e = "";

    private java.util.Map<java.lang.String, java.lang.String> l() {
        java.util.HashMap c = com.github.catvod.spider.merge.b.C0747h.c("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0", "Referer", "https://1.star2.cn");
        c.put("Cookie", this.e);
        return c;
    }

    public java.lang.String categoryContent(java.lang.String str, java.lang.String str2, boolean z, java.util.HashMap<java.lang.String, java.lang.String> hashMap) {
        int i;
        int indexOf;
        int i2;
        int indexOf2;
        int indexOf3;
        int indexOf4;
        int i3;
        int indexOf5;
        org.json.JSONObject jSONObject = new org.json.JSONObject();
        org.json.JSONArray jSONArray = new org.json.JSONArray();
        java.lang.String l = com.github.catvod.spider.merge.k.C0779b.l("https://1.star2.cn/" + str + "_" + str2, l());
        if (android.text.TextUtils.isEmpty(l)) {
            jSONObject.put("list", jSONArray);
            jSONObject.put("page", 1);
            jSONObject.put("pagecount", 1);
            jSONObject.put("limit", 20);
            jSONObject.put("total", 0);
            return jSONObject.toString();
        }
        int indexOf6 = l.indexOf("<ul class=\"erx-list\">");
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
        java.lang.String[] split = l.substring(indexOf6, indexOf7).split("<li class=\"item\">");
        if (split.length <= 1) {
            jSONObject.put("list", jSONArray);
            jSONObject.put("page", 1);
            jSONObject.put("pagecount", 1);
            jSONObject.put("limit", 20);
            jSONObject.put("total", 0);
            return jSONObject.toString();
        }
        for (int i4 = 1; i4 < split.length; i4++) {
            java.lang.String str3 = split[i4];
            int indexOf8 = str3.indexOf("<a href=\"");
            if (indexOf8 != -1 && (indexOf = str3.indexOf("\"", (i = indexOf8 + 9))) != -1) {
                java.lang.String substring = str3.substring(i, indexOf);
                int indexOf9 = str3.indexOf(">", indexOf);
                if (indexOf9 != -1 && (indexOf2 = str3.indexOf("</a>", (i2 = indexOf9 + 1))) != -1) {
                    java.lang.StringBuilder sb = new java.lang.StringBuilder(str3.substring(i2, indexOf2));
                    while (true) {
                        indexOf3 = sb.indexOf("【");
                        if (indexOf3 < 0) {
                            break;
                        }
                        int indexOf10 = sb.indexOf("】", indexOf3);
                        if (indexOf10 > indexOf3) {
                            sb.delete(indexOf3, indexOf10 + 1);
                        } else {
                            sb.delete(indexOf3, sb.length());
                        }
                    }
                    java.lang.String sb2 = sb.toString();
                    int indexOf11 = str3.indexOf("<span class=\"erx-num-font time\">");
                    if (indexOf11 != indexOf3 && (indexOf4 = str3.indexOf(">", indexOf11 + 31)) != -1 && (indexOf5 = str3.indexOf("</span>", (i3 = indexOf4 + 1))) > 0) {
                        str3.substring(i3, indexOf5);
                    }
                    if (!android.text.TextUtils.isEmpty(sb2) && !android.text.TextUtils.isEmpty(sb)) {
                        org.json.JSONObject jSONObject2 = new org.json.JSONObject();
                        jSONObject2.put("vod_id", substring);
                        jSONObject2.put("vod_name", sb2);
                        jSONObject2.put("vod_pic", "");
                        jSONObject2.put("vod_remarks", "");
                        jSONArray.put(jSONObject2);
                    }
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
        int i;
        int indexOf;
        int indexOf2;
        int indexOf3;
        org.json.JSONObject jSONObject = new org.json.JSONObject();
        java.lang.String l = com.github.catvod.spider.merge.k.C0779b.l("https://1.star2.cn" + list.get(0), l());
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
        int indexOf4 = l.indexOf("<h1");
        if (indexOf4 != -1 && (indexOf2 = l.indexOf("</h1>", indexOf4)) != -1 && (indexOf3 = l.indexOf(">", indexOf4)) != -1 && indexOf3 < indexOf2) {
            jSONObject2.put("vod_name", l.substring(indexOf3 + 1, indexOf2));
        }
        java.util.ArrayList arrayList = new java.util.ArrayList();
        int indexOf5 = l.indexOf("dlipp-dl-btn");
        while (indexOf5 != -1) {
            int indexOf6 = l.indexOf("href=\"", indexOf5);
            if (indexOf6 == -1 || (indexOf = l.indexOf("\"", (i = indexOf6 + 6))) == -1) {
                break;
            }
            arrayList.add(com.github.catvod.spider.merge.a.C0731a.filterCloudDiskLinks(l.substring(i, indexOf)));
            indexOf5 = l.indexOf("dlipp-dl-btn", indexOf + 1);
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
        java.util.List asList = java.util.Arrays.asList("dj", "ju", "zy", "mv", "rh", "ym", "wj", "dm");
        java.util.List asList2 = java.util.Arrays.asList("短剧", "国剧", "综艺", "电影", "韩日", "英美", "外剧", "动漫");
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
        this.e = com.github.catvod.spider.merge.A.a.a("https://1.star2.cn", l());
    }

    public java.lang.String searchContent(java.lang.String str, boolean z) {
        int indexOf;
        int indexOf2;
        int i;
        int indexOf3;
        int i2;
        int indexOf4;
        java.lang.String substring;
        try {
            org.json.JSONArray jSONArray = new org.json.JSONArray();
            java.lang.String l = com.github.catvod.spider.merge.k.C0779b.l("https://1.star2.cn/search/?keyword=" + java.net.URLEncoder.encode(str, "UTF-8"), l());
            if (android.text.TextUtils.isEmpty(l) || (indexOf = l.indexOf("<ul class=\"erx-list\">")) == -1 || (indexOf2 = l.indexOf("</ul>", indexOf)) == -1) {
                return "{\"list\":[]}";
            }
            java.lang.String[] split = l.substring(indexOf, indexOf2).split("<li class=\"item\">");
            if (split.length <= 1) {
                return "{\"list\":[]}";
            }
            for (int i3 = 1; i3 < split.length; i3++) {
                java.lang.String str2 = split[i3];
                int indexOf5 = str2.indexOf("<a href=\"");
                if (indexOf5 != -1 && (indexOf3 = str2.indexOf("\"", (i = indexOf5 + 9))) != -1) {
                    java.lang.String substring2 = str2.substring(i, indexOf3);
                    int indexOf6 = str2.indexOf(">", indexOf3);
                    if (indexOf6 != -1 && (indexOf4 = str2.indexOf("</a>", (i2 = indexOf6 + 1))) != -1) {
                        java.lang.StringBuilder sb = new java.lang.StringBuilder(str2.substring(i2, indexOf4));
                        while (true) {
                            int indexOf7 = sb.indexOf("【");
                            if (indexOf7 < 0) {
                                break;
                            }
                            int indexOf8 = sb.indexOf("】", indexOf7);
                            if (indexOf8 > indexOf7) {
                                sb.delete(indexOf7, indexOf8 + 1);
                            } else {
                                sb.delete(indexOf7, sb.length());
                            }
                        }
                        java.lang.String sb2 = sb.toString();
                        int indexOf9 = str2.indexOf("<span class=\"erx-num-font time\">");
                        if (indexOf9 == -1) {
                            substring = "";
                        } else {
                            int indexOf10 = str2.indexOf(">", indexOf9 + 31);
                            if (indexOf10 == -1) {
                                substring = "";
                            } else {
                                int i4 = indexOf10 + 1;
                                int indexOf11 = str2.indexOf("</span>", i4);
                                substring = indexOf11 == -1 ? "" : str2.substring(i4, indexOf11);
                            }
                        }
                        if (!android.text.TextUtils.isEmpty(sb2) && !android.text.TextUtils.isEmpty(substring2)) {
                            org.json.JSONObject jSONObject = new org.json.JSONObject();
                            jSONObject.put("vod_id", substring2);
                            jSONObject.put("vod_name", sb2);
                            jSONObject.put("vod_pic", "");
                            jSONObject.put("vod_remarks", substring);
                            jSONArray.put(jSONObject);
                        }
                    }
                }
            }
            org.json.JSONObject jSONObject2 = new org.json.JSONObject();
            jSONObject2.put("list", jSONArray);
            return jSONObject2.toString();
        } catch (java.lang.Exception e) {
            return "{\"list\":[]}";
        }
    }
}
