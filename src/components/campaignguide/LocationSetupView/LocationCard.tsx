import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import SingleCardWrapper from '@components/card/SingleCardWrapper';
import Card from '@data/Card';
import { m } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

const PLAYER_BACK = require('../../../../assets/player-back.png');
const ATLACH = require('../../../../assets/atlach.jpg');

interface Props {
  code: string;
  height: number;
  width: number;
  left: number;
  top: number;
}

export default class LocationCard extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _renderCard = (card: Card, back: boolean) => {
    const { colors, borderStyle, typography } = this.context;
    const image = back ? card.backimagesrc : card.imagesrc;
    if (!image) {
      return (
        <View style={[styles.singleCardWrapper, borderStyle, { borderWidth: 1, borderRadius: 8, backgroundColor: colors.faction.mythos.background }]}>
          <Text style={typography.text}>{ card.name }</Text>
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
    const { colors, borderStyle } = this.context;
    const { code } = this.props;
    switch (code) {
      case 'blank':
        return null;
      case 'placeholder':
        return (
          <View style={[
            styles.singleCardWrapper,
            borderStyle,
            {
              borderWidth: 2,
              borderStyle: 'dashed',
              backgroundColor: colors.L30,
            }]} />
        );
      case 'player_back':
        return (
          <FastImage
            style={styles.verticalCardImage}
            source={PLAYER_BACK}
            resizeMode="contain"
          />
        );
      case 'atlach':
        return (
          <FastImage
            style={styles.verticalCardImage}
            source={ATLACH}
            resizeMode="contain"
          />
        );
      default:
        return (
          <SingleCardWrapper
            code={code.replace('_back', '')}
            type="encounter"
          >
            { (card: Card) => this._renderCard(card, code.indexOf('_back') !== -1) }
          </SingleCardWrapper>
        );
    }
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
    padding: m,
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
});
