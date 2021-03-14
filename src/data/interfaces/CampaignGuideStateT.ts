import { GuideInput } from '@actions/types';

export default interface CampaignGuideStateT {
  countInput: (prediction: (p: GuideInput) => boolean) => number;
  findInput: (predicate: (p: GuideInput) => boolean) => GuideInput | undefined;
  findLastInput: (predicate: (p: GuideInput) => boolean) => GuideInput | undefined;
  binaryAchievement: (id: string) => boolean;
  countAchievement: (id: string) => number;
  lastUpdated: () => Date | undefined;
  numInputs: () => number;
}
