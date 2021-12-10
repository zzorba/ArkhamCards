import React, { useContext, useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { find, filter, flatMap, forEach, map, findLast } from 'lodash';
import { t } from 'ttag';

import ScenarioStepContext from '@components/campaignguide/ScenarioStepContext';
import { Partner, PartnerTraumaInput } from '@data/scenario/types';
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
import ScenarioGuideContext from '@components/campaignguide/ScenarioGuideContext';
import { NumberChoices } from '@actions/types';
import { SELECTED_PARTNERS_CAMPAIGN_LOG_ID } from '@data/scenario/fixedSteps';
import SetupStepWrapper from '@components/campaignguide/SetupStepWrapper';
import CampaignGuideTextComponent from '@components/campaignguide/CampaignGuideTextComponent';

interface Props {
  id: string;
  text?: string;
  input: PartnerTraumaInput;
}

function PartnerTraumaRow({ partner, card, physical, mental, editable, incP, decP, incM, decM, status }: {
  partner: Partner;
  card?: Card;
  editable: boolean;
  physical?: number;
  mental?: number;
  incP: (code: string, max?: number) => void;
  decP: (code: string, min?: number) => void,
  incM: (code: string, max?: number) => void;
  decM: (code: string, min?: number) => void,
  status?: string[]
 }) {
  const { width } = useContext(StyleContext);
  const [health, sanity] = useMemo(() => {
    const resolute = !!find(status, s => s === 'resolute');
    return [
      (resolute && partner.resolute_health) || partner.health,
      (resolute && partner.resolute_sanity) || partner.sanity,
    ];
  }, [status, partner]);
  const incPhysical = useCallback(() => {
    incP(partner.code, health || 0);
  }, [incP, partner.code, health]);
  const decPhysical = useCallback(() => {
    decP(partner.code, 0);
  }, [decP, partner.code]);
  const incMental = useCallback(() => {
    incM(partner.code, sanity || 0);
  }, [partner.code, sanity, incM]);
  const decMental = useCallback(() => {
    decM(partner.code, 0);
  }, [partner.code, decM]);
  return (
    <RoundedFactionBlock
      header={<CompactInvestigatorRow investigator={card} hideImage={!card} name={partner.name} description={partner.description} width={width - s * (editable ? 4 : 2)} open />}
      faction="neutral"
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
        max={health}
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
        max={sanity}
        hideTotal
      />
    </RoundedFactionBlock>
  )
}
export default function PartnerTraumaComponent({ id, input, text }: Props) {
  const { campaignLog } = useContext(ScenarioStepContext);
  const { scenarioState } = useContext(ScenarioGuideContext);
  const theChoices = useMemo(() => scenarioState.numberChoices(id), [scenarioState, id]);
  const editable = theChoices === undefined;
  const [partners, codes] = useMemo(() => {
    const partners = campaignLog.campaignGuide.campaignLogPartners(input.section);
    const entries = campaignLog.sections[input.section]?.entries || [];
    const cardEntry = findLast(entries, e => e.type === 'card' && e.id === SELECTED_PARTNERS_CAMPAIGN_LOG_ID);
    if (cardEntry?.type === 'card') {
      const selectedCodes = new Set(flatMap(cardEntry.cards, c => c.count > 0 ? c.card : []));
      const selectedPartners = filter(partners, p => selectedCodes.has(p.code) && campaignLog.hasPartnerStatus(input.section, p, 'alive'));
      return [
        selectedPartners,
        map(selectedPartners, p => p.code),
      ];
    }
    return [[], []];
  }, [campaignLog, input.section]);
  const [initialPhysical, initialMental] = useMemo(() => {
    const p: Counters = {}
    const m: Counters = {};
    forEach(partners, partner => {
      const t = campaignLog.traumaAndCardData(partner.code);
      p[partner.code] = t?.physical || 0;
      m[partner.code] = t?.mental || 0;
    });
    return [p, m];
  }, [partners, campaignLog]);
  const [physical, incPhysical, decPhysical] = useCounters(initialPhysical);
  const [mental, incMental, decMental] = useCounters(initialMental);
  const [cards] = useCardList(codes, 'encounter');
  const save = useCallback(async() => {
    const choices: NumberChoices = {};
    forEach(codes, c => {
      choices[c] = [
        (physical[c] || 0) - (initialPhysical[c] || 0),
        (mental[c] || 0) - (initialMental[c] || 0),
      ];
    });
    await scenarioState.setNumberChoices(id, choices)
  }, [scenarioState, id, physical, mental, initialPhysical, initialMental, codes]);
  return (
    <>
      { !!text && (
        <SetupStepWrapper>
          <CampaignGuideTextComponent text={text} />
        </SetupStepWrapper>
      )}
      <InputWrapper
        title={t`Record damage/horror:`}
        editable={editable}
        onSubmit={save}
      >
        { map(partners, partner => (
          <PartnerTraumaRow
            key={partner.code}
            card={find(cards, c => c.code === partner.code)}
            partner={partner}
            editable={editable}
            physical={physical[partner.code] || 0}
            mental={mental[partner.code] || 0}
            incP={incPhysical}
            decP={decPhysical}
            incM={incMental}
            decM={decMental}
            status={campaignLog.traumaAndCardData(partner.code).storyAssets}
          />
        )) }
      </InputWrapper>
    </>
  );
}
