import { Trauma } from 'actions/types';

export const DEFAULT_TRAUMA_DATA = {
  mental: 0,
  physical: 0,
  killed: false,
  insane: false,
};

export function traumaDelta(
  traumaData: Trauma,
  originalTraumaData: Trauma
) {
  const result: Trauma = {};
  if (traumaData.killed && !originalTraumaData.killed) {
    result.killed = true;
  }
  if (traumaData.insane && !originalTraumaData.insane) {
    result.insane = true;
  }

  result.physical = (traumaData.physical || 0) - (originalTraumaData.physical || 0);
  result.mental = (traumaData.mental || 0) - (originalTraumaData.mental || 0);

  return result;
}

export default {
  DEFAULT_TRAUMA_DATA,
  traumaDelta,
};
