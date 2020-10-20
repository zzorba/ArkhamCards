import React from 'react';
import { omit } from 'lodash';
import deepDiff from 'deep-diff';

interface Props<T, S> {
  getQuery: (props: T) => S;
  children: (query: S) => React.ReactNode | null;
}

interface State<S> {
  query: S;
}

export default class QueryProvider<T, S> extends React.PureComponent<Props<T, S> & T, State<S>> {
  constructor(props: Props<T, S> & T) {
    super(props);

    this.state = {
      query: props.getQuery(props as any),
    };
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  componentDidUpdate(prevProps: Props<T, S>) {
    const ignoreFields = ['children', 'getQuery'];
    const diff = deepDiff(omit(this.props, ignoreFields), omit(prevProps, ignoreFields));
    if (diff) {
      this.updateQuery();
    }
  }

  updateQuery() {
    this.setState({
      query: this.props.getQuery(this.props as any),
    });
  }

  render() {
    const { query } = this.state;
    // @ts-ignore
    return this.props.children(query);
  }
}
