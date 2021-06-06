import { DeckProblem, ParsedDeck } from '@actions/types';
import React from 'react';
import CardCountLine from './CardCountLine';
import ExperienceLine from './ExperienceLine';
import ProblemLine from './ProblemLine';

interface Props {
  parsedDeck: ParsedDeck;
  bondedCardCount: number;
  problem?: DeckProblem;
}

export default function DeckMetadataComponent({ parsedDeck, bondedCardCount, problem }: Props) {
  const hasXp = (!!parsedDeck.changes || parsedDeck.experience > 0);
  return (
    <>
      <ProblemLine problem={problem} />
      <CardCountLine parsedDeck={parsedDeck} bondedCardCount={bondedCardCount} last={!hasXp} />
      { hasXp && <ExperienceLine parsedDeck={parsedDeck} />}
    </>
  );
}