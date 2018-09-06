import L from '../../app/i18n';

export const DEFAULT_TRAUMA_DATA = {
  mental: 0,
  physical: 0,
  killed: false,
  insane: false,
};

export function traumaDelta(traumaData, originalTraumaData) {
  const result = {};
  if (traumaData.killed && !originalTraumaData.killed) {
    result.killed = true;
  }
  if (traumaData.insane && !originalTraumaData.insane) {
    result.insane = true;
  }

  result.physical = traumaData.physical - originalTraumaData.physical;
  result.mental = traumaData.mental - originalTraumaData.mental;

  return result;
}

export function isEliminated(traumaData, investigatorCard) {
  if (traumaData.killed || traumaData.insane) {
    return true;
  }
  if (investigatorCard.health <= traumaData.physical ||
    investigatorCard.sanity <= traumaData.mental) {
    return true;
  }
  return false;
}

export function traumaString(traumaData, investigator) {
  const parts = [];
  if (traumaData.killed || investigator.health <= traumaData.physical) {
    return L('Killed');
  }
  if (traumaData.insane || investigator.sanity <= traumaData.mental) {
    return L('Insane');
  }
  if (traumaData.physical !== 0) {
    parts.push(L('{{count}} Physical', { count: traumaData.physical }));
  }
  if (traumaData.mental !== 0) {
    parts.push(L('{{count}} Mental', { count: traumaData.mental }));
  }
  if (!parts.length) {
    return L('None');
  }
  return parts.join(', ');
}

export default {
  DEFAULT_TRAUMA_DATA,
  traumaString,
  traumaDelta,
  isEliminated,
};
