import React from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import L from '../app/i18n';
import { handleAuthErrors } from './authHelper';
import { showDeckModal } from './navHelper';
import InvestigatorsListComponent from './InvestigatorsListComponent';
import { iconsMap } from '../app/NavIcons';
import * as Actions from '../actions';
import { newDeck } from '../lib/authApi';

class NewDeckView extends React.Component {
  static propTypes = {
    componentId: PropTypes.string.isRequired,
    setNewDeck: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    onCreateDeck: PropTypes.func,
    filterInvestigators: PropTypes.array,
  };

  static get options() {
    return {
      topBar: {
        title: {
          title: L('New Deck'),
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
    };

    this._onPress = throttle(this.onPress.bind(this), 200);

    Navigation.events().bindComponent(this);
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
    const {
      componentId,
      setNewDeck,
      onCreateDeck,
      login,
    } = this.props;
    if (!this.state.saving) {
      this.setState({
        saving: true,
      });
      const newDeckPromise = newDeck(investigator.code);
      handleAuthErrors(
        newDeckPromise,
        deck => {
          setNewDeck(deck.id, deck);
          onCreateDeck && onCreateDeck(deck);
          showDeckModal(componentId, deck, investigator);
        },
        () => {
          this.setState({
            saving: false,
          });
        },
        () => this.onPress(investigator),
        login
      );
    }
  }

  render() {
    const {
      componentId,
      filterInvestigators,
    } = this.props;
    return (
      <InvestigatorsListComponent
        componentId={componentId}
        filterInvestigators={filterInvestigators}
        onPress={this._onPress}
      />
    );
  }
}


function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(NewDeckView);
