import React from 'react';
import { filter, throttle } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { t } from 'ttag';

import CollapsibleSearchBox from '@components/core/CollapsibleSearchBox';
import BasicButton from '@components/core/BasicButton';
import { CUSTOM, Campaign, DecksMap } from '@actions/types';
import CampaignList from './CampaignList';
import { campaignNames } from '@components/campaign/constants';
import { searchMatchesText } from '@components/core/searchHelpers';
import withFetchCardsGate from '@components/card/withFetchCardsGate';
import { iconsMap } from '@app/NavIcons';
import { getAllDecks, getCampaigns, AppState } from '@reducers';
import typography from '@styles/typography';
import COLORS from '@styles/colors';
import { m } from '@styles/space';

interface OwnProps {
  componentId: string;
}

interface ReduxProps {
  campaigns: Campaign[];
  decks: DecksMap;
}

type Props = OwnProps & ReduxProps;

interface State {
  search: string;
}

class MyCampaignsView extends React.Component<Props, State> {
  static get options() {
    return {
      topBar: {
        title: {
          text: t`Campaigns`,
        },
        rightButtons: [{
          icon: iconsMap.add,
          id: 'add',
          color: COLORS.navButton,
          testID: t`New Campaign`,
        }],
      },
    };
  }

  _navEventListener?: EventSubscription;
  _showNewCampaignDialog!: () => void;

  constructor(props: Props) {
    super(props);

    this.state = {
      search: '',
    };

    this._showNewCampaignDialog = throttle(this.showNewCampaignDialog.bind(this), 200);
    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  _searchChanged = (text: string) => {
    this.setState({
      search: text,
    });
  };

  showNewCampaignDialog() {
    const {
      componentId,
    } = this.props;
    Navigation.push<{}>(componentId, {
      component: {
        name: 'Campaign.New',
        options: {
          topBar: {
            title: {
              text: t`New Campaign`,
            },
            backButton: {
              title: t`Cancel`,
            },
          },
        },
      },
    });
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    if (buttonId === 'add') {
      this._showNewCampaignDialog();
    }
  }


  filteredCampaigns(): Campaign[] {
    const {
      campaigns,
    } = this.props;
    const {
      search,
    } = this.state;

    return filter<Campaign>(campaigns, campaign => {
      const parts = [campaign.name];
      if (campaign.cycleCode !== CUSTOM) {
        parts.push(campaignNames()[campaign.cycleCode]);
      }
      return searchMatchesText(search, parts);
    });
  }

  renderConditionalFooter(campaigns: Campaign[]) {
    const {
      search,
    } = this.state;
    if (campaigns.length === 0) {
      if (search) {
        return (
          <View style={styles.footer}>
            <Text style={[typography.text]}>
              { t`No matching campaigns for "${search}".` }
            </Text>
          </View>
        );
      }
      return (
        <View style={styles.footer}>
          <Text style={[typography.text]}>
            { t`No campaigns yet.\n\nUse the + button to create a new one.\n\nYou can use this app to keep track of campaigns, including investigator trauma, the chaos bag, basic weaknesses, campaign notes and the experience values for all decks.` }
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.footer} />
    );
  }

  renderFooter(campaigns: Campaign[]) {
    return (
      <View>
        { this.renderConditionalFooter(campaigns) }
        <BasicButton
          title={t`New Campaign`}
          onPress={this._showNewCampaignDialog}
        />
        <View style={styles.gutter} />
      </View>
    );
  }

  render() {
    const { componentId } = this.props;
    const { search } = this.state;
    const campaigns = this.filteredCampaigns();
    return (
      <CollapsibleSearchBox
        prompt={t`Search campaigns`}
        searchTerm={search}
        onSearchChange={this._searchChanged}
      >
        { onScroll => (
          <CampaignList
            onScroll={onScroll}
            componentId={componentId}
            campaigns={campaigns}
            footer={this.renderFooter(campaigns)}
          />
        ) }
      </CollapsibleSearchBox>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    campaigns: getCampaigns(state),
    decks: getAllDecks(state),
  };
}

export default withFetchCardsGate<OwnProps>(
  connect(mapStateToProps)(MyCampaignsView),
  { promptForUpdate: false },
);

const styles = StyleSheet.create({
  footer: {
    margin: m,
    alignItems: 'center',
  },
  gutter: {
    marginBottom: 60,
  },
});
