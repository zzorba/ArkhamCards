import React from 'react';
import PropTypes from 'prop-types';
import { find, head, map } from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';

import L from '../../app/i18n';
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
    componentId: PropTypes.string.isRequired,
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
      componentId,
      lang,
    } = this.props;
    /* eslint-disable eqeqeq */
    const selectedLang = find(LANGUAGES, obj => obj.code == lang) || head(LANGUAGES);
    return (
      <DialogPicker
        componentId={componentId}
        options={map(LANGUAGES, obj => obj.name)}
        onSelectionChanged={this._selectionChanged}
        header={L('Change Card Language')}
        description={'Note: not all cards have translations available.'}
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
