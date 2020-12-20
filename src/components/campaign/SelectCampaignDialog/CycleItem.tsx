import React, { useCallback } from 'react';
import { TouchableOpacity } from 'react-native';

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
      <TouchableOpacity onPress={handleOnPress} key={packCode}>
        <ItemContent packCode={packCode} text={text} disabled={disabled} description={description} />
      </TouchableOpacity>
    );
  }
  return <ItemContent packCode={packCode} text={text} disabled={disabled} description={description} />;
}