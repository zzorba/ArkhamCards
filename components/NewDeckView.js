import React from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import { Keyboard, StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';

import { SORT_BY_PACK } from './CardSortDialog/constants';
import InvestigatorsListComponent from './InvestigatorsListComponent';
import NewDeckOptionsDialog from './NewDeckOptionsDialog';
import L from '../app/i18n';
import { iconsMap } from '../app/NavIcons';

export default class NewDeckView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    // From passProps
    onCreateDeck: PropTypes.func,
    filterInvestigators: PropTypes.array,
  };

  static get options() {
    return {
      topBar: {
        title: {
          text: L('New Deck'),
        },
        leftButtons: [{
          icon: iconsMap.close,
          id: 'close',
        }],
        rightButtons: [{
          icon: iconsMap['sort-by-alpha'],
          id: 'sort',
        }],
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      viewRef: null,
      activeInvestigatorId: null,
      selectedSort: SORT_BY_PACK,
    };

    this._onPress = this.onPress.bind(this);
    this._captureViewRef = this.captureViewRef.bind(this);
    this._closeDialog = this.closeDialog.bind(this);
    this._sortChanged = this.sortChanged.bind(this);
    this._showSortDialog = throttle(this.showSortDialog.bind(this), 200);

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  sortChanged(sort) {
    this.setState({
      selectedSort: sort,
    });
  }

  showSortDialog() {
    this.isOnTop = false;
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
  }


  captureViewRef(ref) {
    this.setState({
      viewRef: ref,
    });
  }

  closeDialog() {
    this.setState({
      activeInvestigatorId: null,
    });
  }

  navigationButtonPressed({ buttonId }) {
    const {
      componentId,
    } = this.props;
    if (buttonId === 'close') {
      Navigation.dismissModal(componentId);
    } else if (buttonId === 'sort') {
      this._showSortDialog();
    }
  }

  onPress(investigator) {
    if (!this.state.activeInvestigatorId) {
      this.setState({
        activeInvestigatorId: investigator.code,
      });
    }
  }

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
