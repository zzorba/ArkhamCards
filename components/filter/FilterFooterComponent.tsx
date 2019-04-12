import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import Realm, { Results } from 'realm';
import DeviceInfo from 'react-native-device-info';
import { connectRealm, CardResults } from 'react-native-realm';
import LinearGradient from 'react-native-linear-gradient';
import { msgid, ngettext, t } from 'ttag';

import { filterToQuery, FilterState } from '../../lib/filters';
import Card from '../../data/Card';
import space from '../../styles/space';
import typography from '../../styles/typography';
const FOOTER_HEIGHT = 40;
const NOTCH_BOTTOM_PADDING = DeviceInfo.hasNotch() ? 20 : 0;

interface OwnProps {
  baseQuery?: string;
  filters: FilterState;
  modal?: boolean;
}

interface RealmProps {
  cards: Results<Card>;
}

type Props = OwnProps & RealmProps;

class FilterFooterComponent extends React.Component<Props> {
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
    const count = this.cardCount();
    return (
      <LinearGradient
        style={modal ? styles.footerBarModal : styles.footerBar}
        colors={['#e6e6e6', '#cccccc']}
      >
        <Text style={[typography.text, space.marginLeftS]}>
          { ngettext(
              msgid`${count} Card Matched`,
              `${count} Cards Matched`,
              count
            ) }
        </Text>
      </LinearGradient>
    );
  }
}

export default connectRealm<OwnProps, RealmProps, Card>(FilterFooterComponent, {
  schemas: ['Card'],
  mapToProps(results: CardResults<Card>, realm: Realm, props: OwnProps): RealmProps {
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
