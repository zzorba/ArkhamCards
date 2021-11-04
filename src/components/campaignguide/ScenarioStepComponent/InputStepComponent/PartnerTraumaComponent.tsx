import React, { useContext, useCallback, useMemo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { find, flatMap, forEach, map } from 'lodash';
import { t } from 'ttag';

import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import { PartnerTraumaInput } from '@data/scenario/types';
import useCardList from '@components/card/useCardList';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import StyleContext from '@styles/StyleContext';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import space, { s } from '@styles/space';
import Card from '@data/types/Card';
import HealthSanityIcon from '@components/core/HealthSanityIcon';
import InputCounterRow from './InputCounterRow';
import InputWrapper from '@components/campaignguide/prompts/InputWrapper';
import { Counters, useCounters } from '@components/core/hooks';
import CampaignGuideContext from '@components/campaignguide/CampaignGuideContext';
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import { NumberChoices } from '@actions/types';

interface Props {
  id: string;
  input: PartnerTraumaInput;
}

function PartnerTraumaRow({ card, physical, mental, editable, incP, decP, incM, decM }: {
  card: Card;
  editable: boolean;
  physical?: number;
  mental?: number;
  incP: (code: string, max?: number) => void;
  decP: (code: string, min?: number) => void,
  incM: (code: string, max?: number) => void;
  decM: (code: string, min?: number) => void,
 }) {
  const { width } = useContext(StyleContext);
  const incPhysical = useCallback(() => {
    incP(card.code, card.health || 0);
  }, [incP, card]);
  const decPhysical = useCallback(() => {
    decP(card.code, 0);
  }, [decP, card]);
  const incMental = useCallback(() => {
    incM(card.code, card.sanity || 0);
  }, [card, incM]);
  const decMental = useCallback(() => {
    decM(card.code, 0);
  }, [card, decM]);
  return (
    <RoundedFactionBlock
      key={card.code}
      header={<CompactInvestigatorRow investigator={card} width={width - s * (editable ? 4 : 2)} open />}
      faction={card.factionCode()}
      noSpace
      noShadow
    >
      <InputCounterRow
        editable={editable}
        bottomBorder
        icon={<View style={{ paddingLeft: 2, paddingRight: 1 }}><HealthSanityIcon type="health" size={24} /></View>}
        title={t`Damage`}
        count={physical || 0}
        total={physical || 0}
        inc={incPhysical}
        dec={decPhysical}
        max={card.health || 1}
        hideTotal
      />
      <InputCounterRow
        editable={editable}
        icon={<View style={space.paddingRightXs}><HealthSanityIcon type="sanity" size={20} /></View>}
        title={t`Horror`}
        count={mental || 0}
        total={mental || 0}
        inc={incMental}
        dec={decMental}
        max={card.sanity || 1}
        hideTotal
      />
    </RoundedFactionBlock>
  )
}
export default function PartnerTraumaComponent({ id, input }: Props) {
  const { campaignLog } = useContext(ScenarioStepContext);
  const { scenarioState } = useContext(ScenarioGuideContext);
  const theChoices = useMemo(() => scenarioState.numberChoices(id), [scenarioState, id]);
  const editable = theChoices === undefined;
  const codes = useMemo(() => {
    const entries = campaignLog.sections[input.section]?.entries || [];
    const cardEntry = find(entries, e => e.type === 'card' && e.id === input.id);
    if (cardEntry?.type === 'card') {
      return flatMap(cardEntry.cards, c => c.count > 0 ? c.card : []);
    }
    return [];
  }, [campaignLog, input.section, input.id]);
  const [initialPhysical, initialMental] = useMemo(() => {
    const p: Counters = {}
    const m: Counters = {};
    forEach(codes, c => {
      const t = campaignLog.traumaAndCardData(c);
      p[c] = t?.physical || 0;
      m[c] = t?.mental || 0;
    });
    return [p, m];
  }, [codes, campaignLog]);
  const [physical, incPhysical, decPhysical] = useCounters(initialPhysical);
  const [mental, incMental, decMental] = useCounters(initialMental);
  const [cards, loading] = useCardList(codes, 'encounter');
  const save = useCallback(() => {
    const choices: NumberChoices = {};
    forEach(codes, c => {
      choices[c] = [
        (physical[c] || 0) - (initialPhysical[c] || 0),
        (mental[c] || 0) - (initialMental[c] || 0),
      ];
    });
    scenarioState.setNumberChoices(id, choices)
  }, [scenarioState, id, physical, mental, initialPhysical, initialMental, codes]);
  return (
    <InputWrapper
      title={t`Partner Damage/Horror:`}
      editable={editable}
      onSubmit={save}
    >
      { loading ? <ActivityIndicator size="small" animating /> : (
        <>
          { map(cards, c => (
            <PartnerTraumaRow
              key={c.code}
              card={c}
              editable={editable}
              physical={physical[c.code] || 0}
              mental={mental[c.code] || 0}
              incP={incPhysical}
              decP={decPhysical}
              incM={incMental}
              decM={decMental}
            />
          )) }
        </>
      ) }
    </InputWrapper>
  );
}
