import React, { useCallback } from 'react';

import { TouchableShrink } from '@components/core/Touchables';
import { StandaloneId } from '@actions/types';
import ItemContent from './ItemContent';

interface Props {
  id: StandaloneId;
  packCode: string;
  text: string;
  description?: string;
  disabled?: boolean;
  onPress: (id: StandaloneId, text: string) => void;
}


export default function StandaloneItem({ id, packCode, text, description, disabled, onPress }: Props) {
  const handleOnPress = useCallback(() => {
    onPress(id, text);
  }, [onPress, id, text]);

  if (!disabled) {
    return (
      <TouchableShrink onPress={handleOnPress} key={packCode}>
        <ItemContent packCode={packCode} text={text} disabled={disabled} description={description} />
      </TouchableShrink>
    );
  }
  return <ItemContent packCode={packCode} text={text} disabled={disabled} description={description} />;
}

