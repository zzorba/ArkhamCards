import React, { useCallback } from 'react';

import DbChooserButton from '@components/core/DbChooserButton';
import { Brackets } from 'typeorm';

interface Props {
  componentId: string;
  title: string;
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
    [key: string]: string;
  };
  includeNone?: boolean;
}

export default function FilterChooserButton({
  componentId,
  title,
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

  return (
    <DbChooserButton
      componentId={componentId}
      title={title}
      field={field}
      selection={selection}
      onChange={onChange}
      processValue={processValue}
      indent={indent}
      query={query}
      tabooSetId={tabooSetId}
      capitalize={capitalize}
      fixedTranslations={fixedTranslations}
      includeNone={includeNone}
    />
  );
}
