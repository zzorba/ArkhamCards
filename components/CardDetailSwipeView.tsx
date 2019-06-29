import React from 'react';
import {
  Animated,
  Linking,
  StyleSheet,
  View,
} from 'react-native';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { connect } from 'react-redux';
import { t } from 'ttag';

import { Slots } from '../actions/types';
import CardQuantityComponent from './CardSearchResult/CardQuantityComponent';
import CardDetailComponent from './CardDetailView/CardDetailComponent';
import { rightButtonsForCard } from './CardDetailView';
import SwipeRecognizer, { SwipeDirection } from './core/SwipeRecognizer';
import withDimensions, { DimensionsProps } from './core/withDimensions';
import Card from '../data/Card';
import { getTabooSet, AppState } from '../reducers';
import withPlayerCards, { PlayerCardProps } from './withPlayerCards';
import { InvestigatorCardsProps } from './InvestigatorCardsView';
import { CardFaqProps } from './CardFaqView';
import { NavigationProps } from './types';
import { COLORS } from '../styles/colors';

interface ReduxProps {
  showSpoilers: { [pack_code: string]: boolean };
  tabooSetId?: number;
  hasSecondCore: boolean;
}

export interface CardDetailSwipeProps {
  ids: string[];
  initialIndex: number;
  showSpoilers?: boolean;
  tabooSetId?: number;
  deckCardCounts?: Slots;
  onDeckCountChange?: (code: string, count: number) => void;
  renderFooter?: (slots?: Slots, controls?: React.ReactNode) => React.ReactNode;
}

type Props = NavigationProps & DimensionsProps & CardDetailSwipeProps & ReduxProps & PlayerCardProps;

interface State {
  deckCardCounts?: Slots;
  showSpoilers: { [code: string]: boolean };
  lastIndex: number;
  index: number;
}

class CardDetailSwipeView extends React.Component<Props, State> {
  static options(passProps: CardDetailSwipeProps) {
    return {
      topBar: {
        backButton: {
          title: t`Back`,
          color: passProps.onDeckCountChange ? 'white' : COLORS.navButton,
        },
      },
      popGesture: false,
    };
  }

  _navEventListener?: EventSubscription;
  _touchX: Animated.Value;
  constructor(props: Props) {
    super(props);

    this.state = {
      showSpoilers: {},
      deckCardCounts: props.deckCardCounts,
      index: props.initialIndex,
      lastIndex: props.initialIndex === 0 ? 0 : props.initialIndex,
    };

    this._touchX = new Animated.Value(props.width / 2);
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentDidMount() {
    this._syncNavigationButtons();
  }
  currentCard() {
    const {
      ids,
      cards,
    } = this.props;
    const { index } = this.state;
    return ids && cards[ids[index]];
  }

  _syncNavigationButtons = () => {
    const card = this.currentCard();
    const buttonColor = this.props.onDeckCountChange ? 'white' : COLORS.navButton;
    const rightButtons = rightButtonsForCard(card, buttonColor);
    Navigation.mergeOptions(this.props.componentId, {
      topBar: {
        rightButtons,
        backButton: {
          title: t`Back`,
          color: buttonColor,
        },
      },
    });
  };

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    const {
      componentId,
    } = this.props;
    const card = this.currentCard();
    if (buttonId === 'share') {
      Linking.openURL(`https://arkhamdb.com/card/${card.code}#reviews-header`);
    } else if (buttonId === 'deck') {
      this._showInvestigatorCards(card.code);
    } else if (buttonId === 'faq') {
      this._showFaq();
    } else if (buttonId === 'back') {
      Navigation.pop(componentId);
    }
  }

  _showFaq = () => {
    const {
      componentId,
    } = this.props;
    const card = this.currentCard();
    if (card) {
      Navigation.push<CardFaqProps>(componentId, {
        component: {
          name: 'Card.Faq',
          passProps: {
            id: card.code,
          },
          options: {
            topBar: {
              title: {
                text: card.name,
              },
              subtitle: {
                text: t`FAQ`,
              },
            },
          },
        },
      });
    }
  };

  _showInvestigatorCards = (code: string) => {
    const {
      componentId,
    } = this.props;

    Navigation.push<InvestigatorCardsProps>(componentId, {
      component: {
        name: 'Browse.InvestigatorCards',
        passProps: {
          investigatorCode: code,
        },
        options: {
          topBar: {
            title: {
              text: t`Allowed Cards`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  };

  _toggleShowSpoilers = (code: string) => {
    const { showSpoilers } = this.state;
    this.setState({
      showSpoilers: {
        ...showSpoilers,
        [code]: !showSpoilers[code],
      },
    });
  };

  showSpoilers(card?: Card) {
    const {
      showSpoilers,
    } = this.props;
    if (!card) {
      return false;
    }
    if (showSpoilers[card.pack_code] || this.state.showSpoilers[card.code]) {
      return true;
    }
    return false;
  }

  _onSwipe = (direction: SwipeDirection) => {
    const { ids } = this.props;
    const { index } = this.state;
    if (direction === SwipeDirection.SWIPE_RIGHT) {
      this.setState({
        index: Math.max(0, index - 1),
      });
    } else {
      this.setState({
        index: Math.min(ids.length - 1, index + 1),
      });
    }
  };

  _countChanged = (count: number) => {
    const {
      onDeckCountChange,
    } = this.props;
    const { deckCardCounts } = this.state;
    const card = this.currentCard();
    if (card && onDeckCountChange) {
      onDeckCountChange(card.code, count);
    }
    this.setState({
      deckCardCounts: {
        ...deckCardCounts,
        [card.code]: count,
      },
    });
  };

  renderDeckCountControl() {
    const {
      hasSecondCore,
      onDeckCountChange,
    } = this.props;
    const {
      deckCardCounts,
    } = this.state;
    const card = this.currentCard();
    if (!onDeckCountChange || !deckCardCounts || !card) {
      return null;
    }
    const deck_limit: number = Math.min(
      card.pack_code === 'core' ?
        ((card.quantity || 0) * (hasSecondCore ? 2 : 1)) :
        (card.deck_limit || 0),
      card.deck_limit || 0
    );
    return (
      <View>
        <CardQuantityComponent
          key={card.code}
          count={deckCardCounts[card.code] || 0}
          countChanged={this._countChanged}
          limit={deck_limit}
          showZeroCount
          forceBig
          light
        />
      </View>
    );
  }

  render() {
    const {
      componentId,
      tabooSetId,
      width,
      renderFooter,
    } = this.props;
    const {
      deckCardCounts,
    } = this.state;
    const card = this.currentCard();
    if (!card) {
      return null;
    }
    return (
      <SwipeRecognizer
        onSwipe={this._onSwipe}
        config={{
          velocityThreshold: 0.1,
          directionalOffsetThreshold: 50,
        }}
        style={styles.wrapper}
      >
        <View style={styles.wrapper}>
          <CardDetailComponent
            componentId={componentId}
            card={card}
            showSpoilers={this.showSpoilers(card)}
            tabooSetId={tabooSetId}
            toggleShowSpoilers={this._toggleShowSpoilers}
            showInvestigatorCards={this._showInvestigatorCards}
            width={width}
          />
          { !!renderFooter && renderFooter(deckCardCounts, this.renderDeckCountControl()) }
        </View>
      </SwipeRecognizer>
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: NavigationProps & CardDetailSwipeProps
): ReduxProps {
  return {
    showSpoilers: state.packs.show_spoilers || {},
    tabooSetId: getTabooSet(state, props.tabooSetId),
    hasSecondCore: (state.packs.in_collection || {}).core || false,
  };
}

export default
connect<ReduxProps, {}, NavigationProps & CardDetailSwipeProps, AppState>(mapStateToProps)(
  withPlayerCards<NavigationProps & CardDetailSwipeProps & ReduxProps>(
    withDimensions(CardDetailSwipeView)
  )
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
  },
});
