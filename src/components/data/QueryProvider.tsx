import React from 'react';
import { omit } from 'lodash';
import { Brackets } from 'typeorm/browser';
import deepDiff from 'deep-diff';

interface Props<T> {
  getQuery: (props: T) => Brackets | undefined;
  children: (query?: Brackets) => React.ReactNode | null;
}

interface State {
  query?: Brackets;
}

export default class QueryProvider<T> extends React.PureComponent<Props<T> & T, State> {
  state: State = {};

  constructor(props: Props<T> & T) {
    super(props);

    this.state = {
      query: props.getQuery(props as any),
    };
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  componentDidUpdate(prevProps: Props<T>) {
    const ignoreFields = ['children', 'getQuery'];
    const diff = deepDiff(omit(this.props, ignoreFields), omit(prevProps, ignoreFields));
    if (diff) {
      console.log(diff);
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
