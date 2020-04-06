import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { map } from 'lodash';

import { NavigationProps } from 'components/nav/types';
import { LocationSetupStep } from 'data/scenario/types'
import withDimensions, { DimensionsProps } from 'components/core/withDimensions';
import LocationCard from './LocationCard';

export interface LocationSetupProps {
  step: LocationSetupStep;
}

type Props = LocationSetupProps & NavigationProps & DimensionsProps;

class LocationSetupView extends React.Component<Props> {
  render() {
    const {
      step: {
        locations,
      },
      width,
    } = this.props;
    return (
      <ScrollView>
        { map(locations, (locationsRow, idx) => (
          <View key={idx} style={styles.row}>
            { map(locationsRow, (item, idx2) => (
              <LocationCard
                key={idx2}
                code={item}
                rowSize={locationsRow.length}
                width={width}
              />
            ))}
          </View>
        ))
        }
      </ScrollView>
    );
  }
}

export default withDimensions(LocationSetupView);

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
