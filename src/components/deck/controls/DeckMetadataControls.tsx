import React, { useMemo } from 'react';
import { forEach } from 'lodash';

import Card from '@data/types/Card';
import DeckTabooPickerButton from './DeckTabooPickerButton';
import InvestigatorOptionsControl, { hasInvestigatorOptions } from './InvestigatorOptionsControl';
import { useInvestigatorCards } from '@components/core/hooks';
import { DeckMeta } from '@actions/types';

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
  const investigators = useInvestigatorCards(tabooSetId);
  const parallelInvestigators = useMemo(() => {
    if (!investigatorCode) {
      return [];
    }
    const parallelInvestigators: Card[] = [];
    forEach(investigators, card => {
      if (card && investigatorCode && card.alternate_of_code === investigatorCode) {
        parallelInvestigators.push(card);
      }
    });
    return parallelInvestigators;
  }, [investigators, investigatorCode]);
  const investigator = investigators && investigatorCode && investigators[investigatorCode];
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