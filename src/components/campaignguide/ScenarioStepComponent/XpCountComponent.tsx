import React from 'react';
import { map } from 'lodash';
import { msgid, ngettext } from 'ttag';

import { XpCountStep } from '@data/scenario/types';
import GuidedCampaignLog from '@data/scenario/GuidedCampaignLog';
import ChoiceListItemComponent from '@components/campaignguide/prompts/ChoiceListComponent/ChoiceListItemComponent';
import COLORS from '@styles/colors';
import Card from '@data/Card';

interface Props {
  step: XpCountStep;
  campaignLog: GuidedCampaignLog;
}

export default class XpCountComponent extends React.Component<Props> {
  _onChoiceChange = () => {
    // intentionally empty.
  };

  specialString(investigator: Card) {
    const { step, campaignLog } = this.props;
    const count = campaignLog.specialXp(investigator.code, step.special_xp);
    switch (step.special_xp) {
      case 'resupply_points':
        return ngettext(msgid`${count} resupply`,
          `${count} resupply`,
          count);
      case 'supply_points':
        return ngettext(msgid`${count} supply point`,
          `${count} supply points`,
          count);
    }
  }
  render() {
    const { campaignLog } = this.props;
    return (
      <>
        { map(campaignLog.investigators(false), (investigator, idx) => {
          const resupplyPointsString = this.specialString(investigator);
          const xp = campaignLog.totalXp(investigator.code);
          return (
            <ChoiceListItemComponent
              key={investigator.code}
              code={investigator.code}
              name={investigator.name}
              color={COLORS.faction[investigator.factionCode()].background}
              choices={[{
                text: ngettext(
                  msgid`${xp} general / ${resupplyPointsString} XP`,
                  `${xp} general / ${resupplyPointsString} XP`,
                  xp
                ),
              }]}
              onChoiceChange={this._onChoiceChange}
              choice={0}
              editable={false}
              optional={false}
              firstItem={idx === 0}
            />
          );
        })}
      </>
    );
  }
}
