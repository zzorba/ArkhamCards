import React from 'react';
import { StyleSheet, View } from 'react-native';
import { find, map } from 'lodash';

import ParallelInvestigatorPicker from './ParallelInvestigatorPicker';
import InvestigatorOption from './InvestigatorOption';
import { DeckMeta } from 'actions/types';
import Card from 'data/Card';
import { s } from 'styles/space';

interface Props {
  investigator: Card;
  meta: DeckMeta;
  parallelInvestigators: Card[];
  setMeta: (key: keyof DeckMeta, value?: string) => void;
  editWarning: boolean;
  disabled?: boolean;
}

export default class InvestigatorOptionsModule extends React.Component<Props> {

  _parallelCardChange = (
    type: 'alternate_front' | 'alternate_back',
    investigator: Card
  ) => {
    const { setMeta } = this.props;
    setMeta(
      type,
      investigator.code === this.props.investigator.code ? undefined : investigator.code
    );
  };

  renderParallelOptions() {
    const {
      investigator,
      parallelInvestigators,
      disabled,
      editWarning,
      meta,
    } = this.props;
    if (!parallelInvestigators.length) {
      return null;
    }

    return (
      <>
        <ParallelInvestigatorPicker
          investigator={investigator}
          parallelInvestigators={parallelInvestigators}
          type="alternate_front"
          onChange={this._parallelCardChange}
          selection={find(
            parallelInvestigators,
            investigator => investigator.code === meta.alternate_front
          ) || investigator}
          disabled={disabled}
          editWarning={editWarning}
        />
        <ParallelInvestigatorPicker
          investigator={investigator}
          parallelInvestigators={parallelInvestigators}
          type="alternate_back"
          onChange={this._parallelCardChange}
          selection={find(
            parallelInvestigators,
            investigator => investigator.code === meta.alternate_back
          ) || investigator}
          disabled={disabled}
          editWarning={editWarning}
        />
      </>
    );
  }

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
      return (
        <View style={styles.placeholder} />
      );
    }
    return (
      <View>
        { this.renderParallelOptions() }
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
