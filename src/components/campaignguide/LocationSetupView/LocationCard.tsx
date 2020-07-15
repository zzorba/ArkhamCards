import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import SingleCardWrapper from '@components/card/SingleCardWrapper';
import Card from '@data/Card';
import { m } from '@styles/space';
import COLORS from '@styles/colors';

const PLAYER_BACK = require('../../../../assets/player-back.png');

interface Props {
  code: string;
  height: number;
  width: number;
  left: number;
  top: number;
}

export default class LocationCard extends React.Component<Props> {
  _renderCard = (card: Card, back: boolean) => {
    const image = back ? card.backimagesrc : card.imagesrc;
    if (!image) {
      return (
        <View style={styles.singleCardWrapper}>
          <Text>{ card.name }</Text>
        </View>
      );
    }
    return (
      <FastImage
        style={styles.verticalCardImage}
        source={{
          uri: `https://arkhamdb.com${image}`,
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
        type="encounter"
      >
        { (card: Card) => this._renderCard(card, code.indexOf('_back') !== -1) }
      </SingleCardWrapper>
    );
  }

  render() {
    const {
      height,
      width,
      left,
      top,
    } = this.props;
    return (
      <View
        style={[
          styles.card,
          { width, height, left, top },
        ]}
      >
        { this.renderImage() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
  },
  verticalCardImage: {
    width: '100%',
    height: '100%',
  },
  singleCardWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.divider,
    padding: m,
    backgroundColor: '#ddd',
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});
