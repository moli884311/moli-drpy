package com.github.catvod.spider;

/* loaded from: classes.dex */
public class PanWebShare extends com.github.catvod.spider.Pan {

    /* renamed from: short, reason: not valid java name */
    private static final short[] f11short = {1514, 1505, 1531, 1516, 1519, 1504, 2072, 2064, 2109, 2105, 2108, 2109, 2090, 2091, 2149, 2119, 2145, 2167, 2144, 2111, 2131, 2165, 2167, 2172, 2150, 2564, 2598, 2611, 2592, 2597, 2597, 2600, 2662, 2684, 2663, 2681, 2665, 2657, 2565, 2592, 2599, 2620, 2609, 2674, 2665, 2568, 2599, 2605, 2619, 2598, 2592, 2605, 2665, 2680, 2682, 2674, 2665, 2591, 2683, 2681, 2685, 2672, 2568, 2665, 2571, 2620, 2592, 2597, 2605, 2662, 2589, 2585, 2680, 2568, 2663, 2683, 2683, 2681, 2687, 2683, 2685, 2663, 2681, 2680, 2685, 2674, 2665, 2622, 2623, 2656, 2665, 2568, 2617, 2617, 2597, 2604, 2590, 2604, 2603, 2562, 2592, 2621, 2662, 2684, 2682, 2686, 2663, 2682, 2687, 2665, 2657, 2562, 2561, 2589, 2564, 2565, 2661, 2665, 2597, 2592, 2594, 2604, 2665, 2574, 2604, 2602, 2594, 2598, 2656, 2665, 2591, 2604, 2619, 2618, 2592, 2598, 2599, 2662, 2685, 2663, 2681, 2665, 2570, 2593, 2619, 2598, 2596, 2604, 2662, 2680, 2680, 2687, 2663, 2681, 2663, 2681, 2663, 2681, 2665, 2564, 2598, 2603, 2592, 2597, 2604, 2665, 2586, 2600, 2607, 2600, 2619, 2592, 2662, 2684, 2682, 2686, 2663, 2682, 2687, 956, 907, 904, 907, 924, 907, 924, 2864, 2860, 2860, 2856, 2859, 2914, 2935, 2935, 2863, 2863, 2863, 2934, 2876, 2871, 2861, 2874, 2873, 2870, 2934, 2875, 2871, 2869, 887, 849, 839, 848, 783, 867, 837, 839, 844, 854, 3188, 3158, 3139, 3152, 3157, 3157, 3160, 3094, 3084, 3095, 3081, 3097, 3089, 3182, 3152, 3159, 3165, 3158, 3150, 3146, 3097, 3191, 3181, 3097, 3080, 3081, 3095, 3081, 3074, 3097, 3182, 3152, 3159, 3087, 3085, 3074, 3097, 3137, 3087, 3085, 3088, 3097, 3192, 3145, 3145, 3157, 3164, 3182, 3164, 3163, 3186, 3152, 3149, 3094, 3084, 3082, 3086, 3095, 3082, 3087, 3097, 3089, 3186, 3185, 3181, 3188, 3189, 3093, 3097, 3157, 3152, 3154, 3164, 3097, 3198, 3164, 3162, 3154, 3158, 3088, 3097, 3194, 3153, 3147, 3158, 3156, 3164, 3094, 3080, 3080, 3086, 3095, 3081, 3095, 3081, 3095, 3081, 3097, 3178, 3160, 3167, 3160, 3147, 3152, 3094, 3084, 3082, 3086, 3095, 3082, 3087, 2702, 2745, 2746, 2745, 2734, 2745, 2734, 563, 1829, 1917, 1890, 1903, 1902, 1892, 1830, 1890, 1893, 1901, 1892, 1830, 1890, 1919, 1902, 1894, 2735, 395, 1461, 1523, 1524, 1534, 1535, 1506, 1460, 1514, 1522, 1514, 1461, 1516, 1525, 1534, 1461, 1513, 1535, 1531, 1512, 1529, 1522, 1461, 1517, 1534, 1461, 2488, 2558, 2530, 2555, 2554, 2309, 2374, 2372, 2383, 2398, 2375, 2382, 2310, 2392, 2382, 2378, 2393, 2376, 2371, 2310, 2370, 2399, 2382, 2374, 2135, 2063, 2064, 2077, 2076, 2070, 2132, 2064, 2071, 2079, 2070, 2132, 2065, 2076, 2072, 2077, 2076, 2059, 2137, 2072, 556, 566, 545, 546, 1647, 1591, 1576, 1573, 1572, 1582, 1644, 1576, 1583, 1575, 1582, 1644, 1577, 1572, 1568, 1573, 1572, 1587, 1633, 1568, 1823, 1794, 1823, 1799, 1806, 2182, 2245, 2247, 2252, 2269, 2244, 2253, 2181, 2241, 2268, 2253, 2245, 2181, 2264, 2241, 2251, 2184, 2241, 2245, 2255, 2573, 2568, 2589, 2568, 2628, 2586, 2587, 2570, 1383, 1403, 1403, 1407, 656, 712, 727, 730, 731, 721, 659, 727, 720, 728, 721, 659, 726, 731, 735, 730, 731, 716, 670, 735, 656, 712, 727, 730, 731, 721, 659, 717, 731, 716, 727, 735, 722, 1879, 1877, 1856, 1873, 1917, 1872, 1168, 1170, 1159, 1174, 1210, 1175, 2876, 2863, 2872, 2876, 2481, 2559, 2540, 2555, 2559, 2481, 2103, 2084, 2099, 2103, 762, 737, 1332, 1401, 1378, 1332, 1370, 1345, 995, 1023, 1019, 1000, 2422, 2336, 2364, 2360, 2347, 2422, 2589, 2561, 2565, 2582, 2192, 2207, 2194, 2176, 2176, 2724, 2792, 2791, 2794, 2808, 2808, 2724, 2749, 2738, 2751, 2733, 2733, 744, 741, 746, 739, 2718, 2781, 2768, 2783, 2774, 2718, 2976, 2989, 2978, 2987, 2953, 3023, 3016, 3010, 3011, 3038, 2952, 3030, 3022, 3030, 2953, 3024, 3017, 3010, 2953, 3029, 3022, 3017, 3025, 2953, 3023, 3010, 2953, 935, 1016, 1001, 1007, 1005, 935, 1099, 1037, 1041, 1032, 1033, 1075, 1073, 1060, 1077, 1079, 1087, 1058, 1065, 1043, 1087, 1086, 1060, 1077, 1086, 1060, 1136, 1075, 1073, 1060, 1077, 1029, 1058, 1084, 1130, 1136, 1715, 1776, 1778, 1785, 1768, 1777, 1784, 1712, 1780, 1769, 1784, 1776, 434, 430, 430, 426, 2653, 2590, 2588, 2583, 2566, 2591, 2582, 2654, 2561, 2588, 2564, 2654, 2567, 2582, 2571, 2567, 2308, 2305, 2324, 2305, 2381, 2307, 2316, 2313, 2320, 2306, 2319, 2305, 2322, 2308, 2381, 2324, 2309, 2328, 2324, 453, 413, 386, 399, 398, 388, 454, 386, 389, 397, 388, 454, 387, 398, 394, 399, 398, 409, 459, 469, 459, 453, 411, 394, 396, 398, 454, 415, 386, 415, 391, 398, 1519, 1452, 1454, 1445, 1460, 1453, 1444, 1516, 1448, 1461, 1444, 1452, 1516, 1457, 1448, 1442, 1505, 1448, 1452, 1446, 1825, 1828, 1841, 1828, 1896, 1846, 1847, 1830, 564, 552, 552, 556, 3136, 3096, 3079, 3082, 3083, 3073, 3139, 3079, 3072, 3080, 3073, 3139, 3078, 3083, 3087, 3082, 3083, 3100, 3150, 3087, 3136, 3098, 3087, 3081, 3139, 3074, 3079, 3072, 3077, 3208, 526, 598, 585, 580, 581, 591, 525, 585, 590, 582, 591, 525, 584, 581, 577, 580, 581, 594, 512, 580, 585, 598, 526, 596, 577, 583, 525, 588, 585, 590, 587, 512, 577, 1223, 1177, 1220, 1222, 1245, 1245, 1256, 1238, 22957, 27973, 19314, 27229, 23369, 19422, 24132, 27563, 2569, 2576, 2642, 2587, 2574, 2581, 2584, 2641, 2581, 2568, 2585, 2577, 2575, 2652, 2626, 2652, 2576, 2581, 2652, 2626, 2652, 2589, 2903, 2893, 2906, 2905, 1390, 1320, 1327, 1317, 1316, 1337, 1391, 1329, 1321, 1329, 1390, 1335, 1326, 1317, 674, 696, 687, 684, 2998, 2990, 3009, 2697, 2708, 2697, 2705, 2712, 2321, 2321, 2325, 1072, 1139, 1137, 1146, 1131, 1138, 1147, 1075, 1143, 1130, 1147, 1139, 3132, 3110, 3131, 3114, 1666, 1679, 1675, 1678, 2546, 2481, 2483, 2488, 2473, 2480, 2489, 2545, 2485, 2472, 2489, 2481, 2545, 2472, 2485, 2472, 2480, 2489, 2494, 2483, 2468, 2556, 2530, 2493, 2760, 2770, 2757, 2758, 2156, 2095, 2093, 2086, 2103, 2094, 2087, 2159, 2091, 2102, 2087, 2095, 2159, 2102, 2091, 2102, 2094, 2087, 2080, 2093, 2106, 2146, 2172, 2083, 2530, 2559, 2530, 2554, 2547, -30603, 22247, 3005, 3070, 3068, 3063, 3046, 3071, 3062, 3006, 3066, 3047, 3062, 3070, 3006, 3043, 3066, 3056, 
    2995, 3066, 3070, 3060, 1550, 1547, 1566, 1547, 1607, 1561, 1560, 1545, 2813, 2785, 2785, 2789, 2803, 2736, 2738, 2745, 2728, 2737, 2744, 2800, 2740, 2729, 2744, 2736, 2800, 2729, 2744, 2725, 2729};
    private java.lang.String f;

    static {
        new okhttp3.OkHttpClient();
    }

    public static java.lang.String d(java.lang.String str) {
        if (!com.github.catvod.spider.merge.FM.C.C0063.m474(str, com.github.catvod.spider.C0239.m1612(m30(), 0, 6, 1422))) {
            return str;
        }
        try {
            java.lang.StringBuilder sb = new java.lang.StringBuilder();
            com.github.catvod.spider.merge.FM.n.C0112.m795(sb, str);
            com.github.catvod.spider.merge.FM.n.C0112.m795(sb, com.github.catvod.spider.merge.FM.e.C0096.m692(m30(), 6, 9, 2136));
            org.json.JSONObject jSONObject = new org.json.JSONObject();
            com.github.catvod.spider.merge.FM.o.C0114.m812(jSONObject, com.github.catvod.spider.merge.FM.u.C0117.m835(m30(), 15, 10, 2066), org.slf4j.event.C0270.m1721(m30(), 25, 154, 2633));
            com.github.catvod.spider.merge.FM.o.C0114.m812(jSONObject, com.github.catvod.spider.merge.R.C0163.m1081(m30(), 179, 7, 1006), com.github.catvod.spider.merge.FM.U.C0076.m566(m30(), 186, 22, 2904));
            com.github.catvod.spider.merge.FM.n.C0112.m795(sb, com.github.catvod.spider.merge.C0.d0.C0035.m280(jSONObject));
            return com.github.catvod.spider.merge.FM.D.C0065.m492(sb);
        } catch (java.lang.Exception e) {
            com.github.catvod.spider.merge.C0.W.C0019.m171(e);
            return str;
        }
    }

    private java.util.Map<java.lang.String, java.lang.String> g() {
        java.util.HashMap hashMap = new java.util.HashMap();
        com.github.catvod.spider.merge.FM.c0.C0089.m650(hashMap, com.github.catvod.spider.merge.FM.C0126.m894(m30(), 208, 10, 802), com.github.catvod.spider.merge.FM.e0.C0099.m712(m30(), 218, 111, 3129));
        java.lang.String m490 = com.github.catvod.spider.merge.FM.D.C0065.m490(m30(), 329, 7, 2780);
        java.lang.StringBuilder sb = new java.lang.StringBuilder();
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb, m25(this));
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb, com.github.catvod.spider.merge.H.C0133.m929(m30(), 336, 1, 540));
        com.github.catvod.spider.merge.FM.c0.C0089.m650(hashMap, m490, com.github.catvod.spider.merge.FM.D.C0065.m492(sb));
        return hashMap;
    }

    private java.lang.String h(com.github.catvod.spider.merge.FM.K.h hVar, java.lang.String str) {
        java.util.Iterator m337 = com.github.catvod.spider.merge.C0.j.C0043.m337(com.github.catvod.spider.merge.N.C0152.m1018(hVar, com.github.catvod.spider.merge.FM.e.C0095.m688(m30(), 337, 16, 1803)));
        while (com.github.catvod.spider.merge.e.C0182.m1226(m337)) {
            com.github.catvod.spider.merge.FM.K.m mVar = (com.github.catvod.spider.merge.FM.K.m) com.github.catvod.spider.merge.FM.c.C0088.m640(m337);
            if (com.github.catvod.spider.merge.FM.C.C0063.m474(com.github.catvod.spider.merge.C0.e0.C0037.m297(com.github.catvod.spider.merge.b.C0177.m1196(mVar)), str)) {
                java.lang.String m269 = com.github.catvod.spider.merge.C0.d0.C0034.m269(m30(), 353, 1, 2691);
                java.util.List m1516 = com.github.catvod.spider.merge.w.C0223.m1516(com.github.catvod.spider.merge.N.C0152.m1018(mVar, com.github.catvod.spider.merge.C0.T.C0018.m168(m30(), 354, 1, 490)));
                java.lang.StringBuilder sb = new java.lang.StringBuilder();
                java.util.Iterator m1738 = org.slf4j.spi.C0273.m1738((java.util.ArrayList) m1516);
                if (com.github.catvod.spider.merge.e.C0182.m1226(m1738)) {
                    while (true) {
                        com.github.catvod.spider.merge.FM.U.C0076.m564(sb, (java.lang.CharSequence) com.github.catvod.spider.merge.FM.c.C0088.m640(m1738));
                        if (!com.github.catvod.spider.merge.e.C0182.m1226(m1738)) {
                            break;
                        }
                        com.github.catvod.spider.merge.FM.U.C0076.m564(sb, m269);
                    }
                }
                return com.github.catvod.spider.merge.FM.D.C0065.m492(sb);
            }
        }
        return com.github.catvod.spider.merge.FM.U.C0079.m584();
    }

    private java.lang.String j(java.lang.String str) {
        java.lang.StringBuilder sb = new java.lang.StringBuilder();
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb, m25(this));
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb, com.github.catvod.spider.merge.N.C0153.m1024(m30(), 355, 25, 1434));
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb, com.github.catvod.spider.merge.FM.X.C0083.m606(str));
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb, com.github.catvod.spider.merge.m.C0200.m1395(m30(), 380, 5, 2454));
        com.github.catvod.spider.merge.FM.M.C0476g m1018 = com.github.catvod.spider.merge.N.C0152.m1018(com.github.catvod.spider.merge.C0.n0.C0046.m361(com.github.catvod.spider.merge.C0.W.C0019.m177(com.github.catvod.spider.merge.FM.D.C0065.m492(sb), m26(this))), com.github.catvod.spider.merge.C0.i.C0041.m328(m30(), 385, 19, 2347));
        java.util.ArrayList arrayList = new java.util.ArrayList();
        java.util.Iterator m337 = com.github.catvod.spider.merge.C0.j.C0043.m337(m1018);
        while (com.github.catvod.spider.merge.e.C0182.m1226(m337)) {
            com.github.catvod.spider.merge.FM.K.m mVar = (com.github.catvod.spider.merge.FM.K.m) com.github.catvod.spider.merge.FM.c.C0088.m640(m337);
            java.lang.String m797 = com.github.catvod.spider.merge.FM.n.C0112.m797(com.github.catvod.spider.merge.N.C0152.m1018(mVar, com.github.catvod.spider.merge.FM.C.C0064.m487(m30(), 404, 20, 2169)), com.github.catvod.spider.merge.FM.h.C0102.m728(m30(), 424, 4, 580));
            java.lang.String m7972 = com.github.catvod.spider.merge.FM.n.C0112.m797(com.github.catvod.spider.merge.N.C0152.m1018(mVar, com.github.catvod.spider.merge.FM.Z.C0085.m623(m30(), 428, 20, 1601)), com.github.catvod.spider.merge.G.C0130.m917(m30(), 448, 5, 1899));
            java.lang.String m7973 = com.github.catvod.spider.merge.FM.n.C0112.m797(com.github.catvod.spider.merge.N.C0152.m1018(mVar, com.github.catvod.spider.merge.FM.G.C0068.m512(m30(), 453, 20, 2216)), com.github.catvod.spider.merge.FM.l.C0108.m772(m30(), 473, 8, 2665));
            int m257 = com.github.catvod.spider.merge.C0.d.C0031.m257(m7973, com.github.catvod.spider.merge.FM.n.C0111.m793(m30(), 481, 4, 1295));
            if (m257 >= 0) {
                m7973 = com.github.catvod.spider.merge.C0.T.C0018.m169(com.github.catvod.spider.merge.a.C0175.m1144(m7973, m257));
            }
            com.github.catvod.spider.merge.FM.M.C0476g m10182 = com.github.catvod.spider.merge.N.C0152.m1018(mVar, com.github.catvod.spider.merge.AB.o.C0008.m113(m30(), 485, 33, 702));
            com.github.catvod.spider.merge.FM.d0.C0093.m672(m797, m7972, m7973, !com.github.catvod.spider.merge.FM.c.C0088.m641(m10182) ? com.github.catvod.spider.merge.C0.e0.C0037.m297(com.github.catvod.spider.merge.FM.A.C0058.m438(m10182)) : com.github.catvod.spider.merge.FM.U.C0079.m584(), arrayList);
        }
        return com.github.catvod.spider.merge.A.C0004.m82(arrayList);
    }

    /* renamed from: ۟۟ۧۤۦ, reason: not valid java name and contains not printable characters */
    public static java.lang.String m25(java.lang.Object obj) {
        if (com.github.catvod.spider.merge.FM.o.C0113.m805() < 0) {
            return ((com.github.catvod.spider.PanWebShare) obj).f;
        }
        return null;
    }

    /* renamed from: ۟۠ۢۨ۟, reason: not valid java name and contains not printable characters */
    public static java.util.Map m26(java.lang.Object obj) {
        if (com.github.catvod.spider.merge.C0.r.C0047.m370() <= 0) {
            return ((com.github.catvod.spider.PanWebShare) obj).g();
        }
        return null;
    }

    /* renamed from: ۟ۦۥۣ, reason: not valid java name and contains not printable characters */
    public static java.lang.String m27(java.lang.Object obj, java.lang.Object obj2, java.lang.Object obj3) {
        if (com.github.catvod.spider.merge.J.C0142.m953() <= 0) {
            return ((com.github.catvod.spider.PanWebShare) obj).h((com.github.catvod.spider.merge.FM.K.h) obj2, (java.lang.String) obj3);
        }
        return null;
    }

    /* renamed from: ۟ۧۢۥۦ, reason: not valid java name and contains not printable characters */
    public static void m28(java.lang.Object obj) {
        if (com.github.catvod.spider.merge.FM.m.C0109.m778() >= 0) {
            com.github.catvod.spider.PanOrder.sort((java.util.List) obj);
        }
    }

    /* renamed from: ۣۤ۟۟, reason: not valid java name and contains not printable characters */
    public static java.lang.String m29(java.lang.Object obj, java.lang.Object obj2) {
        if (com.github.catvod.spider.merge.m.C0200.m1396() <= 0) {
            return ((com.github.catvod.spider.PanWebShare) obj).j((java.lang.String) obj2);
        }
        return null;
    }

    /* renamed from: ۣۧۧ۠, reason: not valid java name and contains not printable characters */
    public static short[] m30() {
        if (com.github.catvod.spider.merge.C0.b.C0022.m194() <= 0) {
            return f11short;
        }
        return null;
    }

    /* renamed from: ۣۨ۠ۨ, reason: not valid java name and contains not printable characters */
    public static void m31(java.lang.Object obj) {
        if (com.github.catvod.spider.merge.p.C0205.m1428() > 0) {
            com.github.catvod.crawler.SpiderDebug.log((java.lang.String) obj);
        }
    }

    public java.lang.String categoryContent(java.lang.String str, java.lang.String str2, boolean z, java.util.HashMap<java.lang.String, java.lang.String> hashMap) {
        java.lang.String str3;
        java.lang.String str4;
        java.lang.String str5;
        java.lang.String str6;
        java.lang.String str7 = str;
        if (com.github.catvod.spider.merge.h.C0191.m1276(hashMap, com.github.catvod.spider.merge.C0.n0.C0046.m363(m30(), 518, 6, 1844)) != null) {
            str7 = (java.lang.String) com.github.catvod.spider.merge.h.C0191.m1276(hashMap, com.github.catvod.spider.merge.j.C0195.m1287(m30(), 524, 6, 1267));
        }
        java.lang.Object m1276 = com.github.catvod.spider.merge.h.C0191.m1276(hashMap, com.github.catvod.spider.merge.v.C0219.m1498(m30(), 530, 4, 2909));
        java.lang.String m584 = com.github.catvod.spider.merge.FM.U.C0079.m584();
        if (m1276 != null) {
            java.lang.StringBuilder sb = new java.lang.StringBuilder();
            com.github.catvod.spider.merge.FM.n.C0112.m795(sb, com.github.catvod.spider.merge.FM.a0.C0086.m632(m30(), 534, 6, 2462));
            com.github.catvod.spider.merge.FM.n.C0112.m795(sb, (java.lang.String) com.github.catvod.spider.merge.h.C0191.m1276(hashMap, com.github.catvod.spider.merge.C0.S.C0017.m157(m30(), 540, 4, 2134)));
            str3 = com.github.catvod.spider.merge.FM.D.C0065.m492(sb);
        } else {
            str3 = m584;
        }
        if (com.github.catvod.spider.merge.h.C0191.m1276(hashMap, com.github.catvod.spider.merge.R.C0164.m1085(m30(), 544, 2, 664)) != null) {
            java.lang.StringBuilder sb2 = new java.lang.StringBuilder();
            com.github.catvod.spider.merge.FM.n.C0112.m795(sb2, com.github.catvod.spider.merge.FM.e.C0094.m679(m30(), 546, 4, 1307));
            com.github.catvod.spider.merge.FM.n.C0112.m795(sb2, (java.lang.String) com.github.catvod.spider.merge.h.C0191.m1276(hashMap, com.github.catvod.spider.merge.FM.h.C0102.m728(m30(), 550, 2, 1336)));
            str4 = com.github.catvod.spider.merge.FM.D.C0065.m492(sb2);
        } else {
            str4 = m584;
        }
        if (com.github.catvod.spider.merge.h.C0191.m1276(hashMap, com.github.catvod.spider.merge.S.C0166.m1099(m30(), 552, 4, 922)) != null) {
            java.lang.StringBuilder sb3 = new java.lang.StringBuilder();
            com.github.catvod.spider.merge.FM.n.C0112.m795(sb3, com.github.catvod.spider.merge.a.C0175.m1140(m30(), 556, 6, 2393));
            com.github.catvod.spider.merge.FM.n.C0112.m795(sb3, (java.lang.String) com.github.catvod.spider.merge.h.C0191.m1276(hashMap, com.github.catvod.spider.merge.FM.m.C0110.m789(m30(), 562, 4, 2660)));
            str5 = com.github.catvod.spider.merge.FM.D.C0065.m492(sb3);
        } else {
            str5 = m584;
        }
        if (com.github.catvod.spider.merge.h.C0191.m1276(hashMap, com.github.catvod.spider.merge.J.C0142.m957(m30(), 566, 5, 2291)) != null) {
            java.lang.StringBuilder sb4 = new java.lang.StringBuilder();
            com.github.catvod.spider.merge.FM.n.C0112.m795(sb4, com.github.catvod.spider.merge.P.C0157.m1045(m30(), 571, 7, 2699));
            com.github.catvod.spider.merge.FM.n.C0112.m795(sb4, (java.lang.String) com.github.catvod.spider.merge.h.C0191.m1276(hashMap, com.github.catvod.spider.merge.D.C0050.m395(m30(), 578, 5, 2782)));
            str6 = com.github.catvod.spider.merge.FM.D.C0065.m492(sb4);
        } else {
            str6 = m584;
        }
        if (com.github.catvod.spider.merge.h.C0191.m1276(hashMap, com.github.catvod.spider.merge.C0.j.C0043.m341(m30(), 583, 4, 644)) != null) {
            java.lang.StringBuilder sb5 = new java.lang.StringBuilder();
            com.github.catvod.spider.merge.FM.n.C0112.m795(sb5, com.github.catvod.spider.merge.N.C0151.m1006(m30(), 587, 6, 2737));
            com.github.catvod.spider.merge.FM.n.C0112.m795(sb5, (java.lang.String) com.github.catvod.spider.merge.h.C0191.m1276(hashMap, com.github.catvod.spider.merge.P.C0157.m1045(m30(), 593, 4, 3020)));
            m584 = com.github.catvod.spider.merge.FM.D.C0065.m492(sb5);
        }
        java.lang.StringBuilder sb6 = new java.lang.StringBuilder();
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb6, m25(this));
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb6, com.github.catvod.spider.merge.C0.j.C0042.m332(m30(), 597, 23, 2982));
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb6, str7);
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb6, com.github.catvod.spider.merge.p.C0208.m1445(m30(), 620, 6, 904));
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb6, str2);
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb6, str6);
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb6, str3);
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb6, m584);
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb6, str5);
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb6, str4);
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb6, com.github.catvod.spider.merge.x.C0227.m1549(m30(), 626, 5, 1125));
        java.lang.String m492 = com.github.catvod.spider.merge.FM.D.C0065.m492(sb6);
        java.lang.StringBuilder sb7 = new java.lang.StringBuilder();
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb7, com.github.catvod.spider.merge.e.C0182.m1225(m30(), 631, 25, 1104));
        com.github.catvod.spider.merge.FM.n.C0112.m795(sb7, m492);
        m31(com.github.catvod.spider.merge.FM.D.C0065.m492(sb7));
        java.util.List m1538 = com.github.catvod.spider.merge.x.C0226.m1538(this, com.github.catvod.spider.merge.N.C0152.m1018(com.github.catvod.spider.merge.e.C0182.m1221(com.github.catvod.spider.merge.C0.W.C0019.m177(m492, m26(this))), com.github.catvod.spider.merge.C0.b0.C0025.m211(m30(), 656, 12, 1693)));
        com.github.catvod.spider.merge.FM.c.C0531g c0531g = new com.github.catvod.spider.merge.FM.c.C0531g();
        com.github.catvod.spider.merge.FM.z.C0125.m886(c0531g, m1538);
        return com.github.catvod.spider.merge.x.C0226.m1540(c0531g);
    }

    @Override // com.github.catvod.spider.Pan
    public java.lang.String detailContent(java.util.List<java.lang.String> list) {
        java.lang.String m492;
        if (com.github.catvod.spider.merge.D.C0050.m390((java.lang.String) com.github.catvod.spider.merge.l.C0199.m1309(list, 0), com.github.catvod.spider.merge.FM.c0.C0089.m649(m30(), 668, 4, 474))) {
            m492 = (java.lang.String) com.github.catvod.spider.merge.l.C0199.m1309(list, 0);
        } else {
            java.lang.StringBuilder sb = new java.lang.StringBuilder();
            com.github.catvod.spider.merge.FM.n.C0112.m795(sb, m25(this));
            com.github.catvod.spider.merge.FM.n.C0112.m795(sb, (java.lang.String) com.github.catvod.spider.merge.l.C0199.m1309(list, 0));
            m492 = com.github.catvod.spider.merge.FM.D.C0065.m492(sb);
        }
        com.github.catvod.spider.merge.FM.K.h m1221 = com.github.catvod.spider.merge.e.C0182.m1221(com.github.catvod.spider.merge.C0.W.C0019.m177(m492, m26(this)));
        com.github.catvod.spider.merge.FM.c.C0534j c0534j = new com.github.catvod.spider.merge.FM.c.C0534j();
        java.util.List m656 = com.github.catvod.spider.merge.FM.c0.C0090.m656(com.github.catvod.spider.merge.N.C0152.m1018(m1221, com.github.catvod.spider.merge.p.C0206.m1435(m30(), 672, 16, 2675)), com.github.catvod.spider.merge.FM.c.C0088.m646(m30(), 688, 19, 2400));
        java.util.ArrayList arrayList = new java.util.ArrayList();
        java.util.ArrayList arrayList2 = new java.util.ArrayList();
        java.util.ArrayList arrayList3 = new java.util.ArrayList();
        java.util.ArrayList arrayList4 = new java.util.ArrayList();
        java.util.ArrayList arrayList5 = new java.util.ArrayList();
        java.lang.String m297 = com.github.catvod.spider.merge.C0.e0.C0037.m297(com.github.catvod.spider.merge.C0.W.C0019.m176(com.github.catvod.spider.merge.K.C0145.m966(m30(), 707, 32, 491), m1221));
        int i = 0;
        while (true) {
            java.util.ArrayList arrayList6 = (java.util.ArrayList) m656;
            if (i >= com.github.catvod.spider.merge.C0.c0.C0027.m233(arrayList6)) {
                break;
            }
            if (com.github.catvod.spider.merge.C0.P.C0015.m145(com.github.catvod.spider.merge.C0.b.C0022.m197(com.github.catvod.spider.merge.FM.G.C0069.m518(), (java.lang.CharSequence) com.github.catvod.spider.merge.F.C0056.m426(arrayList6, i)))) {
                com.github.catvod.spider.merge.C0.j.C0042.m334(arrayList, (java.lang.String) com.github.catvod.spider.merge.F.C0056.m426(arrayList6, i));
            }
            if (com.github.catvod.spider.merge.C0.P.C0015.m145(com.github.catvod.spider.merge.C0.b.C0022.m197(com.github.catvod.parser.C0003.m23(), (java.lang.CharSequence) com.github.catvod.spider.merge.F.C0056.m426(arrayList6, i)))) {
                com.github.catvod.spider.merge.C0.j.C0042.m334(arrayList2, (java.lang.String) com.github.catvod.spider.merge.F.C0056.m426(arrayList6, i));
            }
            if (com.github.catvod.spider.merge.C0.P.C0015.m145(com.github.catvod.spider.merge.C0.b.C0022.m197(com.github.catvod.spider.merge.FM.A.C0060.m453(), (java.lang.CharSequence) com.github.catvod.spider.merge.F.C0056.m426(arrayList6, i)))) {
                com.github.catvod.spider.merge.C0.j.C0042.m334(arrayList3, (java.lang.String) com.github.catvod.spider.merge.F.C0056.m426(arrayList6, i));
            }
            if (com.github.catvod.spider.merge.C0.P.C0015.m145(com.github.catvod.spider.merge.C0.b.C0022.m197(com.github.catvod.spider.merge.FM.B.C0061.m466(), (java.lang.CharSequence) com.github.catvod.spider.merge.F.C0056.m426(arrayList6, i)))) {
                com.github.catvod.spider.merge.C0.j.C0042.m334(arrayList4, (java.lang.String) com.github.catvod.spider.merge.F.C0056.m426(arrayList6, i));
            }
            if (com.github.catvod.spider.merge.C0.P.C0015.m145(com.github.catvod.spider.merge.C0.b.C0022.m197(com.github.catvod.spider.merge.C0.d0.C0035.m281(), (java.lang.CharSequence) com.github.catvod.spider.merge.F.C0056.m426(arrayList6, i)))) {
                com.github.catvod.spider.merge.C0.j.C0042.m334(arrayList5, (java.lang.String) com.github.catvod.spider.merge.F.C0056.m426(arrayList6, i));
            }
            if (com.github.catvod.spider.merge.C0.P.C0015.m145(com.github.catvod.spider.merge.C0.b.C0022.m197(com.github.catvod.spider.merge.FM.A.C0060.m457(), (java.lang.CharSequence) com.github.catvod.spider.merge.F.C0056.m426(arrayList6, i)))) {
                com.github.catvod.spider.merge.C0.j.C0042.m334(arrayList5, (java.lang.String) com.github.catvod.spider.merge.F.C0056.m426(arrayList6, i));
            }
            if (com.github.catvod.spider.merge.C0.P.C0015.m145(com.github.catvod.spider.merge.C0.b.C0022.m197(com.github.catvod.spider.merge.N.C0154.m1028(), (java.lang.CharSequence) com.github.catvod.spider.merge.F.C0056.m426(arrayList6, i)))) {
                com.github.catvod.spider.merge.C0.j.C0042.m334(arrayList5, (java.lang.String) com.github.catvod.spider.merge.F.C0056.m426(arrayList6, i));
            }
            i++;
        }
        java.util.ArrayList arrayList7 = new java.util.ArrayList();
        com.github.catvod.spider.merge.K.C0145.m969(arrayList7, arrayList);
        com.github.catvod.spider.merge.K.C0145.m969(arrayList7, arrayList2);
        com.github.catvod.spider.merge.K.C0145.m969(arrayList7, arrayList3);
        com.github.catvod.spider.merge.K.C0145.m969(arrayList7, arrayList4);
        com.github.catvod.spider.merge.K.C0145.m969(arrayList7, arrayList5);
        m28(arrayList7);
        com.github.catvod.spider.merge.C0.e0.C0036.m290(c0534j, com.github.catvod.spider.merge.AB.o.C0009.m121(this, arrayList7));
        com.github.catvod.spider.merge.FM.X.C0083.m610(c0534j, com.github.catvod.spider.merge.C0.d.C0033.m263(this, arrayList7));
        java.lang.String m548 = com.github.catvod.spider.merge.FM.Q.C0074.m548(com.github.catvod.spider.merge.C0.W.C0019.m176(com.github.catvod.spider.merge.w.C0222.m1511(m30(), 739, 20, 1473), m1221), com.github.catvod.spider.merge.q.C0210.m1458(m30(), 759, 8, 1861));
        int m257 = com.github.catvod.spider.merge.C0.d.C0031.m257(m548, com.github.catvod.spider.merge.C0.b.C0022.m196(m30(), 767, 4, 604));
        if (m257 >= 0) {
            m548 = com.github.catvod.spider.merge.C0.T.C0018.m169(com.github.catvod.spider.merge.a.C0175.m1144(m548, m257));
        }
        java.lang.String m2972 = com.github.catvod.spider.merge.C0.e0.C0037.m297(com.github.catvod.spider.merge.C0.a0.C0021.m188(com.github.catvod.spider.merge.N.C0152.m1018(m1221, com.github.catvod.spider.merge.FM.e0.C0098.m702(m30(), 771, 29, 3182))));
        java.lang.String m250 = com.github.catvod.spider.merge.C0.d.C0030.m250(m30(), 800, 1, 3236);
        java.util.List m1516 = com.github.catvod.spider.merge.w.C0223.m1516(com.github.catvod.spider.merge.N.C0152.m1018(m1221, com.github.catvod.spider.merge.FM.e0.C0101.m720(m30(), 801, 33, 544)));
        java.lang.StringBuilder sb2 = new java.lang.StringBuilder();
        java.util.Iterator m1738 = org.slf4j.spi.C0273.m1738((java.util.ArrayList) m1516);
        if (com.github.catvod.spider.merge.e.C0182.m1226(m1738)) {
            while (true) {
                com.github.catvod.spider.merge.FM.U.C0076.m564(sb2, (java.lang.CharSequence) com.github.catvod.spider.merge.FM.c.C0088.m640(m1738));
                if (!com.github.catvod.spider.merge.e.C0182.m1226(m1738)) {
                    break;
                }
                com.github.catvod.spider.merge.FM.U.C0076.m564(sb2, m250);
            }
        }
        java.lang.String m4922 = com.github.catvod.spider.merge.FM.D.C0065.m492(sb2);
        java.lang.String m90 = com.github.catvod.spider.merge.AB.b.C0005.m90(com.github.catvod.spider.merge.N.C0152.m1018(m1221, com.github.catvod.spider.merge.FM.e.C0097.m695(m30(), 834, 8, 1207)));
        java.lang.String m27 = m27(this, m1221, com.github.catvod.spider.merge.FM.V.C0080.m594(m30(), 842, 2, 593));
        java.lang.String m272 = m27(this, m1221, com.github.catvod.spider.merge.q.C0213.m1473(m30(), 844, 2, 1353));
        java.lang.String m273 = m27(this, m1221, com.github.catvod.spider.merge.e.C0182.m1225(m30(), 846, 2, 1341));
        java.lang.String m274 = m27(this, m1221, com.github.catvod.spider.merge.e.C0181.m1212(m30(), 848, 2, 1859));
        com.github.catvod.spider.merge.FM.m.C0110.m781(c0534j, (java.lang.String) com.github.catvod.spider.merge.l.C0199.m1309(list, 0));
        com.github.catvod.spider.merge.FM.u.C0117.m831(c0534j, m548);
        com.github.catvod.spider.merge.C0.T.C0018.m167(c0534j, m273);
        com.github.catvod.spider.merge.FM.i.C0104.m743(c0534j, m297);
        com.github.catvod.spider.merge.FM.l.C0106.m761(c0534j, m2972);
        com.github.catvod.spider.merge.S.C0167.m1104(c0534j, m272);
        com.github.catvod.spider.merge.FM.v.C0118.m839(c0534j, m274);
        com.github.catvod.spider.merge.D.C0050.m393(c0534j, m90);
        com.github.catvod.spider.merge.T.C0169.m1119(c0534j, m27);
        com.github.catvod.spider.merge.x.C0226.m1537(c0534j, m4922);
        return com.github.catvod.spider.merge.FM.Y.C0084.m617(com.github.catvod.spider.merge.b.C0177.m1195(c0534j));
    }

    public java.lang.String homeContent(boolean z) {
        java.util.ArrayList arrayList = new java.util.ArrayList();
        com.github.catvod.spider.merge.FM.K.h m1221 = com.github.catvod.spider.merge.e.C0182.m1221(com.github.catvod.spider.merge.C0.W.C0019.m177(m25(this), m26(this)));
        java.util.Iterator m337 = com.github.catvod.spider.merge.C0.j.C0043.m337(com.github.catvod.spider.merge.N.C0152.m1018(m1221, com.github.catvod.spider.merge.FM.e0.C0100.m714(m30(), 850, 22, 2684)));
        while (com.github.catvod.spider.merge.e.C0182.m1226(m337)) {
            com.github.catvod.spider.merge.FM.K.m mVar = (com.github.catvod.spider.merge.FM.K.m) com.github.catvod.spider.merge.FM.c.C0088.m640(m337);
            if (com.github.catvod.spider.merge.D.C0050.m390(com.github.catvod.spider.merge.FM.Q.C0074.m548(mVar, com.github.catvod.spider.merge.C0.n0.C0046.m363(m30(), 872, 4, 2879)), com.github.catvod.spider.merge.g.C0188.m1261(m30(), 876, 14, 1345))) {
                if (com.github.catvod.spider.merge.C0.c0.C0027.m233(arrayList) >= 7) {
                    break;
                }
                java.lang.String m542 = com.github.catvod.spider.merge.FM.O.C0073.m542(com.github.catvod.spider.merge.FM.Q.C0074.m548(mVar, com.github.catvod.spider.merge.FM.t.C0116.m824(m30(), 890, 4, 714)), org.slf4j.helpers.C0272.m1732(m30(), 894, 3, 3050), com.github.catvod.spider.merge.FM.U.C0079.m584());
                java.lang.String m548 = com.github.catvod.spider.merge.FM.Q.C0074.m548(mVar, com.github.catvod.spider.merge.FM.m.C0109.m777(m30(), 897, 5, 2813));
                if (!com.github.catvod.spider.merge.FM.C.C0063.m474(m548, com.github.catvod.spider.merge.FM.E.C0066.m503(m30(), 902, 3, 2336))) {
                    com.github.catvod.spider.merge.C0.j.C0042.m334(arrayList, new com.github.catvod.spider.merge.FM.c.C0525a(m542, m548));
                }
            }
        }
        return np.protect.C0261.m1674(arrayList, com.github.catvod.spider.merge.x.C0226.m1538(this, com.github.catvod.spider.merge.N.C0152.m1018(m1221, com.github.catvod.spider.merge.P.C0160.m1066(m30(), 905, 12, 1054))), new org.json.JSONObject(com.github.catvod.spider.merge.FM.i.C0103.m735()));
    }

    @Override // com.github.catvod.spider.Pan
    public void init(android.content.Context context, java.lang.String str) {
        org.json.JSONArray m1089;
        int m1756;
        if (com.github.catvod.spider.merge.p.C0208.m1444(str) || (m1756 = org.slf4j.C0276.m1756((m1089 = com.github.catvod.spider.merge.R.C0164.m1089(new org.json.JSONObject(str), com.github.catvod.spider.merge.F.C0055.m423(m30(), 917, 4, 3151))))) == 0) {
            return;
        }
        for (int i = 0; i < m1756; i++) {
            java.lang.String m343 = com.github.catvod.spider.merge.C0.j.C0043.m343(com.github.catvod.spider.merge.x.C0227.m1553(m1089, i));
            if (!com.github.catvod.spider.merge.p.C0208.m1444(m343)) {
                try {
                    java.net.HttpURLConnection httpURLConnection = (java.net.HttpURLConnection) com.github.catvod.spider.merge.FM.X.C0083.m612(new java.net.URL(m343));
                    com.github.catvod.spider.merge.FM.e.C0096.m691(httpURLConnection, true);
                    com.github.catvod.spider.merge.FM.A.C0058.m445(httpURLConnection, 10000);
                    com.github.catvod.spider.merge.e.C0182.m1224(httpURLConnection, 10000);
                    com.github.catvod.spider.merge.F.C0055.m419(httpURLConnection, com.github.catvod.spider.merge.FM.U.C0078.m578(m30(), 921, 4, 1738));
                    int m731 = com.github.catvod.spider.merge.FM.h.C0102.m731(httpURLConnection);
                    if (m731 >= 200 && m731 < 400) {
                        this.f = m343;
                        com.github.catvod.spider.merge.FM.T.C0075.m559(httpURLConnection);
                        return;
                    }
                    com.github.catvod.spider.merge.FM.T.C0075.m559(httpURLConnection);
                } catch (java.lang.Exception e) {
                    com.github.catvod.spider.merge.C0.j.C0043.m338(e);
                }
            }
        }
    }

    public java.util.List<com.github.catvod.spider.merge.FM.c.C0534j> parseVodList(com.github.catvod.spider.merge.FM.M.C0476g c0476g) {
        java.util.ArrayList arrayList = new java.util.ArrayList();
        java.util.Iterator m337 = com.github.catvod.spider.merge.C0.j.C0043.m337(c0476g);
        while (com.github.catvod.spider.merge.e.C0182.m1226(m337)) {
            com.github.catvod.spider.merge.FM.K.m mVar = (com.github.catvod.spider.merge.FM.K.m) com.github.catvod.spider.merge.FM.c.C0088.m640(m337);
            java.lang.String m797 = com.github.catvod.spider.merge.FM.n.C0112.m797(com.github.catvod.spider.merge.N.C0152.m1018(mVar, com.github.catvod.spider.merge.FM.C.C0064.m487(m30(), 925, 24, 2524)), com.github.catvod.spider.merge.FM.a0.C0086.m632(m30(), 949, 4, 2720));
            java.lang.String m7972 = com.github.catvod.spider.merge.FM.n.C0112.m797(com.github.catvod.spider.merge.N.C0152.m1018(mVar, np.protect.C0245.m1632(m30(), 953, 24, 2114)), com.github.catvod.spider.merge.C0.n0.C0046.m363(m30(), 977, 5, 2454));
            if (!com.github.catvod.spider.merge.FM.y.C0122.m870(com.github.catvod.spider.merge.FM.Q.C0074.m553(m30(), 982, 2, 2446), m7972)) {
                java.lang.String m7973 = com.github.catvod.spider.merge.FM.n.C0112.m797(com.github.catvod.spider.merge.N.C0152.m1018(mVar, com.github.catvod.spider.merge.FM.D.C0065.m490(m30(), 984, 20, 2963)), com.github.catvod.spider.merge.C0.W.C0019.m174(m30(), 1004, 8, 1642));
                int m257 = com.github.catvod.spider.merge.C0.d.C0031.m257(m7973, com.github.catvod.spider.merge.C0.T.C0018.m168(m30(), 1012, 4, 2709));
                if (m257 >= 0) {
                    m7973 = com.github.catvod.spider.merge.C0.T.C0018.m169(com.github.catvod.spider.merge.a.C0175.m1144(m7973, m257));
                }
                com.github.catvod.spider.merge.FM.d0.C0093.m672(m797, m7972, m7973, com.github.catvod.spider.merge.AB.b.C0005.m90(com.github.catvod.spider.merge.N.C0152.m1018(mVar, com.github.catvod.spider.merge.FM.G.C0068.m512(m30(), 1016, 17, 2781))), arrayList);
            }
        }
        return arrayList;
    }

    public java.lang.String searchContent(java.lang.String str, boolean z) {
        return m29(this, str);
    }

    public java.lang.String searchContent(java.lang.String str, boolean z, java.lang.String str2) {
        return m29(this, str);
    }
}
