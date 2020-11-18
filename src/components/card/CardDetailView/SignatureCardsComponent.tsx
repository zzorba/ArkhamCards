import React, { useMemo } from 'react';
import { flatMap, map, partition } from 'lodash';
import {
  View,
} from 'react-native';
import { t } from 'ttag';

import SignatureCardItem from './SignatureCardItem';
import CardDetailSectionHeader from './CardDetailSectionHeader';
import BondedCardsComponent from './BondedCardsComponent';
import Card from '@data/Card';
import space from '@styles/space';
import useCardList from '../useCardList';

interface Props {
  componentId?: string;
  investigator: Card;
  width: number;
}

export default function SignatureCardsComponent({ componentId, investigator, width }: Props) {
  const requiredCodes = useMemo(() => {
    return flatMap(investigator.deck_requirements?.card || [], req => req.code ? [req.code] : []);
  }, [investigator]);
  const [requiredCards, requiredCardsLoading] = useCardList(requiredCodes, 'player');
  const alternateCodes = useMemo(() => {
    return flatMap(investigator.deck_requirements?.card || [], req => (req.alternates || []));
  }, [investigator]);
  const [alternateCards, alternateCardsLoading] = useCardList(alternateCodes, 'player');
  if (alternateCardsLoading && requiredCardsLoading) {
    return null;
  }
  const [advancedCards, altCards] = partition(alternateCards, card => !!card.advanced);
  return (
    <View style={space.marginBottomS}>
      { (requiredCards.length > 0) && (
        <>
          <CardDetailSectionHeader title={t`Required Cards`} />
          { map(requiredCards, card => (
            <SignatureCardItem
              key={card.code}
              componentId={componentId}
              card={card}
              width={width}
            />
          )) }
        </>
      ) }
      { (altCards.length > 0) && (
        <>
          <CardDetailSectionHeader title={t`Alternate Cards`} />
          { map(altCards, card => (
            <SignatureCardItem
              key={card.code}
              componentId={componentId}
              card={card}
              width={width}
            />
          )) }
        </>
      ) }
      { (advancedCards.length > 0) && (
        <>
          <CardDetailSectionHeader title={t`Advanced Cards`} />
          { map(advancedCards, card => (
            <SignatureCardItem
              key={card.code}
              componentId={componentId}
              card={card}
              width={width}
            />
          )) }
        </>
      ) }
      <BondedCardsComponent
        componentId={componentId}
        width={width}
        cards={[
          ...(requiredCards || []),
          ...(altCards || []),
          ...(advancedCards || []),
        ]}
      />
    </View>
  );
}
