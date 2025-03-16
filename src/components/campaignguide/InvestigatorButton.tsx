import React, { useCallback, useContext } from 'react';
import { Text, View } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import StyleContext from '@styles/StyleContext';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import space from '@styles/space';
import COLORS from '@styles/colors';
import { TouchableShrink } from '@components/core/Touchables';
import { StepPaddingContext } from './StepPaddingContext';
import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';

interface Props {
  investigator: CampaignInvestigator;
  value: string | undefined;
  detail?: string;
  widget?: 'shuffle';
  disabled?: boolean;
  color?: 'dark' | 'light';
  onPress: (investigator: CampaignInvestigator) => void;
  gameFont?: boolean,
}

export default function InvestigatorButton({
  investigator,
  value,
  detail,
  widget,
  onPress,
  color,
  gameFont,
  disabled,
}: Props) {
  const { typography, width: fullWidth } = useContext(StyleContext);
  const { side } = useContext(StepPaddingContext);
  const onTouchablePress = useCallback(() => {
    onPress(investigator);
  }, [onPress, investigator]);
  const width = fullWidth - side * 2;
  return (
    <TouchableShrink style={{ width }} onPress={onTouchablePress} disabled={disabled}>
      <CompactInvestigatorRow
        investigator={investigator.card}
        color={color}
        width={width}
      >
        { !!value && (
          <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Text style={[gameFont ? typography.gameFont : typography.text, typography.white]}>{value}</Text>
            { !!detail && <Text style={[typography.smallButtonLabel, typography.white]}>{detail}</Text> }
          </View>
        )}
        { widget === 'shuffle' && !disabled && (
          <View style={[space.marginRightS, space.marginLeftS]}>
            <MaterialCommunityIcons
              name="shuffle-variant"
              size={24}
              color={COLORS.white}
            />
          </View>
        ) }
      </CompactInvestigatorRow>
    </TouchableShrink>
  );
}
