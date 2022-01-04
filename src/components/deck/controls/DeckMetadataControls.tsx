import React, { useMemo } from 'react';
import { filter, find } from 'lodash';

import Card from '@data/types/Card';
import DeckTabooPickerButton from './DeckTabooPickerButton';
import InvestigatorOptionsControl, { hasInvestigatorOptions } from './InvestigatorOptionsControl';
import { useInvestigatorCards, useParallelInvestigators } from '@components/core/hooks';
import { DeckMeta } from '@actions/types';
import useCardsFromQuery, { useCardsForQuery } from '@components/card/useCardsFromQuery';
import { where } from '@data/sqlite/query';
import useSingleCard from '@components/card/useSingleCard';

interface Props {
  investigatorCode?: string;
  tabooOpen?: boolean;
  editable: boolean;
  setTabooSet?: (tabooSet?: number) => void;
  tabooSetId: number;
  hasPreviousDeck?: boolean;

  meta: DeckMeta;
  setMeta: (key: keyof DeckMeta, value?: string) => void;
  setParallel: (front: string, back: string) => void;

  firstElement?: (last: boolean) => React.ReactNode;
}

export default function DeckMetadataControls({
  investigatorCode,
  tabooOpen,
  editable,
  meta,
  setMeta,
  setParallel,
  setTabooSet,
  tabooSetId,
  firstElement,
  hasPreviousDeck,
}: Props) {
  const [parallelInvestigators] = useParallelInvestigators(investigatorCode, tabooSetId);
  const [investigator] = useSingleCard(investigatorCode, 'player', tabooSetId);
  if (!investigator) {
    return null;
  }
  const hasOptions = hasInvestigatorOptions(investigator, parallelInvestigators);
  return (
    <>
      { !!firstElement && firstElement(!setTabooSet && !hasOptions) }
      { !!setTabooSet && (
        <DeckTabooPickerButton
          open={tabooOpen}
          disabled={!editable}
          tabooSetId={tabooSetId}
          setTabooSet={setTabooSet}
          first={!firstElement}
          last={!hasOptions}
        />
      ) }
      <InvestigatorOptionsControl
        investigator={investigator}
        meta={meta}
        parallelInvestigators={parallelInvestigators}
        setMeta={setMeta}
        setParallel={setParallel}
        editWarning={!!hasPreviousDeck}
        disabled={!editable}
        first={!setTabooSet && !firstElement}
      />
    </>
  );
}