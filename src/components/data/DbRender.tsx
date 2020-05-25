import React from 'react';
import { difference } from 'lodash';
import { EventSubscriber } from 'typeorm/browser';

import Database from 'data/Database';
import DatabaseContext, { DatabaseContextType } from 'data/DatabaseContext';

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

    this._loadData(context);
  }

  componentDidUpdate(prevProps: Props<T>) {
    const { name } = this.props;
    const diff = difference(this.props.ids, prevProps.ids);
    if (diff.length) {
      console.log(`RERENDER(${name}): ${JSON.stringify(diff)}, ${JSON.stringify(prevProps.ids)} vs ${JSON.stringify(this.props.ids)}`);
      this._loadData(this.context);
    }
  }

  _loadData = (context?: DatabaseContextType) => {
    const {
      getData,
      ids,
    } = this.props;
    const db = (context || this.context).db;
    getData(db).then(data => {
      this.setState({
        data,
        dataIds: ids,
      });
    });
  };

  render() {
    const { children, ids } = this.props;
    const { data, dataIds } = this.state;
    return children(data, difference(ids, dataIds).length > 0);
  }
}
