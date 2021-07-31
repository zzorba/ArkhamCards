import { t } from 'ttag';
import React, { useCallback, useContext } from 'react';
import { Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { dissonantVoicesLogin, dissonantVoicesLogout } from '@actions';
import { AppState } from '@reducers';
import DeckActionRow from '@components/deck/controls/DeckActionRow';
import DeckButton from '@components/deck/controls/DeckButton';
import StyleContext from '@styles/StyleContext';
import space from '@styles/space';
import { ShowAlert } from '@components/deck/dialogs';

interface Props {
  showAlert: ShowAlert;
  last?: boolean;
}

export default function DissonantVoicesLoginButton({ last, showAlert }: Props) {
  const { typography } = useContext(StyleContext);
  const dispatch = useDispatch();
  const { loading, status, error } = useSelector((state: AppState) => state.dissonantVoices);
  const doLogin = useCallback(() => {
    dispatch(dissonantVoicesLogin());
  }, [dispatch]);
  const logOutPressed = useCallback(() => {
    dispatch(dissonantVoicesLogout());
  }, [dispatch]);
  const loginPressed = useCallback(() => {
    showAlert(
      t`Sign in to Dissonant Voices?`,
      t`Dissonant Voices is an ongoing project by Mythos Busters to narrate the english scenario text for each Arkham Horror campaign.`,
      [
        { text: t`Cancel`, style: 'cancel' },
        { text: t`Sign In`, onPress: doLogin },
      ],
    );
  }, [doLogin, showAlert]);
  return (
    <View>
      <DeckActionRow
        icon="mythos-busters"
        title={status ? t`Narration enabled` : t`Audio narration`}
        description={t`Dissonant Voices`}
        growControl
        control={<DeckButton thin onPress={status ? logOutPressed : loginPressed} title={status ? t`Log out` : t`Log in`} />}
        loading={loading}
        last={last}
      />
      { !!error && (
        <View style={space.paddingS}>
          <Text style={[typography.text, typography.error]}>{ error }</Text>
        </View>
      ) }
    </View>
  );
}
