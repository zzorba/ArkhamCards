import React from 'react';
import { flatMap, map, max, min } from 'lodash';
import {
  Text,
  StyleSheet,
} from 'react-native';
import { ButtonGroup } from 'react-native-elements';
import { t } from 'ttag';

interface Props {
  onFilterChange: (setting: string, value: any) => void;
  onToggleChange: (setting: string, value: boolean) => void;
  maxLevel: number;
  levels: [number, number];
  enabled: boolean;
  exceptional: boolean;
  nonExceptional: boolean;
}

export default class XpChooser extends React.Component<Props> {
  levelRanges() {
    const {
      maxLevel,
    } = this.props;
    return [[0, 0], [1, maxLevel]];
  }

  _updateIndex = (indexes: number[]) => {
    const {
      onFilterChange,
      onToggleChange,
      maxLevel,
      enabled,
      exceptional,
      nonExceptional,
    } = this.props;
    const ranges = this.levelRanges();
    const selection = flatMap(indexes, idx => ranges[idx]);
    const level = indexes.length > 0 ? [min(selection), max(selection)] : [0, maxLevel];
    onFilterChange('level', level);
    if (indexes.length > 0) {
      if (!enabled) {
        onToggleChange('levelEnabled', true);
      }
    } else {
      if (enabled && !exceptional && !nonExceptional) {
        onToggleChange('levelEnabled', false);
      }
    }
    this.setState({
      levels: level,
    });
  };

  render() {
    const {
      levels,
      maxLevel,
      enabled,
    } = this.props;

    if (maxLevel <= 1) {
      return null;
    }

    const selectedIndexes = flatMap(this.levelRanges(), (xyz, idx) => {
      if (enabled &&
          xyz[0] >= levels[0] && xyz[0] <= levels[1] &&
          xyz[1] >= levels[0] && xyz[1] <= levels[1]) {
        return [idx];
      }
      return [];
    });
    const buttons = map(this.levelRanges(), xyz => {
      const startXp = xyz[0];
      const endXp = xyz[0];
      const xp = startXp === endXp ?
        t`Level ${startXp}` :
        t`Level ${startXp} - ${endXp}`;
      return {
        element: () => (<Text>{ xp }</Text>),
      };
    });
    return (
      <ButtonGroup
        // @ts-ignore
        onPress={this._updateIndex}
        selectedIndexes={selectedIndexes}
        buttons={buttons}
        buttonStyle={styles.button}
        selectedButtonStyle={styles.selectedButton}
        containerStyle={styles.container}
        selectMultiple
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 40,
  },
  button: {
    backgroundColor: 'rgb(246,246,246)',
  },
  selectedButton: {
    backgroundColor: 'rgb(221,221,221)',
  },
});
