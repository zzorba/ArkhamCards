import React from 'react';
import { NavigationProps } from '@components/nav/types';
import { ScrollView } from 'react-native';
import { DeckId } from '@actions/types';

export interface DeckDraftProps {
  id: DeckId;
}
export default function DeckDraftView({ componentId, id }: DeckDraftProps & NavigationProps) {
  return (
    <ScrollView>

    </ScrollView>
  );
}