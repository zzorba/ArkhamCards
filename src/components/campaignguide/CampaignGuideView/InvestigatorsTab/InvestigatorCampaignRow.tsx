import React from 'react';
import { Text } from 'react-native';
import { map } from 'lodash';
import { t } from 'ttag';

import { TraumaAndCardData } from 'actions/types';
import CardSectionHeader from 'components/core/CardSectionHeader';
import InvestigatorRow from 'components/core/InvestigatorRow';
import Card from 'data/Card';
import SingleCardWrapper from '../../SingleCardWrapper';

interface Props {
  investigator: Card;
  traumaAndCardData: TraumaAndCardData;
  fontScale: number;
}

export default class InvestigatorCampaignRow extends React.Component<Props> {
  _renderStoryAsset = (card: Card) => {
    return (
      <Text>{ card.name }</Text>
    );
  };

  renderDetail() {
    const { traumaAndCardData, investigator, fontScale } =  this.props;
    if (traumaAndCardData.storyAssets && traumaAndCardData.storyAssets.length) {
      return (
        <>
          <CardSectionHeader
            investigator={investigator}
            fontScale={fontScale}
            section={{ title: t`Story Cards`}}
          />
          <Text>Story Cards</Text>
          { map(traumaAndCardData.storyAssets, asset => (
            <SingleCardWrapper
              key={asset}
              code={asset}
              render={this._renderStoryAsset}
            />
          )) }
        </>
      )
    }
    return null;
  }

  render() {
    const {
      investigator,
      traumaAndCardData,
    } = this.props;
    return (
      <InvestigatorRow
        investigator={investigator}
        eliminated={investigator.eliminated(traumaAndCardData)}
        detail={this.renderDetail()}
      />
    );
  }
}
