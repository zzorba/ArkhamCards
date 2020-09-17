import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { map, sumBy } from 'lodash';
// @ts-ignore
import MaterialIcons from 'react-native-vector-icons/dist/MaterialIcons';

import CampaignMergeItem from './CampaignMergeItem';
import { Campaign } from '@actions/types';
import typography from '@styles/typography';
import space from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';

interface Props {
  title: string;
  campaigns: Campaign[];
  values: { [id: string]: boolean | undefined };
  inverted?: boolean;
  onValueChange: (campaign: Campaign, value: boolean) => void;
}

interface State {
  open: boolean;
}
export default class CampaignMergeSection extends React.Component<Props, State> {
  static contextType = StyleContext;
  context!: StyleContextType;

  state: State = {
    open: false,
  };

  renderItems() {
    const { campaigns, inverted, onValueChange, values } = this.props;
    return (
      <>
        { map(campaigns, campaign => (
          <CampaignMergeItem
            key={campaign.uuid || campaign.id}
            campaign={campaign}
            inverted={!!inverted}
            value={!!values[campaign.id]}
            onValueChange={onValueChange}
          />
        )) }
      </>
    );
  }

  _toggleOpen = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  renderHeader() {
    const { title, campaigns, inverted, values } = this.props;
    const { open } = this.state;
    const { colors, borderStyle } = this.context;
    const selected = sumBy(campaigns, campaign => {
      if (inverted) {
        return values[campaign.id] ? 0 : 1;
      }
      return values[campaign.id] ? 1 : 0;
    });
    return (
      <View style={[styles.headerRow, { backgroundColor: colors.L10 }, borderStyle, space.paddingS, space.paddingLeftM]}>
        <Text style={typography.label}>
          { title } ({selected} / {campaigns.length})
        </Text>
        { !inverted && (
          <View style={[styles.icon, space.marginSideS]}>
            <MaterialIcons
              name={open ? 'keyboard-arrow-up' : 'keyboard-arrow-down'}
              size={24}
              color={colors.darkText}
            />
          </View>
        ) }
      </View>
    );
  }

  render() {
    const { campaigns, inverted } = this.props;
    const { open } = this.state;
    if (!campaigns.length) {
      return null;
    }
    if (!inverted) {
      return (
        <>
          <TouchableOpacity onPress={this._toggleOpen}>
            { this.renderHeader() }
          </TouchableOpacity>
          <Collapsible collapsed={!open}>
            { this.renderItems() }
          </Collapsible>
        </>
      );
    }
    return (
      <>
        { this.renderHeader() }
        { this.renderItems() }
      </>
    );
  }
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  icon: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
