import React, { useMemo } from 'react';
import { View } from 'react-native';
import { find, partition, map, forEach } from 'lodash';

import CampaignGuide from '@data/scenario/CampaignGuide';
import GuidedCampaignLog, { EntrySection } from '@data/scenario/GuidedCampaignLog';
import space from '@styles/space';
import useSingleCard from '@components/card/useSingleCard';
import { BODY_OF_A_YITHIAN } from '@app_constants';
import InvestigatorImage from '@components/core/InvestigatorImage';
import CampaignLogEntryComponent from './CampaignLogEntryComponent';

interface Props {
  sectionId: string;
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;
  section: EntrySection;
  title?: string;
  interScenarioId?: string;
}

function SingleInvestigatorImage({ code, campaignLog }: { code: string; campaignLog: GuidedCampaignLog }) {
  const [investigator] = useSingleCard(code, 'player');
  const yithian = useMemo(() => !!find(campaignLog.traumaAndCardData(code)?.storyAssets || [], x => x === BODY_OF_A_YITHIAN), [campaignLog, code]);
  if (!investigator) {
    return null;
  }
  return (
    <View style={space.marginLeftXs}>
      <InvestigatorImage card={investigator} yithian={yithian} size="extra_tiny" />
    </View>
  );
}

export default function CampaignLogInvestigatorChecklistComponent({ interScenarioId, sectionId, campaignLog, campaignGuide, section, title }: Props) {
  const { cardEntries, entries } = useMemo(() => {
    const [card, other] = partition(section.entries, (entry) => entry.type === 'card');
    const byId: { [id: string]: string[] | undefined } = {};
    forEach(card, c => {
      if (c.type === 'card') {
        if (!byId[c.id]) {
          byId[c.id] = [];
        }
        forEach(c.cards, code => byId[c.id]?.push(code.card));
      }
    });
    return { cardEntries: byId, entries: other };
  }, [section.entries]);

  return (
    <>
      { map(entries, (entry) => (
        <View
          key={entry.id}
          style={[
            space.paddingSideS,
            { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
          ]}
        >
          <CampaignLogEntryComponent
            entry={entry}
            sectionId={sectionId}
            campaignGuide={campaignGuide}
            section={section}
            interScenarioId={interScenarioId}
            title={title}
            first={false}
            last={false}
            noWrapper
          />
          <View style={[{ flexDirection: 'row', alignItems: 'center', height: 30 }, space.marginBottomXs]}>
            { map(cardEntries[entry.id] ?? [], (code) => (
              <SingleInvestigatorImage
                key={code}
                code={code}
                campaignLog={campaignLog} />
            ))}
          </View>
        </View>
      )) }
    </>
  );
}
