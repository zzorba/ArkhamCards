import React, { useCallback, useContext, useState } from 'react';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';
import NavButton from './NavButton';
import { SearchSelectProps } from '../cardlist/SearchMultiSelectView';
import COLORS from '@styles/colors';
import DatabaseContext from '@data/DatabaseContext';
import { Brackets } from 'typeorm/browser';

interface Props {
  componentId: string;
  title: string;
  field: string;
  query?: Brackets;
  tabooSetId?: number;
  onChange: (selection: string[]) => void;
  selection?: string[];
  indent?: boolean;
  processValue?: (value: string) => string[];
  capitalize?: boolean;
}
export default function DbChooserButton({ componentId, title, field, onChange, selection, indent, query, tabooSetId, processValue, capitalize }: Props) {
  const { db } = useContext(DatabaseContext);
  const [pressed, setPressed] = useState(false);
  const onPress = useCallback(() => {
    setPressed(true);
    db.getDistinctFields(field, query, tabooSetId, processValue).then(values => {
      Navigation.push<SearchSelectProps>(componentId, {
        component: {
          name: 'SearchFilters.Chooser',
          passProps: {
            placeholder: t`Search ${title}`,
            values,
            onChange,
            selection,
            capitalize,
          },
          options: {
            topBar: {
              title: {
                text: t`Select ${title}`,
                color: COLORS.M,
              },
              backButton: {
                title: t`Back`,
                color: COLORS.M,
              },
              rightButtons: selection && selection.length > 0 ?
                [{
                  text: t`Clear`,
                  id: 'clear',
                  color: COLORS.M,
                  accessibilityLabel: t`Clear`,
                }] : [],
            },
          },
        },
      });
      setPressed(false);
    });
  }, [capitalize, db, field, componentId, title, setPressed, onChange, selection, processValue, query, tabooSetId]);

  return (
    <NavButton
      text={`${title}: ${selection && selection.length ? selection.join(', ') : t`All`}`}
      onPress={onPress}
      indent={indent}
      disabled={pressed}
    />
  );
}
