import React from 'react';
import { map } from 'lodash';

import TableRowComponent from './TableRowComponent';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import { TableStep } from '@data/scenario/types';

interface Props {
  step: TableStep;
}

export default function TableStepComponent({ step }: Props) {
  return (
    <SetupStepWrapper bulletType={step.bullet_type}>
      { !!step.text && <CampaignGuideTextComponent text={step.text} /> }
      <TableRowComponent style="header" row={step.header} />
      { map(step.rows, (row, idx) => (
        <TableRowComponent 
          key={idx} 
          row={row} 
          style={idx % 2 === 0 ? 'light': 'dark'} 
          last={idx === step.rows.length - 1}
        /> 
      )) }
    </SetupStepWrapper>
  );
}
