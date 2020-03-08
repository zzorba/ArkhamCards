import React from 'react';
import { head } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { connectRealm, CardResults } from 'react-native-realm';
import ViewControl from 'react-native-zoom-view';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { t } from 'ttag';

import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { iconsMap } from 'app/NavIcons';
import Card from 'data/Card';
import { getTabooSet, AppState } from 'reducers';
import { HEADER_HEIGHT } from 'styles/sizes';
import { COLORS } from 'styles/colors';
import { NavigationProps } from 'components/nav/types';

interface RealmProps {
  card?: Card;
}

export interface CardImageProps {
  id: string;
}

interface ReduxProps {
  tabooSetId?: number;
}

type Props = CardImageProps & NavigationProps & DimensionsProps & ReduxProps & RealmProps;

interface State {
  flipped: boolean;
}

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
            testID: t`Flip Card`,
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
      height,
      width,
    } = this.props;
    const {
      flipped,
    } = this.state;
    if (!card) {
      return null;
    }

    const cardRatio = 68 / 95;
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
    return (
      <View style={styles.container}>
        { this.renderContent() }
      </View>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    tabooSetId: getTabooSet(state),
  };
}

export default connect<ReduxProps, {}, NavigationProps & CardImageProps, AppState>(
  mapStateToProps
)(connectRealm<CardImageProps & NavigationProps & ReduxProps, RealmProps, Card>(
  withDimensions(CardImageView), {
    schemas: ['Card'],
    mapToProps(
      results: CardResults<Card>,
      realm: Realm,
      props: CardImageProps & NavigationProps & ReduxProps
    ) {
      const card =
        head(results.cards.filtered(`(code == "${props.id}") and ${Card.tabooSetQuery(props.tabooSetId)}`));
      return {
        card,
      };
    },
  })
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  pinchZoom: {
    flex: 1,
    backgroundColor: 'white',
  },
});
