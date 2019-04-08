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

import L from '../../../app/i18n';
import { Campaign, Deck } from '../../../actions/types';
import CampaignItem from './CampaignItem';
import { CampaignDetailProps } from '../CampaignDetailView';
import { campaignNames } from '../constants';
import SearchBox from '../../SearchBox';
import withPlayerCards, { PlayerCardProps } from '../../withPlayerCards';
import { searchMatchesText } from '../../searchHelpers';
import withFetchCardsGate from '../../cards/withFetchCardsGate';
import { iconsMap } from '../../../app/NavIcons';
import { CUSTOM } from '../../../actions/types';
import { getAllDecks, getCampaigns, AppState } from '../../../reducers';
import typography from '../../../styles/typography';
import { COLORS } from '../../../styles/colors';

interface OwnProps {
  componentId: string;
}

interface ReduxProps {
  campaigns: Campaign[];
  decks: { [id: number]: Deck };
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
          text: L('Campaigns'),
        },
        rightButtons: [{
          icon: iconsMap.add,
          id: 'add',
          color: COLORS.navButton,
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
              title: L('Back'),
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
              text: L('New Campaign'),
            },
            backButton: {
              title: L('Cancel'),
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
              { L('No matching campaigns for "{{searchTerm}}".', { searchTerm: search }) }
            </Text>
          </View>
        );
      }
      return (
        <View style={styles.footer}>
          <Text style={[typography.text]}>
            { L('No campaigns yet.\n\nUse the + button to create a new one.\n\nYou can use this app to keep track of campaigns, including investigator trauma, the chaos bag, basic weaknesses, campaign notes and the experience values for all decks.') }
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
          placeholder={L('Search campaigns')}
        />
        { map(campaigns, campaign => this.renderItem(campaign)) }
        { this.renderFooter(campaigns) }
        <View style={styles.button}>
          <Button title={L('New Campaign')} onPress={this._showNewCampaignDialog} />
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

export default withFetchCardsGate(
  connect(mapStateToProps)(
    withPlayerCards(MyCampaignsView)
  ),
  { promptForUpdate: false },
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    margin: 8,
    alignItems: 'center',
  },
  gutter: {
    marginBottom: 60,
  },
  button: {
    margin: 8,
  },
});
