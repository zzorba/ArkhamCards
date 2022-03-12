import React, { useContext, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { flatMap } from 'lodash';
import stable from 'stable';

import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import { FilterState } from '@lib/filters';
import ToggleFilter from '@components/core/ToggleFilter';
import LanguageContext from '@lib/i18n/LanguageContext';

export interface ToggleItem {
  label: string;
  sort?: string;
  setting: keyof FilterState;
}

interface Props {
  items: ToggleItem[];
  filters: FilterState;
  onToggleChange: (key: keyof FilterState, value: boolean) => void;
  noBorder?: boolean;
}
export default function TwoColumnSort({ items, filters, noBorder, onToggleChange }: Props) {
  const { borderStyle } = useContext(StyleContext);
  const { lang } = useContext(LanguageContext);
  const sortedItems = useMemo(() => {
    return stable(items.slice(), (a, b) => (a.sort || a.label).localeCompare(b.sort || b.label, lang));
  }, [items, lang]);
  return (
    <View style={[noBorder ? undefined : styles.toggleStack, noBorder ? undefined : borderStyle, space.paddingBottomS]}>
      <View style={[styles.toggleRow, space.marginTopXs]}>
        <View style={styles.toggleColumn}>
          { flatMap(sortedItems, ({ label, setting }, index) => {
            if (index % 2 === 1) {
              return null
            }
            return (
              <ToggleFilter
                key={label}
                label={label}
                setting={setting}
                value={!!filters[setting]}
                onChange={onToggleChange}
              />
            );
          }) }
        </View>
        <View style={styles.toggleColumn}>
        { flatMap(sortedItems, ({ label, setting }, index) => {
          if (index % 2 === 0) {
            return null
          }
          return (
            <ToggleFilter
              key={label}
              label={label}
              setting={setting}
              value={!!filters[setting]}
              onChange={onToggleChange}
            />
          );
        }) }
        </View>
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  toggleStack: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  toggleColumn: {
    width: '50%',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  xpSection: {
    flexDirection: 'column',
    width: '100%',
    alignItems: 'flex-end',
  },
});
