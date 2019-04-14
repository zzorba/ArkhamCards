import React from 'react';
import { find, map } from 'lodash';
import Realm from 'realm';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { connectRealm, CardResults } from 'react-native-realm';

import { t } from 'ttag';
import DialogPicker from '../core/DialogPicker';
import { fetchCards } from '../cards/actions';
import Card from '../../data/Card';
import { AppState } from '../../reducers';

const LANGUAGES = [
  { name: 'English', code: 'en' },
  { name: 'Español', code: 'es' },
  { name: 'Deutsch', code: 'de' },
  { name: 'Italiano', code: 'it' },
  { name: 'Français', code: 'fr' },
];

interface OwnProps {
  componentId: string;
}

interface ReduxProps {
  lang: string;
}

interface ReduxActionProps {
  fetchCards: (realm: Realm, lang: string) => void;
}

interface RealmProps {
  realm: Realm;
}

type Props = OwnProps & ReduxProps & ReduxActionProps & RealmProps;

class LanguageDialog extends React.Component<Props> {
  _selectionChanged = (language: string) => {
    const {
      realm,
      lang,
      fetchCards,
    } = this.props;
    const languageObj = find(
      LANGUAGES,
      obj => obj.name === language
    );
    if (languageObj && languageObj.code !== lang) {
      fetchCards(realm, languageObj.code);
    }
  };

  render() {
    const {
      componentId,
      lang,
    } = this.props;
    const selectedLang = find(
      LANGUAGES,
      obj => obj.code === lang
    ) || LANGUAGES[0];
    return (
      <DialogPicker
        componentId={componentId}
        options={map(LANGUAGES, obj => obj.name)}
        onSelectionChanged={this._selectionChanged}
        header={t`Change Card Language`}
        description={'Note: not all cards have translations available.'}
        selectedOption={selectedLang.name}
      />
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    lang: state.packs.lang || 'en',
  };
}

function mapDispatchToProps(
  dispatch: Dispatch<Action>
): ReduxActionProps {
  return bindActionCreators({
    fetchCards,
  }, dispatch);
}

export default connectRealm<OwnProps, RealmProps, Card>(
  connect<ReduxProps, ReduxActionProps, OwnProps & RealmProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(LanguageDialog), {
    schemas: ['Card'],
    mapToProps(results: CardResults<Card>, realm: Realm) {
      return {
        realm,
      };
    },
  });
