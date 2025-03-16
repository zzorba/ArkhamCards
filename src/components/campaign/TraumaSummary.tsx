import React, { useContext } from 'react';
import { StyleSheet, Text, TextStyle, View } from 'react-native';
import { range, map } from 'lodash';
import { c, t } from 'ttag';

import { TraumaAndCardData } from '@actions/types';
import HealthSanityIcon from '@components/core/HealthSanityIcon';
import StyleContext from '@styles/StyleContext';
import space, { xs } from '@styles/space';
import { TINY_PHONE } from '@styles/sizes';
import { useCampaignInvestigator } from '@components/campaignguide/CampaignGuideContext';
import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';

interface Props {
  trauma: TraumaAndCardData;
  investigator: CampaignInvestigator;
  whiteText?: boolean;
  hideNone?: boolean;
  textStyle?: TextStyle | TextStyle[];
  tiny?: boolean;
}

export function TraumaIconPile({ physical, mental, whiteText, paddingTop, tiny }: { physical: number; mental: number; whiteText?: boolean; paddingTop?: number; tiny?: boolean; }) {
  const textColorStyle = whiteText ? { color: '#FFF' } : undefined;
  const { typography } = useContext(StyleContext);
  if (physical + mental > (TINY_PHONE ? 2 : 3)) {
    // compact mode;
    return (
      <View style={[styles.row, { paddingTop }]}>
        { (physical > 0) && <HealthSanityIcon type="health" size={tiny ? 18 : 24} /> }
        { (physical > 1) && <Text style={[typography.subHeaderText, space.marginRightS, textColorStyle]}>×{physical}</Text> }
        { (mental > 0) && <HealthSanityIcon type="sanity" size={tiny ? 18 : 24} /> }
        { (mental > 1) && <Text style={[space.marginLeftXs, typography.subHeaderText, textColorStyle]}>×{mental}</Text> }
      </View>
    );
  }
  return (
    <View style={[styles.row, { paddingTop }]}>
      { (physical > 0) && map(range(0, physical), idx => <HealthSanityIcon key={idx} type="health" size={tiny ? 18 : 24} />) }
      { (mental > 0) && map(range(0, mental), idx => <HealthSanityIcon key={idx} type="sanity" size={tiny ? 18 : 24} />) }
    </View>
  );
}


export default function TraumaSummary({ trauma, investigator: theInvestigator, whiteText, hideNone, textStyle, tiny }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const investigator = useCampaignInvestigator(theInvestigator);
  const physical = (trauma.physical || 0);
  const mental = (trauma.mental || 0);
  const textColorStyle = whiteText ? { color: '#FFF' } : { color: colors.D30 };
  if (investigator?.card.killed(trauma)) {
    return <Text style={textStyle || [typography.subHeaderText, textColorStyle]}>{t`Killed`}</Text>;
  }
  if (investigator?.card.insane(trauma)) {
    return <Text style={textStyle || [typography.subHeaderText, textColorStyle]}>{t`Insane`}</Text>;
  }
  if (physical + mental === 0) {
    if (whiteText || hideNone) {
      return null;
    }
    return <Text style={[typography.subHeaderText, textColorStyle]}>{c('trauma').t`None`}</Text>;
  }
  return (
    <TraumaIconPile
      physical={physical}
      mental={mental}
      whiteText={whiteText}
      paddingTop={textStyle && !tiny ? xs : undefined}
      tiny={tiny}
    />
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
});
