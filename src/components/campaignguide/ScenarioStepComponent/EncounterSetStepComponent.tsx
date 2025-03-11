import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { groupBy, map, mapValues, sortBy } from 'lodash';
import { msgid, ngettext, t } from 'ttag';

import { stringList } from '@lib/stringHelper';
import SetupStepWrapper from '../SetupStepWrapper';
import { BorderColor, EncounterSetsStep } from '@data/scenario/types';
import EncounterIcon from '@icons/EncounterIcon';
import { EncounterCardErrataProps } from '@components/campaignguide/EncounterCardErrataView';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import space from '@styles/space';
import CampaignGuide from '@data/scenario/CampaignGuide';
import StyleContext from '@styles/StyleContext';
import ArkhamButton from '@components/core/ArkhamButton';
import LanguageContext from '@lib/i18n/LanguageContext';
import { useSettingValue } from '@components/core/hooks';
import ToolTip from '@components/core/ToolTip';
import useCardsFromQuery from '@components/card/useCardsFromQuery';
import { where } from '@data/sqlite/query';
import { Brackets } from 'typeorm/browser';
import { QuerySort } from '@data/sqlite/types';

const CORE_SET_ICONS = new Set([
  'torch', 'arkham', 'cultists', 'tentacles', 'rats', 'ghouls', 'striking_fear',
  'ancient_evils', 'chilling_cold', 'pentagram', 'nightgaunts', 'locked_doors',
  'agents_of_hastur', 'agents_of_yog', 'agents_of_shub','agents_of_cthulhu',
]);

interface Props {
  componentId: string;
  step: EncounterSetsStep;
  campaignGuide: CampaignGuide
  color?: BorderColor;
}

function EncounterSetIcon({ set }: { set: { code: string; name: string | undefined }}) {
  const { colors } = useContext(StyleContext);
  const request = useMemo((): { query: Brackets, sort: QuerySort[]} => (
    {
      query: where('c.encounter_code = :value AND c.hidden IS NULL', { value: set.code }),
      sort: [{ s: 'c.position', direction: 'ASC' }],
    }
  ), [set.code]);
  const [encounterSetCards] = useCardsFromQuery(request);
  const [toggle, setToggle] = useState(false);
  const label = useMemo(() => {
    const byType = mapValues(groupBy(encounterSetCards, c => c.type_code), c => c.length);
    if (byType.act || byType.agenda) {
      const entries = sortBy(Object.entries(byType).map(([type, count]) => {
        switch (type) {
          case 'act':
            return ngettext(msgid`Act: ${count}`, `Acts: ${count}`, count);
          case 'agenda':
            return ngettext(msgid`Agenda: ${count}`, `Agendas: ${count}`, count);
          case 'location':
            return ngettext(msgid`Location: ${count}`, `Locations: ${count}`, count);
          case 'enemy':
            return ngettext(msgid`Enemy: ${count}`, `Enemies: ${count}`, count);
          case 'enemy_location':
            return ngettext(msgid`Enemy-Location: ${count}`, `Enemy-Locations: ${count}`, count);
          case 'treachery':
            return ngettext(msgid`Treachery: ${count}`, `Treacheries: ${count}`, count);
          case 'story':
            return ngettext(msgid`Story: ${count}`, `Stories: ${count}`, count);
          case 'key':
            return ngettext(msgid`Key: ${count}`, `Keys: ${count}`, count);
          case 'asset':
            return ngettext(msgid`Asset: ${count}`, `Assets: ${count}`, count);
          case 'scenario':
            return ngettext(msgid`Scenario reference`, `Scenario references: ${count}`, count);
          default:
            return ngettext(msgid`Unknown: ${count}`, `Unknowns: ${count}`, count);
        }
      }), s => s);
      return entries.join('\n');
    }
    return encounterSetCards
      .filter(c => c.type_code === 'treachery' || c.type_code === 'enemy')
      .map(card => card.quantity ?? 0 > 1 ? `${card.name} x${card.quantity}` : card.name).join('\n');
  }, [encounterSetCards]);


  return (
    <ToolTip
      height={48}
      width={60}
      title={set.name}
      label={label}
      toggle={toggle}
      setToggle={setToggle}
    >
      <EncounterIcon
        encounter_code={set.code}
        size={48}
        color={CORE_SET_ICONS.has(set.code) ? colors.skill.combat.icon : colors.darkText}
      />
    </ToolTip>
  );
}

export default function EncounterSetStepComponent({ componentId, color, step, campaignGuide }: Props) {
  const alphabetizeEncounterSets = useSettingValue('alphabetize');
  const { lang, listSeperator } = useContext(LanguageContext);

  const errata = useMemo(() => campaignGuide.cardErrata(step.encounter_sets), [campaignGuide, step.encounter_sets]);
  const _viewEncounterErrata = useCallback(() => {
    Navigation.push<EncounterCardErrataProps>(componentId, {
      component: {
        name: 'Guide.CardErrata',
        passProps: {
          errata,
        },
      },
    });
  }, [errata, componentId]);

  const rawEncounterSets = useMemo(() => map(
    step.encounter_sets,
    encounter_set => {
      return {
        code: encounter_set,
        name: campaignGuide.encounterSet(encounter_set),
      };
    }
  ), [step.encounter_sets, campaignGuide]);
  const encounterSets = useMemo(() => alphabetizeEncounterSets ? sortBy(rawEncounterSets, set => set.name?.toLocaleLowerCase(lang) || '???') : rawEncounterSets, [lang, alphabetizeEncounterSets, rawEncounterSets]);
  const encounterSetString = useMemo(() => stringList(map(encounterSets, set => set.name ? `<i>${set.name}</i>` : 'Missing Set Name'), listSeperator), [encounterSets, listSeperator]);
  const leadText = step.aside ?
    ngettext(
      msgid`Set the ${encounterSetString} encounter set aside, out of play.`,
      `Set the ${encounterSetString} encounter sets aside, out of play.`,
      encounterSets.length
    ) :
    ngettext(
      msgid`Gather all cards from the ${encounterSetString} encounter set.`,
      `Gather all cards from the following encounter sets: ${encounterSetString}.`,
      encounterSets.length
    );
  const startText = step.text || leadText;
  const text =
  ngettext(msgid`${startText} This set is indicated by the following icon:`,
    `${startText} These sets are indicated by the following icons:`,
    encounterSets.length);
  return (
    <>
      <SetupStepWrapper bulletType={step.bullet_type} color={color}>
        <CampaignGuideTextComponent text={text} />
        <SetupStepWrapper bulletType={step.bullet_type} reverseSpacing>
          <View style={[styles.iconPile, space.marginTopM, space.marginBottomS]}>
            { map(encounterSets, set => !!set && (
              <View style={[space.marginSideS, space.marginBottomM]} key={set.code}>
                <EncounterSetIcon set={set} />
              </View>
            )) }
          </View>
        </SetupStepWrapper>
        { !!step.subtext && (
          <CampaignGuideTextComponent text={step.subtext} />
        ) }
      </SetupStepWrapper>
      { !!errata.length && !step.remove && (
        <ArkhamButton icon="book" title={t`Encounter Card Errata`} onPress={_viewEncounterErrata} />
      ) }
    </>
  );
}

const styles = StyleSheet.create({
  iconPile: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
});
