import React from 'react';
import PropTypes from 'prop-types';
import { throttle } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import L from '../app/i18n';
import { handleAuthErrors } from './authHelper';
import { showDeckModal } from './navHelper';
import InvestigatorsListComponent from './InvestigatorsListComponent';
import { iconsMap } from '../app/NavIcons';
import * as Actions from '../actions';
import { newDeck } from '../lib/authApi';

class NewDeckView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    setNewDeck: PropTypes.func.isRequired,
    login: PropTypes.func.isRequired,
    onCreateDeck: PropTypes.func,
    filterInvestigators: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      saving: false,
    };

    props.navigator.setButtons({
      leftButtons: [
        {
          icon: iconsMap.close,
          id: 'close',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this._onPress = throttle(this.onPress.bind(this), 200);
  }

  onNavigatorEvent(event) {
    const {
      navigator,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'close') {
        navigator.dismissModal();
      }
    }
  }

  componentDidMount() {
    this.props.navigator.setTitle({
      title: L('New Deck'),
    });
  }

  onPress(investigator) {
    const {
      navigator,
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
          showDeckModal(navigator, deck, investigator);
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
      navigator,
      filterInvestigators,
    } = this.props;
    return (
      <InvestigatorsListComponent
        navigator={navigator}
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
