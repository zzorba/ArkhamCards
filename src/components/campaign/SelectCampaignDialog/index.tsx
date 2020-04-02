import React from 'react';
import { filter, map, partition } from 'lodash';
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

import BasicSectionHeader from 'components/core/BasicSectionHeader';
import { CUSTOM, GUIDED_CAMPAIGNS, COMING_SOON_GUIDED_CAMPAIGNS, ALL_CAMPAIGNS, TDEA, TDEB, CampaignCycleCode } from 'actions/types';
import CycleItem from './CycleItem';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import { campaignName } from '../constants';
import { NavigationProps } from 'components/nav/types';
import { getPacksInCollection, AppState } from 'reducers';
import { s } from 'styles/space';

export interface SelectCampagaignProps {
  guided: boolean;
  campaignChanged: (packCode: CampaignCycleCode, text: string) => void;
}

interface ReduxProps {
  in_collection: {
    [code: string]: boolean;
  };
}

type Props = NavigationProps &
  SelectCampagaignProps &
  ReduxProps &
  DimensionsProps;

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

  renderCampaign(packCode: CampaignCycleCode, available: boolean) {
    const { fontScale } = this.props;
    return (
      <CycleItem
        key={packCode}
        fontScale={fontScale}
        packCode={packCode}
        onPress={this._onPress}
        text={campaignName(packCode) || t`Custom`}
        disabled={!available}
      />
    );
  }

  render() {
    const {
      in_collection,
      guided,
    } = this.props;
    const partitionedCampaigns = partition(
      guided ? GUIDED_CAMPAIGNS : ALL_CAMPAIGNS,
      pack_code => (in_collection[pack_code] || (
        in_collection.tde && (pack_code === TDEA || pack_code === TDEB)))
    );
    const myCampaigns = partitionedCampaigns[0];
    const otherCampaigns = partitionedCampaigns[1];

    return (
      <ScrollView style={styles.flex}>
        { myCampaigns.length > 0 && (
          <BasicSectionHeader
            title={t`My Campaigns` }
          />
        ) }
        { map(myCampaigns, pack_code => this.renderCampaign(pack_code, true)) }
        { !guided && this.renderCampaign(CUSTOM, true) }
        <BasicSectionHeader
          title={t`Other Campaigns` }
        />
        { map(otherCampaigns, pack_code => this.renderCampaign(pack_code, true)) }
        <View style={styles.button}>
          <Button onPress={this._editCollection} title={t`Edit Collection`} />
        </View>
        { guided && (
          <>
            <BasicSectionHeader
              title={t`Coming Soon` }
            />
            { map(COMING_SOON_GUIDED_CAMPAIGNS, pack_code => this.renderCampaign(pack_code, false)) }
          </>
        ) }
      </ScrollView>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    in_collection: getPacksInCollection(state),
  };
}

export default connect(mapStateToProps)(
  withDimensions(SelectCampaignDialog)
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    fontFamily: 'System',
    fontSize: 22,
    marginLeft: s,
  },
  button: {
    padding: s,
    borderBottomWidth: 1,
    borderColor: '#888',
  },
});
