import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { map, sortBy } from 'lodash';
import { connect } from 'react-redux';
import { msgid, ngettext } from 'ttag';
import { t } from 'ttag';

import { AppState } from '@reducers';
import BasicButton from '@components/core/BasicButton';
import { stringList } from '@lib/stringHelper';
import SetupStepWrapper from '../SetupStepWrapper';
import { EncounterSetsStep } from '@data/scenario/types';
import EncounterIcon from '@icons/EncounterIcon';
import { EncounterCardErrataProps } from '@components/campaignguide/EncounterCardErrataView';
import CampaignGuideTextComponent from '../CampaignGuideTextComponent';
import space from '@styles/space';
import COLORS from '@styles/colors';
import CampaignGuide from '@data/scenario/CampaignGuide';

interface OwnProps {
  componentId: string;
  campaignId: number;
  step: EncounterSetsStep;
  campaignGuide: CampaignGuide
}

interface ReduxProps {
  alphabetizeEncounterSets: boolean;
}

type Props = OwnProps & ReduxProps;

class EncounterSetStepComponent extends React.Component<Props> {
  _viewEncounterErrata = () => {
    const { componentId, step, campaignId } = this.props;
    Navigation.push<EncounterCardErrataProps>(componentId, {
      component: {
        name: 'Guide.CardErrata',
        passProps: {
          encounterSets: step.encounter_sets,
          campaignId,
        },
      },
    });
  };

  encounterSets() {
    const { step, campaignGuide, alphabetizeEncounterSets } = this.props;
    const encounterSets = map(
      step.encounter_sets,
      encounter_set => {
        return {
          code: encounter_set,
          name: campaignGuide.encounterSet(encounter_set),
        };
      }
    );

    if (alphabetizeEncounterSets) {
      return sortBy(encounterSets, set => set.name || '???');
    }
    return encounterSets;
  }

  render() {
    const { step, campaignGuide } = this.props;
    const encounterSets = this.encounterSets();
    const encounterSetString = stringList(map(encounterSets, set => set.name ? `<i>${set.name}</i>` : 'Missing Set Name'));
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
    const errata = campaignGuide.cardErrata(step.encounter_sets);
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
                    color={COLORS.darkText}
                  />
                </View>
              )) }
            </View>
          </SetupStepWrapper>
          { !!step.subtext && (
            <CampaignGuideTextComponent text={step.subtext} />
          ) }
        </SetupStepWrapper>
        { !!errata.length && (
          <BasicButton title={t`Encounter Card Errata`} onPress={this._viewEncounterErrata} />
        ) }
      </>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    alphabetizeEncounterSets: state.settings.alphabetizeEncounterSets || false,
  };
}

export default connect<ReduxProps, unknown, OwnProps, AppState>(mapStateToProps)(EncounterSetStepComponent);

const styles = StyleSheet.create({
  iconPile: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
});
