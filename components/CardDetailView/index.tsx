import React from 'react';
import { head } from 'lodash';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Realm from 'realm';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { connectRealm, CardResults } from 'react-native-realm';
import { connect } from 'react-redux';
import DeviceInfo from 'react-native-device-info';

import { t } from 'ttag';
import { iconsMap } from '../../app/NavIcons';
import typography from '../../styles/typography';
import { COLORS } from '../../styles/colors';
import AppIcon from '../../assets/AppIcon';
import Button from '../core/Button';
import { getShowSpoilers, getTabooSet, AppState } from '../../reducers';
import Card from '../../data/Card';
import { InvestigatorCardsProps } from '../InvestigatorCardsView';
import { CardFaqProps } from '../CardFaqView';
import { NavigationProps } from '../types';
import BondedCardsComponent from './BondedCardsComponent';
import TwoSidedCardComponent from './TwoSidedCardComponent';
import SignatureCardsComponent from './SignatureCardsComponent';

interface RealmProps {
  card?: Card;
}

interface ReduxProps {
  showSpoilers: boolean;
  tabooSetId?: number;
}

export interface CardDetailProps {
  id: string;
  pack_code: string;
  showSpoilers?: boolean;
  tabooSetId?: number;
}

type Props = NavigationProps & CardDetailProps & ReduxProps & RealmProps;

interface State {
  showSpoilers: boolean;
}

class CardDetailView extends React.Component<Props, State> {
  static get options() {
    return {
      topBar: {
        backButton: {
          title: t`Back`,
        },
      },
    };
  }

  _navEventListener?: EventSubscription;

  constructor(props: Props) {
    super(props);

    this.state = {
      showSpoilers: props.showSpoilers || false,
    };

    const rightButtons = [{
      icon: iconsMap.web,
      id: 'share',
      color: COLORS.navButton,
      testID: t`Share`,
    }, {
      icon: iconsMap.faq,
      id: 'faq',
      color: COLORS.navButton,
      testID: t`FAQ`,
    }];
    if (props.card &&
      props.card.type_code === 'investigator' &&
      props.card.encounter_code === null
    ) {
      rightButtons.push({
        icon: iconsMap.deck,
        id: 'deck',
        color: COLORS.navButton,
        testID: t`Deckbuilding Cards`,
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
    this._navEventListener && this._navEventListener.remove();
  }

  _editSpoilersPressed = () => {
    Navigation.push<{}>(this.props.componentId, {
      component: {
        name: 'My.Spoilers',
      },
    });
  };

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
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
    if (card) {
      Navigation.push<CardFaqProps>(componentId, {
        component: {
          name: 'Card.Faq',
          passProps: {
            id: card.code,
          },
          options: {
            topBar: {
              title: {
                text: card.name,
              },
              subtitle: {
                text: t`FAQ`,
              },
            },
          },
        },
      });
    }
  };

  _showInvestigatorCards = () => {
    const {
      componentId,
      card,
    } = this.props;

    if (card) {
      Navigation.push<InvestigatorCardsProps>(componentId, {
        component: {
          name: 'Browse.InvestigatorCards',
          passProps: {
            investigatorCode: card.code,
          },
          options: {
            topBar: {
              title: {
                text: t`Allowed Cards`,
              },
              backButton: {
                title: t`Back`,
              },
            },
          },
        },
      });
    }
  };

  _toggleShowSpoilers = () => {
    this.setState({
      showSpoilers: !this.state.showSpoilers,
    });
  };

  shouldBlur() {
    const {
      showSpoilers,
      card,
    } = this.props;
    if (showSpoilers || this.state.showSpoilers) {
      return false;
    }
    return card && card.spoiler;
  }

  renderInvestigatorCardsLink() {
    const {
      componentId,
      card,
    } = this.props;
    if (!card || card.type_code !== 'investigator' || card.encounter_code !== null) {
      return null;
    }
    return (
      <React.Fragment>
        <Text style={[typography.header, styles.sectionHeader]}>
          Deckbuilding
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._showInvestigatorCards}
            text={t`Deckbuilding Cards`}
            icon={<AppIcon name="deck" size={22 * DeviceInfo.getFontScale()} color="white" />}
          />
        </View>
        <SignatureCardsComponent componentId={componentId} investigator={card} />
      </React.Fragment>
    );
  }

  render() {
    const {
      componentId,
      card,
    } = this.props;
    if (!card) {
      return null;
    }
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
        <BondedCardsComponent componentId={componentId} card={card} />
        { this.renderInvestigatorCardsLink() }
        <View style={styles.footerPadding} />
      </ScrollView>
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: NavigationProps & CardDetailProps
): ReduxProps {
  return {
    showSpoilers: props.showSpoilers || getShowSpoilers(state, props.pack_code),
    tabooSetId: getTabooSet(state, props.tabooSetId),
  };
}

export default
connect<ReduxProps, {}, NavigationProps & CardDetailProps, AppState>(mapStateToProps)(
  connectRealm<NavigationProps & CardDetailProps & ReduxProps, RealmProps, Card>(
    CardDetailView, {
      schemas: ['Card'],
      mapToProps(
        results: CardResults<Card>,
        realm: Realm,
        props: NavigationProps & CardDetailProps & ReduxProps
      ) {
        const card = head(results.cards.filtered(`(code == '${props.id}') and ${Card.tabooSetQuery(props.tabooSetId)}`));
        return {
          realm,
          card,
        };
      },
    })
);

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
