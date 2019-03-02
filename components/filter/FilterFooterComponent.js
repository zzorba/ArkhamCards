import React from 'react';
import PropTypes from 'prop-types';
import {
  DeviceInfo,
  StyleSheet,
  Text,
} from 'react-native';
import { connectRealm } from 'react-native-realm';
import LinearGradient from 'react-native-linear-gradient';

import L from '../../app/i18n';
import { filterToQuery } from '../../lib/filters';
import space from '../../styles/space';
import typography from '../../styles/typography';
const FOOTER_HEIGHT = 40;
const NOTCH_BOTTOM_PADDING = DeviceInfo.isIPhoneX_deprecated ? 20 : 0;

class FilterFooterComponent extends React.Component {
  static propTypes = {
    /* eslint-disable  react/no-unused-prop-types */
    baseQuery: PropTypes.string,
    filters: PropTypes.object.isRequired,
    cards: PropTypes.object.isRequired,
    modal: PropTypes.bool,
  }

  cardCount() {
    const {
      cards,
      filters,
    } = this.props;
    const query = filterToQuery(filters).join(' and ');
    if (query) {
      return cards.filtered(query).length;
    }
    return cards.length;
  }

  render() {
    const {
      modal,
    } = this.props;
    return (
      <LinearGradient
        style={modal ? styles.footerBarModal : styles.footerBar}
        colors={['#e6e6e6', '#cccccc']}
      >
        <Text style={[typography.text, space.marginLeftS]}>
          { L('{{count}} Cards Matched', { count: this.cardCount() }) }
        </Text>
      </LinearGradient>
    );
  }
}

export default connectRealm(FilterFooterComponent, {
  schemas: ['Card'],
  mapToProps(results, realm, props) {
    return {
      cards: props.baseQuery ? results.cards.filtered(props.baseQuery) : results.cards,
    };
  },
});

const styles = StyleSheet.create({
  footerBar: {
    height: FOOTER_HEIGHT,
    flexDirection: 'column',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderColor: '#bdbdbd',
  },
  footerBarModal: {
    paddingTop: 4,
    height: FOOTER_HEIGHT + NOTCH_BOTTOM_PADDING,
    paddingBottom: NOTCH_BOTTOM_PADDING,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    borderTopWidth: 1,
    borderColor: '#bdbdbd',
  },
});
