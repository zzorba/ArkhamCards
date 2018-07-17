export default function(investigatorData) {
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
