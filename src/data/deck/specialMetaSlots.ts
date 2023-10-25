import { DeckMeta, Slots } from '@actions/types';
import { encodeExtraDeckSlots, getExtraDeckSlots } from '@lib/parseDeck';

export const MANDY_CODE = '06002';
export const OCCULT_EVIDENCE_CODE = '06008';

export const WENDY_CODE = '01005';
export const PARALLEL_WENDY_CODE = '90037';
export const TIDAL_MEMENTO_CODE = '90038';
export const JIM_CODE = '02004';
export const PARALLEL_JIM_CODE = '90049';
export const JIM_VENGEFUL_SHADE_CODE = '90053';
export const THE_BEYOND_CODE = '90052';

export function ensureConsistentMeta(
  investigator_code: string,
  meta: DeckMeta
): DeckMeta {
  switch (investigator_code) {
    case JIM_CODE: {
      if (meta.alternate_back === PARALLEL_JIM_CODE) {
        const extraDeck = getExtraDeckSlots(meta);
        extraDeck[JIM_VENGEFUL_SHADE_CODE] = 1;
        return {
          ...meta,
          extra_deck: encodeExtraDeckSlots(extraDeck),
        };
      }
      return meta;
    }
    default:
      return meta;
  }
}
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
    case JIM_CODE:
      if (update.key === 'alternate_back') {
        return {
          [THE_BEYOND_CODE]: update.value === PARALLEL_JIM_CODE ? 1 : 0,
        };
      }
    default:
      return undefined;
  }
}