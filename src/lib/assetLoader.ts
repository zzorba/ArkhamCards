import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

const assetCache: { [key: string]: any } = {};

// Map of asset keys to their require modules
// These files are registered via expo-asset plugin in app.json
const ASSET_MODULES: { [key: string]: any } = {
  'chaosOdds': require('../../assets/generated/chaosOdds.txt'),
  'chaosOdds_es': require('../../assets/generated/chaosOdds_es.txt'),
  'chaosOdds_ru': require('../../assets/generated/chaosOdds_ru.txt'),
  'chaosOdds_fr': require('../../assets/generated/chaosOdds_fr.txt'),
  'chaosOdds_de': require('../../assets/generated/chaosOdds_de.txt'),
  'chaosOdds_it': require('../../assets/generated/chaosOdds_it.txt'),
  'chaosOdds_pt': require('../../assets/generated/chaosOdds_pt.txt'),
  'chaosOdds_pl': require('../../assets/generated/chaosOdds_pl.txt'),
  'chaosOdds_zh': require('../../assets/generated/chaosOdds_zh.txt'),
  'chaosOdds_zh-cn': require('../../assets/generated/chaosOdds_zh-cn.txt'),
  'chaosOdds_ko': require('../../assets/generated/chaosOdds_ko.txt'),
  'chaosOdds_cs': require('../../assets/generated/chaosOdds_cs.txt'),
  'chaosOdds_vi': require('../../assets/generated/chaosOdds_vi.txt'),
  'taboos': require('../../assets/generated/taboos.txt'),
  'taboos_es': require('../../assets/generated/taboos_es.txt'),
  'taboos_de': require('../../assets/generated/taboos_de.txt'),
  'taboos_ru': require('../../assets/generated/taboos_ru.txt'),
  'taboos_fr': require('../../assets/generated/taboos_fr.txt'),
  'taboos_it': require('../../assets/generated/taboos_it.txt'),
  'taboos_zh': require('../../assets/generated/taboos_zh.txt'),
  'taboos_ko': require('../../assets/generated/taboos_ko.txt'),
  'taboos_pt': require('../../assets/generated/taboos_pt.txt'),
  'taboos_pl': require('../../assets/generated/taboos_pl.txt'),
  'taboos_cs': require('../../assets/generated/taboos_cs.txt'),
  'taboos_vi': require('../../assets/generated/taboos_vi.txt'),
  'rules': require('../../assets/generated/rules.txt'),
  'rules_fr': require('../../assets/generated/rules_fr.txt'),
  'rules_es': require('../../assets/generated/rules_es.txt'),
  'rules_ru': require('../../assets/generated/rules_ru.txt'),
  'rules_de': require('../../assets/generated/rules_de.txt'),
  'rules_ko': require('../../assets/generated/rules_ko.txt'),
  'rules_zh': require('../../assets/generated/rules_zh.txt'),
  'rules_zh-cn': require('../../assets/generated/rules_zh-cn.txt'),
  'rules_pl': require('../../assets/generated/rules_pl.txt'),
  'rules_it': require('../../assets/generated/rules_it.txt'),
  'allCampaigns': require('../../assets/generated/allCampaigns.txt'),
  'allCampaigns_de': require('../../assets/generated/allCampaigns_de.txt'),
  'allCampaigns_es': require('../../assets/generated/allCampaigns_es.txt'),
  'allCampaigns_fr': require('../../assets/generated/allCampaigns_fr.txt'),
  'allCampaigns_it': require('../../assets/generated/allCampaigns_it.txt'),
  'allCampaigns_ko': require('../../assets/generated/allCampaigns_ko.txt'),
  'allCampaigns_pl': require('../../assets/generated/allCampaigns_pl.txt'),
  'allCampaigns_pt': require('../../assets/generated/allCampaigns_pt.txt'),
  'allCampaigns_ru': require('../../assets/generated/allCampaigns_ru.txt'),
  'allCampaigns_vi': require('../../assets/generated/allCampaigns_vi.txt'),
  'allCampaigns_zh': require('../../assets/generated/allCampaigns_zh.txt'),
  'allCampaigns_zh-cn': require('../../assets/generated/allCampaigns_zh-cn.txt'),
  'allCampaigns_cs': require('../../assets/generated/allCampaigns_cs.txt'),
  'campaignErrata': require('../../assets/generated/campaignErrata.txt'),
  'campaignErrata_de': require('../../assets/generated/campaignErrata_de.txt'),
  'campaignErrata_es': require('../../assets/generated/campaignErrata_es.txt'),
  'campaignErrata_fr': require('../../assets/generated/campaignErrata_fr.txt'),
  'campaignErrata_it': require('../../assets/generated/campaignErrata_it.txt'),
  'campaignErrata_ko': require('../../assets/generated/campaignErrata_ko.txt'),
  'campaignErrata_pl': require('../../assets/generated/campaignErrata_pl.txt'),
  'campaignErrata_pt': require('../../assets/generated/campaignErrata_pt.txt'),
  'campaignErrata_ru': require('../../assets/generated/campaignErrata_ru.txt'),
  'campaignErrata_vi': require('../../assets/generated/campaignErrata_vi.txt'),
  'campaignErrata_zh': require('../../assets/generated/campaignErrata_zh.txt'),
  'campaignErrata_zh-cn': require('../../assets/generated/campaignErrata_zh-cn.txt'),
  'campaignErrata_cs': require('../../assets/generated/campaignErrata_cs.txt'),
  'campaignLogs': require('../../assets/generated/campaignLogs.txt'),
  'campaignLogs_de': require('../../assets/generated/campaignLogs_de.txt'),
  'campaignLogs_es': require('../../assets/generated/campaignLogs_es.txt'),
  'campaignLogs_fr': require('../../assets/generated/campaignLogs_fr.txt'),
  'campaignLogs_it': require('../../assets/generated/campaignLogs_it.txt'),
  'campaignLogs_ko': require('../../assets/generated/campaignLogs_ko.txt'),
  'campaignLogs_pl': require('../../assets/generated/campaignLogs_pl.txt'),
  'campaignLogs_pt': require('../../assets/generated/campaignLogs_pt.txt'),
  'campaignLogs_ru': require('../../assets/generated/campaignLogs_ru.txt'),
  'campaignLogs_vi': require('../../assets/generated/campaignLogs_vi.txt'),
  'campaignLogs_zh': require('../../assets/generated/campaignLogs_zh.txt'),
  'campaignLogs_zh-cn': require('../../assets/generated/campaignLogs_zh-cn.txt'),
  'campaignLogs_cs': require('../../assets/generated/campaignLogs_cs.txt'),
  'encounterSets': require('../../assets/generated/encounterSets.txt'),
  'encounterSets_de': require('../../assets/generated/encounterSets_de.txt'),
  'encounterSets_es': require('../../assets/generated/encounterSets_es.txt'),
  'encounterSets_fr': require('../../assets/generated/encounterSets_fr.txt'),
  'encounterSets_it': require('../../assets/generated/encounterSets_it.txt'),
  'encounterSets_ko': require('../../assets/generated/encounterSets_ko.txt'),
  'encounterSets_pl': require('../../assets/generated/encounterSets_pl.txt'),
  'encounterSets_pt': require('../../assets/generated/encounterSets_pt.txt'),
  'encounterSets_ru': require('../../assets/generated/encounterSets_ru.txt'),
  'encounterSets_vi': require('../../assets/generated/encounterSets_vi.txt'),
  'encounterSets_zh': require('../../assets/generated/encounterSets_zh.txt'),
  'encounterSets_zh-cn': require('../../assets/generated/encounterSets_zh-cn.txt'),
  'encounterSets_cs': require('../../assets/generated/encounterSets_cs.txt'),
  'scenarioNames': require('../../assets/generated/scenarioNames.txt'),
  'scenarioNames_de': require('../../assets/generated/scenarioNames_de.txt'),
  'scenarioNames_es': require('../../assets/generated/scenarioNames_es.txt'),
  'scenarioNames_fr': require('../../assets/generated/scenarioNames_fr.txt'),
  'scenarioNames_it': require('../../assets/generated/scenarioNames_it.txt'),
  'scenarioNames_ko': require('../../assets/generated/scenarioNames_ko.txt'),
  'scenarioNames_pl': require('../../assets/generated/scenarioNames_pl.txt'),
  'scenarioNames_pt': require('../../assets/generated/scenarioNames_pt.txt'),
  'scenarioNames_ru': require('../../assets/generated/scenarioNames_ru.txt'),
  'scenarioNames_vi': require('../../assets/generated/scenarioNames_vi.txt'),
  'scenarioNames_zh': require('../../assets/generated/scenarioNames_zh.txt'),
  'scenarioNames_zh-cn': require('../../assets/generated/scenarioNames_zh-cn.txt'),
  'scenarioNames_cs': require('../../assets/generated/scenarioNames_cs.txt'),
  'standaloneScenarios': require('../../assets/generated/standaloneScenarios.txt'),
};

export async function loadAsset<T = any>(assetKey: string): Promise<T> {
  // Check cache first
  if (assetCache[assetKey]) {
    return assetCache[assetKey];
  }

  const assetModule = ASSET_MODULES[assetKey];
  if (!assetModule) {
    throw new Error(`Asset ${assetKey} not found`);
  }

  // Load the asset and download to local cache
  const asset = Asset.fromModule(assetModule);
  await asset.downloadAsync();

  if (!asset.localUri) {
    throw new Error(`Failed to download asset ${assetKey}`);
  }

  // Read and parse the JSON file
  const content = await FileSystem.readAsStringAsync(asset.localUri);
  const json = JSON.parse(content);

  // Cache the parsed result
  assetCache[assetKey] = json;
  return json;
}

export function clearAssetCache(assetKey?: string) {
  if (assetKey) {
    delete assetCache[assetKey];
  } else {
    Object.keys(assetCache).forEach(key => delete assetCache[key]);
  }
}
