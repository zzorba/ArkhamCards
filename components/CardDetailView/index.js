import React from 'react';
import PropTypes from 'prop-types';
import { head, flatMap, map, range } from 'lodash';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connectRealm } from 'react-native-realm';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from 'react-native-elements';

import {
  CORE_FACTION_CODES,
  FACTION_COLORS,
  SKILLS,
  SKILL_COLORS,
} from '../../constants';
import * as Actions from '../../actions';
import PlayerCardImage from '../core/PlayerCardImage';
import AppIcon from '../../assets/AppIcon';
import ArkhamIcon from '../../assets/ArkhamIcon';
import EncounterIcon from '../../assets/EncounterIcon';
import CardTextComponent from '../CardTextComponent';
import FlippableCard from '../core/FlippableCard';
import FaqComponent from './FaqComponent';
import { getShowSpoilers } from '../../reducers';
import FlavorTextComponent from './FlavorTextComponent';
import SignatureCardsComponent from './SignatureCardsComponent';

const BLURRED_ACT = require('../../assets/blur-act.jpeg');
const BLURRED_AGENDA = require('../../assets/blur-agenda.jpeg');
const PLAYER_BACK = require('../../assets/player-back.png');
const ENCOUNTER_BACK = require('../../assets/encounter-back.png');
const PER_INVESTIGATOR_ICON = (
  <ArkhamIcon name="per_investigator" size={12} color="#000000" />
);

class CardDetailView extends React.PureComponent {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    /* eslint-disable react/no-unused-prop-types */
    id: PropTypes.string.isRequired,
    pack_code: PropTypes.string.isRequired,
    card: PropTypes.object,
    showSpoilers: PropTypes.bool,
    linked: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      showSpoilers: props.showSpoilers,
      cardViewDimension: {
        width: 0,
        height: 0,
      },
    };

    if (props.card && !props.linked) {
      props.navigator.setTitle({
        title: `${props.card.is_unique ? '*' : ''}${props.card.name}`,
      });
      if (props.card.subname) {
        props.navigator.setSubTitle({
          subtitle: props.card.subname,
        });
      }
    }

    this._onCardViewLayout = this.onCardViewLayout.bind(this);
    this._toggleShowSpoilers = this.toggleShowSpoilers.bind(this);
    this._showInvestigatorCards = this.showInvestigatorCards.bind(this);
  }

  showInvestigatorCards() {
    const {
      navigator,
      card,
    } = this.props;

    navigator.push({
      screen: 'Browse.InvestigatorCards',
      passProps: {
        investigator: card,
      },
      backButtonTitle: 'Back',
    });
  }

  toggleShowSpoilers() {
    this.setState({
      showSpoilers: !this.state.showSpoilers,
    });
  }

  onCardViewLayout(event) {
    const {
      width,
      height,
    } = event.nativeEvent.layout;

    const {
      cardViewDimension,
    } = this.state;

    if (!cardViewDimension || cardViewDimension.width !== width) {
      this.setState({
        cardViewDimension: {
          width,
          height,
        },
      });
    }
  }

  shouldBlur() {
    if (this.props.showSpoilers || this.state.showSpoilers) {
      return false;
    }
    return this.props.card.spoiler;
  }

  renderMetadata(card) {
    return (
      <View style={styles.metadataBlock}>
        { card.type_code !== 'scenario' && card.type_code !== 'location' &&
          card.type_code !== 'act' && card.type_code !== 'agenda' && (
          <Text>
            { (CORE_FACTION_CODES.indexOf(card.faction_code) !== -1) &&
              <ArkhamIcon name={card.faction_code} size={18} color="#000000" /> }
            { card.faction_name }
          </Text>
        ) }
        { !!(card.subtype_name || card.type_name) && (
          <Text style={styles.typeText}>
            { card.subtype_name ?
              `${card.type_name}. ${card.subtype_name}` :
              card.type_name }
            { (card.type_code === 'agenda' || card.type_code === 'act') ? ` ${card.stage}` : '' }
          </Text>
        ) }
        { !!card.traits && <Text style={styles.traitsText}>{ card.traits }</Text> }
      </View>
    );
  }

  renderTestIcons(card) {
    if (card.type_code === 'investigator') {
      return (
        <Text>
          <ArkhamIcon name="willpower" size={14} color="#000" />{ `${card.skill_willpower}  ` }
          <ArkhamIcon name="intellect" size={14} color="#000" />{ `${card.skill_intellect}  ` }
          <ArkhamIcon name="combat" size={14} color="#000" />{ `${card.skill_combat}  ` }
          <ArkhamIcon name="agility" size={14} color="#000" />{ `${card.skill_agility}  ` }
        </Text>
      );
    }
    const skills = flatMap(SKILLS, skill => {
      const count = card[`skill_${skill}`] || 0;
      return range(0, count).map(() => skill);
    });

    if (skills.length === 0) {
      return null;
    }
    return (
      <Text>
        { 'Test Icons:' }
        { map(skills, (skill, idx) => (
          <ArkhamIcon
            key={idx}
            name={skill}
            size={16}
            color={SKILL_COLORS[skill]}
          />))
        }
      </Text>
    );
  }

  renderPlaydata(card) {
    if (card.type_code === 'scenario') {
      return null;
    }
    const costString = (
      (card.type_code === 'asset' || card.type_code === 'event') &&
      `Cost: ${card.cost !== null ? card.cost : '-'}`
    ) || '';

    return (
      <View style={styles.statsBlock}>
        { !!(card.xp || costString) && (
          <Text>
            { card.xp ?
              (`${costString}${costString ? '. ' : ''}XP: ${card.xp}.`) :
              costString
            }
          </Text>
        ) }
        { card.type_code === 'agenda' && <Text>Doom: { card.doom }</Text> }
        { card.type_code === 'act' && card.clues > 0 && (
          <Text>
            Clues: { card.clues }
            { !card.clues_fixed && PER_INVESTIGATOR_ICON }
          </Text>
        ) }
        { this.renderTestIcons(card) }
        { this.renderHealthAndSanity(card) }
        { card.type_code === 'location' && (
          <Text>
            Shroud: { card.shroud }. Clues: { card.clues }
            { card.clues > 0 && !card.clues_fixed && PER_INVESTIGATOR_ICON }
            .
          </Text>)
        }
      </View>
    );
  }

  renderHealthAndSanity(card) {
    if (card.type_code === 'enemy') {
      return (
        <Text>
          { `Fight: ${card.enemy_fight || '-'}. Health: ${card.health || '-'}` }
          { !!card.health_per_investigator && PER_INVESTIGATOR_ICON }
          { `. Evade: ${card.enemy_evade || '-'}. ` }
          { '\n' }
          { `Damage: ${card.enemy_damage || '-'}. Horror: ${card.enemy_horror}. ` }
        </Text>
      );
    }
    if (card.health > 0 || card.sanity > 0) {
      return (
        <Text>
          { `Health: ${card.health || '-'}. Sanity: ${card.sanity || '-'}.` }
        </Text>
      );
    }
    return null;
  }

  renderTitle(card, blur, name, subname) {
    const factionColor = card.faction_code && FACTION_COLORS[card.faction_code];
    return (
      <View style={[styles.cardTitle, {
        backgroundColor: blur ? '#000000' : (factionColor || '#FFFFFF'),
        borderColor: factionColor || '#000000',
      }]}>
        <Text style={[styles.cardTitleText, {
          color: factionColor ? '#FFFFFF' : '#000000',
        }]}>
          { `${card.is_unique ? '* ' : ''}${name}` }
        </Text>
        { !!subname && (
          <Text style={[styles.cardTitleSubtitle, {
            color: factionColor ? '#FFFFFF' : '#000000',
          }]}>
            { subname }
          </Text>
        ) }
      </View>
    );
  }

  backSource(card, isHorizontal) {
    if (card.double_sided) {
      if (isHorizontal) {
        if (card.type_code === 'act') {
          return BLURRED_ACT;
        }
        if (card.type_code === 'agenda') {
          return BLURRED_AGENDA;
        }
        return {
          uri: `https://arkhamdb.com${card.imagesrc}`,
        };
      }
      return {
        uri: `https://arkhamdb.com${card.backimagesrc}`,
      };
    }
    return card.deck_limit > 0 ? PLAYER_BACK : ENCOUNTER_BACK;
  }

  renderCardImage(card, blur, isHorizontal) {
    if (!card.imagesrc) {
      return null;
    }
    if (!card.spoiler) {
      return (
        <View
          style={isHorizontal ? styles.horizontalCard : styles.verticalCard}
          onLayout={this._onCardViewLayout}
        >
          <Image
            style={isHorizontal ? styles.horizontalCardImage : styles.verticalCardImage}
            source={{
              uri: `https://arkhamdb.com${card.imagesrc}`,
            }}
          />
        </View>
      );
    }
    const frontImg = `https://arkhamdb.com${card.imagesrc}`;
    Image.prefetch(frontImg);
    return (
      <View
        style={isHorizontal ? styles.horizontalCard : styles.verticalCard}
        onLayout={this._onCardViewLayout}
      >
        { this.props.showSpoilers ?
          <Image
            style={isHorizontal ? styles.horizontalCardImage : styles.verticalCardImage}
            source={{ uri: frontImg }}
          />
          :
          <FlippableCard
            style={{
              width: this.state.cardViewDimension.width,
              height: 250,
              borderWidth: 0,
            }}
            flipped={!blur}
            backSide={
              <Image
                style={isHorizontal ? styles.horizontalCardImage : styles.verticalCardImage}
                source={this.backSource(card, isHorizontal)}
              />
            }
            frontSide={
              <Image
                style={isHorizontal ? styles.horizontalCardImage : styles.verticalCardImage}
                source={{ uri: frontImg }}
              />
            }
            onFlip={this._toggleShowSpoilers}
          />
        }
      </View>
    );
  }

  renderCardBack(card, blur, isHorizontal, flavorFirst) {
    if (!card.double_sided) {
      return null;
    }
    const image = !blur && card.backimagesrc && (
      <View style={isHorizontal ? styles.horizontalCard : styles.verticalCard}>
        <Image
          style={isHorizontal ? styles.horizontalCardImage : styles.verticalCardImage}
          source={{
            uri: `https://arkhamdb.com${card.backimagesrc}`,
          }}
        />
      </View>
    );

    return (
      <View style={styles.container}>
        <View style={[styles.card, {
          backgroundColor: blur ? '#000000' : '#FFFFFF',
          borderColor: FACTION_COLORS[card.faction_code] || '#000000',
        }]}>
          { this.renderTitle(card, blur, card.back_name || card.name) }
          <View style={styles.cardBody}>
            <View style={styles.typeBlock}>
              <View style={styles.metadataBlock}>
                <Text style={styles.typeText}>
                  { card.type_name }
                  { (card.type_code === 'act' || card.type_code === 'agenda') ? ` ${card.stage}` : '' }
                </Text>
                { !!card.traits && <Text style={styles.traitsText}>{ card.traits }</Text> }
              </View>
              { !!card.back_flavor && flavorFirst &&
                <FlavorTextComponent text={card.back_flavor} />
              }
              { !!card.back_text && (
                <View style={[styles.gameTextBlock, {
                  borderColor: FACTION_COLORS[card.faction_code] || '#000000',
                }]}>
                  <CardTextComponent text={card.back_text} />
                </View>)
              }
              { !!card.back_flavor && !flavorFirst &&
                <FlavorTextComponent text={card.back_flavor} />
              }
            </View>
          </View>
        </View>
      </View>
    );
  }

  renderInvestigatorCardsLink() {
    const {
      navigator,
      card,
    } = this.props;
    if (card.type_code !== 'investigator') {
      return null;
    }
    return (
      <View>
        <SignatureCardsComponent navigator={navigator} investigator={card} />
        <Button
          onPress={this._showInvestigatorCards}
          text="Browse Eligible Cards"
        />
      </View>
    );
  }

  render() {
    const {
      navigator,
      card,
      pack_code,
      showSpoilers,
      linked,
    } = this.props;

    const blur = this.shouldBlur();
    const isHorizontal = card.type_code === 'act' ||
      card.type_code === 'agenda' ||
      card.type_code === 'investigator';
    const flavorFirst = card.type_code === 'story' ||
      card.type_code === 'act' ||
      card.type_code === 'agenda';
    const backFirst = !(isHorizontal || !card.spoiler) && card.type_code !== 'scenario';
    return (
      <ScrollView style={{ flexDirection: 'column', flexWrap: 'wrap' }}>
        { backFirst && this.renderCardBack(card, blur, isHorizontal, flavorFirst) }
        <View style={styles.container}>
          <View style={[
            styles.card,
            { borderColor: FACTION_COLORS[card.faction_code] || '#000000' },
          ]}>
            { this.renderTitle(card, blur, card.name, card.subname) }
            <View style={styles.cardBody}>
              <View style={[styles.typeBlock, {
                backgroundColor: blur ? '#000000' : '#FFFFFF',
              }]}>
                <View style={styles.row}>
                  <View style={styles.mainColumn}>
                    { this.renderMetadata(card) }
                    { this.renderPlaydata(card) }
                    { !!(card.flavor && flavorFirst) &&
                      <FlavorTextComponent text={card.flavor} />
                    }
                  </View>
                  { card.type_code !== 'story' && card.type_code !== 'scenario' && (
                    <View style={styles.column}>
                      <View style={styles.playerImage}>
                        <PlayerCardImage card={card} />
                      </View>
                    </View>
                  ) }
                </View>
                { !!card.real_text && (
                  <View style={[styles.gameTextBlock, {
                    borderColor: FACTION_COLORS[card.faction_code] || '#000000',
                  }]}>
                    <CardTextComponent text={card.real_text} />
                  </View>)
                }
                { ('victory' in card && card.victory !== null) &&
                  <Text style={styles.typeText}>
                    { `Victory: ${card.victory}.` }
                  </Text>
                }
                { !!card.flavor && !flavorFirst &&
                  <FlavorTextComponent text={card.flavor} />
                }
                { !!card.illustrator && (
                  <Text style={styles.illustratorText}>
                    <AppIcon name="palette" size={16} color="#000000" />
                    { card.illustrator }
                  </Text>
                ) }
                { !!card.pack_name &&
                  <View style={styles.setRow}>
                    <Text>
                      { `${card.pack_name} #${card.position % 1000}.` }
                    </Text>
                    { !!card.encounter_name &&
                      <Text>
                        <EncounterIcon
                          encounter_code={card.encounter_code}
                          size={12}
                          color="#000000"
                        />
                        { `${card.encounter_name} #${card.encounter_position}${card.quantity > 1 ? ` (${card.quantity} copies)` : ''}.` }
                      </Text>
                    }
                  </View>
                }
              </View>
            </View>
          </View>
        </View>
        { !backFirst && this.renderCardBack(card, blur, isHorizontal, flavorFirst) }
        { !!card.linked_card && (
          <CardDetailView
            navigator={navigator}
            id={card.code}
            card={card.linked_card}
            pack_code={pack_code}
            showSpoilers={showSpoilers}
            linked
          />
        ) }
        { this.renderInvestigatorCardsLink() }
        { !linked && <FaqComponent navigator={navigator} id={card.code} /> }
        <View style={styles.footerPadding} />
      </ScrollView>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    showSpoilers: props.showSpoilers || getShowSpoilers(state, props.pack_code),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connectRealm(
  connect(mapStateToProps, mapDispatchToProps)(CardDetailView), {
    schemas: ['Card'],
    mapToProps(results, realm, props) {
      return {
        realm,
        card: head(results.cards.filtered(`code == '${props.id}'`)),
      };
    },
  });

const styles = StyleSheet.create({
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  mainColumn: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
  },
  playerImage: {
    marginTop: 2,
  },
  metadataBlock: {
    marginBottom: 8,
  },
  container: {
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  card: {
    width: '100%',
    marginTop: 2,
    borderWidth: 1,
    borderRadius: 4,
  },
  cardBody: {
    paddingTop: 4,
    paddingLeft: 8,
    paddingRight: 9,
    paddingBottom: 4,
  },
  cardTitle: {
    paddingTop: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
  },
  cardTitleText: {
    marginLeft: 4,
    fontSize: 18,
  },
  cardTitleSubtitle: {
    marginLeft: 15,
    fontSize: 11,
  },
  gameTextBlock: {
    borderLeftWidth: 4,
    paddingLeft: 8,
    marginBottom: 8,
  },
  statsBlock: {
    marginBottom: 8,
  },
  setRow: {
    marginBottom: 4,
  },
  typeBlock: {
    marginTop: 4,
  },
  typeText: {
    fontWeight: '700',
  },
  traitsText: {
    fontWeight: '700',
    fontStyle: 'italic',
  },
  illustratorText: {
    fontSize: 14,
    marginBottom: 4,
  },
  horizontalCard: {
    width: '100%',
    height: 200,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  verticalCard: {
    width: '100%',
    height: 280,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  verticalCardImage: {
    height: 280,
    width: '100%',
    resizeMode: 'contain',
    justifyContent: 'flex-start',
  },
  horizontalCardImage: {
    height: 200,
    width: '100%',
    resizeMode: 'contain',
    justifyContent: 'flex-start',
  },
  footerPadding: {
    height: 150,
  },
});
