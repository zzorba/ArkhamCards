import React from 'react';
import { Text } from 'react-native';

import Card from 'data/Card';

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
      <Text>{ investigator.name } got a random basic weakness</Text>
    );
  }
}
