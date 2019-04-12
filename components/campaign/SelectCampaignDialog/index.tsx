import React from 'react';
import { map, partition } from 'lodash';
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import { t } from 'ttag';
import { CUSTOM, ALL_CAMPAIGNS, CampaignCycleCode } from '../../../actions/types';
import CycleItem from './CycleItem';
import { campaignName } from '../constants';
import { NavigationProps } from '../../types';
import { getPacksInCollection, AppState } from '../../../reducers';

export interface SelectCampagaignProps {
  campaignChanged: (packCode: CampaignCycleCode, text: string) => void;
}

interface ReduxProps {
  in_collection: { [code: string]: boolean; };
}

type Props = NavigationProps & SelectCampagaignProps & ReduxProps;

class SelectCampaignDialog extends React.Component<Props> {
  static get options() {
    return {
      topBar: {
        title: {
          text: t`Select Campaign`,
        },
      },
    };
  }

  _onPress = (packCode: CampaignCycleCode, text: string) => {
    const {
      campaignChanged,
      componentId,
    } = this.props;

    campaignChanged(packCode, text);
    Navigation.pop(componentId);
  };

  _editCollection = () => {
    Navigation.push<{}>(this.props.componentId, {
      component: {
        name: 'My.Collection',
      },
    });
  };

  renderCampaign(packCode: CampaignCycleCode) {
    return (
      <CycleItem
        key={packCode}
        packCode={packCode}
        onPress={this._onPress}
        text={campaignName(packCode) || t`Custom`}
      />
    );
  }

  render() {
    const {
      in_collection,
    } = this.props;
    const partitionedCampaigns = partition(
      ALL_CAMPAIGNS,
      pack_code => in_collection[pack_code]);
    const myCampaigns = partitionedCampaigns[0];
    const otherCampaigns = partitionedCampaigns[1];

    return (
      <ScrollView style={styles.flex}>
        { myCampaigns.length > 0 && (
          <View style={styles.headerRow}>
            <Text style={styles.header}>
              { t`My Campaigns` }
            </Text>
          </View>
        ) }
        { map(myCampaigns, pack_code => this.renderCampaign(pack_code)) }
        { this.renderCampaign(CUSTOM) }
        <View style={styles.button}>
          <Button onPress={this._editCollection} title={t`Edit Collection`} />
        </View>
        { otherCampaigns.length > 0 && (
          <View style={styles.headerRow}>
            <Text style={styles.header}>
              { t`Other Campaigns` }
            </Text>
          </View>
        ) }
        { map(otherCampaigns, pack_code => this.renderCampaign(pack_code)) }
      </ScrollView>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    in_collection: getPacksInCollection(state),
  };
}

export default connect(mapStateToProps)(SelectCampaignDialog);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    fontFamily: 'System',
    fontSize: 22,
    marginLeft: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    height: 50,
  },
  button: {
    marginTop: 8,
  },
});
