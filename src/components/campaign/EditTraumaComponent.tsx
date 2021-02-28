import React, { useCallback, useMemo } from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import { DEFAULT_TRAUMA_DATA } from '@lib/trauma';
import CardSectionHeader from '@components/core/CardSectionHeader';
import NavButton from '@components/core/NavButton';
import LabeledTextBox from '@components/core/LabeledTextBox';
import { InvestigatorData, Trauma } from '@actions/types';
import Card from '@data/types/Card';
import space from '@styles/space';

interface Props {
  investigator: Card;
  investigatorData?: InvestigatorData;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  sectionHeader?: boolean;
}

export default function EditTraumaComponent({ investigator, investigatorData, showTraumaDialog, sectionHeader }: Props) {
  const traumaData = useMemo(() => {
    return investigatorData?.[investigator.code] || DEFAULT_TRAUMA_DATA;
  }, [investigatorData, investigator]);

  const editTraumaPressed = useCallback(() => {
    showTraumaDialog(investigator, traumaData);
  }, [traumaData, showTraumaDialog, investigator]);

  const traumaString = investigator.traumaString(traumaData);
  if (sectionHeader) {
    return (
      <>
        <CardSectionHeader
          investigator={investigator}
          section={{ superTitle: t`Trauma` }}
        />
        <NavButton
          text={traumaString}
          onPress={editTraumaPressed}
        />
      </>
    );
  }
  return (
    <View style={space.marginBottomXs}>
      <LabeledTextBox
        column
        label={t`Trauma`}
        onPress={editTraumaPressed}
        value={traumaString}
      />
    </View>
  );
}
