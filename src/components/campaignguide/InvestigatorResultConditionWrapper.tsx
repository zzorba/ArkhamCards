import React from 'react';
import { View } from 'react-native';
import { findIndex, flatMap, forEach, map } from 'lodash';

import CardQueryWrapper from './CardQueryWrapper';
import { InvestigatorResult } from 'data/scenario/conditionHelper';
import Card from 'data/Card';
import { Option } from 'data/scenario/types';

interface Props<T> {
  result: InvestigatorResult;
  extraArg: T;
  renderOption: (investigators: Card[], option: Option, extraArg: T) => React.ReactNode;
}

export default class InvestigatorResultConditionWrapper<T> extends React.Component<Props<T>> {
  _renderCards = (cards: Card[], option: Option) => {
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
            if (findIndex(choices, idx => idx === index) !== -1) {
              investigators.push(code);
            }
          });
          if (!investigators.length) {
            return null;
          }
          const query = `(${map(investigators, code => `(code == '${code}')`).join(' OR ')})`;
          return (
            <View key={index}>
              <CardQueryWrapper
                query={query}
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
