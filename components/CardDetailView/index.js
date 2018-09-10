import React from 'react';
import PropTypes from 'prop-types';
import { head } from 'lodash';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import L from '../../app/i18n';
import { iconsMap } from '../../app/NavIcons';
import * as Actions from '../../actions';
import typography from '../../styles/typography';
import AppIcon from '../../assets/AppIcon';
import Button from '../core/Button';
import { getShowSpoilers } from '../../reducers';

import TwoSidedCardComponent from './TwoSidedCardComponent';
import SignatureCardsComponent from './SignatureCardsComponent';

class CardDetailView extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.string.isRequired,
    pack_code: PropTypes.string.isRequired,
    card: PropTypes.object,
    showSpoilers: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      showSpoilers: props.showSpoilers,
    };

    this._editSpoilersPressed = this.editSpoilersPressed.bind(this);
    this._toggleShowSpoilers = this.toggleShowSpoilers.bind(this);
    this._toggleShowBack = this.toggleShowBack.bind(this);
    this._showInvestigatorCards = this.showInvestigatorCards.bind(this);
    this._showFaq = this.showFaq.bind(this);

    const backButton = Platform.OS === 'ios' ? {
      id: 'back',
    } : {
      id: 'back',
      icon: iconsMap['arrow-left'],
    };
    const rightButtons = [{
      icon: iconsMap.faq,
      id: 'faq',
    }];
    if (props.card &&
      props.card.type_code === 'investigator' &&
      props.card.encounter_code === null
    ) {
      rightButtons.push({
        icon: iconsMap.deck,
        id: 'deck',
      });
    }
    props.navigator.setButtons({
      leftButtons: [
        backButton,
      ],
      rightButtons,
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  editSpoilersPressed() {
    this.props.navigator.push({
      screen: 'My.Spoilers',
    });
  }

  onNavigatorEvent(event) {
    const {
      navigator,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'deck') {
        this.showInvestigatorCards();
      } else if (event.id === 'faq') {
        this.showFaq();
      } else if (event.id === 'back') {
        navigator.pop();
      }
    }
  }

  showFaq() {
    const {
      navigator,
      card,
    } = this.props;
    navigator.push({
      screen: 'Card.Faq',
      title: L('FAQ'),
      subtitle: card.name,
      passProps: {
        id: card.code,
      },
    });
  }

  showInvestigatorCards() {
    const {
      navigator,
      card,
    } = this.props;

    navigator.push({
      screen: 'Browse.InvestigatorCards',
      title: L('Allowed Cards'),
      passProps: {
        investigatorCode: card.code,
      },
      backButtonTitle: L('Back'),
    });
  }

  toggleShowBack() {
    this.setState({
      showBack: !this.state.showBack,
    });
  }

  toggleShowSpoilers() {
    this.setState({
      showSpoilers: !this.state.showSpoilers,
    });
  }

  shouldBlur() {
    if (this.props.showSpoilers || this.state.showSpoilers) {
      return false;
    }
    return this.props.card.spoiler;
  }

  renderInvestigatorCardsLink() {
    const {
      navigator,
      card,
    } = this.props;
    if (card.type_code !== 'investigator' || card.encounter_code !== null) {
      return null;
    }
    return (
      <View>
        <Text style={[typography.header, styles.sectionHeader]}>
          Deckbuilding
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._showInvestigatorCards}
            text={`Browse ${card.name} Cards`}
            icon={<AppIcon name="deck" size={18} color="white" />}
          />
        </View>
        <SignatureCardsComponent navigator={navigator} investigator={card} />
      </View>
    );
  }

  render() {
    const {
      navigator,
      card,
    } = this.props;

    if (this.shouldBlur()) {
      return (
        <ScrollView style={styles.viewContainer}>
          <Text style={styles.spoilerText}>
            Warning: this card contains possible spoilers for '{ card.pack_name }'.
          </Text>
          <View style={styles.buttonContainer}>
            <Button onPress={this._toggleShowSpoilers} text="Show card" />
          </View>
          <View style={styles.buttonContainer}>
            <Button onPress={this._editSpoilersPressed} text="Edit my spoiler settings" />
          </View>
        </ScrollView>
      );
    }
    return (
      <ScrollView style={styles.viewContainer}>
        <TwoSidedCardComponent
          navigator={navigator}
          card={card}
        />
        { this.renderInvestigatorCardsLink() }
        <View style={styles.footerPadding} />
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    showSpoilers: props.showSpoilers || getShowSpoilers(state, props.pack_code),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connectRealm(
  connect(mapStateToProps, mapDispatchToProps)(CardDetailView), {
    schemas: ['Card'],
    mapToProps(results, realm, props) {
      return {
        realm,
        card: head(results.cards.filtered(`code == '${props.id}'`)),
      };
    },
  });

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'column',
    flexWrap: 'wrap',
    flex: 1,
    backgroundColor: 'white',
  },
  footerPadding: {
    height: 150,
  },
  buttonContainer: {
    marginLeft: 8,
    marginTop: 4,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  sectionHeader: {
    marginTop: 24,
    paddingLeft: 8,
  },
  spoilerText: {
    margin: 8,
  },
});
