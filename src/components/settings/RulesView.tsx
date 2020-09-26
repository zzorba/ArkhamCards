import React from 'react';
import { View } from 'react-native';
interface Props {
  componentId: string;
}

export default class RulesView extends React.Component<Props> {
  _rules = require('../../../assets/rules.json');

  render() {
    return (
      <View />
    );
  }
}