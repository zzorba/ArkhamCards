import React from 'react';
import { map, partition } from 'lodash';
import {
  ScrollView,
  StyleSheet,
} from 'react-native';
import { connect } from 'react-redux';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

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
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import CardSectionHeader from '@components/core/CardSectionHeader';
import ArkhamButton from '@components/core/ArkhamButton';

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
  static contextType = StyleContext;
  context!: StyleContextType;

  static options() {
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
    const guideComingSoon = (packCode !== CUSTOM && !GUIDED_CAMPAIGNS.has(packCode));
    return (
      <CycleItem
        key={packCode}
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
    const { backgroundStyle } = this.context;
    const partitionedCampaigns = partition(
      ALL_CAMPAIGNS,
      pack_code => (in_collection[pack_code] || (
        in_collection.tde && (pack_code === TDEA || pack_code === TDEB || pack_code === TDE)))
    );
    const myCampaigns = partitionedCampaigns[0];
    const otherCampaigns = partitionedCampaigns[1];

    return (
      <ScrollView style={[styles.flex, backgroundStyle]}>
        { myCampaigns.length > 0 && (
          <CardSectionHeader section={{ title: t`My Campaigns` }} />
        ) }
        { map(myCampaigns, pack_code => this.renderCampaign(pack_code)) }
        { this.renderCampaign(CUSTOM) }
        { otherCampaigns.length > 0 && (
          <CardSectionHeader section={{ title: t`Other Campaigns` }} />
        ) }
        { map(otherCampaigns, pack_code => this.renderCampaign(pack_code)) }
        <ArkhamButton
          icon="edit"
          onPress={this._editCollection}
          title={t`Edit Collection`}
        />
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
});
