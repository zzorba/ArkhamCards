import React from 'react';
import { StyleSheet } from 'react-native';
import { map } from 'lodash';
import { SettingsPicker } from 'react-native-settings-components';
import { t } from 'ttag';

import { FactionCodeType, FACTION_COLORS } from '../../constants';
import { COLORS } from '../../styles/colors';

interface Props {
  name: string;
  sizes: string[];
  selection?: string;
  onChange: (selection: string) => void;
  investigatorFaction?: FactionCodeType;
}

export default class DeckSizeSelectPicker extends React.Component<Props> {
  ref?: SettingsPicker<string>;

  _captureRef = (ref: SettingsPicker<string>) => {
    this.ref = ref;
  };

  _onChange = (selection: string) => {
    this.ref && this.ref.closeModal();
    const {
      onChange,
    } = this.props;
    onChange(selection);
  };

  _codeToLabel = (size?: string) => {
    return size || t`Select Deck Size`;
  };

  render() {
    const {
      sizes,
      selection,
      name,
      investigatorFaction,
    } = this.props;
    const options = map(sizes, size => {
      return {
        label: this._codeToLabel(size),
        value: size,
      };
    });
    const color = investigatorFaction ?
      FACTION_COLORS[investigatorFaction] :
      COLORS.lightBlue;
    return (
      <SettingsPicker
        ref={this._captureRef}
        title={name}
        value={selection}
        valueFormat={this._codeToLabel}
        onValueChange={this._onChange}
        containerStyle={styles.container}
        titleStyle={styles.title}
        valueStyle={styles.value}
        modalStyle={{
          header: {
            wrapper: {
              backgroundColor: color,
            },
            description: {
              paddingTop: 8,
            },
          },
          list: {
            itemColor: color,
          },
        }}
        options={options}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  title: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  value: {
    paddingLeft: 0,
    paddingRight: 0,
  },
});
