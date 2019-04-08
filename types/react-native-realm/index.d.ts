declare module "react-native-realm" {
  import React from 'react';
  import Realm, { Results } from 'realm';
  import { Subtract } from 'utility-types';

  export type Sort = [string, boolean];

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
    faqEntries: Results<FaqEntry>
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

  export function connectRealm<OwnProps, RealmProps, Card, FaqEntry={}>(
    component: React.ComponentType<OwnProps & RealmProps>,
    options: CardOptions<OwnProps, RealmProps, Card> |
      Options<OwnProps, RealmProps> |
      CardAndFaqOptions<OwnProps, RealmProps, Card, FaqEntry>
  ): React.ComponentType<OwnProps>;
}
