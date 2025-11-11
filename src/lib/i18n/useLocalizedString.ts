import { useContext, useMemo } from 'react';
import LanguageContext from './LanguageContext';

/**
 * Hook that returns a localized string and re-evaluates when language changes.
 *
 * @param getTranslation Function that returns a ttag template string
 * @returns The localized string
 *
 * @example
 * const backTitle = useLocalizedString(() => t`Back`);
 * const cardsLabel = useLocalizedString(() => t`Cards`);
 */
export function useLocalizedString(getTranslation: () => string): string {
  const { lang } = useContext(LanguageContext);

  return useMemo(() => getTranslation(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lang],
  );
}
