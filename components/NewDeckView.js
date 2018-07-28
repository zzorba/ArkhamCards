import React from 'react';
import PropTypes from 'prop-types';
import {
  Alert,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { showDeckModal } from './navHelper';
import InvestigatorsListComponent from './InvestigatorsListComponent';
import { iconsMap } from '../app/NavIcons';
import * as Actions from '../actions';
import { newDeck } from '../lib/authApi';

class NewDeckView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    setNewDeck: PropTypes.func.isRequired,
    onCreateDeck: PropTypes.func,
    filterInvestigators: PropTypes.array,
  };

  constructor(props) {
    super(props);

    props.navigator.setButtons({
      leftButtons: [
        {
          icon: iconsMap.close,
          id: 'close',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this._onPress = this.onPress.bind(this);
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
      title: 'New Deck',
    });
  }

  onPress(investigator) {
    const {
      navigator,
      setNewDeck,
      onCreateDeck,
    } = this.props;
    newDeck(investigator.code).then(deck => {
      setNewDeck(deck.id, deck);
      onCreateDeck && onCreateDeck(deck.id);
      showDeckModal(navigator, deck, investigator);
    }, error => {
      Alert.alert('Error', error.message);
    });
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
