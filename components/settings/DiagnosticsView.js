import React from 'react';
import PropTypes from 'prop-types';
import {
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { connectRealm } from 'react-native-realm';
import { ImageCacheManager } from 'react-native-cached-image';

import { clearDecks } from '../../actions';
import { fetchCards } from '../cards/actions';
import SettingsItem from './SettingsItem';

const defaultImageCacheManager = ImageCacheManager();

class DiagnosticsView extends React.Component {
  static propTypes = {
    realm: PropTypes.object.isRequired,
    fetchCards: PropTypes.func.isRequired,
    clearDecks: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._doSyncCards = this.doSyncCards.bind(this);
    this._clearImageCache = this.clearImageCache.bind(this);
    this._clearCache = this.clearCache.bind(this);
  }

  clearImageCache() {
    defaultImageCacheManager.clearCache({});
  }

  clearCache() {
    const {
      realm,
      clearDecks,
    } = this.props;
    clearDecks();
    realm.write(() => {
      realm.delete(realm.objects('Card'));
    });
    this.doSyncCards();
  }

  doSyncCards() {
    const {
      realm,
      fetchCards,
    } = this.props;
    fetchCards(realm);
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.list}>
          <SettingsItem onPress={this._clearImageCache} text="Clear image cache" />
          <SettingsItem onPress={this._clearCache} text="Clear cache" />
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    clearDecks,
    fetchCards,
  }, dispatch);
}

export default connectRealm(
  connect(mapStateToProps, mapDispatchToProps)(DiagnosticsView), {
    schemas: ['Card'],
    mapToProps(results, realm) {
      return {
        realm,
      };
    },
  });

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    paddingTop: 16,
  },
  list: {
    padding: 8,
  },
});
