package com.github.catvod.spider;

/* renamed from: com.github.catvod.spider.4KZhinan, reason: invalid class name */
/* loaded from: classes.dex */
public class C4KZhinan extends com.github.catvod.spider.Pan {
    public final java.lang.String a = "https://4kzn.com";

    public static java.util.List<java.lang.String> extractQuarkLinks(java.lang.String str) {
        java.util.ArrayList arrayList = new java.util.ArrayList();
        if (str != null && !str.isEmpty()) {
            java.util.regex.Matcher matcher = java.util.regex.Pattern.compile("href\\s*=\\s*\"(https://pan\\.quark\\.cn\\/s\\/[a-fA-F0-9]+)\"").matcher(str);
            while (matcher.find()) {
                arrayList.add(com.github.catvod.spider.merge.a.C0731a.filterCloudDiskLinks(matcher.group(1)));
            }
        }
        return arrayList;
    }

    public final java.lang.String b(java.lang.String str, java.lang.String str2) {
        java.lang.StringBuilder sb = new java.lang.StringBuilder();
        sb.append(this.a);
        sb.append("/page/" + str2 + "?post_type=book&s=" + java.net.URLEncoder.encode(str));
        java.lang.String sb2 = sb.toString();
        java.util.HashMap hashMap = new java.util.HashMap();
        hashMap.put("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36");
        com.github.catvod.spider.merge.I.c n0 = com.github.catvod.spider.merge.H.g.d(com.github.catvod.spider.merge.k.C0779b.l(sb2, hashMap)).n0(".posts-item.book-item.d-flex.style-book-v");
        java.util.ArrayList arrayList = new java.util.ArrayList();
        java.util.Iterator<com.github.catvod.spider.merge.G.i> it = n0.iterator();
        while (it.hasNext()) {
            com.github.catvod.spider.merge.G.i next = it.next();
            com.github.catvod.spider.merge.b.C0750k.b(next.n0("div.item-header > div > a").a("href"), next.n0("div.item-body.flex-fill > h3 > a").c(), next.n0("div.item-header > div > a > img").a("data-src"), next.n0("div.item-body.flex-fill > div").c(), arrayList);
        }
        return com.github.catvod.spider.merge.c.C0756c.i(arrayList);
    }

    public java.lang.String categoryContent(java.lang.String str, java.lang.String str2, boolean z, java.util.HashMap<java.lang.String, java.lang.String> hashMap) {
        if (hashMap.get("cateId") != null) {
            str = hashMap.get("cateId");
        }
        java.lang.StringBuilder sb = new java.lang.StringBuilder();
        sb.append(this.a);
        sb.append(str + "/page/" + str2);
        java.lang.String sb2 = sb.toString();
        java.util.HashMap hashMap2 = new java.util.HashMap();
        hashMap2.put("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36");
        com.github.catvod.spider.merge.G.f d = com.github.catvod.spider.merge.H.g.d(com.github.catvod.spider.merge.k.C0779b.l(sb2, hashMap2));
        int parseInt = java.lang.Integer.parseInt(str2);
        int ceil = (int) java.lang.Math.ceil(Integer.MAX_VALUE / 50);
        com.github.catvod.spider.merge.c.C0756c c0756c = new com.github.catvod.spider.merge.c.C0756c();
        java.util.ArrayList arrayList = new java.util.ArrayList();
        java.util.Iterator<com.github.catvod.spider.merge.G.i> it = d.n0(".posts-item.book-item.d-flex.style-book-v").iterator();
        while (it.hasNext()) {
            com.github.catvod.spider.merge.G.i next = it.next();
            com.github.catvod.spider.merge.b.C0750k.b(next.n0("div.item-header > div > a").a("href"), next.n0("div.item-body.flex-fill > h3 > a").c(), next.n0("div.item-header > div > a > img").a("data-src"), next.n0("div.item-body.flex-fill > div").c(), arrayList);
        }
        c0756c.z(arrayList);
        c0756c.m1203i(parseInt, ceil, 50, Integer.MAX_VALUE);
        return c0756c.toString();
    }

    @Override // com.github.catvod.spider.Pan
    public java.lang.String detailContent(java.util.List<java.lang.String> list) {
        int i;
        java.lang.String str = list.get(0);
        java.util.HashMap hashMap = new java.util.HashMap();
        hashMap.put("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36");
        com.github.catvod.spider.merge.G.f d = com.github.catvod.spider.merge.H.g.d(com.github.catvod.spider.merge.k.C0779b.l(str, hashMap));
        com.github.catvod.spider.merge.c.C0758e b = com.github.catvod.spider.merge.A.a.b(str);
        b.k(d.n0("div.d-flex.flex-wrap.mb-4 > div.site-name-box.flex-fill.mb-3 > h1").c());
        b.l(d.n0("div.book-cover.text-center.mr-0.mr-md-3.mt-4.mt-md-0 > img").a("data-src"));
        java.lang.String c = d.n0("div.panel.site-content.card > div > div > p").c();
        int indexOf = c.indexOf("导演:");
        if (indexOf != -1) {
            int i2 = indexOf + 6;
            int indexOf2 = c.indexOf("编剧:");
            if (indexOf2 != -1) {
                b.i(c.substring(i2, indexOf2).trim());
            }
        }
        int indexOf3 = c.indexOf("主演:");
        if (indexOf3 != -1) {
            int i3 = indexOf3 + 6;
            int indexOf4 = c.indexOf("类型:");
            if (indexOf4 != -1) {
                b.f(c.substring(i3, indexOf4).trim().replace(" / ", ","));
            }
        }
        int indexOf5 = c.indexOf("制片国家/地区:");
        if (indexOf5 != -1) {
            int i4 = indexOf5 + 9;
            int indexOf6 = c.indexOf("语言:");
            if (indexOf6 != -1) {
                b.g(c.substring(i4, indexOf6).trim());
            }
        }
        int indexOf7 = c.indexOf("IMDb: ");
        b.h((indexOf7 == -1 || (i = indexOf7 + 16) >= c.length()) ? c : c.substring(i).trim());
        java.util.List<java.lang.String> extractQuarkLinks = extractQuarkLinks(d.n0("div.book-info.flex-fill > div.site-body.text-sm > div.mt-n2 > div.site-go.mt-3").toString());
        b.m(detailContentVodPlayFrom(extractQuarkLinks));
        b.n(detailContentVodPlayUrl(extractQuarkLinks));
        return com.github.catvod.spider.merge.a.C0731a.processVodData(com.github.catvod.spider.merge.c.C0756c.m(b));
    }

    public java.lang.String homeContent(boolean z) {
        java.util.ArrayList arrayList = new java.util.ArrayList();
        java.util.List asList = java.util.Arrays.asList("/books/zuixin", "/books/top250", "/books/juji", "/books/dianying");
        java.util.List asList2 = java.util.Arrays.asList("最新", "top250", "剧集", "电影");
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

    public java.lang.String searchContent(java.lang.String str, boolean z) {
        return b(str, "1");
    }

    public java.lang.String searchContent(java.lang.String str, boolean z, java.lang.String str2) {
        return b(str, str2);
    }
}
