import React, { useCallback, useContext } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native';

import { CampaignCycleCode } from '@actions/types';
import EncounterIcon from '@icons/EncounterIcon';
import { s, iconSizeScale } from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface ContentProps {
  packCode: CampaignCycleCode;
  text: string;
  description?: string;
  disabled?: boolean;
}

interface Props extends ContentProps {
  onPress: (packCode: CampaignCycleCode, text: string) => void;
}

function CycleContent({ packCode, text, disabled, description }: ContentProps) {
  const {
    colors,
    fontScale,
    backgroundStyle,
    borderStyle,
    disabledStyle,
    typography,
  } = useContext(StyleContext);
  return (
    <View style={[styles.campaignRow, backgroundStyle, borderStyle, disabled ? disabledStyle : {}]}>
      <View style={styles.campaignIcon}>
        <EncounterIcon
          encounter_code={packCode}
          size={36 * iconSizeScale * fontScale}
          color={colors.darkText}
        />
      </View>
      <View style={styles.column}>
        <Text style={[typography.mediumGameFont, styles.campaignText]}>
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

export default function CycleItem({ packCode, text, description, disabled, onPress }: Props) {
  const handleOnPress = useCallback(() => {
    onPress(packCode, text);
  }, [onPress, packCode, text]);

  if (!disabled) {
    return (
      <TouchableOpacity onPress={handleOnPress} key={packCode}>
        <CycleContent packCode={packCode} text={text} disabled={disabled} description={description} />
      </TouchableOpacity>
    );
  }
  return <CycleContent packCode={packCode} text={text} disabled={disabled} description={description} />;
}

const styles = StyleSheet.create({
  campaignRow: {
    paddingTop: s,
    paddingBottom: s,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
});
