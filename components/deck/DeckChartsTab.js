import React from 'react';
import PropTypes from 'prop-types';
const {
  StyleSheet,
  SectionList,
  View,
  Image,
  Text,
  ScrollView,
  ActivityIndicator
} = require('react-native');

import FactionChart from './charts/FactionChart';
import CostChart from './charts/CostChart';
import SkillIconChart from './charts/SkillIconChart';

export default class DeckChartsTab extends React.Component {

  render() {
    const {
      parsedDeck,
    } = this.props;
    return (
      <ScrollView>
        <FactionChart parsedDeck={parsedDeck} />
        <CostChart parsedDeck={parsedDeck} />
        <SkillIconChart parsedDeck={parsedDeck} />
      </ScrollView>
    );
  }
}
