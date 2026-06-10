// Seeded agricultural knowledge base. In a real build this comes from the admin module.

export type GrowthStage = {
  name: string;
  startDay: number;   // days after planting
  endDay: number;
  notes: string;
};

export type ScheduleTemplate = {
  activity: string;
  dayOffset: number;       // days after planting
  category: "land" | "planting" | "irrigation" | "fertilizer" | "weeding" | "pest" | "disease" | "harvest" | "soil";
  notes?: string;
};

export type Pest = { name: string; symptoms: string; prevention: string; treatment: string };
export type Disease = { name: string; symptoms: string; cause: string; prevention: string; treatment: string };

export type Crop = {
  id: string;
  name: string;
  emoji: string;
  family: string;
  maturityDays: number;
  varieties: { name: string; maturityDays: number; notes: string }[];
  conditions: { temperature: string; rainfall: string; soil: string; altitude: string };
  fertilizer: { stage: string; product: string; rate: string }[];
  irrigation: string;
  harvesting: string;
  expectedYield: string;
  pests: Pest[];
  diseases: Disease[];
  schedule: ScheduleTemplate[];
  growthStages: GrowthStage[];
};

export const CROPS: Crop[] = [
  {
    id: "cabbage",
    name: "Cabbage",
    emoji: "🥬",
    family: "Brassicaceae",
    maturityDays: 90,
    varieties: [
      { name: "Gloria F1", maturityDays: 75, notes: "Compact heads, good for markets" },
      { name: "Copenhagen Market", maturityDays: 90, notes: "Round heads, heat tolerant" },
      { name: "Pruktor F1", maturityDays: 85, notes: "Disease resistant, uniform" },
    ],
    conditions: {
      temperature: "15–20°C optimum",
      rainfall: "500–700 mm during growing season",
      soil: "Well-drained loam, pH 6.0–6.8",
      altitude: "1000–2500 m",
    },
    fertilizer: [
      { stage: "Planting", product: "DAP", rate: "200 kg/ha" },
      { stage: "Vegetative (3 weeks)", product: "CAN", rate: "150 kg/ha" },
      { stage: "Head formation (6 weeks)", product: "NPK 17-17-17", rate: "100 kg/ha" },
    ],
    irrigation: "Keep soil consistently moist. 25–40 mm per week, more during head formation.",
    harvesting: "Harvest when heads are firm and solid. Cut at base, leaving outer leaves.",
    expectedYield: "30–60 tonnes/ha",
    pests: [
      { name: "Diamondback moth", symptoms: "Holes in leaves, small green caterpillars", prevention: "Crop rotation, intercrop with onions", treatment: "Spray Bt or spinosad weekly" },
      { name: "Aphids", symptoms: "Curled yellow leaves, sticky residue", prevention: "Reflective mulch, encourage ladybugs", treatment: "Insecticidal soap or neem oil" },
      { name: "Cutworms", symptoms: "Seedlings cut at soil line at night", prevention: "Plastic collars around transplants", treatment: "Apply diatomaceous earth or Bt" },
    ],
    diseases: [
      { name: "Black rot", symptoms: "V-shaped yellow lesions on leaf edges", cause: "Xanthomonas bacteria", prevention: "Use certified seed, 3-year rotation", treatment: "Remove infected plants, copper sprays" },
      { name: "Clubroot", symptoms: "Wilting, swollen distorted roots", cause: "Soil fungus, acidic soils", prevention: "Lime to pH 7+, long rotations", treatment: "No cure — remove plants, solarize soil" },
      { name: "Downy mildew", symptoms: "Yellow patches on top, fuzzy growth underneath", cause: "Wet humid conditions", prevention: "Wider spacing, morning irrigation", treatment: "Copper-based fungicide" },
    ],
    growthStages: [
      { name: "Establishment", startDay: 0, endDay: 14, notes: "Seedlings root and harden" },
      { name: "Vegetative", startDay: 15, endDay: 45, notes: "Rapid leaf growth" },
      { name: "Head formation", startDay: 46, endDay: 75, notes: "Heads tighten and fill" },
      { name: "Maturity", startDay: 76, endDay: 90, notes: "Heads firm, ready to harvest" },
    ],
    schedule: [
      { activity: "Land preparation & bed forming", dayOffset: -7, category: "land" },
      { activity: "Soil test sampling", dayOffset: -10, category: "soil", notes: "Take samples from 5 spots, 15cm depth" },
      { activity: "Transplant seedlings", dayOffset: 0, category: "planting" },
      { activity: "Apply DAP at planting", dayOffset: 0, category: "fertilizer" },
      { activity: "First irrigation", dayOffset: 1, category: "irrigation" },
      { activity: "First weeding", dayOffset: 14, category: "weeding" },
      { activity: "Top-dress with CAN", dayOffset: 21, category: "fertilizer" },
      { activity: "Scout for diamondback moth", dayOffset: 28, category: "pest" },
      { activity: "Second weeding & earthing up", dayOffset: 35, category: "weeding" },
      { activity: "NPK at head formation", dayOffset: 42, category: "fertilizer" },
      { activity: "Disease scout — black rot & downy mildew", dayOffset: 50, category: "disease" },
      { activity: "Reduce irrigation as heads firm", dayOffset: 70, category: "irrigation" },
      { activity: "Harvest first heads", dayOffset: 85, category: "harvest" },
    ],
  },
  {
    id: "maize",
    name: "Maize",
    emoji: "🌽",
    family: "Poaceae",
    maturityDays: 120,
    varieties: [
      { name: "DK 8031", maturityDays: 120, notes: "Drought tolerant, high yielding" },
      { name: "H614", maturityDays: 150, notes: "Highland variety, large cobs" },
      { name: "Pioneer 30G19", maturityDays: 110, notes: "Early maturing" },
    ],
    conditions: {
      temperature: "18–27°C",
      rainfall: "500–900 mm well distributed",
      soil: "Deep loam, pH 5.5–7.0",
      altitude: "0–2400 m depending on variety",
    },
    fertilizer: [
      { stage: "Planting", product: "DAP", rate: "125 kg/ha" },
      { stage: "Knee-high (30 days)", product: "CAN or Urea", rate: "100 kg/ha" },
      { stage: "Tasseling (60 days)", product: "CAN", rate: "100 kg/ha" },
    ],
    irrigation: "Critical at tasseling and grain fill. 500–800 mm total.",
    harvesting: "When husks dry and grain moisture is 18–20%. Sun-dry to 13%.",
    expectedYield: "4–8 tonnes/ha rainfed, up to 12 t/ha irrigated",
    pests: [
      { name: "Fall armyworm", symptoms: "Ragged holes in whorl, sawdust frass", prevention: "Early planting, push-pull intercropping", treatment: "Spray emamectin benzoate at whorl" },
      { name: "Stem borer", symptoms: "Pinholes in leaves, dead heart", prevention: "Destroy stubble, rotate", treatment: "Granular insecticide in whorl" },
    ],
    diseases: [
      { name: "Maize streak virus", symptoms: "Yellow streaks parallel to veins", cause: "Leafhopper vector", prevention: "Resistant varieties, control hoppers", treatment: "Remove infected plants" },
      { name: "Gray leaf spot", symptoms: "Rectangular gray lesions", cause: "Cercospora fungus", prevention: "Rotation, tillage", treatment: "Triazole fungicide" },
    ],
    growthStages: [
      { name: "Germination", startDay: 0, endDay: 10, notes: "Emergence" },
      { name: "Vegetative", startDay: 11, endDay: 55, notes: "Leaf development" },
      { name: "Tasseling & silking", startDay: 56, endDay: 75, notes: "Reproductive stage" },
      { name: "Grain fill", startDay: 76, endDay: 110, notes: "Kernels fill" },
      { name: "Maturity", startDay: 111, endDay: 120, notes: "Black layer formation" },
    ],
    schedule: [
      { activity: "Land preparation", dayOffset: -10, category: "land" },
      { activity: "Soil test sampling", dayOffset: -14, category: "soil" },
      { activity: "Plant with DAP", dayOffset: 0, category: "planting" },
      { activity: "First weeding", dayOffset: 18, category: "weeding" },
      { activity: "Top-dress CAN at knee-high", dayOffset: 30, category: "fertilizer" },
      { activity: "Scout for fall armyworm", dayOffset: 35, category: "pest" },
      { activity: "Second weeding & earthing up", dayOffset: 40, category: "weeding" },
      { activity: "CAN at tasseling", dayOffset: 60, category: "fertilizer" },
      { activity: "Disease scout — gray leaf spot", dayOffset: 70, category: "disease" },
      { activity: "Harvest", dayOffset: 115, category: "harvest" },
    ],
  },
  {
    id: "tomato",
    name: "Tomato",
    emoji: "🍅",
    family: "Solanaceae",
    maturityDays: 90,
    varieties: [
      { name: "Anna F1", maturityDays: 75, notes: "Determinate, disease resistant" },
      { name: "Rio Grande", maturityDays: 85, notes: "Processing variety" },
      { name: "Money Maker", maturityDays: 90, notes: "Indeterminate, fresh market" },
    ],
    conditions: {
      temperature: "20–25°C",
      rainfall: "Avoid heavy rain; prefer irrigation",
      soil: "Loam, pH 6.0–6.8",
      altitude: "0–2100 m",
    },
    fertilizer: [
      { stage: "Transplanting", product: "DAP", rate: "200 kg/ha" },
      { stage: "Flowering", product: "NPK 17-17-17", rate: "150 kg/ha" },
      { stage: "Fruiting", product: "CAN + foliar Ca", rate: "100 kg/ha" },
    ],
    irrigation: "Drip preferred. 400–600 mm consistent moisture; avoid wet foliage.",
    harvesting: "Pick at breaker stage for transport, vine-ripe for local sale.",
    expectedYield: "40–80 tonnes/ha",
    pests: [
      { name: "Tuta absoluta", symptoms: "Mines in leaves, holes in fruit", prevention: "Pheromone traps, sanitation", treatment: "Spinosad or chlorantraniliprole" },
      { name: "Whitefly", symptoms: "Yellowing, sooty mold, virus transmission", prevention: "Reflective mulch, yellow traps", treatment: "Neem, imidacloprid" },
    ],
    diseases: [
      { name: "Late blight", symptoms: "Water-soaked lesions, white mold underside", cause: "Phytophthora in cool wet weather", prevention: "Resistant varieties, airflow", treatment: "Mancozeb or copper preventively" },
      { name: "Blossom-end rot", symptoms: "Dark sunken patch on fruit base", cause: "Calcium deficiency / uneven water", prevention: "Mulch, steady irrigation, lime", treatment: "Foliar calcium sprays" },
    ],
    growthStages: [
      { name: "Establishment", startDay: 0, endDay: 14, notes: "Transplant recovery" },
      { name: "Vegetative", startDay: 15, endDay: 35, notes: "Bush growth" },
      { name: "Flowering", startDay: 36, endDay: 55, notes: "Trusses set" },
      { name: "Fruiting", startDay: 56, endDay: 90, notes: "Fruit develops and ripens" },
    ],
    schedule: [
      { activity: "Prepare nursery / raised beds", dayOffset: -14, category: "land" },
      { activity: "Transplant seedlings", dayOffset: 0, category: "planting" },
      { activity: "DAP at planting", dayOffset: 0, category: "fertilizer" },
      { activity: "Install stakes / trellis", dayOffset: 14, category: "land" },
      { activity: "First weeding & mulching", dayOffset: 18, category: "weeding" },
      { activity: "Scout for Tuta & whitefly", dayOffset: 25, category: "pest" },
      { activity: "NPK at flowering", dayOffset: 35, category: "fertilizer" },
      { activity: "Preventive fungicide for blight", dayOffset: 45, category: "disease" },
      { activity: "CAN + foliar calcium at fruit set", dayOffset: 55, category: "fertilizer" },
      { activity: "Begin harvest", dayOffset: 75, category: "harvest" },
    ],
  },
  {
    id: "beans",
    name: "Beans",
    emoji: "🫘",
    family: "Fabaceae",
    maturityDays: 75,
    varieties: [
      { name: "Rosecoco", maturityDays: 75, notes: "Bush type, market favourite" },
      { name: "Mwitemania", maturityDays: 80, notes: "Drought tolerant" },
      { name: "KK8", maturityDays: 70, notes: "Early bush bean" },
    ],
    conditions: {
      temperature: "18–24°C",
      rainfall: "300–500 mm",
      soil: "Well-drained loam, pH 6.0–7.0",
      altitude: "1000–2100 m",
    },
    fertilizer: [
      { stage: "Planting", product: "DAP", rate: "100 kg/ha" },
      { stage: "Flowering", product: "Foliar NPK", rate: "as label" },
    ],
    irrigation: "Drought sensitive at flowering and pod fill. 250–400 mm total.",
    harvesting: "Pull plants when 90% pods are dry. Thresh and winnow.",
    expectedYield: "1.5–2.5 tonnes/ha",
    pests: [
      { name: "Bean fly", symptoms: "Wilting seedlings, swollen stem base", prevention: "Early planting, seed dressing", treatment: "Imidacloprid seed treatment" },
      { name: "Aphids", symptoms: "Curled shoots, sticky residue", prevention: "Encourage beneficials", treatment: "Neem or insecticidal soap" },
    ],
    diseases: [
      { name: "Bean rust", symptoms: "Reddish-brown pustules on leaves", cause: "Uromyces fungus", prevention: "Resistant varieties, rotation", treatment: "Mancozeb sprays" },
      { name: "Anthracnose", symptoms: "Dark sunken lesions on pods and stems", cause: "Seed-borne fungus", prevention: "Clean seed, rotation", treatment: "Copper fungicide" },
    ],
    growthStages: [
      { name: "Germination", startDay: 0, endDay: 8, notes: "Emergence" },
      { name: "Vegetative", startDay: 9, endDay: 30, notes: "Trifoliate growth" },
      { name: "Flowering", startDay: 31, endDay: 45, notes: "Critical water stage" },
      { name: "Pod fill", startDay: 46, endDay: 70, notes: "Pods develop" },
      { name: "Maturity", startDay: 71, endDay: 75, notes: "Pods dry down" },
    ],
    schedule: [
      { activity: "Land preparation", dayOffset: -7, category: "land" },
      { activity: "Plant with DAP", dayOffset: 0, category: "planting" },
      { activity: "First weeding", dayOffset: 14, category: "weeding" },
      { activity: "Scout for bean fly & aphids", dayOffset: 18, category: "pest" },
      { activity: "Second weeding", dayOffset: 28, category: "weeding" },
      { activity: "Foliar feed at flowering", dayOffset: 35, category: "fertilizer" },
      { activity: "Disease scout — rust & anthracnose", dayOffset: 45, category: "disease" },
      { activity: "Harvest dry pods", dayOffset: 72, category: "harvest" },
    ],
  },
  {
    id: "kale",
    name: "Kale (Sukuma)",
    emoji: "🥗",
    family: "Brassicaceae",
    maturityDays: 60,
    varieties: [
      { name: "Collard Southern Georgia", maturityDays: 60, notes: "Continuous picking 6+ months" },
      { name: "Thousand-Headed", maturityDays: 75, notes: "Branching habit" },
    ],
    conditions: {
      temperature: "15–25°C",
      rainfall: "500 mm",
      soil: "Fertile loam, pH 6.0–7.5",
      altitude: "800–2200 m",
    },
    fertilizer: [
      { stage: "Planting", product: "DAP + compost", rate: "150 kg/ha + 10 t/ha" },
      { stage: "After each picking", product: "CAN", rate: "50 kg/ha" },
    ],
    irrigation: "Frequent light irrigation; never let plants wilt.",
    harvesting: "Pick lower leaves every 1–2 weeks; plants regrow for months.",
    expectedYield: "20–40 tonnes/ha over season",
    pests: [
      { name: "Aphids", symptoms: "Colonies on undersides of leaves", prevention: "Beneficials, reflective mulch", treatment: "Neem or soap sprays" },
      { name: "Diamondback moth", symptoms: "Holes in leaves", prevention: "Crop rotation", treatment: "Bt or spinosad" },
    ],
    diseases: [
      { name: "Black rot", symptoms: "V-shaped yellow lesions", cause: "Xanthomonas", prevention: "Clean seed, rotation", treatment: "Copper sprays, rogue plants" },
    ],
    growthStages: [
      { name: "Establishment", startDay: 0, endDay: 14, notes: "Rooting" },
      { name: "Vegetative", startDay: 15, endDay: 45, notes: "Leaf production" },
      { name: "Continuous harvest", startDay: 46, endDay: 240, notes: "Pick and come again" },
    ],
    schedule: [
      { activity: "Land preparation & compost", dayOffset: -7, category: "land" },
      { activity: "Transplant seedlings", dayOffset: 0, category: "planting" },
      { activity: "DAP at planting", dayOffset: 0, category: "fertilizer" },
      { activity: "First weeding", dayOffset: 14, category: "weeding" },
      { activity: "Scout for aphids", dayOffset: 21, category: "pest" },
      { activity: "First harvest", dayOffset: 50, category: "harvest" },
      { activity: "Top-dress CAN", dayOffset: 55, category: "fertilizer" },
    ],
  },
];

export const getCrop = (id: string) => CROPS.find((c) => c.id === id);
