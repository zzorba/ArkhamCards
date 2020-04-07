import React from 'react';
import { StyleSheet, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import SingleCardWrapper from 'components/campaignguide/SingleCardWrapper';
import Card from 'data/Card';
import { CARD_RATIO } from 'styles/sizes';
const PLAYER_BACK = require('../../../../assets/player-back.png');

const SIDE_PADDING = 16;

interface Props {
  code: string;
  rowSize: number;
  width: number;
}

export default class LocationCard extends React.Component<Props> {
  _renderCard = (card: Card, back: boolean) => {
    return (
      <FastImage
        style={styles.verticalCardImage}
        source={{
          uri: `https://arkhamdb.com${back ? card.backimagesrc : card.imagesrc}`,
        }}
        resizeMode="contain"
      />
    );
  };

  renderImage() {
    const { code } = this.props;
    if (code === 'blank') {
      return null;
    }
    if (code === 'player_back') {
      return (
        <FastImage
          style={styles.verticalCardImage}
          source={PLAYER_BACK}
          resizeMode="contain"
        />
      );
    }
    return (
      <SingleCardWrapper
        code={code.replace('_back', '')}
        render={this._renderCard}
        extraArg={code.indexOf('_back') !== -1}
      />
    );
  }

  render() {
    const {
      width,
      rowSize,
    } = this.props;
    const cardWidth = (width - SIDE_PADDING * 2) / rowSize;
    const cardHeight = cardWidth * CARD_RATIO;
    return (
      <View
        style={[
          styles.card,
          { width: cardWidth, height: cardHeight },
        ]}
      >
        { this.renderImage() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    padding: 4,
    borderRadius: 4,
  },
  verticalCardImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});
