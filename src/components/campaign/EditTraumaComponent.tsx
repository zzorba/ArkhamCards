import React, { useCallback, useContext } from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import CardSectionHeader from '@components/core/CardSectionHeader';
import NavButton from '@components/core/NavButton';
import LabeledTextBox from '@components/core/LabeledTextBox';
import { Trauma } from '@actions/types';
import Card from '@data/types/Card';
import space from '@styles/space';
import LanguageContext from '@lib/i18n/LanguageContext';

interface Props {
  investigator: Card;
  traumaData: Trauma;
  showTraumaDialog: (investigator: Card, traumaData: Trauma) => void;
  sectionHeader?: boolean;
}

export default function EditTraumaComponent({ investigator, traumaData, showTraumaDialog, sectionHeader }: Props) {
  const { listSeperator } = useContext(LanguageContext);
  const editTraumaPressed = useCallback(() => {
    showTraumaDialog(investigator, traumaData);
  }, [traumaData, showTraumaDialog, investigator]);

  const traumaString = investigator.traumaString(listSeperator, traumaData);
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
