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

export function traumaString(traumaData) {
  const parts = [];
  if (traumaData.killed) {
    return 'Killed';
  }
  if (traumaData.insane) {
    return 'Insane';
  }
  if (traumaData.physical !== 0) {
    parts.push(`Physical(${traumaData.physical})`);
  }
  if (traumaData.mental !== 0) {
    parts.push(`Mental(${traumaData.mental})`);
  }
  if (!parts.length) {
    return 'None';
  }
  return parts.join(', ');
}

export default {
  DEFAULT_TRAUMA_DATA,
  traumaString,
  traumaDelta,
};
