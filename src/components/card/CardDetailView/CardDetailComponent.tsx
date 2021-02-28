import React, { useCallback, useContext, useMemo } from 'react';
import { forEach, map } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import ArkhamButton from '@components/core/ArkhamButton';
import Card from '@data/types/Card';
import BondedCardsComponent from './BondedCardsComponent';
import TwoSidedCardComponent from './TwoSidedCardComponent';
import SignatureCardsComponent from './SignatureCardsComponent';
import space, { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useInvestigatorCards } from '@components/core/hooks';
import CardDetailSectionHeader from './CardDetailSectionHeader';

interface Props {
  componentId?: string;
  card: Card;
  width: number;
  showSpoilers: boolean;
  toggleShowSpoilers?: (code: string) => void;
  showInvestigatorCards?: (code: string) => void;
  simple?: boolean;
}

export default function CardDetailComponent({ componentId, card, width, showSpoilers, toggleShowSpoilers, showInvestigatorCards, simple }: Props) {
  const { backgroundStyle, colors, typography } = useContext(StyleContext);
  const investigators = useInvestigatorCards();
  const parallelInvestigators = useMemo(() => {
    if (card.type_code !== 'investigator') {
      return [];
    }
    const parallelInvestigators: Card[] = [];
    forEach(investigators, c => {
      if (c && c.alternate_of_code === card.code) {
        parallelInvestigators.push(c);
      }
    });
    return parallelInvestigators;
  }, [investigators, card]);
  const editSpoilersPressed = useCallback(() => {
    if (componentId) {
      Navigation.push(componentId, {
        component: {
          name: 'My.Spoilers',
        },
      });
    }
  }, [componentId]);

  const shouldBlur = useMemo(() => {
    if (showSpoilers) {
      return false;
    }
    return card && card.mythos_card;
  }, [showSpoilers, card]);

  const showInvestigatorCardsPressed = useCallback(() => {
    showInvestigatorCards && showInvestigatorCards(card.code);
  }, [card, showInvestigatorCards]);

  const investigatorCardsLink = useMemo(() => {
    if (!card || card.type_code !== 'investigator' || card.encounter_code !== null) {
      return null;
    }
    return (
      <View style={styles.investigatorContent}>
        { parallelInvestigators.length > 0 && (
          <>
            <CardDetailSectionHeader title={t`Parallel`} />
            { map(parallelInvestigators, parallel => (
              <TwoSidedCardComponent
                key={parallel.code}
                componentId={componentId}
                card={parallel}
                width={width}
                simple={!!simple}
              />
            )) }
          </>
        ) }
        <View style={styles.maxWidth}>
          <View style={[styles.deckbuildingSection, { backgroundColor: colors.L20 }]}>
            <Text style={[typography.large, typography.center, typography.uppercase]}>
              { t`Deckbuilding` }
            </Text>
          </View>
          <ArkhamButton
            icon="deck"
            title={t`Show all available cards`}
            onPress={showInvestigatorCardsPressed}
          />
        </View>
        <SignatureCardsComponent
          componentId={componentId}
          investigator={card}
          width={width}
        />
      </View>
    );
  }, [componentId, card, width, typography, colors, showInvestigatorCardsPressed, simple, parallelInvestigators]);

  const toggleShowSpoilersPressed = useCallback(() => {
    toggleShowSpoilers && toggleShowSpoilers(card.code);
  }, [card, toggleShowSpoilers]);

  if (shouldBlur) {
    return (
      <View key={card.code} style={[styles.viewContainer, backgroundStyle, { width }]}>
        <Text style={[typography.text, space.paddingM]}>
          { t`Warning: this card contains possible spoilers for '${ card.pack_name }'.` }
        </Text>
        <BasicButton onPress={toggleShowSpoilersPressed} title="Show card" />
        <BasicButton onPress={editSpoilersPressed} title="Edit my spoiler settings" />
      </View>
    );
  }

  return (
    <View key={card.code} style={[styles.viewContainer, backgroundStyle]}>
      <View style={{ width }}>
        <TwoSidedCardComponent
          componentId={componentId}
          card={card}
          width={width}
          simple={!!simple}
        />
        <BondedCardsComponent
          componentId={componentId}
          cards={[card]}
          width={width}
        />
      </View>
      { investigatorCardsLink }
    </View>
  );
}

const styles = StyleSheet.create({
  viewContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  investigatorContent: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
  },
  maxWidth: {
    width: '100%',
    maxWidth: 768,
  },
  deckbuildingSection: {
    marginTop: m + s,
    marginLeft: -8,
    marginRight: -8,
    marginBottom: 8,
    padding: s,
    paddingTop: m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
