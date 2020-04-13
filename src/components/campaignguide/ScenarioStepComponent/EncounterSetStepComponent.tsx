import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { flatMap, forEach, map } from 'lodash';
import { connectRealm, EncounterSetResults } from 'react-native-realm';
import { msgid, ngettext } from 'ttag';

import { stringList } from 'lib/stringHelper';
import SetupStepWrapper from '../SetupStepWrapper';
import { EncounterSetsStep } from 'data/scenario/types';
import EncounterSet from 'data/EncounterSet';
import EncounterIcon from 'icons/EncounterIcon';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import space from 'styles/space';

interface OwnProps {
  step: EncounterSetsStep;
}

interface RealmProps {
  encounterSets: EncounterSet[];
}

type Props = OwnProps & RealmProps;

class EncounterSetStepComponent extends React.Component<Props> {

  render() {
    const { step, encounterSets } = this.props;
    const encounterSetString = stringList(map(encounterSets, set => set ? `<i>${set.name}</i>` : 'Missing Set Name'));
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
      <SetupStepWrapper bulletType={step.bullet_type}>
        <CampaignGuideTextComponent text={text} />
        <SetupStepWrapper bulletType={step.bullet_type} reverseSpacing>
          <View style={[styles.iconPile, space.marginTopM, space.marginBottomS]}>
            { map(encounterSets, set => !!set && (
              <View style={[space.marginSideS, space.marginBottomM]} key={set.code}>
                <EncounterIcon
                  encounter_code={set.code}
                  size={48}
                  color="#222"
                />
              </View>
            )) }
          </View>
        </SetupStepWrapper>
        { !!step.subtext && (
          <CampaignGuideTextComponent text={step.subtext} />
        ) }
      </SetupStepWrapper>
    );
  }
}

export default connectRealm<OwnProps, RealmProps, EncounterSet>(
  EncounterSetStepComponent,
  {
    schemas: ['EncounterSet'],
    mapToProps(
      results: EncounterSetResults<EncounterSet>,
      realm: Realm,
      props: OwnProps
    ) {
      const { step } = props;
      const setsByCode: { [code: string]: EncounterSet } = {};
      forEach(
        results.encounterSets.filtered(
          map(step.encounter_sets, code => `(code == "${code}")`).join(' OR ')),
        set => {
          setsByCode[set.code] = set;
        }
      );

      const encounterSets = flatMap(
        step.encounter_sets,
        code => setsByCode[code]
      );

      return {
        encounterSets,
      };
    },
  }
);

const styles = StyleSheet.create({
  iconPile: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
});
