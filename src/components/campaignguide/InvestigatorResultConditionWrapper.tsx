import React from 'react';
import { View } from 'react-native';
import { findIndex, flatMap, forEach } from 'lodash';

import CardListWrapper from './CardListWrapper';
import { InvestigatorResult } from 'data/scenario/conditionHelper';
import Card from 'data/Card';
import { Option } from 'data/scenario/types';

interface Props<T> {
  result: InvestigatorResult;
  extraArg: T;
  renderOption: (investigators: Card[], option: Option, extraArg: T) => Element | null;
}

export default class InvestigatorResultConditionWrapper<T> extends React.Component<Props<T>> {
  _renderCards = (cards: Card[], option: Option): Element | null => {
    const { renderOption, extraArg } = this.props;
    return renderOption(cards, option, extraArg);
  };

  render() {
    const { result } = this.props;
    return (
      <>
        { flatMap(result.options, (option, index) => {
          const investigators: string[] = [];
          forEach(result.investigatorChoices, (choices, code) => {
            if (findIndex(choices, choice => option.id === choice) !== -1) {
              investigators.push(code);
            }
          });
          if (!investigators.length) {
            return null;
          }
          return (
            <View key={index}>
              <CardListWrapper
                cards={investigators}
                render={this._renderCards}
                extraArg={option}
              />
            </View>
          );
        }) }
      </>
    );
  }
}
