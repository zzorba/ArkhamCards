import React from 'react';
import {
  Button as BasicButton,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import typography from 'styles/typography';
import AppIcon from 'icons/AppIcon';
import Button from 'components/core/Button';
import Card from 'data/Card';
import BondedCardsComponent from './BondedCardsComponent';
import TwoSidedCardComponent from './TwoSidedCardComponent';
import SignatureCardsComponent from './SignatureCardsComponent';

interface Props {
  componentId?: string;
  card: Card;
  width: number;
  fontScale: number;
  showSpoilers: boolean;
  tabooSetId?: number;
  toggleShowSpoilers?: (code: string) => void;
  showInvestigatorCards?: (code: string) => void;
  simple?: boolean;
}

export default class CardDetailComponent extends React.Component<Props> {
  public static defaultProps = {
    simple: false,
  };

  _editSpoilersPressed = () => {
    const { componentId } = this.props;
    if (componentId) {
      Navigation.push<{}>(componentId, {
        component: {
          name: 'My.Spoilers',
        },
      });
    }
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
    showInvestigatorCards && showInvestigatorCards(card.code);
  };

  renderInvestigatorCardsLink() {
    const {
      componentId,
      card,
      width,
      fontScale,
    } = this.props;
    if (!card || card.type_code !== 'investigator' || card.encounter_code !== null) {
      return null;
    }
    return (
      <View style={styles.investigatorContent}>
        <Text style={[typography.header, styles.sectionHeader]}>
          { t`Deckbuilding` }
        </Text>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._showInvestigatorCards}
            text={t`Deckbuilding Cards`}
            icon={<AppIcon name="deck" size={22 * fontScale} color="white" />}
          />
        </View>
        <SignatureCardsComponent
          componentId={componentId}
          investigator={card}
          width={width}
          fontScale={fontScale}
        />
      </View>
    );
  }

  _toggleShowSpoilers = () => {
    const {
      card,
      toggleShowSpoilers,
    } = this.props;
    toggleShowSpoilers && toggleShowSpoilers(card.code);
  };

  render() {
    const {
      componentId,
      card,
      simple,
      width,
      fontScale,
    } = this.props;
    if (this.shouldBlur()) {
      return (
        <View key={card.code} style={[styles.viewContainer, { width }]}>
          <Text style={styles.spoilerText}>
            { t`Warning: this card contains possible spoilers for '${ card.pack_name }'.` }
          </Text>
          <View style={styles.basicButtonContainer}>
            <BasicButton onPress={this._toggleShowSpoilers} title="Show card" />
          </View>
          <View style={styles.basicButtonContainer}>
            <BasicButton onPress={this._editSpoilersPressed} title="Edit my spoiler settings" />
          </View>
        </View>
      );
    }
    return (
      <View key={card.code} style={[styles.viewContainer, { width }]}>
        <TwoSidedCardComponent
          componentId={componentId}
          card={card}
          width={width}
          fontScale={fontScale}
          simple={simple}
        />
        <BondedCardsComponent
          componentId={componentId}
          card={card}
          width={width}
          fontScale={fontScale}
        />
        { this.renderInvestigatorCardsLink() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    backgroundColor: 'white',
    flexDirection: 'column',
    alignItems: 'center',
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
  investigatorContent: {
    width: '100%',
    maxWidth: 768,
  },
});
