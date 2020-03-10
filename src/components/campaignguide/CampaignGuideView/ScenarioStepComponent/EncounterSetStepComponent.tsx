import React from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import { flatMap, forEach, map } from 'lodash';
import { connectRealm, EncounterSetResults } from 'react-native-realm';
import { t } from 'ttag';

import SetupStepWrapper from './SetupStepWrapper';
import { EncounterSetsStep } from 'data/scenario/types';
import EncounterSet from 'data/EncounterSet';
import EncounterIcon from 'icons/EncounterIcon';
import CardTextComponent from 'components/card/CardTextComponent';
import typography from 'styles/typography';

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
    const encounterSetString = map(encounterSets, set => `<i>${set.name}</i>`).join(', ');
    const leadText = step.text || t`Gather all cards from the following encounter sets:`;
    const text = t`${leadText} ${encounterSetString}. These sets are indicated by the following icons:`;
    return (
      <SetupStepWrapper>
        <CardTextComponent text={text} />
        <View style={styles.iconPile}>
          {map(encounterSets, set => (
            <View style={styles.icon} key={set.code}>
              <EncounterIcon
                encounter_code={set.code}
                size={48}
                color="#222"
              />
            </View>
          )) }
        </View>
        { !!step.subtext && (
          <CardTextComponent text={step.subtext} />
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
)

const styles = StyleSheet.create({
  iconPile: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  icon: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
  },
})
