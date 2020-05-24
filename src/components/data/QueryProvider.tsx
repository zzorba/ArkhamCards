import React from 'react';
import { Brackets } from 'typeorm/browser';
import deepDiff from 'deep-diff';

interface Props<T> {
  getQuery: (props: T) => Brackets | undefined;
  children: (query?: Brackets) => React.ReactNode | null;
}

interface State {
  query?: Brackets
}

export default class QueryProvider<T> extends React.PureComponent<Props<T> & T, State> {
  state: State = {};

  constructor(props: Props<T> & T) {
    super(props);

    this.state = {
      query: props.getQuery(props as any),
    };
  }

  componentDidUpdate({ children, getQuery, ...prevProps }: Props<T>) {
    const {
      children: newChildren,
      getQuery: newQuery,
      ...props
    } = this.props;
    const diff = deepDiff(props, prevProps);
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
