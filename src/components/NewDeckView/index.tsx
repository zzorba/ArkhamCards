import React from 'react';
import { Keyboard, StyleSheet, View } from 'react-native';
import { Navigation, EventSubscription } from 'react-native-navigation';

import InvestigatorsListComponent from './InvestigatorsListComponent';
import NewDeckOptionsDialog from './NewDeckOptionsDialog';
import { NavigationProps } from 'components/nav/types';
import { t } from 'ttag';
import { iconsMap } from 'app/NavIcons';
import { SORT_BY_PACK, SortType , Deck } from 'actions/types';
import Card from 'data/Card';
import { COLORS } from 'styles/colors';

export interface NewDeckProps {
  onCreateDeck: (deck: Deck) => void;
  filterInvestigators?: string[];
}

type Props = NewDeckProps & NavigationProps;

interface State {
  saving: boolean;
  viewRef?: View;
  activeInvestigatorId?: string;
  selectedSort: SortType;
}

export default class NewDeckView extends React.Component<Props, State> {
  static get options() {
    return {
      topBar: {
        title: {
          text: t`New Deck`,
        },
        leftButtons: [{
          icon: iconsMap.close,
          id: 'close',
          color: COLORS.navButton,
          testID: t`Cancel`,
        }],
        rightButtons: [{
          icon: iconsMap['sort-by-alpha'],
          id: 'sort',
          color: COLORS.navButton,
          testID: t`Sort`,
        }],
      },
    };
  }

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
    Navigation.showOverlay({
      component: {
        name: 'Dialog.InvestigatorSort',
        passProps: {
          sortChanged: this._sortChanged,
          selectedSort: this.state.selectedSort,
        },
        options: {
          layout: {
            backgroundColor: 'rgba(128,128,128,.75)',
          },
        },
      },
    });
  };


  _captureViewRef = (ref: View) => {
    this.setState({
      viewRef: ref,
    });
  };

  _closeDialog = () => {
    this.setState({
      activeInvestigatorId: undefined,
    });
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
    if (!this.state.activeInvestigatorId) {
      this.setState({
        activeInvestigatorId: investigator.code,
      });
    }
  };

  render() {
    const {
      componentId,
      onCreateDeck,
      filterInvestigators,
    } = this.props;
    const {
      viewRef,
      activeInvestigatorId,
      selectedSort,
    } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.container} ref={this._captureViewRef}>
          <InvestigatorsListComponent
            componentId={componentId}
            filterInvestigators={filterInvestigators}
            sort={selectedSort}
            onPress={this._onPress}
          />
        </View>
        <NewDeckOptionsDialog
          componentId={componentId}
          viewRef={viewRef}
          onCreateDeck={onCreateDeck}
          toggleVisible={this._closeDialog}
          investigatorId={activeInvestigatorId}
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
