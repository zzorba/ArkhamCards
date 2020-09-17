import React from 'react';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { Navigation, EventSubscription, Options } from 'react-native-navigation';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import { t } from 'ttag';

import { iconsMap } from '@app/NavIcons';
import { Slots, SORT_BY_TYPE, SortType } from '@actions/types';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import { AppState, getDeckChecklist } from '@reducers';
import { NavigationProps } from '@components/nav/types';
import { showCard } from '@components/nav/helper';
import { setDeckChecklistCard, resetDeckChecklist } from '@components/deck/actions';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import CardResultList from '@components/cardlist/CardSearchResultsComponent/CardResultList';
import { showSortDialog } from '@components/cardlist/CardSortDialog';
import Card from '@data/Card';
import COLORS from '@styles/colors';
import typography from '@styles/typography';
import space from '@styles/space';

export interface DeckChecklistProps {
  investigator: string;
  id: number;
  slots: Slots;
  tabooSetOverride?: number;
}

interface ReduxProps {
  checklist: Set<string>;
}

interface ReduxActionProps {
  resetDeckChecklist: (id: number) => void;
  setDeckChecklistCard: (id: number, card: string, value: boolean) => void;
}

type Props = DeckChecklistProps & PlayerCardProps & ReduxProps & ReduxActionProps & NavigationProps;
interface State {
  sort: SortType;
}
class DeckChecklistView extends React.Component<Props, State> {
  static options(): Options {
    return {
      topBar: {
        title: {
          text: t`Checklist`,
          color: COLORS.white,
        },
        rightButtons: [
          {
            icon: iconsMap.sort,
            id: 'sort',
            color: COLORS.white,
            accessibilityLabel: t`Sort`,
          },
        ],
      },
    };
  }

  state: State = {
    sort: SORT_BY_TYPE,
  };
  _navEventListener?: EventSubscription;

  componentDidMount() {
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  _sortChanged = (sort: SortType) => {
    this.setState({
      sort,
    });
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    const { sort } = this.state;
    if (buttonId === 'sort') {
      showSortDialog(
        this._sortChanged,
        sort,
        false
      );
    }
  }

  _toggleCard = (card: Card, value: boolean) => {
    const { setDeckChecklistCard, id } = this.props;
    setDeckChecklistCard(id, card.code, value);
  };

  _pressCard = (card: Card) => {
    const {
      componentId,
      tabooSetOverride,
    } = this.props;
    showCard(
      componentId,
      card.code,
      card,
      true,
      tabooSetOverride
    );
  };

  _renderCard = (card: Card) => {
    const { slots, checklist } = this.props;
    return (
      <CardSearchResult
        card={card}
        count={slots[card.code]}
        onToggleChange={this._toggleCard}
        onPress={this._pressCard}
        toggleValue={checklist.has(card.code)}
        backgroundColor="transparent"
      />
    );
  };

  _handleScroll = () => {
    // intentionally blank.
  };

  _clearChecklist = () => {
    const { id, resetDeckChecklist } = this.props;
    resetDeckChecklist(id);
  };

  _renderHeader = () => {
    const { checklist } = this.props;
    return (
      <View style={[space.paddingM, space.marginRightXs, styles.headerRow]}>
        <TouchableOpacity onPress={this._clearChecklist} disabled={!checklist.size}>
          <Text style={[typography.text, checklist.size ? styles.clearText : typography.darkGray]}>{t`Clear`}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  render() {
    const { componentId, slots, checklist } = this.props;
    const { sort } = this.state;
    return (
      <CardResultList
        componentId={componentId}
        visible
        deckCardCounts={slots}
        originalDeckSlots={slots}
        onDeckCountChange={this._handleScroll}
        sort={sort}
        renderHeader={this._renderHeader}
        renderCard={this._renderCard}
        handleScroll={this._handleScroll}
        extraData={checklist}
        noSearch
      />
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: NavigationProps & DeckChecklistProps & PlayerCardProps
): ReduxProps {
  return {
    checklist: getDeckChecklist(state, props.id),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    setDeckChecklistCard,
    resetDeckChecklist,
  }, dispatch);
}

export default withPlayerCards<NavigationProps & DeckChecklistProps>(
  connect<ReduxProps, ReduxActionProps, NavigationProps & DeckChecklistProps & PlayerCardProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(DeckChecklistView)
);

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  clearText: {
    color: COLORS.M,
  },
});
