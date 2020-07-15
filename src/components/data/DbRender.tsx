import React from 'react';
import deepDiff from 'deep-diff';
import { EventSubscriber } from 'typeorm/browser';

import Database from '@data/Database';
import DatabaseContext, { DatabaseContextType } from '@data/DatabaseContext';

interface Props<T> {
  name: string;
  ids: any[];
  extraProps?: any;
  getData: (db: Database, extraProps?: any) => Promise<T>;
  children: (t?: T, refreshing?: boolean) => React.ReactNode | null;
}

interface State<T> {
  data?: T;
  dataIds: any[];
}

@EventSubscriber()
export default class DbRender<T> extends React.Component<Props<T>, State<T>> {
  static contextType = DatabaseContext;
  context!: DatabaseContextType;

  constructor(props: Props<T>, context: DatabaseContextType) {
    super(props, context);

    this.state = {
      dataIds: [],
    };

    this._loadData(context, props.ids);
  }

  componentDidUpdate(prevProps: Props<T>) {
    const { ids } = this.props;
    const diff = deepDiff(ids, prevProps.ids);
    if (diff && diff.length) {
      // console.log(`RERENDER(${this.props.name}): ${JSON.stringify(diff)}, ${JSON.stringify(prevProps.ids)} vs ${JSON.stringify(this.props.ids)}`);
      this._loadData(this.context, ids);
    }
  }

  _loadData = async(context: DatabaseContextType, ids: any[]) => {
    const {
      getData,
    } = this.props;
    const db = (context || this.context).db;
    const data = await getData(db);

    // Check if results got pre-empted by other changes.
    if (deepDiff(ids, this.props.ids)) {
      return;
    }
    this.setState({
      data,
      dataIds: ids,
    });
  }

  render() {
    const { children, ids } = this.props;
    const { data, dataIds } = this.state;
    return children(data, !!deepDiff(ids, dataIds));
  }
}
