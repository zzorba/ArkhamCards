import React from 'react';
import PropTypes from 'prop-types';
import { flatMap, map, range } from 'lodash';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import L from '../../app/i18n';
import {
  CORE_FACTION_CODES,
  FACTION_COLORS,
  FACTION_BACKGROUND_COLORS,
  SKILLS,
  SKILL_COLORS,
} from '../../constants';
import typography from '../../styles/typography';
import space from '../../styles/space';
import AppIcon from '../../assets/AppIcon';
import ArkhamIcon from '../../assets/ArkhamIcon';
import EncounterIcon from '../../assets/EncounterIcon';
import CardTextComponent from '../CardTextComponent';
import Button from '../core/Button';
import CardCostIcon from '../core/CardCostIcon';

import PlayerCardImage from './PlayerCardImage';
import FlavorTextComponent from './FlavorTextComponent';

const BLURRED_ACT = require('../../assets/blur-act.jpeg');
const BLURRED_AGENDA = require('../../assets/blur-agenda.jpeg');
const PLAYER_BACK = require('../../assets/player-back.png');
const ENCOUNTER_BACK = require('../../assets/encounter-back.png');
const PER_INVESTIGATOR_ICON = (
  <ArkhamIcon name="per_investigator" size={12} color="#000000" />
);

function num(value) {
  if (value === null) {
    return '-';
  }
  if (value < 0) {
    return 'X';
  }
  return value;
}

export default class TwoSidedCardComponent extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    card: PropTypes.object.isRequired,
    linked: PropTypes.bool,
    notFirst: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.state = {
      showBack: false,
    };

    this._toggleShowBack = this.toggleShowBack.bind(this);
    this._showFaq = this.showFaq.bind(this);
  }

  editSpoilersPressed() {
    this.props.navigator.push({
      screen: 'My.Spoilers',
    });
  }

  onNavigatorEvent(event) {
    const {
      navigator,
    } = this.props;
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'deck') {
        this.showInvestigatorCards();
      } else if (event.id === 'faq') {
        this.showFaq();
      } else if (event.id === 'back') {
        navigator.pop();
      }
    }
  }

  showFaq() {
    const {
      navigator,
      card,
    } = this.props;
    navigator.push({
      screen: 'Card.Faq',
      title: L('FAQ'),
      subtitle: card.name,
      passProps: {
        id: card.code,
      },
    });
  }

  showInvestigatorCards() {
    const {
      navigator,
      card,
    } = this.props;

    navigator.push({
      screen: 'Browse.InvestigatorCards',
      title: L('Allowed Cards'),
      passProps: {
        investigatorCode: card.code,
      },
      backButtonTitle: L('Back'),
    });
  }

  toggleShowBack() {
    this.setState({
      showBack: !this.state.showBack,
    });
  }

  renderMetadata(card) {
    return (
      <View style={styles.metadataBlock}>
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
      <View style={styles.testIconRow}>
        <Text>
          { L('Test Icons: ') }
        </Text>
        { map(skills, (skill, idx) => (
          <ArkhamIcon
            style={styles.testIcon}
            key={idx}
            name={`skill_${skill}`}
            size={16}
            color={SKILL_COLORS[skill]}
          />))
        }
      </View>
    );
  }

  renderSlot(card) {
    if (!card.slot) {
      return null;
    }
    return (
      <View style={styles.slotBlock}>
        <Text>
          { L('Slot: {{slot}}', { slot: card.slot }) }
        </Text>
      </View>
    );
  }


  renderPlaydata(card) {
    if (card.type_code === 'scenario') {
      return null;
    }
    const costString = card.costString(this.props.linked);
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
        { this.renderSlot(card) }
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
          { `${L('Fight')}: ${num(card.enemy_fight)}. ${L('Health')}: ${num(card.health)}` }
          { !!card.health_per_investigator && PER_INVESTIGATOR_ICON }
          { `. ${L('Evade')}: ${num(card.enemy_evade)}. ` }
          { '\n' }
          { `${L('Damage')}: ${num(card.enemy_damage)}. ${L('Horror')}: ${num(card.enemy_horror)}. ` }
        </Text>
      );
    }
    if (card.health > 0 || card.sanity > 0) {
      return (
        <Text>
          { `${L('Health')}: ${num(card.health)}. ${L('Sanity')}: ${num(card.sanity)}.` }
        </Text>
      );
    }
    return null;
  }

  renderFactionIcon(card) {
    const color = (
      card.type_code === 'asset' ||
      card.type_code === 'event' ||
      card.type_code === 'skill' ||
      (card.type_code === 'investigator' && card.encounter_code === null) ||
      card.subtype_code === 'weakness' ||
      card.subtype_code === 'basicweakness'
    ) ? '#FFF' : '#222';

    if (card.spoiler) {
      return (
        <View style={styles.factionIcon}>
          <EncounterIcon
            encounter_code={card.encounter_code || (card.linked_card && card.linked_card.encounter_code)}
            size={28}
            color={color}
          />
        </View>
      );
    }
    if (card.subtype_code &&
      (card.subtype_code === 'weakness' || card.subtype_code === 'basicweakness')
    ) {
      return (
        <View style={styles.factionIcon}>
          <ArkhamIcon name="weakness" size={28} color={color} />
        </View>
      );
    }

    if (card.type_code !== 'scenario' && card.type_code !== 'location' &&
      card.type_code !== 'act' && card.type_code !== 'agenda') {
      return (
        <View style={styles.factionIcon}>
          { (CORE_FACTION_CODES.indexOf(card.faction_code) !== -1) &&
            <ArkhamIcon name={card.faction_code} size={28} color={color} /> }
        </View>
      );
    }
    return null;
  }

  renderTitle(card, name, subname) {
    const factionColor = card.faction_code && FACTION_BACKGROUND_COLORS[card.faction_code];
    return (
      <View style={[styles.cardTitle, {
        backgroundColor: factionColor || '#FFFFFF',
        borderColor: factionColor || '#000000',
      }]}>
        <View style={styles.titleRow}>
          { (card.type_code === 'skill' || card.type_code === 'asset' || card.type_code === 'event') && (
            <View style={styles.costIcon}>
              <CardCostIcon card={card} inverted linked={this.props.linked} />
            </View>
          ) }
          <View style={styles.column}>
            <Text style={[
              typography.text,
              space.marginLeftS,
              { color: factionColor ? '#FFFFFF' : '#000000' },
            ]}>
              { `${name}${card.is_unique ? ' ✷' : ''}` }
            </Text>
            { !!subname && (
              <Text style={[
                typography.small,
                space.marginLeftS,
                { color: factionColor ? '#FFFFFF' : '#000000' },
              ]}>
                { subname }
              </Text>
            ) }
          </View>
        </View>
        { this.renderFactionIcon(card) }
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
          cache: 'force-cache',
        };
      }
      return {
        uri: `https://arkhamdb.com${card.backimagesrc}`,
        cache: 'force-cache',
      };
    }
    return card.deck_limit > 0 ? PLAYER_BACK : ENCOUNTER_BACK;
  }

  renderCardBack(card, backFirst, isHorizontal, flavorFirst, isFirst) {
    const {
      navigator,
    } = this.props;
    if (card.linked_card) {
      return (
        <View>
          <TwoSidedCardComponent
            navigator={navigator}
            id={card.code}
            card={card.linked_card}
            pack_code={card.pack_code}
            linked
            notFirst={!isFirst}
          />
        </View>
      );
    }
    if (!card.double_sided) {
      return null;
    }

    if (!backFirst && card.spoiler && !this.state.showBack && card.type_code !== 'scenario') {
      return (
        <View style={styles.buttonContainer}>
          <Button text={L('Show back')} onPress={this._toggleShowBack} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={[styles.card, {
          backgroundColor: '#FFFFFF',
          borderColor: FACTION_COLORS[card.faction_code] || '#000000',
        }]}>
          { this.renderTitle(card, card.back_name || card.name) }
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
            { isFirst && this.renderCardFooter(card) }
          </View>
        </View>
      </View>
    );
  }

  renderFaqButton() {
    return (
      <View style={styles.buttonContainer}>
        <Button
          text={L('FAQ')}
          onPress={this._showFaq}
          icon={<AppIcon name="faq" size={18} color="white" />}
        />
      </View>
    );
  }

  renderCardFooter(card) {
    return (
      <View style={styles.twoColumn}>
        <View style={[styles.column, styles.flex]}>
          { !!card.illustrator && (
            <Text style={styles.illustratorText}>
              <AppIcon name="paintbrush" size={12} color="#000000" />
              { ` ${card.illustrator}` }
            </Text>
          ) }
          { !!card.pack_name &&
            <View style={styles.setRow}>
              <Text>
                { `${card.pack_name} #${card.position % 1000}.` }
              </Text>
              { !!card.encounter_name &&
                <Text>
                  { `${card.encounter_name} #${card.encounter_position}.${card.quantity > 1 ?
                    `\n${L('{{quantity}} copies.', { quantity: card.quantity })}` :
                    ''
                  }` }
                </Text>
              }
            </View>
          }
        </View>
        <View style={styles.column}>
          { this.renderFaqButton() }
        </View>
      </View>
    );
  }

  renderCardFront(card, backFirst, isHorizontal, flavorFirst, isFirst) {
    const {
      navigator,
    } = this.props;
    if ((card.hidden || backFirst) && (card.hidden || card.spoiler) && !this.state.showBack) {
      return (
        <View style={styles.buttonContainer}>
          <Button
            text={(card.hidden || backFirst) ? L('Show back') : L('Show front')}
            onPress={this._toggleShowBack}
          />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={[
          styles.card,
          { borderColor: FACTION_COLORS[card.faction_code] || '#000000' },
        ]}>
          { this.renderTitle(card, card.name, card.subname) }
          <View style={styles.cardBody}>
            <View style={[styles.typeBlock, {
              backgroundColor: '#FFFFFF',
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
                      <PlayerCardImage card={card} navigator={navigator} />
                    </View>
                  </View>
                ) }
              </View>
              { !!card.text && (
                <View style={[styles.gameTextBlock, {
                  borderColor: FACTION_COLORS[card.faction_code] || '#000000',
                }]}>
                  <CardTextComponent text={card.text} />
                </View>)
              }
              { ('victory' in card && card.victory !== null) &&
                <Text style={styles.typeText}>
                  { L('Victory: {{points}}.', { points: card.victory }) }
                </Text>
              }
              { !!card.flavor && !flavorFirst &&
                <FlavorTextComponent text={card.flavor} />
              }
              { isFirst && this.renderCardFooter(card) }
            </View>
          </View>
        </View>
      </View>
    );
  }

  render() {
    const {
      card,
      linked,
      notFirst,
    } = this.props;

    const isHorizontal = card.type_code === 'act' ||
      card.type_code === 'agenda' ||
      card.type_code === 'investigator';
    const flavorFirst = card.type_code === 'story' ||
      card.type_code === 'act' ||
      card.type_code === 'agenda';
    const backFirst = !linked &&
      (card.double_sided || (card.linked_card && !card.linked_card.hidden)) &&
      !(isHorizontal || !card.spoiler) &&
      card.type_code !== 'scenario';

    const sideA = backFirst && this.renderCardBack(card, backFirst, isHorizontal, flavorFirst, !notFirst);
    const sideB = this.renderCardFront(card, backFirst, isHorizontal, flavorFirst, !notFirst && !sideA);
    const sideC = !backFirst && this.renderCardBack(card, backFirst, isHorizontal, flavorFirst, !notFirst && !sideA && !sideB);
    return (
      <View>
        { sideA }
        { sideB }
        { sideC }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  row: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  flex: {
    flex: 1,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  twoColumn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
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
    paddingRight: 8,
    paddingTop: 4,
    paddingBottom: 4,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gameTextBlock: {
    borderLeftWidth: 4,
    paddingLeft: 8,
    marginBottom: 8,
  },
  statsBlock: {
    marginBottom: 8,
  },
  slotBlock: {
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
  buttonContainer: {
    marginLeft: 8,
    marginTop: 4,
    marginBottom: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  costIcon: {
    marginLeft: 4,
  },
  testIconRow: {
    flexDirection: 'row',
  },
  testIcon: {
    marginLeft: 2,
  },
});
