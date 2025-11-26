import { Asset } from 'expo-asset';
import * as FileSystem from 'expo-file-system/legacy';

const assetCache: { [key: string]: any } = {};
const pendingLoads: { [key: string]: Promise<any> | undefined } = {};

// Map of asset keys to their require modules
// These files are registered via expo-asset plugin in app.json
const ASSET_MODULES: { [key: string]: any } = {
  'chaos_odds': require('../../assets/generated/chaos_odds.txt'),
  'chaos_odds_es': require('../../assets/generated/chaos_odds_es.txt'),
  'chaos_odds_ru': require('../../assets/generated/chaos_odds_ru.txt'),
  'chaos_odds_fr': require('../../assets/generated/chaos_odds_fr.txt'),
  'chaos_odds_de': require('../../assets/generated/chaos_odds_de.txt'),
  'chaos_odds_it': require('../../assets/generated/chaos_odds_it.txt'),
  'chaos_odds_pt': require('../../assets/generated/chaos_odds_pt.txt'),
  'chaos_odds_pl': require('../../assets/generated/chaos_odds_pl.txt'),
  'chaos_odds_zh': require('../../assets/generated/chaos_odds_zh.txt'),
  'chaos_odds_zh-cn': require('../../assets/generated/chaos_odds_zh_cn.txt'),
  'chaos_odds_ko': require('../../assets/generated/chaos_odds_ko.txt'),
  'chaos_odds_cs': require('../../assets/generated/chaos_odds_cs.txt'),
  'chaos_odds_vi': require('../../assets/generated/chaos_odds_vi.txt'),
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
  'rules_zh-cn': require('../../assets/generated/rules_zh_cn.txt'),
  'rules_pl': require('../../assets/generated/rules_pl.txt'),
  'rules_it': require('../../assets/generated/rules_it.txt'),
  'all_campaigns': require('../../assets/generated/all_campaigns.txt'),
  'all_campaigns_de': require('../../assets/generated/all_campaigns_de.txt'),
  'all_campaigns_es': require('../../assets/generated/all_campaigns_es.txt'),
  'all_campaigns_fr': require('../../assets/generated/all_campaigns_fr.txt'),
  'all_campaigns_it': require('../../assets/generated/all_campaigns_it.txt'),
  'all_campaigns_ko': require('../../assets/generated/all_campaigns_ko.txt'),
  'all_campaigns_pl': require('../../assets/generated/all_campaigns_pl.txt'),
  'all_campaigns_pt': require('../../assets/generated/all_campaigns_pt.txt'),
  'all_campaigns_ru': require('../../assets/generated/all_campaigns_ru.txt'),
  'all_campaigns_vi': require('../../assets/generated/all_campaigns_vi.txt'),
  'all_campaigns_zh': require('../../assets/generated/all_campaigns_zh.txt'),
  'all_campaigns_zh-cn': require('../../assets/generated/all_campaigns_zh_cn.txt'),
  'all_campaigns_cs': require('../../assets/generated/all_campaigns_cs.txt'),
  'campaign_errata': require('../../assets/generated/campaign_errata.txt'),
  'campaign_errata_de': require('../../assets/generated/campaign_errata_de.txt'),
  'campaign_errata_es': require('../../assets/generated/campaign_errata_es.txt'),
  'campaign_errata_fr': require('../../assets/generated/campaign_errata_fr.txt'),
  'campaign_errata_it': require('../../assets/generated/campaign_errata_it.txt'),
  'campaign_errata_ko': require('../../assets/generated/campaign_errata_ko.txt'),
  'campaign_errata_pl': require('../../assets/generated/campaign_errata_pl.txt'),
  'campaign_errata_pt': require('../../assets/generated/campaign_errata_pt.txt'),
  'campaign_errata_ru': require('../../assets/generated/campaign_errata_ru.txt'),
  'campaign_errata_vi': require('../../assets/generated/campaign_errata_vi.txt'),
  'campaign_errata_zh': require('../../assets/generated/campaign_errata_zh.txt'),
  'campaign_errata_zh-cn': require('../../assets/generated/campaign_errata_zh_cn.txt'),
  'campaign_errata_cs': require('../../assets/generated/campaign_errata_cs.txt'),
  'campaign_logs': require('../../assets/generated/campaign_logs.txt'),
  'campaign_logs_de': require('../../assets/generated/campaign_logs_de.txt'),
  'campaign_logs_es': require('../../assets/generated/campaign_logs_es.txt'),
  'campaign_logs_fr': require('../../assets/generated/campaign_logs_fr.txt'),
  'campaign_logs_it': require('../../assets/generated/campaign_logs_it.txt'),
  'campaign_logs_ko': require('../../assets/generated/campaign_logs_ko.txt'),
  'campaign_logs_pl': require('../../assets/generated/campaign_logs_pl.txt'),
  'campaign_logs_pt': require('../../assets/generated/campaign_logs_pt.txt'),
  'campaign_logs_ru': require('../../assets/generated/campaign_logs_ru.txt'),
  'campaign_logs_vi': require('../../assets/generated/campaign_logs_vi.txt'),
  'campaign_logs_zh': require('../../assets/generated/campaign_logs_zh.txt'),
  'campaign_logs_zh-cn': require('../../assets/generated/campaign_logs_zh_cn.txt'),
  'campaign_logs_cs': require('../../assets/generated/campaign_logs_cs.txt'),
  'encounter_sets': require('../../assets/generated/encounter_sets.txt'),
  'encounter_sets_de': require('../../assets/generated/encounter_sets_de.txt'),
  'encounter_sets_es': require('../../assets/generated/encounter_sets_es.txt'),
  'encounter_sets_fr': require('../../assets/generated/encounter_sets_fr.txt'),
  'encounter_sets_it': require('../../assets/generated/encounter_sets_it.txt'),
  'encounter_sets_ko': require('../../assets/generated/encounter_sets_ko.txt'),
  'encounter_sets_pl': require('../../assets/generated/encounter_sets_pl.txt'),
  'encounter_sets_pt': require('../../assets/generated/encounter_sets_pt.txt'),
  'encounter_sets_ru': require('../../assets/generated/encounter_sets_ru.txt'),
  'encounter_sets_vi': require('../../assets/generated/encounter_sets_vi.txt'),
  'encounter_sets_zh': require('../../assets/generated/encounter_sets_zh.txt'),
  'encounter_sets_zh-cn': require('../../assets/generated/encounter_sets_zh_cn.txt'),
  'encounter_sets_cs': require('../../assets/generated/encounter_sets_cs.txt'),
  'scenario_names': require('../../assets/generated/scenario_names.txt'),
  'scenario_names_de': require('../../assets/generated/scenario_names_de.txt'),
  'scenario_names_es': require('../../assets/generated/scenario_names_es.txt'),
  'scenario_names_fr': require('../../assets/generated/scenario_names_fr.txt'),
  'scenario_names_it': require('../../assets/generated/scenario_names_it.txt'),
  'scenario_names_ko': require('../../assets/generated/scenario_names_ko.txt'),
  'scenario_names_pl': require('../../assets/generated/scenario_names_pl.txt'),
  'scenario_names_pt': require('../../assets/generated/scenario_names_pt.txt'),
  'scenario_names_ru': require('../../assets/generated/scenario_names_ru.txt'),
  'scenario_names_vi': require('../../assets/generated/scenario_names_vi.txt'),
  'scenario_names_zh': require('../../assets/generated/scenario_names_zh.txt'),
  'scenario_names_zh-cn': require('../../assets/generated/scenario_names_zh_cn.txt'),
  'scenario_names_cs': require('../../assets/generated/scenario_names_cs.txt'),
  'standalone_scenarios': require('../../assets/generated/standalone_scenarios.txt'),
};

export async function loadAsset<T = any>(assetKey: string): Promise<T> {
  // Check cache first
  if (assetCache[assetKey]) {
    return assetCache[assetKey];
  }

  // Check if already loading
  if (pendingLoads[assetKey]) {
    return pendingLoads[assetKey];
  }

  const assetModule = ASSET_MODULES[assetKey];
  if (!assetModule) {
    throw new Error(`Asset ${assetKey} not found`);
  }

  // Start loading and cache the promise
  const loadPromise = (async () => {
    try {
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
    } finally {
      // Clean up pending load regardless of success or failure
      delete pendingLoads[assetKey];
    }
  })();

  pendingLoads[assetKey] = loadPromise;
  return loadPromise;
}

export function clearAssetCache(assetKey?: string) {
  if (assetKey) {
    delete assetCache[assetKey];
    delete pendingLoads[assetKey];
  } else {
    Object.keys(assetCache).forEach(key => delete assetCache[key]);
    Object.keys(pendingLoads).forEach(key => delete pendingLoads[key]);
  }
}
