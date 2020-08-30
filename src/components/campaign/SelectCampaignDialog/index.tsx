import React from 'react';
import { map, partition } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import BasicSectionHeader from '@components/core/BasicSectionHeader';
import {
  CUSTOM,
  ALL_CAMPAIGNS,
  GUIDED_CAMPAIGNS,
  TDE,
  TDEA,
  TDEB,
  CampaignCycleCode,
} from '@actions/types';
import CycleItem from './CycleItem';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import { campaignName } from '../constants';
import { NavigationProps } from '@components/nav/types';
import { getPacksInCollection, AppState } from '@reducers';
import COLORS from '@styles/colors';

export interface SelectCampagaignProps {
  campaignChanged: (packCode: CampaignCycleCode, text: string, hasGuide: boolean) => void;
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

  _onPress = (campaignCode: CampaignCycleCode, text: string) => {
    const {
      campaignChanged,
      componentId,
    } = this.props;

    campaignChanged(campaignCode, text, GUIDED_CAMPAIGNS.has(campaignCode));
    Navigation.pop(componentId);
  };

  _editCollection = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'My.Collection',
      },
    });
  };

  campaignDescription(packCode: CampaignCycleCode): string | undefined {
    switch (packCode) {
      case TDE:
        return t`Campaign A and Campaign B\nEight-part campaign`;
      case TDEA:
        return t`Campaign A\nFour-part campaign`;
      case TDEB:
        return t`Campaign B\nFour-part campaign`;
      default:
        return undefined;
    }
  }

  renderCampaign(packCode: CampaignCycleCode) {
    const { fontScale } = this.props;
    const guideComingSoon = (packCode !== CUSTOM && !GUIDED_CAMPAIGNS.has(packCode));
    return (
      <CycleItem
        key={packCode}
        fontScale={fontScale}
        packCode={packCode}
        onPress={this._onPress}
        text={campaignName(packCode) || t`Custom`}
        description={guideComingSoon ? t`Guide not yet available` : this.campaignDescription(packCode)}
      />
    );
  }

  render() {
    const {
      in_collection,
    } = this.props;
    const partitionedCampaigns = partition(
      ALL_CAMPAIGNS,
      pack_code => (in_collection[pack_code] || (
        in_collection.tde && (pack_code === TDEA || pack_code === TDEB || pack_code === TDE)))
    );
    const myCampaigns = partitionedCampaigns[0];
    const otherCampaigns = partitionedCampaigns[1];

    return (
      <ScrollView style={styles.flex}>
        { myCampaigns.length > 0 && (
          <BasicSectionHeader
            title={t`My Campaigns`}
          />
        ) }
        { map(myCampaigns, pack_code => this.renderCampaign(pack_code)) }
        { this.renderCampaign(CUSTOM) }
        { otherCampaigns.length > 0 && (
          <BasicSectionHeader
            title={t`Other Campaigns`}
          />
        ) }
        { map(otherCampaigns, pack_code => this.renderCampaign(pack_code)) }
        <View style={styles.button}>
          <BasicButton onPress={this._editCollection} title={t`Edit Collection`} />
        </View>
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
    backgroundColor: COLORS.background,
  },
  button: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
  },
});
