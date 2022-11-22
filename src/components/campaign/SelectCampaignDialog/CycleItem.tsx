import React, { useCallback } from 'react';

import { TouchableShrink } from '@components/core/Touchables';
import { CampaignCycleCode } from '@actions/types';
import ItemContent from './ItemContent';

interface Props {
  packCode: CampaignCycleCode;
  text: string;
  description?: string;
  disabled?: boolean;
  onPress: (packCode: CampaignCycleCode, text: string) => void;
}
export default function CycleItem({ packCode, text, description, disabled, onPress }: Props) {
  const handleOnPress = useCallback(() => {
    onPress(packCode, text);
  }, [onPress, packCode, text]);

  if (!disabled) {
    return (
      <TouchableShrink onPress={handleOnPress} key={packCode}>
        <ItemContent packCode={packCode} text={text} disabled={disabled} description={description} />
      </TouchableShrink>
    );
  }
  return <ItemContent packCode={packCode} text={text} disabled={disabled} description={description} />;
}