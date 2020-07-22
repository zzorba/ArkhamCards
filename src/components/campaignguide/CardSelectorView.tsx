import React from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { filter, forEach, keys, map, uniqBy } from 'lodash';
import { Brackets } from 'typeorm/browser';
import { t } from 'ttag';

import CollapsibleSearchBox from '@components/core/CollapsibleSearchBox';
import QueryProvider from '@components/data/QueryProvider';
import BasicButton from '@components/core/BasicButton';
import CardQueryWrapper from '@components/card/CardQueryWrapper';
import CardSectionHeader from '@components/core/CardSectionHeader';
import CardToggleRow from '@components/cardlist/CardSelectorComponent/CardToggleRow';
import { NavigationProps } from '@components/nav/types';
import { searchMatchesText } from '@components/core/searchHelpers';
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import Card from '@data/Card';
import { combineQueries, where } from '@data/query';
import space from '@styles/space';

export interface CardSelectorProps {
  query?: Brackets;
  selection: string[];
  onSelect: (cards: string[]) => void;
  includeStoryToggle: boolean;
  uniqueName: boolean;
}

type Props = CardSelectorProps & NavigationProps & DimensionsProps;

interface QueryProps {
  query?: Brackets;
  searchTerm: string;
}

interface State {
  selection: {
    [code: string]: boolean;
  };
  storyToggle: boolean;
  searchTerm: string;
}

class CardSelectorView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const selection: { [code: string]: boolean } = {};
    forEach(props.selection, code => {
      selection[code] = true;
    });
    this.state = {
      selection,
      storyToggle: false,
      searchTerm: '',
    };
  }

  _onChange = (card: Card, count: number) => {
    const selection = {
      ...this.state.selection,
    };
    if (count > 0) {
      selection[card.code] = true;
    } else {
      delete selection[card.code];
    }
    this.setState({
      selection,
    });
    this.props.onSelect(keys(selection));
  };

  _render = (cards: Card[], loading: boolean) => {
    const { fontScale, uniqueName } = this.props;
    const { selection, searchTerm } = this.state;
    if (loading) {
      return (
        <ActivityIndicator
          style={space.paddingM}
          size="large"
          animating
        />
      );
    }
    return map(
      uniqBy(
        filter(
          cards,
          card => searchMatchesText(
            searchTerm,
            [card.name]
          )
        ),
        card => uniqueName ? card.name : card.code),
      card => (
        <CardToggleRow
          key={card.code}
          fontScale={fontScale}
          card={card}
          onChange={this._onChange}
          count={selection[card.code] ? 1 : 0}
          limit={1}
        />
      )
    );
  };

  _toggleStoryCards = () => {
    this.setState({
      storyToggle: true,
    });
  };

  static storyCardsQuery({ query }: QueryProps): Brackets {
    return combineQueries(
      where('c.encounter_code is not null'),
      query ? [query] : [],
      'and'
    );
  }

  static normalCardsQuery({ query }: QueryProps): Brackets {
    return combineQueries(
      where('c.encounter_code is null'),
      query ? [query] : [],
      'and'
    );
  }

  renderStoryCards(searchTerm: string) {
    const { fontScale, query } = this.props;
    const { storyToggle } = this.state;
    if (!storyToggle) {
      return (
        <BasicButton
          title={t`Show story assets from other campaigns`}
          onPress={this._toggleStoryCards}
        />
      );
    }
    return (
      <>
        <CardSectionHeader
          fontScale={fontScale}
          section={{ title: t`Story assets` }}
        />
        <QueryProvider<QueryProps, Brackets>
          query={query}
          searchTerm={searchTerm}
          getQuery={CardSelectorView.storyCardsQuery}
        >
          { query => (
            <CardQueryWrapper name="other-selector" query={query}>
              { this._render }
            </CardQueryWrapper>
          ) }
        </QueryProvider>
      </>
    );
  }

  _onSearchChange = (searchTerm: string) => {
    this.setState({
      searchTerm,
    });
  }

  render() {
    const { query, includeStoryToggle } = this.props;
    const { searchTerm } = this.state;
    return (
      <CollapsibleSearchBox
        searchTerm={searchTerm}
        onSearchChange={this._onSearchChange}
        prompt={t`Search`}
      >
        { onScroll => (
          <ScrollView onScroll={onScroll}>
            <QueryProvider<QueryProps, Brackets>
              query={query}
              searchTerm={searchTerm}
              getQuery={CardSelectorView.normalCardsQuery}
            >
              { query => (
                <CardQueryWrapper name="normal-selector" query={query}>
                  { this._render }
                </CardQueryWrapper>
              ) }
            </QueryProvider>
            { includeStoryToggle && this.renderStoryCards(searchTerm) }
          </ScrollView>
        ) }
      </CollapsibleSearchBox>
    );
  }
}

export default withDimensions(CardSelectorView);
