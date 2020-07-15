import React from 'react';
import { View } from 'react-native';
import { find, map } from 'lodash';

import ParallelInvestigatorPicker from './ParallelInvestigatorPicker';
import InvestigatorOption from './InvestigatorOption';
import { DeckMeta } from 'actions/types';
import Card from '@data/Card';

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
    code?: string
  ) => {
    const { setMeta } = this.props;
    setMeta(type, code);
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
          )}
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
          )}
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
