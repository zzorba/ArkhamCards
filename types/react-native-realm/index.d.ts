declare module "react-native-realm" {
  import React from 'react';
  import Realm from 'realm';
  import { Subtract } from 'utility-types';

  interface ResultsObject<T> {
    filtered: (query: string) => T[];
  }

  export interface CardResults<Card> {
    cards: ResultsObject<Card>;
  }

  export interface CardResults<Card> {
    cards: ResultsObject<Card>;
  }

  export interface CardOptions<P extends IP, IP extends object, Card> {
    schemas: ['Card'];
    mapToProps: (
      results: CardResults<Card>,
      realm: Realm,
      props: Subtract<P, IP>
    ) => IP;
  }

  export interface CardAndFaqResults<Card, FaqEntry> {
    cards: ResultsObject<Card>;
    faqEntries: ResultsObject<FaqEntry>
  }

  export interface CardAndFaqOptions<P extends IP, IP extends object, Card, FaqEntry>  {
    schemas: ['Card', 'FaqEntry'];
    mapToProps: (
      results: CardAndFaqResults<Card, FaqEntry>,
      realm: Realm,
      props: Subtract<P, IP>
    ) => IP;
  }

  export function connectRealm<P extends IP, IP extends object, Card>(
    component: React.ComponentType<P>,
    options: CardOptions<P, IP, Card>
  ): React.ComponentType<Subtract<P, IP>>;
}
