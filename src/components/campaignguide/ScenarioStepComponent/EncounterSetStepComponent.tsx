import React, { useCallback, useContext, useMemo } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { map, sortBy } from 'lodash';
import { useSelector } from 'react-redux';
import { msgid, ngettext, t } from 'ttag';

import { AppState } from '@reducers';
import { stringList } from '@lib/stringHelper';
import SetupStepWrapper from '../SetupStepWrapper';
import { EncounterSetsStep } from '@data/scenario/types';
import EncounterIcon from '@icons/EncounterIcon';
import { EncounterCardErrataProps } from '@components/campaignguide/EncounterCardErrataView';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import space from '@styles/space';
import CampaignGuide from '@data/scenario/CampaignGuide';
import StyleContext from '@styles/StyleContext';
import { CampaignId } from '@actions/types';
import ArkhamButton from '@components/core/ArkhamButton';
import LanguageContext from '@lib/i18n/LanguageContext';

const CORE_SET_ICONS = new Set([
  'torch', 'arkham', 'cultists', 'tentacles', 'rats', 'ghouls', 'striking_fear',
  'ancient_evils', 'chilling_cold', 'pentagram', 'nightgaunts', 'locked_doors',
  'agents_of_hastur', 'agents_of_yog', 'agents_of_shub','agents_of_cthulhu',
]);

interface Props {
  componentId: string;
  campaignId: CampaignId;
  step: EncounterSetsStep;
  campaignGuide: CampaignGuide
}

export default function EncounterSetStepComponent({ componentId, campaignId, step, campaignGuide }: Props) {
  const alphabetizeEncounterSets = useSelector<AppState>(state => state.settings.alphabetizeEncounterSets || false);
  const { colors } = useContext(StyleContext);
  const { listSeperator } = useContext(LanguageContext);

  const _viewEncounterErrata = useCallback(() => {
    Navigation.push<EncounterCardErrataProps>(componentId, {
      component: {
        name: 'Guide.CardErrata',
        passProps: {
          encounterSets: step.encounter_sets,
          campaignId,
        },
      },
    });
  }, [step, campaignId, componentId]);

  const rawEncounterSets = useMemo(() => map(
    step.encounter_sets,
    encounter_set => {
      return {
        code: encounter_set,
        name: campaignGuide.encounterSet(encounter_set),
      };
    }
  ), [step.encounter_sets, campaignGuide]);
  const encounterSets = useMemo(() => alphabetizeEncounterSets ? sortBy(rawEncounterSets, set => set.name || '???') : rawEncounterSets, [alphabetizeEncounterSets, rawEncounterSets]);
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
  const errata = useMemo(() => campaignGuide.cardErrata(step.encounter_sets), [campaignGuide, step.encounter_sets]);
  return (
    <>
      <SetupStepWrapper bulletType={step.bullet_type}>
        <CampaignGuideTextComponent text={text} />
        <SetupStepWrapper bulletType={step.bullet_type} reverseSpacing>
          <View style={[styles.iconPile, space.marginTopM, space.marginBottomS]}>
            { map(encounterSets, set => !!set && (
              <View style={[space.marginSideS, space.marginBottomM]} key={set.code}>
                <EncounterIcon
                  encounter_code={set.code}
                  size={48}
                  color={CORE_SET_ICONS.has(set.code) ? colors.skill.combat.icon : colors.darkText}
                />
              </View>
            )) }
          </View>
        </SetupStepWrapper>
        { !!step.subtext && (
          <CampaignGuideTextComponent text={step.subtext} />
        ) }
      </SetupStepWrapper>
      { !!errata.length && !step.remove && (
        <ArkhamButton icon="faq" title={t`Encounter Card Errata`} onPress={_viewEncounterErrata} />
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
