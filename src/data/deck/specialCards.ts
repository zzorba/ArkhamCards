import { PARALLEL_WENDY_CODE } from './specialMetaSlots';

interface SpecialCards {
  codes: string[];
  min: number;
  max: number;
}
interface InvestigatorSpecialCards {
  front?: SpecialCards;
  back?: SpecialCards
}

interface AllSpecialCards {
  [code: string]: undefined | InvestigatorSpecialCards;
}

export const LILY_CODE = '08010';
export const ROLAND_CODE = '01001';
export const PARALLEL_ROLAND_CODE = '90024';
export const LOLA_CODE = '03006';
export const JOE_DIAMOND_CODE = '05002';

const specialCards: AllSpecialCards = {
  [PARALLEL_WENDY_CODE]: {
    front: {
      min: 0,
      max: 0,
      codes: [
        '90038',
      ],
    },
  },
  [PARALLEL_ROLAND_CODE]: {
    front: {
      min: 3,
      max: 3,
      codes: [
        '90025',
        '90026',
        '90027',
        '90028',
        '90029',
      ],
    },
  },
  [LILY_CODE]: {
    back: {
      min: 1,
      max: 4,
      codes: [
        '08011a',
        '08012a',
        '08013a',
        '08014a',
      ],
    },
  },
};

export default specialCards;