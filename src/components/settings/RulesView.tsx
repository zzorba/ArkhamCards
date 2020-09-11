import React from 'react';
import { FlatList } from 'react-native';
interface Props {
  componentId: string;
}

export default class RulesView extends React.Component<Props> {

  constructor(props: Props) {
    super(props);

    this._rules = require('../../../assets/rules.json');
  }
  render() {
    return (

    )
  }
}