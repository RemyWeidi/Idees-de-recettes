// filter.worker.js

let allRecipes = [];

// 1. Copiez vos définitions de tags ici
const tagDefinitions = {
    viande: ["viande", "viandes","bœuf", "beef", "agneau", "porc", "poulet", "veau", "canard", "lapin", "chèvre", "mouton", "saucisse", "lardons", "gibier", "os à moelle", "queue de bœuf", "tripes", "coq", "poule", "jambon", "spam", "cheval", "kefta", "pancetta", "confit", "lard", "renne", "bacon", "kangourou", "döner", "chorizo", "merguez", "dumba", "wurst", "gammon", "corned beef", "andouille", "boudin", "morcilla", "chouriço", "farinheira", "carne seca", "foie", "tête de porc", "joue", "oreille", "gosht", "char siu", "boerewors", "sang", "saindoux", "suif", "rognons", "graisse", "graisse de bœuf", "graisse d'oie", "Bouillon de bœuf", "Bouillon de poulet", "Bouillon de porc"],
    poisson: ["poisson", "poissons", "haddock fumé", "lotte", "thon", "anchois", "saumon", "poissons de roche", "morue", "maquereau", "anguille", "sériole", "barramundi", "congre", "mahimahi", "thiof", "flocons de bonite", "katsuobushi", "ikan bilis", "cabillaud", "sole", "bar", "vivaneau", "truite", "sardine", "hareng", "tilapia"],
    fruit_de_mer: ["crevette", "crevettes", "moule", "moules", "palourde", "palourdes", "crabe", "calamar", "calamars", "fruits de mer", "seiche", "gambas", "écrevisse", "écrevisses", "homard", "huître", "huîtres", "poulpe", "coque", "coques", "pâte de crevette", "bagoong", "terasi", "mắm ruốc", "yet", "surimi", "oursin", "œufs de poisson", "tobiko", "œufs de saumon", "ikura", "belacan", "langoustine", "pétoncle", "coquille saint-jacques", "lambi"],
    oeuf: ["œuf", "oeuf", "œufs", "oeufs", "jaune d'œuf", "blancs d'œufs", "œuf dur", "œufs durs", "omelette", "œufs de caille"],
    legumes: {
        includes: ["carotte", "oignon", "poireau", "tomate", "aubergine", "chou", "pomme de terre", "poivron", "céleri", "navet", "ail", "courge", "betterave", "olive", "maïs", "rutabaga", "panais", "cornichon", "okra", "gombo", "radis", "manioc", "plantain", "igname", "kimchi", "choucroute", "épinard", "kumara", "potiron", "artichaut", "concombre", "roquette", "cresson", "liseron d'eau", "orties", "oseille", "daikon", "konjac", "racine de lotus", "renkon", "gobo", "racine de bardane", "tomatillo", "chayotte", "mu er", "germes de soja", "feuilles de taro", "taro", "papaye verte", "jicama", "fleur de bananier", "algues", "wakame", "nori", "kombu", "cavolo nero", "nopales", "cardons", "poire coréenne", "jujubes", "haricots verts", "haricots longs", "petits pois"],
        excludes: ["pois chiches", "pois cassés", "haricots (lingots)", "haricots (Tarbais)", "haricots (Fabas)", "haricots (borlotti)", "haricots (cannellini)", "haricots (secs)", "farine de pois chiches", "champignon", "champignons", "shiitake", "pleurotes", "cèpes", "girolles", "morilles", "truffe", "champignons de Paris", "champignons noirs", "oreilles de Judas", "kikurage", "enoki"]
    },
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
        includes: ["quinoa", "semoule", "couscous", "millet", "orge", "blé", "avoine", "polenta", "sarrasin", "pain", "chapelure", "seigle", "farine", "farine de maïs", "cornmeal"],
        excludes: ["farine de riz", "farine de pois chiches"]
    },
    pates: {
        includes: ["pâtes", "nouilles", "vermicelles", "orzo", "ramen", "udon", "spätzle", "spaghetti", "lasagnes", "cannelloni", "gnocchi", "macaroni", "wonton", "soba", "knedlíky"],
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
        76, 80, 85, 102, 111, 131, 132, 179, 180, 185, 186, 200, 212, 216, 227, 229, 245, 
        246, 254, 264, 266, 279, 283, 284, 293, 294, 296, 308, 310, 311, 312, 313, 
        316, 317, 318, 321, 322, 323, 334, 336, 338, 339, 340, 351, 358, 366, 
        371, 384, 388, 398, 406, 465, 506, 511, 515, 518, 526, 540, 549, 551,
        561, 567, 568, 569, 575, 577, 587, 592, 593, 594, 606, 640, 658, 660,
        661, 667, 677, 682, 684, 685, 698, 699, 709, 717, 740, 766, 769, 777,
        780, 795, 800, 809, 810, 815, 821, 827, 828, 833, 834, 837, 839, 840,
        843, 845, 847, 851, 857, 859, 860, 868, 870, 874, 878, 881, 882, 883,
        887, 888, 889, 893, 894, 895, 896, 897, 898, 901, 902, 903, 908, 911,
        912, 917, 920, 921, 926, 936, 939, 952, 963, 964, 968, 971, 982, 984,
        986, 987, 991, 995, 996, 997, 1010, 1024, 1025, 1029, 1036, 1039, 1051,
        1053, 1058, 1059, 1060, 1061, 1064, 1066, 1068, 1069, 1071, 1072, 1073,
        1074, 1075, 1078, 1085, 1087, 1092, 1093, 1102, 1103, 1108, 1109, 1111,
        1112, 1113, 1115, 1116, 1120, 1123, 1133, 1135, 1136, 1138, 1139, 1142,
        1144, 1145, 1148, 1150, 1151, 1162, 1172, 1182, 1183, 1184, 1185, 1186,
        1187, 1188, 1189, 1190, 1191, 1192, 1193, 1194, 1197, 1205, 1206, 1207,
        1210, 1211, 1212, 1213, 1214, 1215, 1216, 1223, 1224, 1227, 1230, 1232,
        1236, 1238, 1245, 1247, 1248, 1249, 1250, 1251, 1259, 1260, 1261, 1265,
        1267, 1269, 1270, 1272, 1273, 1276, 1277, 1278, 1282, 1300, 1301, 1302,
        1305, 1309, 1310, 1315, 1317, 1323, 1324, 1325, 1326, 1328, 1330, 1331,
        1332, 1333, 1334, 1335, 1336, 1337, 1338, 1339, 1340, 1341, 1343, 1344,
        1345, 1346, 1347, 1348, 1349, 1350, 1351, 1352, 1353, 1354, 1355, 1356,
        1357, 1361, 1364, 1365, 1366, 1367, 1368, 1369, 1370, 1373, 1375, 1383,
        1384, 1385, 1386, 1387, 1393, 1396, 1397, 1398, 1399, 1400, 1401, 1402,
        1403, 1404, 1405, 1406, 1408, 1409, 1410, 1411, 1412, 1413, 1414, 1415,
        1416, 1418, 1419, 1420, 1422, 1423, 1424, 1426, 1427, 1428, 1429, 1430,
        1431, 1432, 1433, 1434, 1435, 1436, 1437, 1438, 1442, 1443, 1444, 1445,
        1448, 1449, 1451, 1452, 1455, 1456, 1457, 1458, 1459, 1464, 1465, 1466,
        1467, 1468, 1469, 1470, 1471, 1472, 1480, 1481, 1485, 1488, 1489, 1493,
        1497, 1498, 1499, 1500, 1501, 1502, 1503, 1504, 1505, 1506, 1507, 1508,
        1509, 1510, 1511, 1512, 1513, 1514, 1515, 1520, 1521, 1525, 1526, 1527,
        1528, 1529, 1530, 1531, 1532, 1533, 1534, 1536, 1537, 1539, 1582, 1583,
        1584, 1590, 1594, 1595, 1600, 1601, 1605, 1612, 1613, 1618, 1619, 1620,
        1623, 1624, 1626, 1628, 1656, 1682, 1701, 1702, 1706, 1713
    ]);

    if (allKnownVeggieIDs.has(recipeId)) {
        isKnownVeggie = true;
    }

    for (const [tag, config] of Object.entries(tagDefinitions)) {
        if (tag === 'vegetarien') continue;
        const includesKeywords = Array.isArray(config) ? config : config.includes;
        const excludesKeywords = Array.isArray(config) ? [] : (config.excludes || []);

        if (includesKeywords.some(keyword => ingredientsLower.includes(keyword))) {
            const isExcluded = excludesKeywords.some(excludeKeyword => ingredientsLower.includes(excludeKeyword));
            if (!isExcluded) {
                tags.add(tag);
                if (tag === 'viande') hasViande = true;
                if (tag === 'poisson' || tag === 'fruit_de_mer') hasPoisson = true;
            }
        }
    }
    
    if (!hasViande && !hasPoisson) {
        if (isKnownVeggie || ingredientsLower.includes("végétarien")) {
             tags.add('vegetarien');
        }
    }
    
    return Array.from(tags);
}


// 3. L'écouteur principal du worker
self.onmessage = function(e) {
    const { type, payload } = e.data;

    if (type === 'LOAD_DATA') {
        // Reçoit les 1723 recettes
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
        if (selectedRecipeTypes.length === 0 || !selectedRecipeTypes.includes(recipe.type)) {
            return false;
        }
        // 2. Filtre Continent
        if (filters.continent !== 'Tous' && recipe.continent !== filters.continent) {
            return false;
        }
        // 3. Filtre Pays
        if (filters.country !== 'Tous' && recipe.country !== filters.country) {
            return false;
        }
        // 4. Filtre Temps
        if (recipe.prepTime > filters.maxTime) {
            return false;
        }
        // 5. Filtre Tags (utilise les tags pré-calculés)
        if (filters.tags.length > 0 && !filters.tags.every(tag => recipe.tags.includes(tag))) {
            return false;
        }
        
        return true;
    });

    // 6. Tri (le faire ici réduit le travail du thread principal)
    filteredRecipes.sort((a, b) => {
        const countryComparison = a.country.localeCompare(b.country, 'fr', { sensitivity: 'base' });
        if (countryComparison !== 0) return countryComparison;
        return a.name.localeCompare(b.name, 'fr', { sensitivity: 'case' });
    });

    return filteredRecipes;
}