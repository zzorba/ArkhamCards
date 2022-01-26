import { GuideInput } from '@actions/types';

export default interface CampaignGuideStateT {
  inputs: (prediction: (p: GuideInput) => boolean) => GuideInput[];
  countInput: (prediction: (p: GuideInput) => boolean) => number;
  findInput: (predicate: (p: GuideInput) => boolean) => GuideInput | undefined;
  findLastInput: (predicate: (p: GuideInput) => boolean) => GuideInput | undefined;
  binaryAchievement: (id: string) => boolean;
  countAchievement: (id: string) => number;
  lastUpdated: () => Date | undefined;
  numInputs: () => number;

  undoInputs: (scenarioId: string) => GuideInput[];
}
