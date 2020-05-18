import React from 'react';
import { debounce } from 'lodash';
import { EventSubscriber, EntitySubscriberInterface } from 'typeorm';

import Database from 'data/Database';
import DatabaseContext, { DatabaseContextType } from 'data/DatabaseContext';

interface Props<T> {
  id: string;
  extraProps: any;
  getData: (db: Database) => Promise<T>;
  children: (t?: T) => React.ReactNode;
}

interface State<T> {
  data?: T;
}

@EventSubscriber()
export default class DbRender<T> extends React.Component<Props<T>, State<T>> implements EntitySubscriberInterface {
  static contextType = DatabaseContext;
  context!: DatabaseContextType;

  _delayedLoadData: () => void;

  constructor(props: Props<T>, context: DatabaseContextType) {
    super(props, context);

    this.state = {};

    this._loadData(context);
    this._delayedLoadData = debounce(this._loadData, 250);
  }

  componentDidUpdate(prevProps: Props<T>) {
    if (this.props.id !== prevProps.id || this.props.extraProps !== prevProps.extraProps) {
      this._delayedLoadData();
    }
  }

  componentDidMount() {
//    this.context.db.addSubscriber(this);
  }

  componentWillUnmount() {
//    this.context.db.removeSubscriber(this);
  }

  afterInsert() {
    this._delayedLoadData();
  }

  afterUpdate() {
    this._delayedLoadData();
  }

  _loadData = (context?: DatabaseContextType) => {
    const db = (context || this.context).db;
    this.props.getData(db).then(data => {
      this.setState({
        data,
      });
    });
  };

  render() {
    const { children } = this.props;
    return children(this.state.data);
  }
}
