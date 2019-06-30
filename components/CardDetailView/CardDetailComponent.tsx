import React from 'react';
import {
  Button as BasicButton,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import DeviceInfo from 'react-native-device-info';

import { t } from 'ttag';
import typography from '../../styles/typography';
import AppIcon from '../../assets/AppIcon';
import Button from '../core/Button';
import Card from '../../data/Card';
import BondedCardsComponent from './BondedCardsComponent';
import TwoSidedCardComponent from './TwoSidedCardComponent';
import SignatureCardsComponent from './SignatureCardsComponent';

interface Props {
  componentId: string;
  card: Card;
  width: number;
  showSpoilers: boolean;
  tabooSetId?: number;
  toggleShowSpoilers: (code: string) => void;
  showInvestigatorCards: (code: string) => void;
}

export default class CardDetailComponent extends React.Component<Props> {
  _editSpoilersPressed = () => {
    Navigation.push<{}>(this.props.componentId, {
      component: {
        name: 'My.Spoilers',
      },
    });
  };

  shouldBlur() {
    const {
      showSpoilers,
      card,
    } = this.props;
    if (showSpoilers) {
      return false;
    }
    return card && card.spoiler;
  }

  _showInvestigatorCards = () => {
    const {
      card,
      showInvestigatorCards,
    } = this.props;
    showInvestigatorCards(card.code);
  };

  renderInvestigatorCardsLink() {
    const {
      componentId,
      card,
      width,
    } = this.props;
    if (!card || card.type_code !== 'investigator' || card.encounter_code !== null) {
      return null;
    }
    return (
      <React.Fragment>
        <Text style={[typography.header, styles.sectionHeader]}>
          { t`Deckbuilding` }
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._showInvestigatorCards}
            text={t`Deckbuilding Cards`}
            icon={<AppIcon name="deck" size={22 * DeviceInfo.getFontScale()} color="white" />}
          />
        </View>
        <SignatureCardsComponent
          componentId={componentId}
          investigator={card}
          width={width}
        />
      </React.Fragment>
    );
  }

  _toggleShowSpoilers = () => {
    const {
      card,
      toggleShowSpoilers,
    } = this.props;
    toggleShowSpoilers(card.code);
  };

  render() {
    const {
      componentId,
      card,
      width,
    } = this.props;
    if (this.shouldBlur()) {
      return (
        <ScrollView key={card.code} style={styles.viewContainer} contentContainerStyle={{ width }}>
          <Text style={styles.spoilerText}>
            { t`Warning: this card contains possible spoilers for '${ card.pack_name }'.` }
          </Text>
          <View style={styles.basicButtonContainer}>
            <BasicButton onPress={this._toggleShowSpoilers} title="Show card" />
          </View>
          <View style={styles.basicButtonContainer}>
            <BasicButton onPress={this._editSpoilersPressed} title="Edit my spoiler settings" />
          </View>
        </ScrollView>
      );
    }
    return (
      <ScrollView key={card.code} style={styles.viewContainer} contentContainerStyle={{ width }}>
        <TwoSidedCardComponent
          componentId={componentId}
          card={card}
          width={width}
        />
        <BondedCardsComponent
          componentId={componentId}
          card={card}
          width={width}
        />
        { this.renderInvestigatorCardsLink() }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  buttonContainer: {
    marginLeft: 8,
    marginTop: 4,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  basicButtonContainer: {
    marginLeft: 8,
    marginTop: 4,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  sectionHeader: {
    marginTop: 24,
    paddingLeft: 8,
  },
  spoilerText: {
    margin: 8,
  },
});
