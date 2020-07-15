import React from 'react';
import { debounce } from 'lodash';
import deepDiff from 'deep-diff';
import { EventSubscriber, EntitySubscriberInterface } from 'typeorm/browser';
import hoistNonReactStatic from 'hoist-non-react-statics';

import Database from '@data/Database';
import DatabaseContext, { DatabaseContextType } from '@data/DatabaseContext';

export default function connectDb<InputProps, GenerateProps, GenerateParams={}>(
  WrappedComponent: React.ComponentType<InputProps & GenerateProps>,
  extractProps: (props: InputProps) => GenerateParams,
  getData: (db: Database, props: GenerateParams) => Promise<GenerateProps>
) {
  interface State {
    generatedData?: GenerateProps;
  }

  @EventSubscriber()
  class ConnectedDatabaseComponent extends React.Component<InputProps, State> implements EntitySubscriberInterface {
    static contextType = DatabaseContext;
    context!: DatabaseContextType;

    _delayedLoadData: () => void;
    constructor(props: InputProps, context: DatabaseContextType) {
      super(props, context);

      this.state = {};

      this._loadData();
      this._delayedLoadData = debounce(this._loadData, 25);
    }

    componentDidMount() {
      this.context.db.addSubscriber(this);
    }

    componentDidUpdate(prevProps: InputProps) {
      const diff = deepDiff(extractProps(this.props), extractProps(prevProps));
      if (diff && diff.length) {
        this._loadData();
      }
    }

    componentWillUnmount() {
      this.context.db.removeSubscriber(this);
    }

    afterInsert() {
      this._delayedLoadData();
    }

    afterUpdate() {
      this._delayedLoadData();
    }

    _loadData = () => {
      getData(this.context.db, extractProps(this.props)).then(generatedData => {
        this.setState({
          generatedData,
        });
      });
    };

    render() {
      const { generatedData } = this.state;
      if (!generatedData) {
        return null;
      }
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
