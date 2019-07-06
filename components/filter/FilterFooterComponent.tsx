import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { connect } from 'react-redux';
import Realm, { Results } from 'realm';
import DeviceInfo from 'react-native-device-info';
import { connectRealm, CardResults } from 'react-native-realm';
import LinearGradient from 'react-native-linear-gradient';
import { msgid, ngettext } from 'ttag';

import { filterToQuery, FilterState } from '../../lib/filters';
import Card from '../../data/Card';
import { getTabooSet, AppState } from '../../reducers';
import space from '../../styles/space';
import typography from '../../styles/typography';
import { COLORS } from '../../styles/colors';

const FOOTER_HEIGHT = 40;
const NOTCH_BOTTOM_PADDING = DeviceInfo.hasNotch() ? 20 : 0;

interface OwnProps {
  componentId: string;
  baseQuery?: string;
  filters: FilterState;
  modal?: boolean;
}

interface RealmProps {
  cards: Results<Card>;
}

interface ReduxProps {
  tabooSetId?: number;
}

type Props = OwnProps & RealmProps & ReduxProps;

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

function mapStateToProps(state: AppState): ReduxProps {
  return {
    tabooSetId: getTabooSet(state),
  };
}

export default connect<ReduxProps, {}, OwnProps, AppState>(
  mapStateToProps
)(connectRealm<OwnProps & ReduxProps, RealmProps, Card>(FilterFooterComponent, {
  schemas: ['Card'],
  mapToProps(
    results: CardResults<Card>,
    realm: Realm,
    props: OwnProps & ReduxProps
  ): RealmProps {
    return {
      cards: props.baseQuery ?
        results.cards.filtered(`(${props.baseQuery}) and ${Card.tabooSetQuery(props.tabooSetId)}`) :
        results.cards.filtered(Card.tabooSetQuery(props.tabooSetId)),
    };
  },
})
);

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
