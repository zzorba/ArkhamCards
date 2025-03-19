import CampaignGuide from '@data/scenario/CampaignGuide';
import { CampaignLogEntry, EntrySection } from '@data/scenario/GuidedCampaignLog';
import { ArkhamSlimIcon } from '@icons/ArkhamIcon';
import { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { find, range } from 'lodash';
import React, { useContext, useMemo } from 'react';

import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-gesture-handler';

type Props = {
  sectionId: string;
  campaignGuide: CampaignGuide;
  section: EntrySection;
  interScenarioId: string | undefined;
};

function getEntryText(
  entry: CampaignLogEntry | undefined,
  campaignGuide: CampaignGuide, sectionId: string): string | undefined {
  if (!entry) {
    return undefined
  }
  if (entry.type === 'freeform') {
    return entry.text;
  }
  const logEntry = campaignGuide.logEntry(sectionId, entry.id);
  if (!logEntry || logEntry.type !== 'text') {
    return undefined;
  }
  return logEntry.text;
}

function GlyphEntry({ glyph, sectionId, section, campaignGuide }: { sectionId: string; glyph: string; section: EntrySection; campaignGuide: CampaignGuide }) {
  const { colors, typography } = useContext(StyleContext);
  const text = useMemo(() => {
    const entry = find(section.entries, e => e.id === glyph);
    return getEntryText(entry, campaignGuide, sectionId);
  }, [section, campaignGuide, sectionId, glyph]);
  return (
    <View style={styles.glyph}>
      <ArkhamSlimIcon size={48} name={glyph} color={colors.D30} />
      { !!text ? <Text style={typography.cursive}>{text}</Text> : <View style={{ height: 20 }} />}
    </View>
  )
}

export default function CampaignLogGlyphsComponent({ sectionId, campaignGuide, section }: Props) {
  return (
    <View style={styles.container}>
      { range(0, 26).map(idx => {
        const char = String.fromCharCode(97 + idx);
        const entry = `tdc_rune_${char}`;
        return <GlyphEntry key={idx} glyph={entry} sectionId={sectionId} section={section} campaignGuide={campaignGuide} />;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  glyph: {
    marginLeft: s,
    marginRight: s,
    marginBottom: m,
    alignItems: 'center',
    justifyContent: 'center',
  },
})