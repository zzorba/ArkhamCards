import React from 'react';
import PropTypes from 'prop-types';
import { head } from 'lodash';
import {
  Dimensions,
  StyleSheet,
  View,
} from 'react-native';
import { CachedImage } from 'react-native-cached-image';
import { connectRealm, CardResults } from 'react-native-realm';
import ViewControl from 'react-native-zoom-view';
import { Navigation, EventSubscription } from 'react-native-navigation';

import { iconsMap } from '../../app/NavIcons';
import Card from '../../data/Card';
import { HEADER_HEIGHT } from '../../styles/sizes';
import { COLORS } from '../../styles/colors';
import { NavigationProps } from '../types';

interface RealmProps {
  card?: Card;
}

export interface CardImageProps {
  id: string;
}

type Props = CardImageProps & NavigationProps & RealmProps;

interface State {
  flipped: boolean;
};

class CardImageView extends React.Component<Props, State> {
  _navEventListener?: EventSubscription;

  constructor(props: Props) {
    super(props);

    const doubleCard: boolean = !!props.card && (
      props.card.double_sided ||
      !!(props.card.linked_card && props.card.linked_card.imagesrc)
    );

    this.state = {
      flipped: !!props.card && (
        props.card.type_code === 'investigator' ||
        props.card.type_code === 'act' ||
        props.card.type_code === 'agenda' ||
        (doubleCard && !!props.card.hidden)),
    };

    if (doubleCard) {
      Navigation.mergeOptions(props.componentId, {
        topBar: {
          rightButtons: [{
            id: 'flip',
            icon: iconsMap.flip_card,
            color: COLORS.navButton,
          }],
        },
      });
    }
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

  renderContent() {
    const {
      card,
    } = this.props;
    const {
      flipped,
    } = this.state;
    const {
      height,
      width,
    } = Dimensions.get('window');
    if (!card) {
      return null;
    }

    const cardRatio = 68.0 / 88;
    const cardHeight = (height - HEADER_HEIGHT) * cardRatio;
    const cardWidth = width - 16;
    if (card.double_sided || (card.linked_card && card.linked_card.imagesrc)) {
      if (flipped) {
        return (
          <ViewControl
            cropWidth={width}
            cropHeight={height - HEADER_HEIGHT}
            imageWidth={cardWidth}
            imageHeight={cardHeight}
            style={styles.pinchZoom}
          >
            <CachedImage
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
          <CachedImage
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
        <CachedImage
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
    return (
      <View style={styles.container}>
        { this.renderContent() }
      </View>
    );
  }
}

export default connectRealm<CardImageProps & NavigationProps, RealmProps, Card>(CardImageView, {
  schemas: ['Card'],
  mapToProps(
    results: CardResults<Card>,
    realm: Realm,
    props: CardImageProps & NavigationProps
  ) {
    const card =
      head(results.cards.filtered(`code == "${props.id}"`));
    return {
      card,
    };
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pinchZoom: {
    flex: 1,
    backgroundColor: 'white',
  },
});
