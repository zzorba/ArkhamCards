import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import withStyles, { StylesProps } from '@components/core/withStyles';
import { CampaignCycleCode } from '@actions/types';
import EncounterIcon from '@icons/EncounterIcon';
import { s, iconSizeScale } from '@styles/space';
import typography from '@styles/typography';
import COLORS from '@styles/colors';

interface Props {
  fontScale: number;
  packCode: CampaignCycleCode;
  text: string;
  description?: string;
  disabled?: boolean;
  onPress: (packCode: CampaignCycleCode, text: string) => void;
}

class CycleItem extends React.Component<Props & StylesProps> {
  _onPress = () => {
    this.props.onPress(this.props.packCode, this.props.text);
  };

  renderContent() {
    const {
      packCode,
      text,
      fontScale,
      disabled,
      description,
      gameFont,
    } = this.props;
    return (
      <View style={[styles.campaignRow, disabled ? styles.disabled : {}]}>
        <View style={styles.campaignIcon}>
          <EncounterIcon
            encounter_code={packCode}
            size={36 * iconSizeScale * fontScale}
            color={COLORS.darkText}
          />
        </View>
        <View style={styles.column}>
          <Text style={[typography.mediumGameFont, { fontFamily: gameFont }, styles.campaignText]}>
            { text }
          </Text>
          { !!description && (
            <Text style={[typography.text, styles.campaignText]}>
              { description }
            </Text>
          ) }
        </View>
      </View>
    );
  }

  render() {
    const {
      disabled,
      packCode,
    } = this.props;
    if (!disabled) {
      return (
        <TouchableOpacity onPress={this._onPress} key={packCode}>
          { this.renderContent() }
        </TouchableOpacity>
      );
    }
    return this.renderContent();
  }
}

export default withStyles(CycleItem);

const styles = StyleSheet.create({
  campaignRow: {
    paddingTop: s,
    paddingBottom: s,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.divider,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  campaignText: {
    marginLeft: s,
  },
  campaignIcon: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    margin: s,
  },
  column: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flex: 1,
  },
  disabled: {
    backgroundColor: COLORS.disabledOverlay,
  },
});
