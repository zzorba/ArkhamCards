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


  export interface EncounterSetResults<EncounterSet> {
    encounterSets: Results<EncounterSet>;
  }
  export interface EncounterSetOptions<OwnProps, RealmProps, EncounterSet> {
    schemas: ['EncounterSet'];
    mapToProps: (
      results: EncounterSetResults<EncounterSet>,
      realm: Realm,
      props: OwnProps
    ) => RealmProps;
  }

  export function connectRealm<OwnProps, RealmProps, Type1, Type2={}>(
    component: React.ComponentType<OwnProps & RealmProps>,
    options: CardOptions<OwnProps, RealmProps, Type1> |
      Options<OwnProps, RealmProps> |
      CardAndFaqOptions<OwnProps, RealmProps, Type1, Type2> |
      CardAndTabooSetOptions<OwnProps, RealmProps, Type1, Type2> |
      TabooSetOptions<OwnProps, RealmProps, Type1> |
      EncounterSetOptions<OwnProps, RealmProps, Type1>
  ): React.ComponentType<OwnProps>;
}
