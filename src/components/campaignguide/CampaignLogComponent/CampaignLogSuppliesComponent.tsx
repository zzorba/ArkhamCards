import React, { useMemo } from 'react';
import { View } from 'react-native';
import { find, map } from 'lodash';

import CampaignLogSectionComponent from './CampaignLogSectionComponent';
import CampaignGuide from '@data/scenario/CampaignGuide';
import GuidedCampaignLog, { InvestigatorSection } from '@data/scenario/GuidedCampaignLog';
import space from '@styles/space';
import useSingleCard from '@components/card/useSingleCard';
import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import RoundedFactionBlock from '@components/core/RoundedFactionBlock';
import { BODY_OF_A_YITHIAN } from '@app_constants';

interface Props {
  sectionId: string;
  campaignGuide: CampaignGuide;
  campaignLog: GuidedCampaignLog;
  section: InvestigatorSection;
  title?: string;
  width: number;
}

function CampaignLogSuppliesInvestigatorSection({ sectionId, campaignGuide, campaignLog, section, code, title, width }: Props & { code: string }) {
  const [investigator] = useSingleCard(code, 'player');
  const yithian = useMemo(() => !!find(campaignLog.traumaAndCardData(code)?.storyAssets || [], x => x === BODY_OF_A_YITHIAN), [campaignLog, code]);
  if (!investigator) {
    return null;
  }
  const investigatorSection = section[investigator.code];
  return (
    <RoundedFactionBlock
      key={investigator.code}
      header={<CompactInvestigatorRow investigator={investigator} width={width} open yithian={yithian} />}
      faction={investigator.factionCode()}
      noSpace
      noShadow
    >
      <View style={[space.paddingSideS, sectionId === 'supplies' ? space.paddingTopS : space.paddingTopM]}>
        { !!investigatorSection && (
          <CampaignLogSectionComponent
            sectionId={sectionId}
            campaignGuide={campaignGuide}
            section={investigatorSection}
            title={title}
          />
        ) }
      </View>
    </RoundedFactionBlock>
  );
}

export default function CampaignLogSuppliesComponent({ sectionId, campaignLog, campaignGuide, section, title, width }: Props) {
  return (
    <>
      { map(section, (investigatorSection, code) => (
        <CampaignLogSuppliesInvestigatorSection
          sectionId={sectionId}
          campaignGuide={campaignGuide}
          campaignLog={campaignLog}
          section={section}
          title={title}
          key={code}
          code={code}
          width={width}
        />
      )) }
    </>
  );
}
