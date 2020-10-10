import React, { useCallback, useContext, useEffect, useState, useReducer, Reducer, ReducerWithoutAction } from 'react';
import { flatMap, keys, map, sortBy } from 'lodash';
import { ListRenderItemInfo, FlatList, View } from 'react-native';
import Collapsible from 'react-native-collapsible';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Brackets } from 'typeorm/browser';

import Rule from '@data/Rule';
import StyleContext from '@styles/StyleContext';
import CardFlavorTextComponent from '@components/card/CardFlavorTextComponent';
import CardTextComponent from '@components/card/CardTextComponent';
import { s, m } from '@styles/space';
import DatabaseContext from '@data/DatabaseContext';
import { Navigation } from 'react-native-navigation';
import { RuleViewProps } from './RuleView';

interface Props {
  componentId: string;
}

function RuleComponent({ componentId, rule, level }: { componentId: string; rule: Rule; level: number }) {
  const onPress = useCallback(() =>{
    Navigation.push<RuleViewProps>(componentId, {
      component: {
        name: 'Rule',
        passProps: {
          rule,
        },
        options: {
          topBar: {
            title: {
              text: rule.title,
            },
          },
        },
      }
    });
  }, []);
  return (
    <View style={{ paddingLeft: s + s * (level + 1), paddingRight: m }}>
      <TouchableOpacity onPress={onPress}>
        <CardFlavorTextComponent text={`<game>${rule.title}</game>`} />
        { map(rule.rules || [], subRule => (
            <CardTextComponent text={`- ${subRule.title}`} />
        )) }
      </TouchableOpacity>
    </View>
  );
}

const PAGE_SIZE = 50;
interface PagedRules {
  rules: { [page: string]: Rule[] };
  endReached: boolean;
}

interface AppendPagedRules {
  rules: Rule[];
  page: number;
}


export default function RulesView({ componentId }: Props) {
  const [rules, appendRules] = useReducer<Reducer<PagedRules, AppendPagedRules>>(
    (state: PagedRules, action: AppendPagedRules): PagedRules => {
      return {
        rules: {
          ...state.rules,
          [action.page]: action.rules,
        },
        endReached: state.endReached || action.rules.length < PAGE_SIZE,
      };
  }, {
    rules: {},
    endReached: false,
  });
  const { db } = useContext(DatabaseContext);
  const { colors } = useContext(StyleContext);
  const [page, fetchPage] = useReducer<ReducerWithoutAction<number>>((page: number) => {
    if (!rules.endReached) {
      db.getRules(
        page,
        PAGE_SIZE,
        new Brackets(qb => qb.where('r.parentRule is null'))
      ).then((rules: Rule[]) => appendRules({ rules, page }), console.log);
      return page + 1;
    }
    return page;
  }, 0);

  useEffect(() => {
    // Fetch the initial page.
    fetchPage();
  }, []);

  const fetchMore = useCallback(() => {
    if (!rules.endReached) {
      fetchPage();
    }
  }, []);
  const renderItem = ({ item, index }: ListRenderItemInfo<Rule>) => <RuleComponent componentId={componentId} key={index} rule={item} level={0} />;
  const data = flatMap(
    sortBy(keys(rules.rules), parseInt),
    idx => rules.rules[idx]
  );
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      onEndReachedThreshold={1}
      onEndReached={fetchMore}
      updateCellsBatchingPeriod={0}
      initialNumToRender={30}
      maxToRenderPerBatch={30}
      pagingEnabled={!rules.endReached}
      windowSize={30}
    />
  );
}