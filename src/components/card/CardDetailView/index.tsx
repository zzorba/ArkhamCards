import React, { useCallback, useContext, useEffect } from 'react';
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

export function rightButtonsForCard(card?: Card, color?: string) {
  const rightButtons = [{
    icon: iconsMap.web,
    id: 'share',
    color: color || COLORS.M,
    accessibilityLabel: t`Share`,
  }, {
    icon: iconsMap.wild,
    id: 'faq',
    color: color || COLORS.M,
    accessibilityLabel: t`FAQ`,
  }];
  if (card &&
    card.type_code === 'investigator' &&
    card.encounter_code === null
  ) {
    rightButtons.push({
      icon: iconsMap.deck,
      id: 'deck',
      color: color || COLORS.M,
      accessibilityLabel: t`Deckbuilding Cards`,
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

function CardDetailView({ componentId, id, back_id, pack_code, showSpoilers: propsShowSpoilers, tabooSetId: tabooSetIdOverride }: Props) {
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
