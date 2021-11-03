import React, { useContext } from 'react';

import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import { PartnerTraumaInput } from '@data/scenario/types';

interface Props {
  id: string;
  input: PartnerTraumaInput;
}
export default function PartnerTraumaComponent({ id, input }: Props) {
  const { campaignLog } = useContext(ScenarioStepContext);

  return null;
}
