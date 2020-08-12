import React from 'react';
import { connect } from 'react-redux';
import { Brackets } from 'typeorm/browser';
import { filter } from 'lodash';

import Card from '@data/Card';
import Database from '@data/Database';
import { QuerySort } from '@data/types';
import DbRender from '@components/data/DbRender';
import { getTabooSet, AppState } from '@reducers';

interface Props {
  name: string;
  query?: Brackets;
  sort?: QuerySort[];
  children: (cards: Card[], loading: boolean) => React.ReactNode;
}

interface ReduxProps {
  tabooSetId?: number;
}

interface Data {
  cards: Card[];
}

class CardQueryWrapper extends React.Component<Props & ReduxProps> {
  _render = (data?: Data) => {
    const { children } = this.props;
    return children(data ? data.cards : [], !data);
  };

  _getData = async(db: Database): Promise<Data> => {
    const { query, tabooSetId, sort } = this.props;
    if (!query) {
      return {
        cards: [],
      };
    }
    return {
      cards: filter(await db.getCards(query, tabooSetId, sort), card => !!card),
    };
  };

  render() {
    const { name, query, tabooSetId, sort } = this.props;
    return (
      <DbRender name={name} getData={this._getData} ids={[query, tabooSetId, sort]}>
        { this._render }
      </DbRender>
    );
  }
}

function mapStateToProps(
  state: AppState,
): ReduxProps {
  return {
    tabooSetId: getTabooSet(state),
  };
}

export default connect<ReduxProps, unknown, Props, AppState>(
  mapStateToProps
)(CardQueryWrapper) as React.ComponentType<Props>;
