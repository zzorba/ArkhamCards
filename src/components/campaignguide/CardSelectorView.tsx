import React from 'react';
import { ScrollView } from 'react-native';
import { forEach, keys, map, uniqBy } from 'lodash';
import { Brackets } from 'typeorm';
import { t } from 'ttag';

import BasicButton from 'components/core/BasicButton';
import CardQueryWrapper from 'components/card/CardQueryWrapper';
import CardSectionHeader from 'components/core/CardSectionHeader';
import CardToggleRow from 'components/cardlist/CardSelectorComponent/CardToggleRow';
import { NavigationProps } from 'components/nav/types';
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import Card from 'data/Card';
import { combineQueries, where } from 'data/query';

export interface CardSelectorProps {
  query?: Brackets;
  selection: string[];
  onSelect: (cards: string[]) => void;
  includeStoryToggle: boolean;
  uniqueName: boolean;
}

type Props = CardSelectorProps & NavigationProps & DimensionsProps;

interface State {
  selection: {
    [code: string]: boolean;
  };
  storyToggle: boolean;
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

  _render = (cards: Card[]) => {
    const { fontScale, uniqueName } = this.props;
    const { selection } = this.state;
    return map(
      uniqBy(cards, card => uniqueName ? card.name : card.code),
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

  renderStoryCards() {
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
        <CardQueryWrapper
          query={combineQueries(
            where('c.encounter_code is not null'),
            query ? [query] : [],
            'and'
          )}
          extraArg={undefined}
        >
          { this._render }
        </CardQueryWrapper>
      </>
    );
  }

  render() {
    const { query, includeStoryToggle } = this.props;
    return (
      <ScrollView>
        <CardQueryWrapper
          query={combineQueries(
            where('c.encounter_code is null'),
            query ? [query] : [],
            'and'
          )}
          extraArg={undefined}
        >
          {this._render}
        </CardQueryWrapper>
        { includeStoryToggle && this.renderStoryCards() }
      </ScrollView>
    );
  }
}

export default withDimensions(CardSelectorView);
