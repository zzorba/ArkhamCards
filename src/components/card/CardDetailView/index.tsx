import React from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { connect } from 'react-redux';
import { t } from 'ttag';

import CardDetailComponent from './CardDetailComponent';
import SingleCardWrapper from '@components/card/SingleCardWrapper';
import { CardFaqProps } from '@components/card/CardFaqView';
import { InvestigatorCardsProps } from '../../cardlist/InvestigatorCardsView';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import { NavigationProps } from '@components/nav/types';
import { iconsMap } from '@app/NavIcons';
import COLORS from '@styles/colors';
import { getShowSpoilers, getTabooSet, AppState } from '@reducers';
import Card from '@data/Card';

export function rightButtonsForCard(card?: Card, color?: string) {
  const rightButtons = [{
    icon: iconsMap.web,
    id: 'share',
    color: color || COLORS.navButton,
    testID: t`Share`,
  }, {
    icon: iconsMap.faq,
    id: 'faq',
    color: color || COLORS.navButton,
    testID: t`FAQ`,
  }];
  if (card &&
    card.type_code === 'investigator' &&
    card.encounter_code === null
  ) {
    rightButtons.push({
      icon: iconsMap.deck,
      id: 'deck',
      color: color || COLORS.navButton,
      testID: t`Deckbuilding Cards`,
    });
  }
  return rightButtons;
}

interface ReduxProps {
  showSpoilers: boolean;
  tabooSetId?: number;
}

export interface CardDetailProps {
  id: string;
  pack_code: string;
  showSpoilers?: boolean;
  tabooSetId?: number;
}

type Props = NavigationProps & DimensionsProps & CardDetailProps & ReduxProps;

interface State {
  showSpoilers: boolean;
}

class CardDetailView extends React.Component<Props, State> {
  static get options() {
    return {
      topBar: {
        backButton: {
          title: t`Back`,
        },
      },
    };
  }

  navUpdated: boolean;
  _navEventListener?: EventSubscription;

  constructor(props: Props) {
    super(props);

    this.state = {
      showSpoilers: props.showSpoilers || false,
    };
    this.navUpdated = false;

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    const {
      componentId,
      id,
    } = this.props;
    if (buttonId === 'share') {
      Linking.openURL(`https://arkhamdb.com/card/${id}#reviews-header`);
    } else if (buttonId === 'deck') {
      this._showInvestigatorCards();
    } else if (buttonId === 'faq') {
      this._showFaq();
    } else if (buttonId === 'back') {
      Navigation.pop(componentId);
    }
  }

  _showFaq = () => {
    const {
      componentId,
      id,
    } = this.props;
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
  };

  _showInvestigatorCards = () => {
    const {
      componentId,
      id,
    } = this.props;
    Navigation.push<InvestigatorCardsProps>(componentId, {
      component: {
        name: 'Browse.InvestigatorCards',
        passProps: {
          investigatorCode: id,
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
  };

  _toggleShowSpoilers = () => {
    this.setState({
      showSpoilers: !this.state.showSpoilers,
    });
  };


  render() {
    const {
      componentId,
      showSpoilers,
      tabooSetId,
      width,
      fontScale,
      id,
    } = this.props;
    return (
      <SingleCardWrapper code={id} type="encounter" loadingComponent={<View style={styles.wrapper} />}>
        { (card: Card) => {
          if (!this.navUpdated) {
            this.navUpdated = true;
            Navigation.mergeOptions(componentId, {
              topBar: {
                rightButtons: rightButtonsForCard(card),
              },
            });
          }
          if (!card) {
            return null;
          }
          return (
            <ScrollView style={styles.wrapper}>
              <CardDetailComponent
                width={width}
                fontScale={fontScale}
                componentId={componentId}
                card={card}
                showSpoilers={showSpoilers || this.state.showSpoilers}
                tabooSetId={tabooSetId}
                toggleShowSpoilers={this._toggleShowSpoilers}
                showInvestigatorCards={this._showInvestigatorCards}
              />
            </ScrollView>
          );
        } }
      </SingleCardWrapper>
    );

  }
}

function mapStateToProps(
  state: AppState,
  props: NavigationProps & CardDetailProps
): ReduxProps {
  return {
    showSpoilers: props.showSpoilers || getShowSpoilers(state, props.pack_code),
    tabooSetId: getTabooSet(state, props.tabooSetId),
  };
}

export default
connect<ReduxProps, {}, NavigationProps & CardDetailProps, AppState>(mapStateToProps)(
  withDimensions(CardDetailView)
);

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
