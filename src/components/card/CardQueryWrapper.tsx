import React from 'react';
import { connect } from 'react-redux';
import { Brackets } from 'typeorm/browser';

import Card from 'data/Card';
import Database from 'data/Database';
import DbRender from 'components/data/DbRender';
import { getTabooSet, AppState } from 'reducers';

interface Props<T> {
  query?: Brackets;
  extraArg: T;
  children: (cards: Card[], extraArg: T) => React.ReactNode;
}

export default function CardQueryWrapper<T=undefined>(props: Props<T>) {
  interface ReduxProps {
    tabooSetId?: number;
  }

  interface Data {
    cards: Card[];
  }

  class CardQueryWrapperComponent extends React.Component<Props<T> & ReduxProps> {
    _render = (data?: Data) => {
      const { extraArg, children } = this.props;
      return children(data ? data.cards : [], extraArg);
    };

    _getData = async (db: Database): Promise<Data> => {
      const { query, tabooSetId } = this.props;
      if (!query) {
        return {
          cards: [],
        };
      }
      return {
        cards:  await db.getCards(query, tabooSetId),
      };
    };

    render() {
      const { query, tabooSetId } = this.props;
      return (
        <DbRender getData={this._getData} ids={[query, tabooSetId]}>
          { this._render }
        </DbRender>
      )
    }
  }

  function mapStateToProps(
    state: AppState,
  ): ReduxProps {
    return {
      tabooSetId: getTabooSet(state),
    };
  }

  return connect<ReduxProps, {}, Props<T>, AppState>(
    mapStateToProps
  )(CardQueryWrapperComponent)(props);
}
