import React from 'react';
import PropTypes from 'prop-types';
import { head } from 'lodash';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { connectRealm } from 'react-native-realm';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';

import L from '../../app/i18n';
import { iconsMap } from '../../app/NavIcons';
import * as Actions from '../../actions';
import typography from '../../styles/typography';
import { COLORS } from '../../styles/colors';
import AppIcon from '../../assets/AppIcon';
import Button from '../core/Button';
import { getShowSpoilers } from '../../reducers';
import Card from '../../data/Card';

import TwoSidedCardComponent from './TwoSidedCardComponent';
import SignatureCardsComponent from './SignatureCardsComponent';

/*
interface RealmProps {
  card?: Card;
}

interface Props extends RealmProps {
  componentId: string;
  id: string;
  pack_code: string;
  showSpoilers?: boolean;
}

interface State {
  showSpoilers: boolean;
}*/

class CardDetailView extends React.Component<Props, State> {
  static get options() {
    return {
      topBar: {
        backButton: {
          title: L('Back'),
        },
      },
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      showSpoilers: props.showSpoilers || false,
    };

    const rightButtons = [{
      icon: iconsMap.web,
      id: 'share',
      color: COLORS.navButton,
    }, {
      icon: iconsMap.faq,
      id: 'faq',
      color: COLORS.navButton,
    }];
    if (props.card &&
      props.card.type_code === 'investigator' &&
      props.card.encounter_code === null
    ) {
      rightButtons.push({
        icon: iconsMap.deck,
        id: 'deck',
        color: COLORS.navButton,
      });
    }
    Navigation.mergeOptions(props.componentId, {
      topBar: {
        rightButtons,
      },
    });
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener.remove();
  }

  _editSpoilersPressed = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'My.Spoilers',
      },
    });
  };

  navigationButtonPressed({ buttonId }) {
    const {
      componentId,
      id,
    } = this.props;
    if (buttonId === 'share') {
      Linking.openURL(`https://arkhamdb.com/card/${id}#reviews-header`);
    } else if (buttonId === 'deck') {
      this._showInvestigatorCards();
    } else if (buttonId === 'faq') {
      this._showFaq();
    } else if (buttonId === 'back') {
      Navigation.pop(componentId);
    }
  }

  _showFaq = () => {
    const {
      componentId,
      card,
    } = this.props;
    Navigation.push(componentId, {
      component: {
        name: 'Card.Faq',
        passProps: {
          id: card.code,
        },
        options: {
          topBar: {
            title: {
              text: L('FAQ'),
            },
            subtitle: {
              text: card.name,
            },
          },
        },
      },
    });
  };

  _showInvestigatorCards = () => {
    const {
      componentId,
      card,
    } = this.props;

    Navigation.push(componentId, {
      component: {
        name: 'Browse.InvestigatorCards',
        passProps: {
          investigatorCode: card.code,
        },
        options: {
          topBar: {
            title: {
              text: L('Allowed Cards'),
            },
            backButton: {
              title: L('Back'),
            },
          },
        },
      },
    });
  };

  _toggleShowSpoilers = () => {
    this.setState({
      showSpoilers: !this.state.showSpoilers,
    });
  };

  shouldBlur() {
    if (this.props.showSpoilers || this.state.showSpoilers) {
      return false;
    }
    return this.props.card.spoiler;
  }

  renderInvestigatorCardsLink() {
    const {
      componentId,
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
            text={L('Deckbuilding Cards')}
            icon={<AppIcon name="deck" size={18 * DeviceInfo.getFontScale()} color="white" />}
          />
        </View>
        <SignatureCardsComponent componentId={componentId} investigator={card} />
      </View>
    );
  }

  render() {
    const {
      componentId,
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
          componentId={componentId}
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
