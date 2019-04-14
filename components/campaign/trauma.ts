import { t } from 'ttag';
import { Trauma } from '../../actions/types';
import Card from '../../data/Card';

export const DEFAULT_TRAUMA_DATA = {
  mental: 0,
  physical: 0,
  killed: false,
  insane: false,
};

export function traumaDelta(traumaData: Trauma, originalTraumaData: Trauma) {
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

export function isEliminated(traumaData: Trauma, investigatorCard: Card) {
  if (traumaData.killed || traumaData.insane) {
    return true;
  }
  if ((investigatorCard.health || 0) <= (traumaData.physical || 0) ||
    (investigatorCard.sanity || 0) <= (traumaData.mental || 0)) {
    return true;
  }
  return false;
}

export function traumaString(traumaData: Trauma, investigator: Card) {
  const parts = [];
  if (traumaData.killed || (investigator.health || 0) <= (traumaData.physical || 0)) {
    return t`Killed`;
  }
  if (traumaData.insane || (investigator.sanity || 0) <= (traumaData.mental || 0)) {
    return t`Insane`;
  }
  if (traumaData.physical !== 0) {
    parts.push(t`${traumaData.physical} Physical`);
  }
  if (traumaData.mental !== 0) {
    parts.push(t`${traumaData.mental} Mental`);
  }
  if (!parts.length) {
    return t`None`;
  }
  return parts.join(', ');
}

export default {
  DEFAULT_TRAUMA_DATA,
  traumaString,
  traumaDelta,
  isEliminated,
};
