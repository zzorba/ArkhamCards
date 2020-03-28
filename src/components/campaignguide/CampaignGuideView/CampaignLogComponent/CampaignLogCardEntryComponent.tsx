import React from 'react';
import { StyleSheet } from 'react-native'

import TextEntryComponent from './TextEntryComponent';
import SingleCardWrapper from '../../SingleCardWrapper';
import { LogEntryCard } from 'data/scenario/CampaignGuide';
import Card from 'data/Card';

interface Props {
  crossedOut?: boolean;
  entry: LogEntryCard;
}

export default class CampaignLogCardEntryComponent extends React.Component<Props> {
  _renderCard = (card: Card) => {
    return (
      <TextEntryComponent
        text={card.name}
        crossedOut={this.props.crossedOut}
      />
    );
  };

  render() {
    const { entry } = this.props;
    return (
      <SingleCardWrapper
        code={entry.code}
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
