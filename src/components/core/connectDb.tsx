import React from 'react';
import { debounce } from 'lodash';
import { EventSubscriber, EntitySubscriberInterface } from 'typeorm';
import hoistNonReactStatic from 'hoist-non-react-statics';

import Database from 'data/entities/Database';
import DatabaseContext, { DatabaseContextType } from 'data/entities/DatabaseContext';

export function connectDb<InputProps, GeneratedProps>(
  WrappedComponent: React.ComponentType<InputProps & Partial<GeneratedProps>>,
  getData: (db: Database) => Promise<GeneratedProps>
) {
  interface State {
    generatedData?: GeneratedProps;
  }

  @EventSubscriber()
  class ConnectedDatabaseComponent extends React.Component<InputProps, State> implements EntitySubscriberInterface {
    static contextType = DatabaseContext;
    context!: DatabaseContextType;

    results?: GeneratedProps;

    _delayedLoadData: () => void;
    constructor(props: InputProps, context: DatabaseContextType) {
      super(props, context);

      this.state = {};
      this.context.db.addSubscriber(this);
      this._loadData();
      this._delayedLoadData = debounce(this._loadData, 250);
    }

    componentDidMount() {
      this.context.db.addSubscriber(this);
    }

    componentWillUnmount() {
      this.context.db.removeSubscriber
    }

    afterInsert() {
      this._delayedLoadData();
    }

    afterUpdate() {
      this._delayedLoadData();
    }

    _loadData = () => {
      getData(this.context.db).then(generatedData => {
        this.setState({
          generatedData,
        });
      });
    };

    render() {
      return (
        <WrappedComponent
          {...this.props}
          {...this.state.generatedData}
        />
      );
    }
  }

  hoistNonReactStatic(ConnectedDatabaseComponent, WrappedComponent);

  return ConnectedDatabaseComponent;
}

export default connectRealm;
