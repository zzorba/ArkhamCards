import { Linking } from 'react-native';
import React, { useMemo } from 'react';
import { startsWith, map, range } from 'lodash';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { t } from 'ttag';

import { usePickerDialog, Item } from '@components/deck/dialogs';
import { CampaignId, Customizations, Deck, DeckId, ParsedDeck } from '@actions/types';
import Card from '@data/types/Card';
import { ThemeColors } from '@styles/theme';
import HeaderTitle from '@components/core/HeaderTitle';
import Database from '@data/sqlite/Database';
import { where } from '@data/sqlite/query';
import COLORS from '@styles/colors';
import { ArkhamNavigation } from '@navigation/types';
import { FactionCodeType } from '@app_constants';

// Unified deck screen options helper
export function getDeckScreenOptions(
  colors: ThemeColors,
  {
    modal,
    title,
    noTitle,
    initialMode,
  }: {
    modal?: boolean;
    title?: string;
    noTitle?: boolean;
    initialMode?: 'upgrade' | 'edit';
  } = {},
  investigator?: Card,
): NativeStackNavigationOptions {
  const textColor = initialMode === 'upgrade' ? COLORS.D30 : '#FFFFFF';
  const backgroundColor = initialMode === 'upgrade' ? colors.upgrade : colors.faction[
    (investigator ? investigator.faction_code : null) || 'neutral'
  ].background;

  const headerTitle = investigator ? investigator.name : t`Deck`;
  const headerSubtitle = title;

  const options: NativeStackNavigationOptions = {
    headerStyle: {
      backgroundColor,
    },
    headerTintColor: textColor,
    headerTitleStyle: {
      color: textColor,
    },
    statusBarStyle: initialMode === 'upgrade' ? 'dark' : 'light',
    presentation: modal ? 'fullScreenModal' : undefined,
  };

  if (!noTitle) {
    if (headerSubtitle) {
      // Custom header component for title + subtitle
      options.headerTitle = () => (
        <HeaderTitle
          title={headerTitle}
          subtitle={headerSubtitle}
          color={textColor}
        />
      );
    } else {
      // Simple title only
      options.headerTitle = () => (
        <HeaderTitle
          title={headerTitle}
          color={textColor}
        />
      );
    }
  }

  return options;
}

export function getDeckScreenOptionsFromFaction(
  colors: ThemeColors,
  factionCode?: FactionCodeType,
  initialMode?: 'upgrade' | 'edit'
): NativeStackNavigationOptions {
  const textColor = initialMode === 'upgrade' ? COLORS.D30 : '#FFFFFF';
  const backgroundColor = initialMode === 'upgrade' ? colors.upgrade : colors.faction[
    factionCode || 'neutral'
  ].background;

  return {
    headerStyle: {
      backgroundColor,
    },
    headerTintColor: textColor,
    headerTitleStyle: {
      color: textColor,
    },
    statusBarStyle: initialMode === 'upgrade' ? 'dark' : 'light',
  };
}

export function showDeckModal(
  navigation: ArkhamNavigation,
  colors: ThemeColors,
  id: DeckId,
  deck: Deck,
  campaignId: CampaignId | undefined,
  investigator?: Card,
  initialMode?: 'upgrade' | 'edit',
  fromCampaign?: boolean
) {
  const backgroundColor = initialMode === 'upgrade' ? colors.upgrade : (investigator ? colors.faction[investigator.factionCode()].background : undefined);
  navigation.navigate('Deck', {
    id,
    modal: true,
    campaignId,
    title: investigator ? investigator.name : t`Deck`,
    subtitle: deck.name,
    initialMode,
    fromCampaign,
    headerBackgroundColor: backgroundColor,
  });
}

type ShowCardOptions = {
  showSpoilers: undefined | boolean;
  tabooSetId?: number;
  backCode?: string;
  initialCustomizations?: Customizations;
  deckId?: DeckId;
  deckInvestigatorId?: string;
  investigator?: Card;
}

export function showCard(
  navigation: ArkhamNavigation,
  code: string,
  card: Card,
  colors: ThemeColors,
  options: ShowCardOptions
) {
  const { showSpoilers, deckId, initialCustomizations, tabooSetId, backCode, investigator } = options;
  navigation.navigate('Card', {
    id: code,
    back_id: backCode,
    pack_code: card.pack_code,
    showSpoilers: !!showSpoilers,
    tabooSetId,
    deckId,
    deckInvestigatorId: options.deckInvestigatorId,
    initialCustomizations,
    headerBackgroundColor: investigator && colors ? colors.faction[investigator.factionCode()].background : undefined,
  });
}

export function showCardCharts(
  navigation: ArkhamNavigation,
  colors: ThemeColors,
  parsedDeck: ParsedDeck,
) {
  navigation.navigate('Deck.Charts', {
    parsedDeck,
    headerBackgroundColor: colors.faction[parsedDeck.faction ?? 'neutral'].background,
  });
}

export function showDrawSimulator(
  navigation: ArkhamNavigation,
  colors: ThemeColors,
  parsedDeck: ParsedDeck,
) {
  const {
    slots,
    customizations,
    investigator,
  } = parsedDeck;
  navigation.navigate('Deck.DrawSimulator', {
    slots,
    customizations,
    investigator: investigator.front,
    headerBackgroundColor: colors.faction[parsedDeck.faction ?? 'neutral'].background,
  });
}

export function showCardSwipe(
  navigation: ArkhamNavigation,
  colors: ThemeColors,
  codes: string[],
  controls: undefined | 'side' | 'extra' | 'checklist' | ('side' | 'deck' | 'extra' | 'ignore' | 'bonded' | 'attachment' | 'special' | 'checklist')[],
  index: number,
  initialCards?: Card[],
  showSpoilers?: boolean,
  tabooSetId?: number,
  deckId?: DeckId,
  investigator?: Card,
  editable?: boolean,
  initialCustomizations?: Customizations,
  customizationsEditable?: boolean
) {
  navigation.navigate('Card.Swipe', {
    cardCodes: codes,
    initialCards,
    initialIndex: index,
    showAllSpoilers: !!showSpoilers,
    tabooSetId,
    deckId,
    whiteNav: !!investigator,
    faction: investigator?.factionCode(),
    controls: controls === 'side' || controls === 'extra' || controls === 'checklist' ? map(range(0, codes.length), () => controls) : controls,
    editable,
    initialCustomizations,
    customizationsEditable: editable || customizationsEditable,
    headerBackgroundColor: investigator ? colors.faction[investigator.factionCode()].background : undefined,
  });
}

export function useOptionDialog(
  title: string,
  selectedValue: number | undefined,
  options: string[],
  onSelect: (index: number) => void,
): [React.ReactNode, () => void] {
  const items: Item<number>[] = useMemo(() => [
    ...map(options, (title, idx) => {
      return {
        title,
        value: idx,
      };
    }),
  ], [options]);
  return usePickerDialog({ title, items, onValueChange: onSelect, selectedValue });
}

export function showCardImage(
  navigation: ArkhamNavigation,
  card: Card,
) {
  navigation.navigate('Card.Image', {
    id: card.code,
    cardName: card.name,
  });
}

export async function openUrl(
  navigation: ArkhamNavigation,
  url: string,
  db: Database,
  colors: ThemeColors,
  tabooSetId?: number,
) {
  const card_regex = /\/card\/(\d+)/;
  const card_match = url.match(card_regex);

  if (card_match) {
    const code = card_match[1];
    const card = await db.getCard(
      where('c.code = :code', { code }),
      tabooSetId
    );
    if (card) {
      showCard(navigation, code, card, colors, { showSpoilers: false });
      return;
    }
  }

  const rule_regex = /^((https:\/\/arkhamdb.com)?\/rules)?#(.+)$/;
  const rule_match = url.match(rule_regex);
  if (rule_match) {
    const rule_id = rule_match[3];
    const rules = await db.getRulesPaged(0, 1, where('r.id = :rule_id', { rule_id }));
    if (rules.length) {
      navigation.navigate('Rule', {
        rule: rules[0],
      }, { merge: false });
      return;
    }
  }

  if (startsWith(url, '/')) {
    url = `https://arkhamdb.com${url}`;
  }

  if (url.indexOf('arkhamdb.com') !== -1) {
    Linking.openURL(url);
  }
}

export default {
  showDeckModal,
  showCard,
  useOptionDialog,
  openUrl,
};
