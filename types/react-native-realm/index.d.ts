declare module "react-native-realm" {
  import React from 'react';
  import Realm from 'realm';
  import { Subtract } from 'utility-types';

  interface ResultsObject<T> {
    filtered: (query: string) => T[];
    length: number;
  }

  export interface CardResults<Card> {
    cards: ResultsObject<Card>;
  }

  export interface CardResults<Card> {
    cards: ResultsObject<Card>;
  }

  export interface CardOptions<OwnProps, RealmProps, Card> {
    schemas: ['Card'];
    mapToProps: (
      results: CardResults<Card>,
      realm: Realm,
      props: OwnProps
    ) => RealmProps;
  }

  export interface CardAndFaqResults<Card, FaqEntry> {
    cards: ResultsObject<Card>;
    faqEntries: ResultsObject<FaqEntry>
  }

  export interface CardAndFaqOptions<OwnProps, RealmProps, Card, FaqEntry> {
    schemas: ['Card', 'FaqEntry'];
    mapToProps: (
      results: CardAndFaqResults<Card, FaqEntry>,
      realm: Realm,
      props: OwnProps
    ) => RealmProps;
  }

  export function connectRealm<OwnProps, RealmProps, Card>(
    component: React.ComponentType<OwnProps & RealmProps>,
    options: CardOptions<OwnProps, RealmProps, Card>
  ): React.ComponentType<OwnProps>;
}
