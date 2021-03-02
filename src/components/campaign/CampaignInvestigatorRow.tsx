import React, { useCallback } from 'react';
import { find, map } from 'lodash';
import {
  StyleSheet,
  View,
} from 'react-native';

import { BODY_OF_A_YITHIAN } from '@app_constants';
import InvestigatorImage from '@components/core/InvestigatorImage';
import { s } from '@styles/space';
import { useInvestigatorCards } from '@components/core/hooks';
import MiniCampaignT from '@data/interfaces/MiniCampaignT';

interface Props {
  campaign: MiniCampaignT;
}
export default function CampaignInvestigatorRow({ campaign }: Props) {
  const investigators = useInvestigatorCards();
  const renderInvestigator = useCallback((code: string) => {
    const traumaAndCardData = campaign.investigatorTrauma(code);
    const card = investigators?.[code];
    const killedOrInsane = card && card.eliminated(traumaAndCardData);
    const yithian = !!find(traumaAndCardData.storyAssets || [], asset => asset === BODY_OF_A_YITHIAN);
    return (
      <View key={code} style={styles.investigator}>
        <InvestigatorImage
          card={card}
          killedOrInsane={killedOrInsane}
          yithian={yithian}
          border
          size="small"
        />
      </View>
    );
  }, [investigators, campaign]);

  return (
    <View style={styles.row}>
      { map(campaign.investigators(), code => renderInvestigator(code)) }
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginTop: s,
    minHeight: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  investigator: {
    marginRight: s,
    marginBottom: s,
  },
});
