import { DeckMeta, Slots } from '@actions/types';

export const MANDY_CODE = '06002';
export const OCCULT_EVIDENCE_CODE = '06008';

export const WENDY_CODE = '01005';
export const PARALLEL_WENDY_CODE = '90037';
export const TIDAL_MEMENTO_CODE = '90038';

export default function specialMetaSlots(
  investigator_code: string,
  update: {
    key: keyof DeckMeta;
    value?: string;
  },
): Slots | undefined {
  switch(investigator_code) {
    case MANDY_CODE:
      if (update.key === 'deck_size_selected') {
        return {
          [OCCULT_EVIDENCE_CODE]: (parseInt(update.value || '10', 10) - 20) / 10,
        };
      }
      return undefined;
    case WENDY_CODE:
      if (update.key === 'alternate_front') {
        return {
          [TIDAL_MEMENTO_CODE]: update.value === PARALLEL_WENDY_CODE ? 1 : 0,
        };
      }
      return undefined;
    default:
      return undefined;
  }
}