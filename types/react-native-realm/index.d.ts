declare module 'react-native-realm' {
  import React from 'react';
  import Realm, { Results } from 'realm';
  import { Subtract } from 'utility-types';

  export type Sort = [string, boolean];

  export interface TabooSetResults<TabooSet> {
    tabooSets: Results<TabooSet>;
  }

  export interface TabooSetOptions<OwnProps, RealmProps, TabooSet> {
    schemas: ['TabooSet'];
    mapToProps: (
      results: TabooSetResults<TabooSet>,
      realm: Realm,
      props: OwnProps
    ) => RealmProps;
  }

  export interface CardAndTabooSetResults<Card, TabooSet> {
    cards: Results<Card>;
    tabooSets: Results<TabooSet>;
  }

  export interface CardAndTabooSetOptions<OwnProps, RealmProps, Card, TabooSet> {
    schemas: ['Card', 'TabooSet'];
    mapToProps: (
      results: CardAndTabooSetResults<Card, TabooSet>,
      realm: Realm,
      props: OwnProps
    ) => RealmProps;
  }

  export interface CardResults<Card> {
    cards: Results<Card>;
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
    cards: Results<Card>;
    faqEntries: Results<FaqEntry>;
  }

  export interface Options<OwnProps, RealmProps> {
    mapToProps: (
      results: any,
      realm: Realm,
      props: OwnProps
    ) => RealmProps;
  }

  export interface CardAndFaqOptions<OwnProps, RealmProps, Card, FaqEntry> {
    schemas: ['Card', 'FaqEntry'];
    mapToProps: (
      results: CardAndFaqResults<Card, FaqEntry>,
      realm: Realm,
      props: OwnProps
    ) => RealmProps;
  }

  export function connectRealm<OwnProps, RealmProps, Card, FaqEntry={}, TabooSet={}>(
    component: React.ComponentType<OwnProps & RealmProps>,
    options: CardOptions<OwnProps, RealmProps, Card> |
      Options<OwnProps, RealmProps> |
      CardAndFaqOptions<OwnProps, RealmProps, Card, FaqEntry> |
      CardAndTabooSetOptions<OwnProps, RealmProps, Card, TabooSet> |
      TabooSetOptions<OwnProps, RealmProps, TabooSet>
  ): React.ComponentType<OwnProps>;
}
