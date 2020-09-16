import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import ChangesFromPreviousDeck from './ChangesFromPreviousDeck';
import EditTraumaComponent from '@components/campaign/EditTraumaComponent';
import CampaignSummaryComponent from '@components/campaign/CampaignSummaryComponent';
import CardSectionHeader from '@components/core/CardSectionHeader';
import { Campaign, Deck, ParsedDeck, Slots, Trauma } from '@actions/types';
import Card, { CardsMap } from '@data/Card';
import { fetchPublicDeck, fetchPrivateDeck } from '@components/deck/actions';
import typography from '@styles/typography';
import space, { l, m, s } from '@styles/space';

interface OwnProps {
  componentId: string;
  deck: Deck;
  cards: CardsMap;
  parsedDeck: ParsedDeck;
  isPrivate: boolean;
  editable: boolean;
  campaign?: Campaign;
  hideCampaign?: boolean;
  title?: string;
  onTitlePress?: (deck: ParsedDeck) => void;
  showTraumaDialog?: (investigator: Card, traumaData: Trauma) => void;
  showDeckHistory?: () => void;
  investigatorDataUpdates?: any;
  xpAdjustment: number;
  showDeckUpgrade?: () => void;
  tabooSetId?: number;
  renderFooter?: (slots?: Slots) => React.ReactNode;
  onDeckCountChange?: (code: string, count: number) => void;
  singleCardView?: boolean;
}

interface ReduxActionProps {
  fetchPrivateDeck: (deckId: number) => void;
  fetchPublicDeck: (deckId: number, useDeckEndpoint: boolean) => void;
}

type Props = OwnProps & ReduxActionProps;

class DeckProgressComponent extends React.PureComponent<Props> {
  investigatorData() {
    const {
      campaign,
      investigatorDataUpdates,
    } = this.props;
    if (!campaign) {
      return null;
    }
    return Object.assign(
      {},
      campaign.investigatorData || {},
      investigatorDataUpdates
    );
  }

  renderCampaignSection() {
    const {
      campaign,
      parsedDeck: {
        investigator,
      },
      showTraumaDialog,
      showDeckUpgrade,
      editable,
      hideCampaign,
    } = this.props;
    if (!editable) {
      return null;
    }
    return (
      <React.Fragment>
        <CardSectionHeader
          investigator={investigator}
          section={{ superTitle: t`Campaign` }}
        />
        { !!campaign && !hideCampaign && (
          <View style={styles.campaign}>
            <Text style={[typography.text, space.marginBottomS]}>
              { campaign.name }
            </Text>
            <View style={space.marginBottomM}>
              <CampaignSummaryComponent campaign={campaign} hideScenario />
            </View>
            { !!showTraumaDialog && !campaign.guided && (
              <EditTraumaComponent
                investigator={investigator}
                investigatorData={this.investigatorData()}
                showTraumaDialog={showTraumaDialog}
              />
            ) }
          </View>
        ) }
        { !!showDeckUpgrade && (
          <BasicButton
            title={t`Upgrade Deck with XP`}
            onPress={showDeckUpgrade}
          />
        ) }
      </React.Fragment>
    );
  }

  render() {
    const {
      campaign,
      componentId,
      deck,
      cards,
      parsedDeck,
      xpAdjustment,
      editable,
      tabooSetId,
      renderFooter,
      onDeckCountChange,
      singleCardView,
      title,
      onTitlePress,
      showDeckHistory,
    } = this.props;

    if (!deck.previous_deck && !deck.next_deck && !campaign && !editable && !title) {
      return null;
    }

    // Actually compute the diffs.
    return (
      <View style={styles.container}>
        { this.renderCampaignSection() }
        <ChangesFromPreviousDeck
          componentId={componentId}
          title={title}
          cards={cards}
          parsedDeck={parsedDeck}
          xpAdjustment={xpAdjustment}
          tabooSetId={tabooSetId}
          renderFooter={renderFooter}
          onDeckCountChange={onDeckCountChange}
          singleCardView={singleCardView}
          editable={editable}
          onTitlePress={onTitlePress}
        />
        { !!editable && !!deck.previous_deck && !!showDeckHistory && (
          <BasicButton
            title={t`Upgrade History`}
            onPress={showDeckHistory}
          />
        ) }
      </View>
    );
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    fetchPublicDeck,
    fetchPrivateDeck,
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckProgressComponent);


const styles = StyleSheet.create({
  container: {
    marginTop: m,
    marginBottom: l,
  },
  campaign: {
    marginTop: s,
    marginLeft: s,
    marginRight: s,
  },
});
