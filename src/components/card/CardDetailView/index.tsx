import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo } from 'react';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { ArkhamNavigation, RootStackParamList } from '@navigation/types';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useSelector } from 'react-redux';
import { t } from 'ttag';

import AppIcon from '@icons/AppIcon';
import ArkhamIcon, { ArkhamSlimIcon } from '@icons/ArkhamIcon';
import CardDetailComponent from './CardDetailComponent';
import COLORS from '@styles/colors';
import { getShowSpoilers, AppState } from '@reducers';
import Card from '@data/types/Card';
import StyleContext from '@styles/StyleContext';
import { useFlag } from '@components/core/hooks';
import space from '@styles/space';
import useSingleCard from '../useSingleCard';
import CardCustomizationOptions from './CardCustomizationOptions';
import { Customizations, DeckId } from '@actions/types';
import LanguageContext from '@lib/i18n/LanguageContext';
import { SimpleDeckEditContextProvider, useAllCardCustomizations, useCardCustomizations, useDeckSlotCount } from '@components/deck/DeckEditContext';
import { HeaderButtonWithId } from '@components/core/HeaderButton';
import { getDeckScreenOptions } from '@components/nav/helper';

export function rightButtonsForCard(card?: Card, color?: string) {
  const rightButtons = card?.custom() ? [] : [{
    iconComponent: <AppIcon name="world" size={24} color={color || COLORS.M} />,
    id: 'share',
    color: color || COLORS.M,
    accessibilityLabel: t`Share`,
  }, {
    iconComponent: <ArkhamIcon name="wild" size={24} color={color || COLORS.M} />,
    id: 'faq',
    color: color || COLORS.M,
    accessibilityLabel: t`FAQ`,
  }];
  if (card?.encounter_code) {
    return rightButtons;
  }
  if (card && card.type_code === 'investigator') {
    rightButtons.push({
      iconComponent: <AppIcon name="cards" size={24} color={color || COLORS.M} />,
      id: 'deck',
      color: color || COLORS.M,
      accessibilityLabel: t`Deckbuilding Cards`,
    });
  } else if (card && (card.deck_limit ?? 0) > 0) {
    rightButtons.push({
      iconComponent: <ArkhamSlimIcon name="per_investigator" size={24} color={color || COLORS.M} />,
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
  initialCustomizations: Customizations | undefined;
  deckId: DeckId | undefined;
  deckInvestigatorId: string | undefined;
  headerBackgroundColor?: string;
}

type Props = Omit<CardDetailProps, 'deckId' | 'deckInvestigatorId'>;

function showFaq(navigation: ArkhamNavigation, id: string, cardName: string) {
  navigation.navigate('Card.Faq', { id, cardName });
}

function CardDetailView({
  id,
  back_id,
  pack_code,
  showSpoilers: propsShowSpoilers,
  tabooSetId: tabooSetIdOverride,
  initialCustomizations,
}: Props) {
  const navigation = useNavigation();
  const { backgroundStyle, typography, width } = useContext(StyleContext);
  const showSpoilersSelector = useCallback((state: AppState) => propsShowSpoilers || getShowSpoilers(state, pack_code), [propsShowSpoilers, pack_code]);
  const showSpoilersSetting = useSelector(showSpoilersSelector);

  const [showSpoilers, toggleShowSpoilers] = useFlag(showSpoilersSetting);
  const showInvestigatorCards = useCallback(() => {
    navigation.navigate('Browse.InvestigatorCards', {
      investigatorCode: back_id ?? id,
    });
  }, [navigation, back_id, id]);


  const showInvestigators = useCallback(() => {
    navigation.navigate('Card.Investigators', { code: id });
  }, [navigation, id]);
  const [card, loading] = useSingleCard(id, 'encounter', tabooSetIdOverride);
  const { listSeperator } = useContext(LanguageContext);
  const [deckCount] = useDeckSlotCount(id);
  const [customizations, setChoice] = useAllCardCustomizations(initialCustomizations);
  const customizationChoices = useCardCustomizations(card, deckCount, customizations);
  const customizedCard = useMemo(() => card?.withCustomizations(listSeperator, customizationChoices), [listSeperator, card, customizationChoices]);
  const [backCard] = useSingleCard(back_id, 'encounter', tabooSetIdOverride);

  const handleButtonPress = useCallback((buttonId: string) => {
    if (buttonId === 'share') {
      Linking.openURL(`https://arkhamdb.com/card/${id}#reviews-header`);
    } else if (buttonId === 'deck') {
      showInvestigatorCards();
    } else if (buttonId === 'faq') {
      showFaq(navigation, id, customizedCard?.name ?? '');
    } else if (buttonId === 'back') {
      navigation.goBack();
    } else if (buttonId === 'investigator') {
      showInvestigators();
    }
  }, [id, showInvestigatorCards, navigation, customizedCard, showInvestigators]);
  useEffect(() => {
    if (customizedCard) {
      const rightButtons = rightButtonsForCard(customizedCard);
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            {rightButtons.map((button) => (
              <HeaderButtonWithId
                key={button.id}
                iconComponent={button.iconComponent}
                id={button.id}
                onPress={handleButtonPress}
                accessibilityLabel={button.accessibilityLabel}
              />
            ))}
          </View>
        ),
      });
    }
  }, [customizedCard, navigation, handleButtonPress]);
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
        card={customizedCard}
        backCard={backCard}
        showSpoilers={showSpoilersSetting || showSpoilers}
        toggleShowSpoilers={toggleShowSpoilers}
        showInvestigatorCards={showInvestigatorCards}
      />
      { !!customizedCard.customization_options && !!card && (
        <CardCustomizationOptions
          card={card}
          customizationOptions={customizedCard.customization_options}
          customizationChoices={customizationChoices}
          width={width}
          setChoice={setChoice}
          editable
        />
      ) }
    </ScrollView>
  );
}

function CardDetailViewWraper() {
  const route = useRoute<RouteProp<RootStackParamList, 'Card'>>();
  const { id, back_id, pack_code, showSpoilers, tabooSetId, initialCustomizations, deckId, deckInvestigatorId } = route.params;
  const navigation = useNavigation();
  const { colors } = useContext(StyleContext);
  const [investigator] = useSingleCard(deckInvestigatorId, 'player');

  useLayoutEffect(() => {
    if (deckInvestigatorId && investigator) {
      navigation.setOptions(getDeckScreenOptions(colors, { noTitle: true }, investigator));
    }
  }, [deckInvestigatorId, investigator, colors, navigation]);

  return (
    <SimpleDeckEditContextProvider deckId={deckId} investigator={deckInvestigatorId}>
      <CardDetailView
        id={id}
        back_id={back_id}
        pack_code={pack_code}
        showSpoilers={showSpoilers}
        tabooSetId={tabooSetId}
        initialCustomizations={initialCustomizations}
      />
    </SimpleDeckEditContextProvider>
  );
}

export default CardDetailViewWraper;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});
