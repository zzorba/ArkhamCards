import React from 'react';
import { filter, map, throttle } from 'lodash';
import {
  Button,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { Navigation, EventSubscription } from 'react-native-navigation';
import { t } from 'ttag';

import { CUSTOM, Campaign, DecksMap } from 'actions/types';
import CampaignItem from './CampaignItem';
import { CampaignDetailProps } from '../CampaignDetailView';
import { campaignNames } from 'components/campaign/constants';
import SearchBox from 'components/core/SearchBox';
import withPlayerCards, { PlayerCardProps } from 'components/core/withPlayerCards';
import { searchMatchesText } from 'components/core/searchHelpers';
import withFetchCardsGate from 'components/card/withFetchCardsGate';
import { iconsMap } from 'app/NavIcons';
import { getAllDecks, getCampaigns, AppState } from 'reducers';
import typography from 'styles/typography';
import { COLORS } from 'styles/colors';
import { s } from 'styles/space';

interface OwnProps {
  componentId: string;
}

interface ReduxProps {
  campaigns: Campaign[];
  decks: DecksMap;
}

type Props = OwnProps & ReduxProps & PlayerCardProps;

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

  _onPress = (id: number, campaign: Campaign) => {
    const {
      componentId,
    } = this.props;
    Keyboard.dismiss();
    Navigation.push<CampaignDetailProps>(componentId, {
      component: {
        name: 'Campaign',
        passProps: {
          id,
        },
        options: {
          topBar: {
            title: {
              text: campaign.name,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
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

  renderItem(campaign: Campaign) {
    const {
      investigators,
    } = this.props;
    return (
      <CampaignItem
        key={campaign.id}
        campaign={campaign}
        investigators={investigators}
        onPress={this._onPress}
      />
    );
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

  renderFooter(campaigns: Campaign[]) {
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


  render() {
    const campaigns = this.filteredCampaigns();
    return (
      <ScrollView
        style={styles.container}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
      >
        <SearchBox
          value={this.state.search}
          onChangeText={this._searchChanged}
          placeholder={t`Search campaigns`}
        />
        { map(campaigns, campaign => this.renderItem(campaign)) }
        { this.renderFooter(campaigns) }
        <View style={styles.button}>
          <Button title={t`New Campaign`} onPress={this._showNewCampaignDialog} />
        </View>
        <View style={styles.gutter} />
      </ScrollView>
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
  connect(mapStateToProps)(
    withPlayerCards<OwnProps & ReduxProps>(MyCampaignsView)
  ),
  { promptForUpdate: false },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    margin: s,
    alignItems: 'center',
  },
  gutter: {
    marginBottom: 60,
  },
  button: {
    margin: s,
  },
});
