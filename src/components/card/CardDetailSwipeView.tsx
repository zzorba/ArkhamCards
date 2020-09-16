import React from 'react';
import {
  Linking,
  StyleSheet,
  Platform,
  View,
} from 'react-native';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { t } from 'ttag';
import Swiper from 'react-native-swiper';

import { FOOTER_HEIGHT } from '@components/DeckNavFooter/constants';
import CardDetailComponent from './CardDetailView/CardDetailComponent';
import { rightButtonsForCard } from './CardDetailView';
import { CardFaqProps } from './CardFaqView';
import { getTabooSet, AppState } from '@reducers';
import CardQuantityComponent from '../cardlist/CardSearchResult/CardQuantityComponent';
import { InvestigatorCardsProps } from '../cardlist/InvestigatorCardsView';
import { NavigationProps } from '@components/nav/types';
import { Slots } from '@actions/types';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import Card from '@data/Card';
import COLORS from '@styles/colors';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface ReduxProps {
  showSpoilers: { [pack_code: string]: boolean };
  tabooSetId?: number;
  hasSecondCore: boolean;
}

export interface CardDetailSwipeProps {
  cards: Card[];
  initialIndex: number;
  whiteNav: boolean;
  showSpoilers?: boolean;
  tabooSetId?: number;
  deckCardCounts?: Slots;
  onDeckCountChange?: (code: string, count: number) => void;
  renderFooter?: (slots?: Slots, controls?: React.ReactNode) => React.ReactNode;
}

type Props = NavigationProps &
  CardDetailSwipeProps &
  ReduxProps &
  DimensionsProps;

interface State {
  deckCardCounts?: Slots;
  showSpoilers: { [code: string]: boolean };
  lastIndex: number;
  index: number;
}

class CardDetailSwipeView extends React.Component<Props, State> {
  static contextType = StyleContext;
  context!: StyleContextType;

  static options(passProps: CardDetailSwipeProps) {
    return {
      topBar: {
        backButton: {
          title: t`Back`,
          color: passProps.whiteNav ? 'white' : '#007AFF',
        },
      },
    };
  }

  _navEventListener?: EventSubscription;

  constructor(props: Props) {
    super(props);

    this.state = {
      showSpoilers: {},
      deckCardCounts: props.deckCardCounts,
      index: props.initialIndex,
      lastIndex: props.initialIndex === 0 ? 0 : props.initialIndex,
    };

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentDidMount() {
    this._syncNavigationButtons();
  }

  componentDidAppear() {
    const { componentId } = this.props;
    Navigation.mergeOptions(componentId, CardDetailSwipeView.options(this.props));
  }

  currentCard() {
    const {
      cards,
    } = this.props;
    const { index } = this.state;
    return cards && cards[index];
  }

  _syncNavigationButtons = () => {
    const {
      componentId,
      whiteNav,
    } = this.props;
    const card = this.currentCard();
    const buttonColor = whiteNav ? 'white' : COLORS.navButton;
    const rightButtons = rightButtonsForCard(card, buttonColor);
    Navigation.mergeOptions(componentId, {
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
    if (showSpoilers || showSpoilers[card.pack_code] || this.state.showSpoilers[card.code]) {
      return true;
    }
    return false;
  }

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
      <View style={{ height: FOOTER_HEIGHT, position: 'relative' }}>
        <CardQuantityComponent
          key={card.code}
          count={deckCardCounts[card.code] || 0}
          countChanged={this._countChanged}
          limit={deck_limit}
          showZeroCount
          forceBig
        />
      </View>
    );
  }

  _onIndexChange = (index: number) => {
    if (index !== this.state.index) {
      this.setState({
        index,
      }, this._syncNavigationButtons);
    }
  };

  renderCard(card: Card, itemIndex: number) {
    const {
      componentId,
      tabooSetId,
      width,
    } = this.props;
    const { colors } = this.context;
    return (
      <ScrollView
        key={itemIndex}
        overScrollMode="never"
        bounces={false}
        contentContainerStyle={{ backgroundColor: colors.background }}
      >
        <CardDetailComponent
          componentId={componentId}
          card={card}
          showSpoilers={this.showSpoilers(card)}
          tabooSetId={tabooSetId}
          toggleShowSpoilers={this._toggleShowSpoilers}
          showInvestigatorCards={this._showInvestigatorCards}
          width={width}
        />
      </ScrollView>
    );
  }

  renderCards() {
    const {
      cards,
    } = this.props;
    return cards.map((card, index) => this.renderCard(card, index));
  }

  render() {
    const {
      width,
      renderFooter,
      initialIndex,
      height,
    } = this.props;
    const {
      deckCardCounts,
    } = this.state;
    const { colors } = this.context;
    const card = this.currentCard();
    if (!card) {
      return <View style={[styles.wrapper, { backgroundColor: colors.background }]} />;
    }
    return (
      <View
        style={[styles.wrapper, { backgroundColor: colors.background }]}
      >
        <Swiper
          index={initialIndex}
          width={width}
          style={{ backgroundColor: colors.background }}
          containerStyle={{ flex: 1, flexDirection: 'column', backgroundColor: colors.background }}
          loadMinimal
          loadMinimalSize={1}
          loadMinimalLoader={<View style={[styles.wrapper, { width, height, backgroundColor: colors.background }]} />}
          showsPagination={false}
          onIndexChanged={this._onIndexChange}
          loop={false}
        >
          { this.renderCards() }
        </Swiper>
        { !!renderFooter && renderFooter(deckCardCounts, this.renderDeckCountControl()) }
        { Platform.OS === 'ios' && <View style={[styles.gutter, { height }]} /> }
      </View>
    );
  }
}

const EMPTY_SPOILERS: { [code: string]: boolean } = {};
function mapStateToProps(
  state: AppState,
  props: NavigationProps & CardDetailSwipeProps
): ReduxProps {
  return {
    showSpoilers: state.packs.show_spoilers || EMPTY_SPOILERS,
    tabooSetId: getTabooSet(state, props.tabooSetId),
    hasSecondCore: (state.packs.in_collection || {}).core || false,
  };
}

export default withDimensions<NavigationProps & CardDetailSwipeProps>(
  connect<ReduxProps, unknown, NavigationProps & CardDetailSwipeProps & DimensionsProps, AppState>(mapStateToProps)(
    // @ts-ignore TS2345
    CardDetailSwipeView
  )
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  gutter: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 10,
  },
});
