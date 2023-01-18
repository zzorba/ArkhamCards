import { Platform, Linking } from 'react-native';
import React, { useMemo } from 'react';
import { Navigation, OptionsTopBar, Options, OptionsModalPresentationStyle } from 'react-native-navigation';
import { startsWith, map, range } from 'lodash';
import { t } from 'ttag';

import { usePickerDialog, Item } from '@components/deck/dialogs';
import { DeckChartsProps } from '@components/deck/DeckChartsView';
import { DrawSimulatorProps } from '@components/deck/DrawSimulatorView';
import { DeckDetailProps } from '@components/deck/DeckDetailView';
import { CardDetailProps } from '@components/card/CardDetailView';
import { CardDetailSwipeProps } from '@components/card/DbCardDetailSwipeView';
import { CampaignId, Customizations, Deck, DeckId, ParsedDeck } from '@actions/types';
import Card from '@data/types/Card';
import { iconsMap } from '@app/NavIcons';
import { CardImageProps } from '@components/card/CardImageView';
import { ThemeColors } from '@styles/theme';
import { StyleContextType } from '@styles/StyleContext';
import Database from '@data/sqlite/Database';
import { where } from '@data/sqlite/query';
import COLORS from '@styles/colors';

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
    statusBar: {
      style: initialMode === 'upgrade' ? 'dark' : 'light',
      backgroundColor,
    },
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

export function showDeckModal(
  id: DeckId,
  deck: Deck,
  campaignId: CampaignId | undefined,
  colors: ThemeColors,
  investigator?: Card,
  initialMode?: 'upgrade' | 'edit',
  fromCampaign?: boolean
) {
  const passProps: DeckDetailProps = {
    id,
    modal: true,
    campaignId,
    title: investigator ? investigator.name : t`Deck`,
    subtitle: deck.name,
    initialMode,
    fromCampaign,
  };

  const options = getDeckOptions(colors, {
    modal: true,
    title: deck.name,
    initialMode,
  }, investigator);
  Navigation.showModal<DeckDetailProps>({
    stack: {
      children: [{
        component: {
          name: 'Deck',
          passProps,
          options,
        },
      }],
    },
  });
}

export function showCard(
  componentId: string,
  code: string,
  card: Card,
  colors: ThemeColors,
  showSpoilers: undefined | boolean,
  deckId?: DeckId,
  initialCustomizations?: Customizations,
  tabooSetId?: number,
  backCode?: string,
) {
  Navigation.push<CardDetailProps>(componentId, {
    component: {
      name: 'Card',
      passProps: {
        id: code,
        back_id: backCode,
        pack_code: card.pack_code,
        showSpoilers: !!showSpoilers,
        tabooSetId,
        deckId,
        initialCustomizations,
      },
      options: {
        topBar: {
          backButton: {
            title: t`Back`,
            color: colors.M,
          },
        },
      },
    },
  });
}

export function showCardCharts(
  componentId: string,
  parsedDeck: ParsedDeck,
  colors: ThemeColors
) {
  Navigation.push<DeckChartsProps>(componentId, {
    component: {
      name: 'Deck.Charts',
      passProps: {
        parsedDeck,
      },
      options: getDeckOptions(colors, {
        title: t`Charts`,
      }, parsedDeck.investigator),
    },
  });
}

export function showDrawSimulator(
  componentId: string,
  parsedDeck: ParsedDeck,
  colors: ThemeColors
) {
  const {
    slots,
    customizations,
    investigator,
  } = parsedDeck;
  Navigation.push<DrawSimulatorProps>(componentId, {
    component: {
      name: 'Deck.DrawSimulator',
      passProps: {
        slots,
        customizations,
      },
      options: getDeckOptions(
        colors,
        {
          title: t`Draw Simulator`,
        },
        investigator),
    },
  });
}

export function showCardSwipe(
  componentId: string,
  codes: string[],
  controls: undefined | 'side' | 'checklist' | ('side' | 'deck' | 'ignore' | 'bonded' | 'special' | 'checklist')[],
  index: number,
  colors: ThemeColors,
  initialCards?: Card[],
  showSpoilers?: boolean,
  tabooSetId?: number,
  deckId?: DeckId,
  investigator?: Card,
  editable?: boolean,
  initialCustomizations?: Customizations,
  customizationsEditable?: boolean
) {
  const options = investigator ?
    getDeckOptions(colors, { title: '' }, investigator) :
    {
      topBar: {
        backButton: {
          title: t`Back`,
          color: colors.M,
        },
      },
    };
  Navigation.push<CardDetailSwipeProps>(componentId, {
    component: {
      name: 'Card.Swipe',
      passProps: {
        cardCodes: codes,
        initialCards,
        initialIndex: index,
        showAllSpoilers: !!showSpoilers,
        tabooSetId,
        deckId,
        whiteNav: !!investigator,
        faction: investigator?.factionCode(),
        controls: controls === 'side' || controls === 'checklist' ? map(range(0, codes.length), () => controls) : controls,
        editable,
        initialCustomizations,
        customizationsEditable: editable || customizationsEditable,
      },
      options,
    },
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

export function showCardImage(componentId: string, card: Card, colors: ThemeColors) {
  const faction = card.factionCode();
  Navigation.push<CardImageProps>(componentId, {
    component: {
      name: 'Card.Image',
      passProps: {
        id: card.code,
      },
      options: {
        topBar: {
          backButton: {
            title: t`Back`,
            color: '#FFFFFF',
          },
          background: {
            color: faction ? colors.faction[faction].background : colors.background,
          },
          title: {
            text: card.name,
            color: faction ? '#FFFFFF' : colors.darkText,
          },
        },
        bottomTabs: {
          visible: false,
          drawBehind: true,
          animate: true,
        },
      },
    },
  });
}

export async function openUrl(
  url: string,
  context: StyleContextType,
  db: Database,
  componentId: string,
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
      showCard(componentId, code, card, context.colors, false);
      return;
    }
  }

  const rule_regex = /^((https:\/\/arkhamdb.com)?\/rules)?#(.+)$/;
  const rule_match = url.match(rule_regex);
  if (rule_match) {
    const rule_id = rule_match[3];
    const rules = await db.getRulesPaged(0, 1, where('r.id = :rule_id', { rule_id }));
    if (rules.length) {
      Navigation.push(componentId, {
        component: {
          name: 'Rule',
          passProps: {
            rule: rules[0],
          },
          options: {
            topBar: {
              backButton: {
                title: t`Back`,
              },
              title: {
                text: rules[0].title,
              },
            },
          },
        },
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
