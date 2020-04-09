import React from 'react';
import { filter, map, throttle } from 'lodash';
import {
  Alert,
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
import { NewCampaignProps } from '../NewCampaignView';
import { CampaignDetailProps } from '../CampaignDetailView';
import { CampaignGuideProps } from 'components/campaignguide/CampaignGuideView';
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
    const options = {
      topBar: {
        title: {
          text: campaign.name,
        },
        backButton: {
          title: t`Back`,
        },
        rightButtons: [
          campaign.guided ? {
            icon: iconsMap.edit,
            id: 'edit',
            color: COLORS.navButton,
            testID: t`Edit name`,
          } : {
            icon: iconsMap.menu,
            id: 'menu',
            color: COLORS.navButton,
          },
        ],
      },
    };
    if (campaign.guided) {
      Navigation.push<CampaignGuideProps>(componentId, {
        component: {
          name: 'Guide.Campaign',
          passProps: {
            campaignId: campaign.id,
          },
          options,
        },
      });
    } else {
      Navigation.push<CampaignDetailProps>(componentId, {
        component: {
          name: 'Campaign',
          passProps: {
            id,
          },
          options,
        },
      });
    }
  };

  showNewCampaignDialog() {
    const {
      componentId,
    } = this.props;
    const options = {
      topBar: {
        title: {
          text: t`New Campaign`,
        },
        backButton: {
          title: t`Cancel`,
        },
      },
    };
    Alert.alert(
      t`New Campaign`,
      t`The app can now walk you through campaign guides, keeping track of the Campaign Log, story assets, and trauma automatically.\nThis feature is still in beta and you might encounter some bugs with it, if you do please send them to arkhamcards@gmail.com`,
      [{
        text: t`Guided Campaign`,
        onPress: () => {
          Navigation.push<NewCampaignProps>(componentId, {
            component: {
              name: 'Campaign.New',
              passProps: {
                guided: true,
              },
              options,
            },
          });
        },
      }, {
        text: t`Manual Campaign`,
        onPress: () => {
          Navigation.push<NewCampaignProps>(componentId, {
            component: {
              name: 'Campaign.New',
              passProps: {
                guided: false,
              },
              options,
            },
          });
        },
      }, {
        text: t`Cancel`,
      }]
    );
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
          <Button
            title={t`New Campaign`}
            onPress={this._showNewCampaignDialog}
          />
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
