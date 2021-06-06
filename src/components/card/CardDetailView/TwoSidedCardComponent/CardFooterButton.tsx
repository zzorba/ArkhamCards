import React from 'react';
import { t } from 'ttag';

import RoundedFooterButton from '@components/core/RoundedFooterButton';
import RoundedFooterDoubleButton from '@components/core/RoundedFooterDoubleButton';

interface Props {
  onPressFaq: () => void;
  onPressTaboo?: () => void;
}

export default function CardFooterButton({ onPressFaq, onPressTaboo }: Props) {
  if (onPressTaboo) {
    return (
      <RoundedFooterDoubleButton
        onPressA={onPressFaq}
        iconA="faq"
        titleA={t`FAQ`}
        onPressB={onPressTaboo}
        iconB="taboo"
        titleB={t`Taboo`}
      />
    );
  }
  return (
    <RoundedFooterButton
      onPress={onPressFaq}
      title={t`FAQ`}
      icon="faq"
    />
  );
}
