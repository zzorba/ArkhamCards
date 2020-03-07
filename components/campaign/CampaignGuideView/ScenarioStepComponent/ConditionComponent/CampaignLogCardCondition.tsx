import React from 'react';
import {
  StyleSheet,
  Text,
} from 'react-native';
import { connectRealm, CardResults } from 'react-native-realm';
import { t } from 'ttag';

import Card from '../../../../../data/Card';
import typography from '../../../../../styles/typography';

interface OwnProps {
  section: string;
  code: string;
}

interface RealmProps {
  card?: Card;
}

type Props = OwnProps & RealmProps;
class CampaignLogCardCondition extends React.Component<Props> {
  render() {
    const { section, card, code } = this.props;
    return (
      <Text style={typography.text}>
        { t`If ${card ? card.name : code} is listed under ${section}. `}
      </Text>
    );
  }
}

export default connectRealm<OwnProps, RealmProps, Card>(
  CampaignLogCardCondition,
  {
    schemas: ['Card'],
    mapToProps(
      results: CardResults<Card>,
      realm: Realm,
      props: OwnProps
    ) {
      const { code } = props;
      const cards = results.cards.filtered(`(code == "${code}")`);
      if (cards.length) {
        return {
          card: cards[0],
        };
      }
      return {};
    },
  }
)

const styles = StyleSheet.create({
  iconPile: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  icon: {
    marginLeft: 16,
    marginRight: 16,
    marginBottom: 16,
  },
})
