// filter.worker.js

let allRecipes = [];

// 1. Copiez vos définitions de tags ici
const tagDefinitions = {
    viande: ["viande", "viandes","bœuf", "beef", "agneau", "porc", "poulet", "veau", "canard", "lapin", "chèvre", "mouton", "saucisse", "lardons", "gibier", "os à moelle", "queue de bœuf", "tripes", "coq", "poule", "jambon", "spam", "cheval", "kefta", "pancetta", "confit", "lard", "renne", "bacon", "kangourou", "döner", "chorizo", "merguez", "dumba", "wurst", "gammon", "corned beef", "andouille", "boudin", "morcilla", "chouriço", "farinheira", "carne seca", "foie", "tête de porc", "joue", "oreille", "gosht", "char siu", "boerewors", "sang", "saindoux", "suif", "rognons", "graisse", "graisse de bœuf", "graisse d'oie", "bouillon de bœuf", "bouillon de poulet", "bouillon de porc", "speck", "chevreau", "chicharrón", "chicharron", "abats", "pâté", "jarret d'agneau"],
    poisson: ["poisson", "poissons", "haddock fumé", "lotte", "thon", "anchois", "saumon", "poissons de roche", "morue", "maquereau", "anguille", "sériole", "barramundi", "congre", "mahimahi", "thiof", "flocons de bonite", "katsuobushi", "ikan bilis", "cabillaud", "sole", "bar", "vivaneau", "truite", "sardine", "hareng", "tilapia", "merlu", "poisson-chat", "hilsa", "hamsi"],
    fruit_de_mer: ["crevette", "crevettes", "moule", "moules", "palourde", "palourdes", "crabe", "calamar", "calamars", "fruits de mer", "seiche", "gambas", "écrevisse", "écrevisses", "homard", "huître", "huîtres", "poulpe", "coque", "coques", "pâte de crevette", "bagoong", "terasi", "mắm ruốc", "yet", "surimi", "oursin", "œufs de poisson", "tobiko", "œufs de saumon", "ikura", "belacan", "langoustine", "pétoncle", "coquille saint-jacques", "lambi"],
    oeuf: ["œuf", "oeuf", "œufs", "oeufs", "jaune d'œuf", "blancs d'œufs", "œuf dur", "œufs durs", "omelette", "œufs de caille"],
    legumes: {
        includes: ["carotte", "oignon", "poireau", "tomate", "aubergine", "chou", "pomme de terre", "poivron", "céleri", "navet", "ail", "courge", "betterave", "olive", "maïs", "rutabaga", "panais", "cornichon", "okra", "gombo", "radis", "manioc", "plantain", "igname", "kimchi", "choucroute", "épinard", "kumara", "potiron", "artichaut", "concombre", "roquette", "cresson", "liseron d'eau", "orties", "oseille", "daikon", "konjac", "racine de lotus", "renkon", "gobo", "racine de bardane", "tomatillo", "chayotte", "mu er", "germes de soja", "feuilles de taro", "taro", "papaye verte", "jicama", "fleur de bananier", "algues", "wakame", "nori", "kombu", "cavolo nero", "nopales", "cardons", "poire coréenne", "jujubes", "haricots verts", "haricots longs", "petits pois", "blette", "molokhia", "châtaignes d'eau", "pousses de bambou"],
        excludes: ["pois chiches", "pois cassés", "haricots (lingots)", "haricots (Tarbais)", "haricots (Fabas)", "haricots (borlotti)", "haricots (cannellini)", "haricots (secs)", "farine de pois chiches", "champignon", "champignons", "shiitake", "pleurotes", "cèpes", "girolles", "morilles", "truffe", "champignons de Paris", "champignons noirs", "oreilles de Judas", "kikurage", "enoki"]
    },
    tofu: ["tofu", "doufu", "tauhu", "to-fu", "beignets de soja"],
    epices: {
        includes: ["paprika", "cumin", "safran", "cannelle", "clou de girofle", "ras el hanout", "curry", "curcuma", "gingembre", "anis étoilé", "poivre", "baies de genièvre", "quatre-épices", "moutarde", "cardamome", "galanga", "pâte de roucou", "achiote", "sumac", "fenugrec", "fenouil", "tamarin", "cinq-épices", "amchur", "grains de paradis", "asafoetida", "hing", "ajwain", "mastic", "noix de muscade", "anis", "coriandre (graines)"],
        excludes: ["huile de sésame"]
    },
    herbes: {
        includes: ["thym", "laurier", "coriandre", "persil", "romarin", "basilic", "aneth", "menthe", "origan", "sauge", "citronnelle", "feuilles de curry", "feuilles de combava", "pandan", "marjolaine", "sarriette", "ciboulette", "estragon", "livèche", "épazote", "kra pao", "ciboule", "guascas", "uziza", "utazi", "rau ram", "kroeung"],
        excludes: ["coriandre (graines)"]
    },
    riz: {
        includes: ["riz", "galettes de riz", "poudre de riz grillé"],
        excludes: ["vinaigre de riz", "farine de riz", "nouilles de riz", "vermicelles de riz", "vin de riz"]
    },
    cereales: {
        includes: ["quinoa", "semoule", "couscous", "millet", "orge", "blé", "avoine", "polenta", "sarrasin", "pain", "chapelure", "seigle", "farine", "farine de maïs", "cornmeal", "boulgour", "masa", "masa harina", "hominy", "freekeh"],
        excludes: ["farine de riz", "farine de pois chiches"]
    },
    pates: {
        includes: ["pâtes", "nouilles", "vermicelles", "orzo", "ramen", "udon", "spätzle", "spaghetti", "lasagnes", "cannelloni", "gnocchi", "macaroni", "wonton", "soba", "knedlíky", "bucatini", "busiate", "pizzoccheri", "reshteh", "trahanas", "kadayıf"],
        excludes: ["nouilles de riz", "vermicelles de riz", "vermicelles de soja", "nouilles de patate douce"]
    },
    legumineuse: {
        includes: ["haricot", "lentille", "pois chiche", "fève", "pois cassés", "pois", "haricots mungo", "tofu", "graines de courge", "pepitas", "cacahuètes", "arachide", "soja", "farine de pois chiches", "besan", "tempeh", "tahini", "sésame", "pignons de pin", "pâte d'arachide"],
        excludes: ["haricots verts", "haricots longs", "petits pois", "sauce soja", "lait de soja", "huile de sésame", "huile d'arachide"]
    },
    champignons: ["champignon", "champignons", "shiitake", "pleurotes", "cèpes", "girolles", "morilles", "truffe", "champignons de Paris", "champignons noirs", "oreilles de Judas", "kikurage", "enoki"],
    epice_piquant: ["piment", "piments", "pimentée", "piquant", "harissa", "gochugaru", "gochujang", "doubanjiang", "berbéré", "épices cajun", "cajun", "sambal", "sriracha", "piment de Cayenne", "cayenne", "chili", "poudre de chili", "pâte de chili", "huile de piment", "scotch bonnet", "habanero", "serrano", "jalapeño", "jalapeños", "ancho", "guajillo", "pasilla", "poblano", "guindilla", "guindillas", "aji amarillo", "aji panca", "aji limo", "siling labuyo", "siling haba", "piment oiseau", "pul biber", "piment d'Alep", "piment du Cachemire", "Kashmiri", "paprika (fort)", "poivre du Sichuan", "pâte de curry rouge", "pâte de curry vert", "pâte de curry jaune", "pâte de Laksa", "Nam Prik Pao", "sauce pimentée", "Rotel", "sahawiq", "Tom Yum", "Colombo", "Mitmita"],
    vegetarien: []
};

function containsKeyword(text, keyword) {
    const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const regex = new RegExp(
        `(^|[^\\p{L}\\p{N}])${escaped}([^\\p{L}\\p{N}]|$)`,
        'iu'
    );

    return regex.test(text);
}

// 2. Copiez votre fonction generateTags ici
function generateTags(recipe) {
    const tags = new Set();
    const ingredientsLower = recipe.ingredients.join(' ').toLowerCase(); 
    const recipeId = recipe.id;
    
    let hasViande = false;
    let hasPoisson = false;
    let isKnownVeggie = false; 

    // IDs Végétariens connus (basé sur la base de données fournie)
    const allKnownVeggieIDs = new Set([
        76, 80, 85, 102, 111, 131, 132, 179, 180, 185, 186, 212, 216, 245,
    246, 254, 269, 275, 279, 283, 284, 286, 293, 294, 296, 311, 316, 317,
    318, 321, 322, 323, 336, 338, 340, 358, 366, 388, 424, 426, 444, 455,
    459, 465, 489, 506, 510, 511, 514, 516, 526, 535, 540, 543, 549, 551,
    552, 556, 567, 569, 571, 575, 577, 587, 588, 592, 593, 594, 640, 647,
    657, 658, 661, 667, 677, 682, 685, 699, 705, 709, 713, 716, 717, 726,
    727, 728, 733, 766, 769, 780, 784, 800, 815, 821, 828, 837, 839, 840,
    843, 845, 847, 853, 857, 859, 860, 868, 873, 874, 877, 878, 881, 882,
    883, 885, 887, 888, 889, 890, 893, 894, 895, 896, 897, 898, 902, 903,
    908, 911, 912, 914, 917, 920, 921, 926, 928, 931, 932, 933, 935, 936,
    939, 941, 950, 952, 954, 956, 960, 963, 964, 968, 971, 972, 976, 980,
    984, 991, 995, 996, 997, 1002, 1010, 1013, 1024, 1025, 1029, 1030, 1036, 1039,
    1042, 1044, 1049, 1051, 1053, 1055, 1056, 1058, 1059, 1060, 1064, 1066,
    1067, 1068, 1069, 1071, 1072, 1073, 1075, 1078, 1085, 1101, 1103, 1108,
    1109, 1110, 1111, 1112, 1113, 1115, 1116, 1120, 1123, 1127, 1131, 1135,
    1136, 1138, 1139, 1142, 1144, 1145, 1148, 1150, 1151, 1158, 1159, 1161,
    1162, 1168, 1169, 1171, 1172, 1179, 1180, 1182, 1183, 1184, 1185, 1186,
    1187, 1188, 1189, 1190, 1191, 1192, 1193, 1194, 1197, 1199, 1204, 1205,
    1206, 1207, 1210, 1211, 1212, 1213, 1214, 1215, 1216, 1217, 1222, 1225,
    1226, 1227, 1236, 1238, 1245, 1247, 1248, 1249, 1250, 1251, 1255, 1257,
    1259, 1260, 1261, 1265, 1267, 1269, 1270, 1272, 1273, 1275, 1277, 1278,
    1290, 1291, 1292, 1293, 1298, 1300, 1301, 1302, 1305, 1309, 1310, 1315,
    1317, 1320, 1325, 1326, 1328, 1330, 1331, 1333, 1334, 1336, 1337, 1338,
    1339, 1344, 1345, 1347, 1348, 1350, 1351, 1352, 1353, 1354, 1355, 1356,
    1375, 1383, 1384, 1385, 1386, 1387, 1396, 1397, 1399, 1400, 1401, 1402,
    1403, 1404, 1405, 1406, 1408, 1409, 1410, 1413, 1415, 1416, 1418, 1420,
    1423, 1429, 1430, 1442, 1443, 1445, 1452, 1458, 1464, 1465, 1466, 1468,
    1469, 1470, 1471, 1472, 1476, 1480, 1481, 1488, 1489, 1497, 1498, 1499,
    1500, 1501, 1502, 1503, 1504, 1505, 1506, 1507, 1508, 1509, 1510, 1511,
    1512, 1513, 1514, 1515, 1520, 1521, 1525, 1526, 1527, 1528, 1529, 1530,
    1531, 1532, 1536, 1537, 1539, 1545, 1547, 1548, 1549, 1550, 1551, 1553,
    1554, 1555, 1558, 1562, 1563, 1566, 1567, 1568, 1569, 1572, 1574, 1577,
    1578, 1582, 1583, 1584, 1588, 1594, 1595, 1598, 1599, 1600, 1601, 1605,
    1609, 1610, 1612, 1614, 1618, 1620, 1624, 1626, 1629, 1636, 1644, 1656,
    1682, 1701, 1702, 1713, 1714, 1720, 1721, 1724, 1725, 1726, 1727, 1728,
    1729, 1730, 1731, 1732, 1734, 1735, 1736, 1739, 1740, 1741, 1743, 1744,
    1745, 1750, 1751, 1752, 1754, 1755, 1756, 1758, 1759, 1760, 1761, 1762,
    1763, 1764, 1765, 1766, 1768, 1769, 1770, 1771, 1772, 1773, 1774, 1776,
    1777, 1778, 1779, 1780, 1781, 1782, 1788, 1790, 1791, 1794, 1795, 1796,
    1804, 1807, 1808, 1811, 1812, 1813, 1820, 1821, 1822, 1824, 1833, 1847,
    1852, 1854, 1855, 1857, 1860, 1862, 1863, 1864, 1865, 1867, 1868, 1869,
    1873, 1874, 1875, 1877, 1878, 1879, 1885, 1890, 1891, 1895, 1898, 1902,
    1903, 1904, 1910, 1913, 1917, 1922, 1923, 1931, 1936, 1939, 1940, 1943,
    1953, 1956, 1957, 1960, 1967, 1980, 1992, 2008, 2009, 2011, 2019, 2021,
    2027, 2029, 2031, 2040, 2044, 2065, 2066, 2067, 2068, 2069, 2070, 2071,
    2072, 2073, 2074, 2075, 2076, 2077, 2078, 2079, 2080, 2081, 2082, 2083,
    2084, 2085, 2086, 2087, 2099, 2100, 2101, 2103, 2104, 2105, 2106, 2108,
    2109, 2111, 2112, 2114, 2115, 2116, 2117, 2118, 2119, 2125, 2149, 2150,
    2152, 2153, 2154, 2155, 2158, 2159, 2160, 2161, 2162, 2163, 2164, 2165,
    2171, 2174, 2182, 2184, 2185, 2198, 2204, 2205, 2219, 2221, 2222, 2231,
    2232, 2233, 2234, 2235, 2236, 2237, 2239, 2241, 2242, 2243, 2244, 2245,
    2252, 2253, 2254, 2255, 2256, 2257, 2259, 2261, 2262, 2263, 2264, 2265,
    2268, 2272, 2277, 2278, 2279, 2280, 2281, 2284, 2285, 2291, 2292, 2295,
    2296, 2297, 2298, 2299, 2302, 2311, 2312, 2313, 2314, 2336, 2340, 2341,
    2342, 2344, 2345
    ]);

    if (allKnownVeggieIDs.has(recipeId)) {
        isKnownVeggie = true;
    }

    for (const [tag, config] of Object.entries(tagDefinitions)) {
        if (tag === 'vegetarien') continue;
        const includesKeywords = Array.isArray(config) ? config : config.includes;
        const excludesKeywords = Array.isArray(config) ? [] : (config.excludes || []);

        if (includesKeywords.some(keyword =>
    containsKeyword(ingredientsLower, keyword.toLowerCase())
)) {
    const isExcluded = excludesKeywords.some(excludeKeyword =>
        containsKeyword(ingredientsLower, excludeKeyword.toLowerCase())
    );

    if (!isExcluded) {
        tags.add(tag);

        if (tag === 'viande') hasViande = true;

        if (tag === 'poisson' || tag === 'fruit_de_mer') {
            hasPoisson = true;
        }
    }
}
    }
    
    if (isKnownVeggie || ingredientsLower.includes("végétarien")) {
    tags.add('vegetarien');
}
    
    return Array.from(tags);
}


// 3. L'écouteur principal du worker
self.onmessage = function(e) {
    const { type, payload } = e.data;

    if (type === 'LOAD_DATA') {
        // Reçoit la base complète des recettes
        let data = payload;
        
        // Génère les tags UNE SEULE FOIS (le travail lent)
        data.forEach(recipe => {
            recipe.tags = generateTags(recipe);
        });
        
        allRecipes = data; // Sauvegarde les recettes tagguées
        console.log('Worker: Données chargées et tagguées.');
    } 
    else if (type === 'FILTER') {
        // Filtre les données (rapide, car les tags existent)
        const filtered = filterData(payload.filters, payload.selectedRecipeTypes);
        
        // Renvoie les résultats à la page
        self.postMessage(filtered);
    }
};

// 4. La logique de filtrage (copiée de votre script)
function filterData(filters, selectedRecipeTypes) {
    const filteredRecipes = allRecipes.filter(recipe => {
        // 1. Filtre Type de Plat
        if (selectedRecipeTypes.length === 0 || !selectedRecipeTypes.includes(recipe.type)) return false;
        
        // 2. Filtre Continent
        if (filters.continent !== 'Tous' && recipe.continent !== filters.continent) return false;
        
        // 3. Filtre Pays
        if (filters.country !== 'Tous' && recipe.country !== filters.country) return false;
        
        // 4. Filtre Temps
        if (recipe.prepTime > filters.maxTime) return false;

        // --- NOUVEAU : 5. Recherche par mot-clé dans les ingrédients ---
        if (filters.ingredientQuery && filters.ingredientQuery.trim() !== '') {
            const query = filters.ingredientQuery.toLowerCase();
            const matchesQuery = recipe.ingredients.some(ing => 
                ing.toLowerCase().includes(query)
            );
            if (!matchesQuery) return false;
        }

        // 6. Filtre Tags (Tofu, Viande, etc.)
        if (filters.tags.length > 0 && !filters.tags.every(tag => recipe.tags.includes(tag))) return false;
        
        return true;
    });

    // 7. Tri
    filteredRecipes.sort((a, b) => {
        const countryComparison = a.country.localeCompare(b.country, 'fr', { sensitivity: 'base' });
        if (countryComparison !== 0) return countryComparison;
        return a.name.localeCompare(b.name, 'fr', { sensitivity: 'case' });
    });

    return filteredRecipes;
}
