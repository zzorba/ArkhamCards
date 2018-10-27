import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View } from 'react-native';
import { Navigation } from 'react-native-navigation';

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
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      saving: false,
      viewRef: null,
      activeInvestigatorId: null,
    };

    this._onPress = this.onPress.bind(this);
    this._captureViewRef = this.captureViewRef.bind(this);
    this._closeDialog = this.closeDialog.bind(this);

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
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
    } = this.state;
    return (
      <View style={styles.container}>
        <View style={styles.container} ref={this._captureViewRef}>
          <InvestigatorsListComponent
            componentId={componentId}
            filterInvestigators={filterInvestigators}
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
