import React, { useCallback, useMemo } from 'react';
import { find, flatMap, map, uniq } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';

import { BODY_OF_A_YITHIAN } from '@app_constants';
import InvestigatorImage from '@components/core/InvestigatorImage';
import { s, xs } from '@styles/space';
import { useInvestigators } from '@components/core/hooks';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';
import { TINY_PHONE } from '@styles/sizes';

interface Props {
  campaign: MiniCampaignT;
}
function CampaignInvestigatorRow({ campaign }: Props) {
  // Include both the base investigator codes and any printing card codes
  const investigatorCodes = useMemo(() => {
    return uniq([
      ...campaign.investigators,
      ...flatMap(campaign.investigators, code => campaign.investigatorPrintings[code] ?? []),
    ]);
  }, [campaign.investigators, campaign.investigatorPrintings]);

  const investigators = useInvestigators(investigatorCodes);
  const renderInvestigator = useCallback((code: string) => {
    const traumaAndCardData = campaign.investigatorTrauma(code);
    // Use the printing card if it's set, otherwise use the default investigator card
    const printingCode = campaign.investigatorPrintings[code];
    const card = printingCode ? investigators?.[printingCode] : investigators?.[code];
    const killedOrInsane = card && card.eliminated(traumaAndCardData);
    const yithian = !!find(traumaAndCardData.storyAssets || [], asset => asset === BODY_OF_A_YITHIAN);
    return (
      <View key={code} style={styles.investigator}>
        <InvestigatorImage
          card={card}
          killedOrInsane={killedOrInsane}
          yithian={yithian}
          border
          size="tiny"
        />
      </View>
    );
  }, [investigators, campaign]);

  return (
    <View style={styles.row}>
      { map(campaign.investigators, code => renderInvestigator(code)) }
    </View>
  );
}
CampaignInvestigatorRow.computeHeight = (fontScale: number) => {
  return s * 2 + InvestigatorImage.computeHeight('tiny', fontScale);
};

export default CampaignInvestigatorRow;

const styles = StyleSheet.create({
  row: {
    marginTop: s,
    minHeight: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  investigator: {
    marginRight: TINY_PHONE ? xs : s,
    marginBottom: s,
  },
});
