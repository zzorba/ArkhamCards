import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import ArkhamButton from '@components/core/ArkhamButton';
import Card from '@data/Card';
import BondedCardsComponent from './BondedCardsComponent';
import TwoSidedCardComponent from './TwoSidedCardComponent';
import SignatureCardsComponent from './SignatureCardsComponent';
import space, { m, s } from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface Props {
  componentId?: string;
  card: Card;
  width: number;
  showSpoilers: boolean;
  tabooSetId?: number;
  toggleShowSpoilers?: (code: string) => void;
  showInvestigatorCards?: (code: string) => void;
  simple?: boolean;
}

export default class CardDetailComponent extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _editSpoilersPressed = () => {
    const { componentId } = this.props;
    if (componentId) {
      Navigation.push(componentId, {
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
    } = this.props;
    const { typography } = this.context;
    if (!card || card.type_code !== 'investigator' || card.encounter_code !== null) {
      return null;
    }
    return (
      <View style={styles.investigatorContent}>
        <Text style={[typography.header, styles.sectionHeader]}>
          { t`Deckbuilding` }
        </Text>
        <ArkhamButton
          icon="deck"
          title={t`Show all available cards`}
          onPress={this._showInvestigatorCards}
        />
        <SignatureCardsComponent
          componentId={componentId}
          investigator={card}
          width={width}
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
    } = this.props;
    const { backgroundStyle } = this.context;
    if (this.shouldBlur()) {
      return (
        <View key={card.code} style={[styles.viewContainer, backgroundStyle, { width }]}>
          <Text style={[space.marginS]}>
            { t`Warning: this card contains possible spoilers for '${ card.pack_name }'.` }
          </Text>
          <BasicButton onPress={this._toggleShowSpoilers} title="Show card" />
          <BasicButton onPress={this._editSpoilersPressed} title="Edit my spoiler settings" />
        </View>
      );
    }
    return (
      <View key={card.code} style={[styles.viewContainer, backgroundStyle, { width }]}>
        <TwoSidedCardComponent
          componentId={componentId}
          card={card}
          width={width}
          simple={!!simple}
        />
        <BondedCardsComponent
          componentId={componentId}
          card={card}
          width={width}
        />
        { this.renderInvestigatorCardsLink() }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  sectionHeader: {
    marginTop: m + s,
    paddingLeft: s,
  },
  investigatorContent: {
    width: '100%',
    maxWidth: 768,
  },
});
