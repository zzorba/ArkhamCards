import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { t } from 'ttag';

import SetupStepWrapper from '../../SetupStepWrapper';
import SingleCardWrapper from '../../SingleCardWrapper';
import ScenarioGuideContext, { ScenarioGuideContextType } from '../../ScenarioGuideContext';
import Card from 'data/Card';
import { CampaignLogEffect } from 'data/scenario/types';
import CardTextComponent from 'components/card/CardTextComponent';

interface Props {
  effect: CampaignLogEffect;
  input?: string[];
  counterInput?: number;
}

export default class CampaignLogEffectComponent extends React.Component<Props> {
  renderContent() {
    const { effect } = this.props;
    return (
      <ScenarioGuideContext.Consumer>
        { ({ campaignGuide }: ScenarioGuideContextType) => {
          if (effect.id) {
            const logEntry = campaignGuide.logEntry(effect.section, effect.id);
            if (!logEntry) {
              return (
                <Text>
                  Unknown campaign log { effect.section }.
                </Text>
              );
            }
            switch (logEntry.type) {
              case 'text': {
                const text = (effect.section === 'campaign_notes') ?
                  t`In your Campaign Log, record that <i>${logEntry.text}</i>` :
                  t`In your Campaign Log, under "${logEntry.section}", record that <i>${logEntry.text}</i>`;
                return (
                  <CardTextComponent text={text} />
                );
              }
              case 'card': {
                return (
                  <SingleCardWrapper
                    code={logEntry.code}
                    render={(card: Card) => (
                      <CardTextComponent
                        text={t`In your Campaign Log, under "${logEntry.section}", record ${card.name}. `}
                      />
                    )}
                  />
                );
              }
              case 'section_count': {
                // Not possible as a record
                return null;
              }
              case 'investigator': {
                // Not possible as a record?
                return null;
              }
            }
          }

          // No id, just a section / count
          const logSection = campaignGuide.logSection(effect.section);
          if (!logSection) {
            return (
              <Text>
                Unknown campaign log section { effect.section }.
              </Text>
            );
          }
          return <Text>Campaign Log Section: { logSection.section }</Text>;
        } }
      </ScenarioGuideContext.Consumer>
    );
  }

  render() {
    return (
      <SetupStepWrapper>
        { this.renderContent() }
      </SetupStepWrapper>
    );
  }
}
