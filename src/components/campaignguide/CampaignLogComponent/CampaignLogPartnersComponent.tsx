import React, { useMemo, useContext } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { find, map } from 'lodash';
import { t } from 'ttag';

import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import { Partner } from '@data/scenario/types';
import useCardList from '@components/card/useCardList';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import { TraumaIconPile } from '@components/campaign/TraumaSummary';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import AppIcon from '@icons/AppIcon';

interface Props {
  campaignLog: GuidedCampaignLog;
  partners: Partner[];
  width: number;
}

export default function CampaignLogPartnersComponent({ partners, campaignLog, width }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const codes = useMemo(() => map(partners, p => p.code), [partners]);
  const [cards, loading] = useCardList(codes, 'encounter');

  if (loading) {
    return <ActivityIndicator size="small" animating />;
  }
  return (
    <>
      { map(partners, (partner) => {
        const { code, name, description } = partner;
        const card = find(cards, c => c.code === code);

        const trauma = campaignLog.traumaAndCardData(code);
        const conditions = new Set(trauma.storyAssets || []);
        const resolute = conditions.has('resolute');
        const health = (resolute && partner.resolute_health) || partner.health;
        const sanity = (resolute && partner.resolute_sanity) || partner.sanity;
        const eliminated = ((trauma.physical || 0) === health) || ((trauma.mental || 0) === sanity) || trauma.killed;
        const the_entity = conditions.has('the_entity');
        return (
          <View key={code} style={space.paddingBottomS}>
            <CompactInvestigatorRow
              investigator={card}
              hideImage={!card && !loading}
              width={width}
              eliminated={eliminated}
              name={name}
              description={description}
            >
              { the_entity && (
                <View style={space.marginLeftXs}>
                  <Text style={[typography.text, { color: '#FFFFFF' }]}>
                    {t`The Entity`}
                  </Text>
                </View>
              ) }
              { conditions.has('resolute') && !the_entity && <AppIcon accessibilityLabel={t`Resolute`} name="check_on_check" size={40} color="#FFFFFF" /> }
              { conditions.has('mia') && !the_entity && (
                <View style={space.marginLeftXs}>
                  <Text style={[typography.text, conditions.has('safe') ? { textDecorationLine: 'line-through', color: colors.M } : { color: '#FFFFFF' }]}>
                    {t`MIA`}
                  </Text>
                </View>
              ) }
              { !eliminated && (
                <View style={space.marginLeftXs}>
                  <TraumaIconPile physical={trauma.physical || 0} mental={trauma.mental || 0} whiteText />
                </View>
              ) }
            </CompactInvestigatorRow>
          </View>
        );
      }) }
    </>
  );
}
