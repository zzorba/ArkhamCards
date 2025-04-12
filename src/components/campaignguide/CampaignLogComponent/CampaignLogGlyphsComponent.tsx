import { ShowTextEditDialog } from '@components/core/useTextEditDialog';
import CampaignGuide from '@data/scenario/CampaignGuide';
import { CampaignLogEntry, EntrySection } from '@data/scenario/GuidedCampaignLog';
import { ArkhamSlimIcon } from '@icons/ArkhamIcon';
import { m, s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { find, range } from 'lodash';
import React, { useCallback, useContext, useMemo } from 'react';

import { StyleSheet, View } from 'react-native';
import { Pressable, Text } from 'react-native-gesture-handler';
import CampaignGuideContext from '../CampaignGuideContext';

type Props = {
  sectionId: string;
  campaignGuide: CampaignGuide;
  section: EntrySection;
  interScenarioId: string | undefined;
  showTextEditDialog: ShowTextEditDialog;
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

function GlyphEntry({ glyph, sectionId, section, campaignGuide, showTextEditDialog }: {
  sectionId: string;
  glyph: string;
  section: EntrySection;
  campaignGuide: CampaignGuide;
  showTextEditDialog: ShowTextEditDialog;
}) {
  const { colors, typography } = useContext(StyleContext);
  const { campaignState } = useContext(CampaignGuideContext);
  const text = useMemo(() => {
    const entry = find(section.entries, e => e.id === glyph);
    return getEntryText(entry, campaignGuide, sectionId);
  }, [section, campaignGuide, sectionId, glyph]);
  const onEditGlyph = useCallback(() => {
    showTextEditDialog('Update translation', text ?? '', (text) => {
      campaignState.replaceTextInput(glyph, text);
    })
  }, [showTextEditDialog, text, glyph, campaignState]);
  return (
    <View style={styles.glyph}>
      <ArkhamSlimIcon size={48} name={glyph} color={colors.D30} />
      { !!text ? (
        <Pressable onPress={glyph !== 'tdc_rune_a' ? onEditGlyph : undefined}>
          <Text style={typography.cursive}>{'  '}{text}{'  '}</Text>
        </Pressable>
      ) : <View style={{ height: 20 }} />}
    </View>
  )
}

export default function CampaignLogGlyphsComponent({ sectionId, campaignGuide, section, showTextEditDialog }: Props) {
  return (
    <View style={styles.container}>
      { range(0, 26).map(idx => {
        const char = String.fromCharCode(97 + idx);
        const entry = `tdc_rune_${char}`;
        return (
          <GlyphEntry
            key={idx}
            glyph={entry}
            sectionId={sectionId}
            section={section}
            campaignGuide={campaignGuide}
            showTextEditDialog={showTextEditDialog}
          />
        );
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