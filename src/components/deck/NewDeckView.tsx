import React from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { t } from 'ttag';

import { showInvestigatorSortDialog } from '@components/cardlist/InvestigatorSortDialog';
import { SORT_BY_PACK, SortType , Deck } from '@actions/types';
import { iconsMap } from '@app/NavIcons';
import { NewDeckOptionsProps } from './NewDeckOptionsDialog';
import { getDeckOptions } from '@components/nav/helper';
import InvestigatorsListComponent from '@components/cardlist/InvestigatorsListComponent';
import { NavigationProps } from '@components/nav/types';
import Card from '@data/Card';
import COLORS from '@styles/colors';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

export interface NewDeckProps {
  onCreateDeck: (deck: Deck) => void;
  filterInvestigators?: string[];
  onlyInvestigators?: string[];
}

type Props = NewDeckProps & NavigationProps;

interface State {
  saving: boolean;
  selectedSort: SortType;
}

export default class NewDeckView extends React.Component<Props, State> {
  static options() {
    return {
      topBar: {
        title: {
          text: t`New Deck`,
        },
        leftButtons: [{
          icon: iconsMap.close,
          id: 'close',
          color: COLORS.M,
          accessibilityLabel: t`Cancel`,
        }],
        rightButtons: [{
          icon: iconsMap.sort,
          id: 'sort',
          color: COLORS.M,
          accessibilityLabel: t`Sort`,
        }],
      },
    };
  }
  static contextType = StyleContext;
  context!: StyleContextType;

  _navEventListener?: EventSubscription;
  constructor(props: Props) {
    super(props);

    this.state = {
      saving: false,
      selectedSort: SORT_BY_PACK,
    };

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  _sortChanged = (sort: SortType) => {
    this.setState({
      selectedSort: sort,
    });
  };

  _showSortDialog = () => {
    Keyboard.dismiss();
    showInvestigatorSortDialog(this._sortChanged);
  };

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    const {
      componentId,
    } = this.props;
    if (buttonId === 'close') {
      Navigation.dismissModal(componentId);
    } else if (buttonId === 'sort') {
      this._showSortDialog();
    }
  }

  _onPress = (investigator: Card) => {
    const { componentId, onCreateDeck } = this.props;
    Navigation.push<NewDeckOptionsProps>(componentId, {
      component: {
        name: 'Deck.NewOptions',
        passProps: {
          investigatorId: investigator.code,
          onCreateDeck,
        },
        options: {
          ...getDeckOptions({ title: t`NewDeck` }, investigator),
          bottomTabs: {},
        },
      },
    });
  };

  render() {
    const {
      componentId,
      filterInvestigators,
      onlyInvestigators,
    } = this.props;
    const { backgroundStyle } = this.context;
    const {
      selectedSort,
    } = this.state;
    return (
      <View style={[styles.container, backgroundStyle]}>
        <InvestigatorsListComponent
          componentId={componentId}
          filterInvestigators={filterInvestigators}
          onlyInvestigators={onlyInvestigators}
          sort={selectedSort}
          onPress={this._onPress}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
