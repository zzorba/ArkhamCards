import React, { useCallback, useContext, useMemo } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import CompactInvestigatorRow from '@components/core/CompactInvestigatorRow';
import Card from '@data/types/Card';
import RadioButton from '../RadioButton';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import AppIcon from '@icons/AppIcon';

interface BasicProps {
  selected: boolean;
  index: number;
  onSelect: (index: number) => void;
  width: number;
  editable: boolean;
  description?: string;
  transparent?: boolean;
}
interface InvestigatorProps extends BasicProps {
  type: 'investigator';
  investigator: Card;
  yithian?: boolean;
}

interface PlaceholderProps extends BasicProps {
  type: 'placeholder';
  label: string;
}

type Props = PlaceholderProps | InvestigatorProps;

export default function InvestigatorRadioChoice({ transparent, description, selected, index, onSelect, editable, width, ...props }: Props) {
  const onPress = useCallback(() => onSelect(index), [onSelect, index]);
  const { colors, typography } = useContext(StyleContext);

  const content = useMemo(() => {
    if (props.type === 'investigator') {
      return (
        <CompactInvestigatorRow
          investigator={props.investigator}
          description={description}
          width={width}
          transparent={transparent && !selected}
          yithian={props.yithian}
        >
          <RadioButton color="light" icon="radio" selected={selected} />
        </CompactInvestigatorRow>
      );
    }
    return (
      <View style={[styles.spreadRow, space.paddingSideS, space.paddingTopS]}>
        <View style={styles.row}>
          <View style={[space.paddingLeftXs, space.paddingRightM]}>
            <AppIcon name="dismiss" size={20} color={colors.D30} />
          </View>
          <Text style={typography.mediumGameFont}>
            { props.label }
          </Text>
        </View>
        <RadioButton color="dark" icon="radio" selected={selected} />
      </View>
    );
  }, [selected, props, width, description, colors, typography, transparent]);
  return (
    <View style={space.paddingBottomXs}>
      { editable ? <TouchableOpacity onPress={onPress}>{content}</TouchableOpacity> : content }
    </View>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  spreadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
