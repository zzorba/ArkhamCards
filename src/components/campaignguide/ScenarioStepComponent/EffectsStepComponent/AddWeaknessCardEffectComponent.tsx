import React from 'react';
import { Text } from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import SetupStepWrapper from '../../SetupStepWrapper';
import SingleCardWrapper from '../../SingleCardWrapper';
import InvestigatorSelectorWrapper from '../../InvestigatorSelectorWrapper';
import Card from 'data/Card';
import CampaignGuideTextComponent from '../../CampaignGuideTextComponent';

interface Props {
  id: string;
  investigator: Card;
  traits: string[];
  skipCampaignLog?: boolean;
}

export default class AddWeaknessCardEffectComponent extends React.Component<Props> {
  render() {
    const { investigator } = this.props;
    return (
      <Text>{investigator.name} got a random basic weakness</Text>
    );
  }
}
