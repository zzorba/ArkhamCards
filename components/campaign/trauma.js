export const DEFAULT_TRAUMA_DATA = {
  mental: 0,
  physical: 0,
  killed: false,
  insane: false,
};

export function traumaString(investigatorData) {
  const parts = [];
  if (investigatorData.killed) {
    return 'Killed';
  }
  if (investigatorData.insane) {
    return 'Insane';
  }
  if (investigatorData.physical > 0) {
    parts.push(`Physical(${investigatorData.physical})`);
  }
  if (investigatorData.mental > 0) {
    parts.push(`Mental(${investigatorData.mental})`);
  }
  if (!parts.length) {
    return 'None';
  }
  return parts.join(', ');
}

export default {
  DEFAULT_TRAUMA_DATA,
  traumaString,
};
