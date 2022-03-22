import React, { useCallback, useMemo } from 'react';

import DbChooserButton from '@components/core/DbChooserButton';
import { Brackets } from 'typeorm';
import { combineQueries, NO_CUSTOM_CARDS_QUERY } from '@data/sqlite/query';

interface Props {
  componentId: string;
  title: string;
  all: string;
  selection?: string[];
  field: string;
  setting: string;
  onFilterChange: (setting: string, selection: string[]) => void;
  indent?: boolean;
  processValue?: (value: string) => string[];
  query?: Brackets;
  tabooSetId?: number;
  capitalize?: boolean;
  fixedTranslations?: {
    [key: string]: string | undefined;
  };
  includeNone?: boolean;
}

export default function FilterChooserButton({
  componentId,
  title,
  all,
  field,
  selection,
  setting,
  onFilterChange,
  indent,
  processValue,
  tabooSetId,
  query,
  capitalize,
  fixedTranslations,
  includeNone,
}: Props) {
  const onChange = useCallback((values: string[]) => {
    onFilterChange(setting, values);
  }, [onFilterChange, setting]);
  const theQuery = useMemo(() => combineQueries(NO_CUSTOM_CARDS_QUERY, query ? [query] : [], 'and'), [query]);
  return (
    <DbChooserButton
      componentId={componentId}
      title={title}
      all={all}
      field={field}
      selection={selection}
      onChange={onChange}
      processValue={processValue}
      indent={indent}
      query={theQuery}
      tabooSetId={tabooSetId}
      capitalize={capitalize}
      fixedTranslations={fixedTranslations}
      includeNone={includeNone}
    />
  );
}
