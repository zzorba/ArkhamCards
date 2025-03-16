import React, { useCallback, useContext } from 'react';
import { View } from 'react-native';
import { t } from 'ttag';

import CardSectionHeader from '@components/core/CardSectionHeader';
import NavButton from '@components/core/NavButton';
import LabeledTextBox from '@components/core/LabeledTextBox';
import { Trauma } from '@actions/types';
import space from '@styles/space';
import LanguageContext from '@lib/i18n/LanguageContext';
import { CampaignInvestigator } from '@data/scenario/GuidedCampaignLog';

interface Props {
  investigator: CampaignInvestigator;
  traumaData: Trauma;
  showTraumaDialog: (investigator: CampaignInvestigator, traumaData: Trauma) => void;
  sectionHeader?: boolean;
}

export default function EditTraumaComponent({ investigator, traumaData, showTraumaDialog, sectionHeader }: Props) {
  const { listSeperator } = useContext(LanguageContext);
  const editTraumaPressed = useCallback(() => {
    showTraumaDialog(investigator, traumaData);
  }, [traumaData, showTraumaDialog, investigator]);

  const traumaString = investigator.card.traumaString(listSeperator, traumaData);
  if (sectionHeader) {
    return (
      <>
        <CardSectionHeader
          investigator={investigator.card}
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
