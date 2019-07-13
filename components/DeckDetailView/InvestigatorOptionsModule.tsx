import React from 'react';
import { StyleSheet, View } from 'react-native';
import { map } from 'lodash';

import InvestigatorOption from './InvestigatorOption';
import { Deck } from '../../actions/types';
import Card from '../../data/Card';
import { s } from '../../styles/space';

interface Props {
  investigator: Card;
  deck: Deck;
}

export default class InvestigatorOptionsModule extends React.Component<Props> {
  render() {
    const { investigator, deck } = this.props;
    const options = investigator.investigatorOptions();
    if (!options.length) {
      return null;
    }
    return (
      <View style={styles.container}>
        { map(options, (option, idx) => {
          return (
            <InvestigatorOption
              key={idx}
              investigator={investigator}
              option={option}
              deck={deck}
            />
          );
        }) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginLeft: s,
    marginRight: s,
  },
});
