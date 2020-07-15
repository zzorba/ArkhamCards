import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import typography from '@styles/typography';
import AppIcon from '@icons/AppIcon';
import Button from '@components/core/Button';
import BasicButton from '@components/core/BasicButton';
import Card from '@data/Card';
import BondedCardsComponent from './BondedCardsComponent';
import TwoSidedCardComponent from './TwoSidedCardComponent';
import SignatureCardsComponent from './SignatureCardsComponent';
import space, { m, s, xs } from '@styles/space';
import COLORS from '@styles/colors';

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
        <View style={[styles.buttonContainer, styles.buttonPadding]}>
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
          <Text style={[space.marginS]}>
            { t`Warning: this card contains possible spoilers for '${ card.pack_name }'.` }
          </Text>
          <BasicButton onPress={this._toggleShowSpoilers} title="Show card" />
          <BasicButton onPress={this._editSpoilersPressed} title="Edit my spoiler settings" />
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
    backgroundColor: COLORS.background,
    flexDirection: 'column',
    alignItems: 'center',
  },
  buttonPadding: {
    marginLeft: s,
    marginTop: xs,
    marginBottom: xs,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  basicButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
