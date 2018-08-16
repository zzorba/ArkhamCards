import React from 'react';
import PropTypes from 'prop-types';
import { find, head, map } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import DialogPicker from '../core/DialogPicker';
import { fetchCards } from '../cards/actions';

const LANGUAGES = [
  { name: 'English', code: null },
  { name: 'Español', code: 'es' },
  { name: 'Deutsch', code: 'de' },
  { name: 'Italiano', code: 'it' },
  { name: 'Français', code: 'fr' },
];

class LanguageDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    // from redux.
    lang: PropTypes.string,
    fetchCards: PropTypes.func.isRequired,
    // from realm
    realm: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this._selectionChanged = this.selectionChanged.bind(this);
  }

  selectionChanged(language) {
    const {
      realm,
      lang,
      fetchCards,
    } = this.props;
    const code = find(LANGUAGES, obj => obj.name === language).code;
    /* eslint-disable eqeqeq */
    if (code != lang) {
      fetchCards(realm, code);
    }
  }

  render() {
    const {
      navigator,
      lang,
    } = this.props;
    /* eslint-disable eqeqeq */
    const selectedLang = find(LANGUAGES, obj => obj.code == lang) || head(LANGUAGES);
    return (
      <DialogPicker
        navigator={navigator}
        options={map(LANGUAGES, obj => obj.name)}
        onSelectionChanged={this._selectionChanged}
        header="Change Card Language"
        description={'Only the card and game text will be translated'}
        selectedOption={selectedLang.name}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    lang: state.packs.lang,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    fetchCards,
  }, dispatch);
}

export default connectRealm(
  connect(mapStateToProps, mapDispatchToProps)(LanguageDialog), {
    schemas: ['Card'],
    mapToProps(results, realm) {
      return {
        realm,
      };
    },
  });
