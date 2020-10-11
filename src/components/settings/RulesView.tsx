import React, { useCallback, useContext, useEffect, useState, useReducer, Reducer, ReducerWithoutAction } from 'react';
import { flatMap, keys, map, sortBy } from 'lodash';
import { ListRenderItemInfo, FlatList, View, Platform } from 'react-native';
import { t } from 'ttag';
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
import { SEARCH_BAR_HEIGHT } from '@components/core/SearchBox';
import CollapsibleSearchBox from '@components/core/CollapsibleSearchBox';
import { where } from '@data/query';

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
    <View key={rule.id} style={{ paddingLeft: s + s * (level + 1), paddingRight: m, marginTop: s }}>
      <TouchableOpacity onPress={onPress}>
        <CardFlavorTextComponent text={`<game>${rule.title}</game>`} />
        { rule.rules && rule.rules.length > 0 && (
          <CardTextComponent text={map(rule.rules || [], subRule => subRule.title).join(', ')} />
          ) }
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

interface SearchResults {
  rules: Rule[];
  term: string;
}


export default function RulesView({ componentId }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResults>({
    term: '',
    rules: [],
  });
  const updateSearch = useCallback((searchTerm: string) => {
    setSearchTerm(searchTerm);
    if (searchTerm == searchResults.term) {
      return;
    }
    if (!searchTerm) {
      setSearchResults({
        term: '',
        rules: [],
      });
    }
    db.getRules(
      0,
      100,
      where(`r.parentRule is null AND (r.title LIKE '%' || :searchTerm || '%' OR r.text LIKE '%' || :searchTerm || '%' OR (sub_rules_title is not null AND sub_rules_title LIKE '%' || :searchTerm || '%') OR (sub_rules_text is not null AND sub_rules_text LIKE '%' || :searchTerm || '%'))`, { searchTerm })
    ).then((rules: Rule[]) => setSearchResults({
      term: searchTerm,
      rules,
    }), console.log);
  },[]);
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
  const data = searchTerm ? searchResults.rules : flatMap(
    sortBy(keys(rules.rules), parseInt),
    idx => rules.rules[idx]
  );
  return (
    <CollapsibleSearchBox
      prompt={t`Search rules`}
      searchTerm={searchTerm}
      onSearchChange={updateSearch}
    >
    { (onScroll) => (
      <FlatList
        onScroll={onScroll}
        data={data}
        contentInset={Platform.OS === 'ios' ? { top: SEARCH_BAR_HEIGHT } : undefined}
        contentOffset={Platform.OS === 'ios' ? { x: 0, y: -SEARCH_BAR_HEIGHT } : undefined}

        renderItem={renderItem}
        onEndReachedThreshold={1}
        onEndReached={fetchMore}
        updateCellsBatchingPeriod={0}
        initialNumToRender={30}
        maxToRenderPerBatch={30}
        pagingEnabled={!rules.endReached}
        windowSize={30}
      />
    ) }
    </CollapsibleSearchBox>

  );
}