import React, { useContext, useEffect } from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';

import BasicListRow from '@components/core/BasicListRow';
import PlusMinusButtons from '@components/core/PlusMinusButtons';
import StyleContext from '@styles/StyleContext';
import { useCounter } from '@components/core/hooks';

interface Props {
  countChanged: (index: number, count: number) => void;
  index: number;
  title: string;
  count?: number;
}

export default function EditCountComponent({ countChanged, index, title, count: initialCount }: Props) {
  const { typography } = useContext(StyleContext);
  const [count, increment, decrement] = useCounter(initialCount || 0, { min: 0 });
  useEffect(() => {
    countChanged(index, count);
  }, [count]);
  return (
    <BasicListRow>
      <Text style={typography.mediumGameFont}>
        { title }
      </Text>
      <PlusMinusButtons
        count={count || 0}
        onIncrement={increment}
        onDecrement={decrement}
        countRender={(
          <Text style={[styles.margin, typography.text]}>
            { count }
          </Text>
        )}
        size={36}
      />
    </BasicListRow>
  );
}

const styles = StyleSheet.create({
  margin: {
    minWidth: 40,
    textAlign: 'center',
  },
});
