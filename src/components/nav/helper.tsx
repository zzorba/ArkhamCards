import { Platform, Linking } from 'react-native';
import React, { useMemo } from 'react';
import { startsWith, map, range } from 'lodash';
import { NavigationProp } from '@react-navigation/native';
import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { t } from 'ttag';

import { usePickerDialog, Item } from '@components/deck/dialogs';
import { CampaignId, Customizations, Deck, DeckId, ParsedDeck } from '@actions/types';
import Card from '@data/types/Card';
import { iconsMap } from '@app/NavIcons';
import { ThemeColors } from '@styles/theme';
import HeaderTitle from '@components/core/HeaderTitle';
import Database from '@data/sqlite/Database';
import { where } from '@data/sqlite/query';
import COLORS from '@styles/colors';
import { ArkhamNavigation, RootStackParamList } from '@navigation/types';

export function getDeckOptions(
  colors: ThemeColors,
  {
    inputOptions = {},
    modal,
    title,
    noTitle,
    initialMode,
  }: {
    inputOptions?: Options;
    modal?: boolean;
    title?: string;
    noTitle?: boolean;
    initialMode?: 'upgrade' | 'edit';
  } = {},
  investigator?: Card,
): Options {
  const topBarOptions: OptionsTopBar = inputOptions.topBar || {};
  const textColor = initialMode === 'upgrade' ? COLORS.D30 : '#FFFFFF';
  const backgroundColor = initialMode === 'upgrade' ? colors.upgrade : colors.faction[
    (investigator ? investigator.faction_code : null) || 'neutral'
  ].background;
  const options: Options = {
    statusBar: Platform.select({
      android: { style: 'dark' },
      ios: {
        style: initialMode === 'upgrade' ? 'dark' : 'light',
        backgroundColor,
      },
    }),
    modalPresentationStyle: Platform.OS === 'ios' ?
      OptionsModalPresentationStyle.fullScreen :
      OptionsModalPresentationStyle.overCurrentContext,
    topBar: {
      backButton: {
        title: t`Back`,
        color: textColor,
        ...topBarOptions.backButton,
      },
      leftButtons: modal ? [
        Platform.OS === 'ios' ? {
          text: t`Done`,
          id: 'back',
          color: textColor,
        } : {
          icon: iconsMap['arrow-left'],
          id: 'androidBack',
          color: textColor,
        },
      ] : topBarOptions.leftButtons || [],
      background: {
        color: backgroundColor,
      },
      rightButtons: topBarOptions.rightButtons,
    },
    layout: {
      backgroundColor: colors.L30,
    },
    bottomTabs: {
      visible: false,
      drawBehind: true,
      animate: true,
    },
  };
  if (!noTitle && options.topBar) {
    options.topBar.title = {
      fontFamily: 'Alegreya-Medium',
      fontSize: 20,
      text: (investigator ? investigator.name : t`Deck`),
      color: textColor,
    };
    options.topBar.subtitle = {
      text: title,
      fontFamily: 'Alegreya-Medium',
      fontSize: 14,
      color: textColor,
    };
  }
  return options;
}

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

export function showDeckModal(
  navigation: ArkhamNavigation,
  id: DeckId,
  deck: Deck,
  campaignId: CampaignId | undefined,
  investigator?: Card,
  initialMode?: 'upgrade' | 'edit',
  fromCampaign?: boolean
) {
  navigation.navigate('Deck', {
    id,
    modal: true,
    campaignId,
    title: investigator ? investigator.name : t`Deck`,
    subtitle: deck.name,
    initialMode,
    fromCampaign,
  });
}

type ShowCardOptions = {
  showSpoilers: undefined | boolean;
  tabooSetId?: number;
  backCode?: string;
  initialCustomizations?: Customizations;
  deckId?: DeckId;
  deckInvestigatorId?: string;
}

export function showCard(
  navigation: ArkhamNavigation,
  code: string,
  card: Card,
  options: ShowCardOptions
) {
  const { showSpoilers, deckId, initialCustomizations, tabooSetId, backCode } = options;
  navigation.navigate('Card', {
    id: code,
    back_id: backCode,
    pack_code: card.pack_code,
    showSpoilers: !!showSpoilers,
    tabooSetId,
    deckId,
    deckInvestigatorId: options.deckInvestigatorId,
    initialCustomizations,
  });
}

export function showCardCharts(
  navigation: ArkhamNavigation,
  parsedDeck: ParsedDeck,
) {
  navigation.navigate('Deck.Charts', {
    parsedDeck,
  });
}

export function showDrawSimulator(
  navigation: ArkhamNavigation,
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
  });
}

export function showCardSwipe(
  navigation: ArkhamNavigation,
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
      showCard(navigation, code, card, { showSpoilers: false });
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
      });
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
  getDeckOptions,
  showCard,
  useOptionDialog,
  openUrl,
};
