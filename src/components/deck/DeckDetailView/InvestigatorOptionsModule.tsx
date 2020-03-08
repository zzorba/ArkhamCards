import React from 'react';
import { StyleSheet, View } from 'react-native';
import { map } from 'lodash';

import InvestigatorOption from './InvestigatorOption';
import { DeckMeta } from 'actions/types';
import Card from 'data/Card';
import { s } from 'styles/space';

interface Props {
  investigator: Card;
  meta: DeckMeta;
  setMeta: (key: string, value: string) => void;
  editWarning: boolean;
  disabled?: boolean;
}

export default class InvestigatorOptionsModule extends React.Component<Props> {
  render() {
    const {
      investigator,
      meta,
      setMeta,
      disabled,
      editWarning,
    } = this.props;
    const options = investigator.investigatorSelectOptions();
    if (!options.length) {
      return <View style={styles.placeholder} />;
    }
    return (
      <View>
        { map(options, (option, idx) => {
          return (
            <InvestigatorOption
              key={idx}
              investigator={investigator}
              option={option}
              setMeta={setMeta}
              meta={meta}
              disabled={disabled}
              editWarning={editWarning}
            />
          );
        }) }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  placeholder: {
    marginBottom: s,
  },
});
