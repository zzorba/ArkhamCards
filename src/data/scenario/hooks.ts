import { useMemo } from 'react';
import { find } from 'lodash';
import { useAsset } from '@lib/useAsset';
import { ChaosTokens, ScenarioChaosTokens, TabooSets } from './types';

function getChaosTokensAssetKey(lang: string): string {
  return lang === 'vi' || lang === 'en' ? 'chaos_odds' : `chaos_odds_${lang}`;
}

function getTaboosAssetKey(lang: string): string | undefined {
  if (lang === 'vi' || lang === 'en' || lang === 'cs') {
    return undefined;
  }
  return `taboos_${lang}`;
}

export function useChaosTokens(
  lang: string,
  code?: string,
  scenario?: string
): ScenarioChaosTokens | undefined {
  const assetKey = useMemo(() => getChaosTokensAssetKey(lang), [lang]);
  const allTokens = useAsset<ChaosTokens>(assetKey);

  return useMemo(() => {
    if (!code && !scenario) {
      return undefined;
    }
    if (!allTokens) {
      return undefined;
    }
    return (
      find(allTokens, (t) => !!(scenario && t.scenario === scenario)) ||
      find(allTokens, (t) => !!(code && t.code === code))
    );
  }, [allTokens, code, scenario]);
}

export function useTaboos(lang: string): TabooSets | undefined {
  const assetKey = useMemo(() => getTaboosAssetKey(lang), [lang]);
  return useAsset<TabooSets>(assetKey);
}
