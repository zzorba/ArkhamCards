import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import ViewControl from 'react-native-zoom-view';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { t } from 'ttag';

import SingleCardWrapper from '@components/card/SingleCardWrapper';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import { iconsMap } from '@app/NavIcons';
import Card from '@data/Card';
import { HEADER_HEIGHT } from '@styles/sizes';
import COLORS from '@styles/colors';
import { NavigationProps } from '@components/nav/types';

export interface CardImageProps {
  id: string;
}

type Props = CardImageProps & NavigationProps & DimensionsProps;

interface State {
  flipped: boolean;
}

class CardImageView extends React.Component<Props, State> {
  _navEventListener?: EventSubscription;
  doubleCard: boolean = false;

  constructor(props: Props) {
    super(props);

    this.state = {
      flipped: false,
    };

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'flip') {
      this._flip();
    }
  }

  _flip = () => {
    this.setState({
      flipped: !this.state.flipped,
    });
  };

  _renderContent = (card: Card) => {
    const {
      componentId,
      height,
      width,
    } = this.props;
    const {
      flipped,
    } = this.state;

    const doubleCard: boolean = card.double_sided ||
      !!(card.linked_card && card.linked_card.imagesrc);
    if (doubleCard !== this.doubleCard) {
      this.doubleCard = doubleCard;
      if (doubleCard) {
        Navigation.mergeOptions(componentId, {
          topBar: {
            rightButtons: [{
              id: 'flip',
              icon: iconsMap.flip_card,
              color: '#FFFFFF',
              testID: t`Flip Card`,
            }],
          },
        });
      }
    }

    const cardRatio = 68 / 95;
    const cardHeight = (height - HEADER_HEIGHT) * cardRatio;
    const cardWidth = width - 16;
    if (card.double_sided || (card.linked_card && card.linked_card.imagesrc)) {
      if (!flipped) {
        return (
          <ViewControl
            cropWidth={width}
            cropHeight={height - HEADER_HEIGHT}
            imageWidth={cardWidth}
            imageHeight={cardHeight}
            style={styles.pinchZoom}
          >
            <FastImage
              style={{ height: cardHeight, width: cardWidth }}
              resizeMode="contain"
              source={{
                uri: `https://arkhamdb.com${card.imagesrc}`,
              }}
            />
          </ViewControl>
        );
      }
      return (
        <ViewControl
          cropWidth={width}
          cropHeight={height - HEADER_HEIGHT}
          imageWidth={cardWidth}
          imageHeight={cardHeight}
          style={styles.pinchZoom}
        >
          <FastImage
            style={{ height: cardHeight, width: cardWidth }}
            resizeMode="contain"
            source={{
              // @ts-ignore
              uri: `https://arkhamdb.com${card.double_sided ? card.backimagesrc : card.linked_card.imagesrc}`,
            }}
          />
        </ViewControl>
      );
    }

    return (
      <ViewControl
        cropWidth={width}
        cropHeight={height - HEADER_HEIGHT}
        imageWidth={cardWidth}
        imageHeight={cardHeight}
        style={styles.pinchZoom}
      >
        <FastImage
          style={{ height: cardHeight, width: cardWidth }}
          resizeMode="contain"
          source={{
            uri: `https://arkhamdb.com${card.imagesrc}`,
          }}
        />
      </ViewControl>
    );
  }

  render() {
    const { id } = this.props;
    return (
      <View style={styles.container}>
        <SingleCardWrapper code={id} type="encounter">
          { this._renderContent }
        </SingleCardWrapper>
      </View>
    );
  }
}

export default withDimensions(CardImageView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  pinchZoom: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
