import React from 'react';
import { StyleSheet } from 'react-native'

import TextEntryComponent from './TextEntryComponent';
import SingleCardWrapper from '../../SingleCardWrapper';
import { CampaignLogEntry } from 'data/scenario/GuidedCampaignLog';
import Card from 'data/Card';

interface Props {
  crossedOut?: boolean;
  code: string;
  entry: CampaignLogEntry;
}

export default class CampaignLogCardEntryComponent extends React.Component<Props> {
  _renderCard = (card: Card) => {
    const { crossedOut, entry } = this.props;
    return (
      <TextEntryComponent
        text={card.name}
        crossedOut={crossedOut}
        entry={entry}
      />
    );
  };

  render() {
    const { code } = this.props;
    return (
      <SingleCardWrapper
        code={code}
        render={this._renderCard}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 8,
    paddingLeft: 16,
    paddingRight: 32,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});
