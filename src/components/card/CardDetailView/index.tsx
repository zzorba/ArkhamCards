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
import LanguageContext from '@lib/i18n/LanguageContext';
import { CustomizationChoice } from '@data/types/CustomizationOption';
import { flatMap } from 'lodash';

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

const NO_CUSTOMIZATIONS: CustomizationChoice[] = [];
function CardDetailView({
  componentId,
  id,
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
  const [card, loading] = useSingleCard(id, 'encounter', tabooSetIdOverride);
  const [customizations, setChoice] = useCardCustomizations(deckId, initialCustomizations);
  const { listSeperator } = useContext(LanguageContext);
  const parsedDeckObj = useParsedDeck(deckId, componentId);
  const deckCount = card && parsedDeckObj.deckEdits?.slots[card.code];
  const customizationChoices: CustomizationChoice[] | undefined = useMemo(() => {
    if (card && deckId) {
      if (deckCount) {
        if (customizations[card.code]) {
          return customizations[card.code];
        }
        return flatMap(card.customization_options, (option, idx) => {
          if (option.xp === 0) {
            return card.customizationChoice(idx, 0, undefined, undefined) || [];
          }
          return [];
        })
      }
      return NO_CUSTOMIZATIONS;
    }
    return undefined;
  }, [deckId, customizations, card, deckCount]);
  const customizedCard = useMemo(() => card?.withCustomizations(listSeperator, customizationChoices), [listSeperator, card, customizationChoices]);
  const [backCard] = useSingleCard(back_id, 'encounter', tabooSetIdOverride);
  useEffect(() => {
    if (customizedCard) {
      Navigation.mergeOptions(componentId, {
        topBar: {
          rightButtons: rightButtonsForCard(customizedCard),
        },
      });
    }
  }, [customizedCard, componentId]);
  if (loading) {
    return <View style={[styles.wrapper, backgroundStyle]} />;
  }
  if (!customizedCard) {
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
        card={customizedCard}
        backCard={backCard}
        showSpoilers={showSpoilersSetting || showSpoilers}
        toggleShowSpoilers={toggleShowSpoilers}
        showInvestigatorCards={showInvestigatorCards}
      />
      { !!customizedCard.customization_options && !!card && (
        <CardCustomizationOptions
          componentId={componentId}
          card={card}
          mode={parsedDeckObj.deckEdits?.mode}
          deckId={deckId}
          customizationOptions={customizedCard.customization_options}
          customizationChoices={customizationChoices}
          width={width}
          editable={parsedDeckObj.editable}
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
