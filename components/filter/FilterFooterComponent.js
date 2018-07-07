import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { connectRealm } from 'react-native-realm';
import LinearGradient from 'react-native-linear-gradient';

import { applyFilters } from '../../lib/filters';
import space from '../../styles/space';
import typography from '../../styles/typography';

const FOOTER_HEIGHT = 40;

class FilterFooterComponent extends React.Component {
  static propTypes = {
    /* eslint-disable  react/no-unused-prop-types */
    baseQuery: PropTypes.string,
    filters: PropTypes.object.isRequired,
    cards: PropTypes.object.isRequired,
  }

  cardCount() {
    const {
      cards,
      filters,
    } = this.props;
    const query = applyFilters(filters).join(' and ');
    if (query) {
      return cards.filtered(query).length;
    }
    return cards.length;
  }

  render() {
    return (
      <LinearGradient style={styles.footerBar} colors={['#e6e6e6', '#cccccc']}>
        <Text style={[typography.text, space.marginLeftS]}>
          { `${this.cardCount()} Cards Matched` }
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
    borderColor: '#000000',
  },
});
