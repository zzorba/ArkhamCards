import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useSelector } from 'react-redux';
import { t } from 'ttag';

import CardDetailComponent from './CardDetailComponent';
import { CardFaqProps } from '@components/card/CardFaqView';
import { InvestigatorCardsProps } from '../../cardlist/InvestigatorCardsView';
import { NavigationProps } from '@components/nav/types';
import { iconsMap } from '@app/NavIcons';
import COLORS from '@styles/colors';
import { getShowSpoilers, AppState } from '@reducers';
import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import { useComponentDidAppear, useFlag, useNavigationButtonPressed } from '@components/core/hooks';
import space from '@styles/space';
import useSingleCard from '../useSingleCard';
import CardCustomizationOptions from './CardCustomizationOptions';
import { Customizations, DeckId } from '@actions/types';
import { useCardCustomizations, useParsedDeck } from '@components/deck/hooks';

export function rightButtonsForCard(card?: Card, color?: string) {
  const rightButtons = card?.custom() ? [] : [{
    icon: iconsMap.world,
    id: 'share',
    color: color || COLORS.M,
    accessibilityLabel: t`Share`,
  }, {
    icon: iconsMap.wild,
    id: 'faq',
    color: color || COLORS.M,
    accessibilityLabel: t`FAQ`,
  }];
  if (card?.encounter_code) {
    return rightButtons;
  }
  if (card && card.type_code === 'investigator') {
    rightButtons.push({
      icon: iconsMap.deck,
      id: 'deck',
      color: color || COLORS.M,
      accessibilityLabel: t`Deckbuilding Cards`,
    });
  } else if (card && (card.deck_limit || 0) > 0) {
    rightButtons.push({
      icon: iconsMap.per_investigator,
      id: 'investigator',
      color: color || COLORS.M,
      accessibilityLabel: t`Investigators`,
    });
  }
  return rightButtons;
}

export interface CardDetailProps {
  id: string;
  back_id?: string;
  pack_code: string;
  showSpoilers?: boolean;
  tabooSetId?: number;
  deckId: DeckId | undefined;
  initialCustomizations: Customizations | undefined;
}

type Props = NavigationProps & CardDetailProps;

function options() {
  return {
    topBar: {
      backButton: {
        title: t`Back`,
        color: COLORS.M,
      },
    },
  };
}

function showFaq(componentId: string, id: string) {
  Navigation.push<CardFaqProps>(componentId, {
    component: {
      name: 'Card.Faq',
      passProps: {
        id,
      },
      options: {
        topBar: {
          title: {
            text: t`FAQ`,
          },
        },
      },
    },
  });
}

function CardDetailView({
  componentId, id,
  back_id,
  pack_code,
  showSpoilers: propsShowSpoilers,
  tabooSetId: tabooSetIdOverride,
  deckId,
  initialCustomizations,
}: Props) {
  const { backgroundStyle, typography, width } = useContext(StyleContext);
  const showSpoilersSelector = useCallback((state: AppState) => propsShowSpoilers || getShowSpoilers(state, pack_code), [propsShowSpoilers, pack_code]);
  const showSpoilersSetting = useSelector(showSpoilersSelector);

  const [showSpoilers, toggleShowSpoilers] = useFlag(showSpoilersSetting);
  const showInvestigatorCards = useCallback(() => {
    Navigation.push<InvestigatorCardsProps>(componentId, {
      component: {
        name: 'Browse.InvestigatorCards',
        passProps: {
          investigatorCode: back_id || id,
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
  }, [componentId, back_id, id]);

  useComponentDidAppear(() => {
    Navigation.mergeOptions(componentId, options());
  }, componentId, []);
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'share') {
      Linking.openURL(`https://arkhamdb.com/card/${id}#reviews-header`);
    } else if (buttonId === 'deck') {
      showInvestigatorCards();
    } else if (buttonId === 'faq') {
      showFaq(componentId, id);
    } else if (buttonId === 'back') {
      Navigation.pop(componentId);
    }
  }, componentId, [componentId, id, showInvestigatorCards]);
  const [originalCard, loading] = useSingleCard(id, 'encounter', tabooSetIdOverride);
  const [customizations, setChoice] = useCardCustomizations(deckId, initialCustomizations);
  const customizationChoices = customizations[id];
  const card = useMemo(() => originalCard?.withCustomizations(customizationChoices), [originalCard, customizationChoices]);
  const [backCard] = useSingleCard(back_id, 'encounter', tabooSetIdOverride);
  useEffect(() => {
    if (card) {
      Navigation.mergeOptions(componentId, {
        topBar: {
          rightButtons: rightButtonsForCard(card),
        },
      });
    }
  }, [card, componentId]);
  const parsedDeckObj = useParsedDeck(deckId, componentId);
  if (loading) {
    return <View style={[styles.wrapper, backgroundStyle]} />;
  }
  if (!card) {
    const code = id;
    return (
      <Text style={[typography.text, space.paddingM]}>
        { t`Missing card #${code}. Please try updating cards from ArkhamDB in settings.` }
      </Text>
    );
  }
  return (
    <ScrollView style={[styles.wrapper, backgroundStyle]}>
      <CardDetailComponent
        width={width}
        componentId={componentId}
        card={card}
        backCard={backCard}
        showSpoilers={showSpoilersSetting || showSpoilers}
        toggleShowSpoilers={toggleShowSpoilers}
        showInvestigatorCards={showInvestigatorCards}
      />
      { !!card.customization_options && !!originalCard && (
        <CardCustomizationOptions
          componentId={componentId}
          card={originalCard}
          deckId={deckId}
          customizationOptions={card.customization_options}
          customizationChoices={customizationChoices}
          width={width}
          editable={parsedDeckObj.editable}
          mode={parsedDeckObj.deckEdits?.mode}
          setChoice={setChoice}
        />
      ) }
    </ScrollView>
  );
}

CardDetailView.options = options;

export default CardDetailView;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
