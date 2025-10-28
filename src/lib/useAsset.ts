import { useEffect, useState } from 'react';
import { loadAsset } from './assetLoader';

export function useAsset<T = any>(assetKey: string | undefined): T | undefined {
  const [data, setData] = useState<T | undefined>(undefined);

  useEffect(() => {
    if (!assetKey) {
      setData(undefined);
      return;
    }

    let cancelled = false;

    loadAsset<T>(assetKey).then(result => {
      if (!cancelled) {
        setData(result);
      }
    }).catch(error => {
      console.error(`Failed to load asset ${assetKey}:`, error);
      if (!cancelled) {
        setData(undefined);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [assetKey]);

  return data;
}
