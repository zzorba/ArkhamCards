import React from 'react';
import { flatMap, map, range } from 'lodash';
import {
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import DeviceInfo from 'react-native-device-info';
import { msgid, ngettext, t } from 'ttag';

import {
  CORE_FACTION_CODES,
  FACTION_COLORS,
  FACTION_BACKGROUND_COLORS,
  SKILL_COLORS,
  RANDOM_BASIC_WEAKNESS,
} from '../../constants';
import typography from '../../styles/typography';
import space, { isBig, xs, s } from '../../styles/space';
import AppIcon from '../../assets/AppIcon';
import ArkhamIcon from '../../assets/ArkhamIcon';
import EncounterIcon from '../../assets/EncounterIcon';
import CardFlavorTextComponent from '../CardFlavorTextComponent';
import { InvestigatorCardsProps } from '../InvestigatorCardsView';
import CardTextComponent from '../CardTextComponent';
import Button from '../core/Button';
import CardCostIcon from '../core/CardCostIcon';
import Card from '../../data/Card';
import { CardFaqProps } from '../CardFaqView';

import PlayerCardImage from './PlayerCardImage';

const BLURRED_ACT = require('../../assets/blur-act.jpeg');
const BLURRED_AGENDA = require('../../assets/blur-agenda.jpeg');
const PLAYER_BACK = require('../../assets/player-back.png');
const ENCOUNTER_BACK = require('../../assets/encounter-back.png');
const PER_INVESTIGATOR_ICON = (
  <ArkhamIcon name="per_investigator" size={12} color="#000000" />
);
const ICON_SIZE = isBig ? 44 : 28;
const SMALL_ICON_SIZE = isBig ? 24 : 14;
const SKILL_ICON_SIZE = isBig ? 24 : 16;

const SKILL_FIELDS = [
  'skill_willpower',
  'skill_intellect',
  'skill_combat',
  'skill_agility',
  'skill_wild'
];

function num(value: number | null) {
  if (value === null) {
    return '-';
  }
  if (value < 0) {
    return 'X';
  }
  return value;
}

interface Props {
  componentId: string;
  card: Card;
  linked?: boolean;
  notFirst?: boolean;
}

interface State {
  showBack: boolean;
}

export default class TwoSidedCardComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      showBack: false,
    };
  }

  editSpoilersPressed() {
    Navigation.push<{}>(this.props.componentId, {
      component: {
        name: 'My.Spoilers',
      },
    });
  }

  _showFaq = () => {
    const {
      componentId,
      card,
    } = this.props;
    Navigation.push<CardFaqProps>(componentId, {
      component: {
        name: 'Card.Faq',
        passProps: {
          id: card.code,
        },
        options: {
          topBar: {
            title: {
              text: t`FAQ`,
            },
            subtitle: {
              text: card.name,
            },
          },
        },
      },
    });
  };

  showInvestigatorCards() {
    const {
      componentId,
      card,
    } = this.props;

    Navigation.push<InvestigatorCardsProps>(componentId, {
      component: {
        name: 'Browse.InvestigatorCards',
        passProps: {
          investigatorCode: card.code,
        },
        options: {
          topBar: {
            title: {
              text: t`Allowed Cards`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }

  _toggleShowBack = () => {
    this.setState({
      showBack: !this.state.showBack,
    });
  };

  renderMetadata(card: Card) {
    return (
      <View style={styles.metadataBlock}>
        { !!(card.subtype_name || card.type_name) && (
          <Text style={[typography.cardText, styles.typeText]}>
            { card.subtype_name ?
              `${card.type_name}. ${card.subtype_name}` :
              card.type_name }
            { (card.type_code === 'agenda' || card.type_code === 'act') ? ` ${card.stage}` : '' }
          </Text>
        ) }
        { !!card.traits && (
          <Text style={[typography.cardText, styles.traitsText]}>
            { card.traits }
          </Text>
        ) }
      </View>
    );
  }

  renderTestIcons(card: Card) {
    if (card.type_code === 'investigator') {
      /* eslint-disable no-irregular-whitespace */
      return (
        <Text style={typography.cardText}>
          { `${card.skill_willpower} ` }<ArkhamIcon name="willpower" size={SMALL_ICON_SIZE} color="#000" />.
          { `  ${card.skill_intellect} ` }<ArkhamIcon name="intellect" size={SMALL_ICON_SIZE} color="#000" />.
          { `  ${card.skill_combat} ` }<ArkhamIcon name="combat" size={SMALL_ICON_SIZE} color="#000" />.
          { `  ${card.skill_agility} ` } <ArkhamIcon name="agility" size={SMALL_ICON_SIZE} color="#000" />.
        </Text>
      );
    }
    const skills = flatMap(SKILL_FIELDS, skill => {
      // @ts-ignore
      const count = card[skill] || 0;
      return range(0, count).map(() => skill);
    });

    if (skills.length === 0) {
      return null;
    }
    return (
      <View style={styles.testIconRow}>
        <Text style={typography.cardText}>
          { t`Test Icons: ` }
        </Text>
        { map(skills, (skill, idx) => (
          <ArkhamIcon
            style={styles.testIcon}
            key={idx}
            name={skill}
            size={SKILL_ICON_SIZE}
            color={SKILL_COLORS[skill]}
          />))
        }
      </View>
    );
  }

  renderSlot(card: Card) {
    if (!card.slot) {
      return null;
    }
    return (
      <View style={styles.slotBlock}>
        <Text style={typography.cardText}>
          { t`Slot: ${card.slot}` }
        </Text>
      </View>
    );
  }


  renderPlaydata(card: Card) {
    if (card.type_code === 'scenario') {
      return null;
    }
    const costString = card.costString(this.props.linked);
    return (
      <View style={styles.statsBlock}>
        { !!(card.xp || costString) && (
          <Text style={typography.cardText}>
            { card.xp ?
              (`${costString}${costString ? '. ' : ''}XP: ${card.xp}.`) :
              costString
            }
          </Text>
        ) }
        { card.type_code === 'agenda' && (
          <Text style={typography.cardText}>
            Doom: { num(card.doom) }
          </Text>
        ) }
        { card.type_code === 'act' && card.clues && card.clues > 0 && (
          <Text style={typography.cardText}>
            Clues: { card.clues }
            { !card.clues_fixed && PER_INVESTIGATOR_ICON }
          </Text>
        ) }
        { this.renderTestIcons(card) }
        { this.renderSlot(card) }
        { this.renderHealthAndSanity(card) }
        { card.type_code === 'location' && (
          <Text style={typography.cardText}>
            Shroud: { num(card.shroud) }. Clues: { num(card.clues) }
            { card.clues && card.clues > 0 && !card.clues_fixed && PER_INVESTIGATOR_ICON }
            .
          </Text>)
        }
      </View>
    );
  }

  renderHealthAndSanity(card: Card) {
    if (card.type_code === 'enemy') {
      return (
        <Text style={typography.cardText}>
          { `${t`Fight`}: ${num(card.enemy_fight)}. ${t`Health`}: ${num(card.health)}` }
          { !!card.health_per_investigator && PER_INVESTIGATOR_ICON }
          { `. ${t`Evade`}: ${num(card.enemy_evade)}. ` }
          { '\n' }
          { `${t`Damage`}: ${num(card.enemy_damage)}. ${t`Horror`}: ${num(card.enemy_horror)}. ` }
        </Text>
      );
    }
    if ((card.health && card.health > 0) || (card.sanity && card.sanity > 0)) {
      return (
        <Text style={typography.cardText}>
          { `${t`Health`}: ${num(card.health)}. ${t`Sanity`}: ${num(card.sanity)}.` }
        </Text>
      );
    }
    return null;
  }

  renderFactionIcon(card: Card) {
    const color = (
      card.type_code === 'asset' ||
      card.type_code === 'event' ||
      card.type_code === 'skill' ||
      card.type_code === 'investigator' ||
      card.subtype_code === 'weakness' ||
      card.subtype_code === 'basicweakness'
    ) ? '#FFF' : '#222';

    if (card.spoiler) {
      const encounter_code = card.encounter_code ||
        (card.linked_card && card.linked_card.encounter_code);
      return (
        <View style={styles.factionIcon}>
          { !!encounter_code && (
            <EncounterIcon
              encounter_code={encounter_code}
              size={ICON_SIZE}
              color={color}
            />
          ) }
        </View>
      );
    }
    if (card.subtype_code &&
      (card.subtype_code === 'weakness' || card.subtype_code === 'basicweakness')
    ) {
      return (
        <View style={styles.factionIcon}>
          <ArkhamIcon name="weakness" size={ICON_SIZE} color={color} />
        </View>
      );
    }

    if (card.type_code !== 'scenario' && card.type_code !== 'location' &&
      card.type_code !== 'act' && card.type_code !== 'agenda') {
      if (card.faction2_code) {
        return (
          <React.Fragment>
            <View style={styles.factionIcon}>
              { !!card.faction_code &&
                (CORE_FACTION_CODES.indexOf(card.faction_code) !== -1) &&
                <ArkhamIcon name={card.faction_code} size={28} color="#FFF" /> }
            </View>
            <View style={styles.factionIcon}>
              { !!card.faction2_code &&
                (CORE_FACTION_CODES.indexOf(card.faction2_code) !== -1) &&
                <ArkhamIcon name={card.faction2_code} size={28} color="#FFF" /> }
            </View>
          </React.Fragment>
        );
      }
      return (
        <View style={styles.factionIcon}>
          { (!!card.faction_code && CORE_FACTION_CODES.indexOf(card.faction_code) !== -1) &&
            <ArkhamIcon name={card.faction_code} size={ICON_SIZE} color={color} /> }
        </View>
      );
    }
    return null;
  }

  renderTitleContent(
    card: Card,
    name: string,
    subname: string | null,
    factionColor?: string
  ) {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }

  renderTitle(
    card: Card,
    name: string,
    subname: string | null,
  ) {
    const factionColor = card.faction2_code ? FACTION_BACKGROUND_COLORS.dual :
      (card.faction_code && FACTION_BACKGROUND_COLORS[card.faction_code]);
    return (
      <View style={[styles.cardTitle, {
        backgroundColor: factionColor || '#FFFFFF',
        borderColor: card.faction2_code ? FACTION_BACKGROUND_COLORS.dual : (factionColor || '#000000'),
      }]}>
        { this.renderTitleContent(card, name, subname, factionColor) }
      </View>
    );
  }

  backSource(card: Card, isHorizontal: boolean) {
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
    return card.deck_limit && card.deck_limit > 0 ? PLAYER_BACK : ENCOUNTER_BACK;
  }

  renderCardBack(
    card: Card,
    backFirst: boolean,
    isHorizontal: boolean,
    flavorFirst: boolean,
    isFirst: boolean
  ) {
    const {
      componentId,
    } = this.props;
    if (card.linked_card) {
      return (
        <View>
          <TwoSidedCardComponent
            componentId={componentId}
            card={card.linked_card}
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
          <Button text={t`Show back`} onPress={this._toggleShowBack} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={[styles.card, {
          backgroundColor: '#FFFFFF',
          borderColor: card.faction2_code ?
            FACTION_BACKGROUND_COLORS.dual :
            ((card.faction_code && FACTION_COLORS[card.faction_code]) || '#000000'),
        }]}>
          { this.renderTitle(card, card.back_name || card.name, null) }
          <View style={styles.cardBody}>
            <View style={styles.typeBlock}>
              <View style={styles.metadataBlock}>
                <Text style={[typography.cardText, styles.typeText]}>
                  { card.type_name }
                  { (card.type_code === 'act' || card.type_code === 'agenda') ?
                    ` ${card.stage}` :
                    '' }
                </Text>
                { !!card.traits && (
                  <Text style={[typography.cardText, styles.traitsText]}>
                    { card.traits }
                  </Text>
                ) }
              </View>
              { !!card.back_flavor && flavorFirst &&
                <CardFlavorTextComponent text={card.back_flavor} />
              }
              { !!card.back_text && (
                <View style={[styles.gameTextBlock, {
                  borderColor: card.faction2_code ?
                    FACTION_BACKGROUND_COLORS.dual :
                    ((card.faction_code && FACTION_COLORS[card.faction_code]) || '#000000'),
                }]}>
                  <CardTextComponent text={card.back_text} />
                </View>)
              }
              { !!card.back_flavor && !flavorFirst &&
                <CardFlavorTextComponent text={card.back_flavor} />
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
          text={t`FAQ`}
          onPress={this._showFaq}
          icon={<AppIcon name="faq" size={18 * DeviceInfo.getFontScale()} color="white" />}
        />
      </View>
    );
  }

  renderCardFooter(card: Card) {
    return (
      <View style={styles.twoColumn}>
        <View style={[styles.column, styles.flex]}>
          { !!card.illustrator && (
            <Text style={[typography.cardText, styles.illustratorText]}>
              <AppIcon name="paintbrush" size={12} color="#000000" />
              { ` ${card.illustrator}` }
            </Text>
          ) }
          { !!card.pack_name &&
            <View style={styles.setRow}>
              <Text style={typography.cardText}>
                { `${card.pack_name} #${card.position % 1000}.` }
              </Text>
              { !!card.encounter_name &&
                <Text style={typography.cardText}>
                  { `${card.encounter_name} #${card.encounter_position}.${card.quantity && card.quantity > 1 ?
                    ngettext(
                      msgid`\n${card.quantity} copy.`,
                      `\n${card.quantity} copies.`,
                      card.quantity
                    ) : ''
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

  renderImage(card: Card) {
    if (card.type_code === 'story' || card.type_code === 'scenario') {
      return null;
    }
    return (
      <View style={styles.column}>
        <View style={styles.playerImage}>
          <PlayerCardImage card={card} componentId={this.props.componentId} />
        </View>
      </View>
    );
  }

  renderCardText(
    card: Card,
    backFirst: boolean,
    isHorizontal: boolean,
    flavorFirst: boolean
  ) {
    return (
      <React.Fragment>
        { !!card.text && (
          <View style={[styles.gameTextBlock, {
            borderColor: card.faction2_code ?
              FACTION_BACKGROUND_COLORS.dual :
              ((card.faction_code && FACTION_COLORS[card.faction_code]) || '#000000'),
          }]}>
            <CardTextComponent text={card.text} />
          </View>)
        }
        { ('victory' in card && card.victory !== null) &&
          <Text style={styles.typeText}>
            { t`Victory: ${card.victory}.` }
          </Text>
        }
        { ('vengeance' in card && card.vengeance !== null) &&
          <Text style={styles.typeText}>
            { t`Vengeance: ${card.vengeance}.` }
          </Text>
        }
        { !!card.flavor && !flavorFirst &&
          <CardFlavorTextComponent text={card.flavor} />
        }
      </React.Fragment>
    );
  }

  renderCardFront(
    card: Card,
    backFirst: boolean,
    isHorizontal: boolean,
    flavorFirst: boolean,
    isFirst: boolean
  ) {
    if ((card.hidden || backFirst) && (card.hidden || card.spoiler) && !this.state.showBack && card.code !== RANDOM_BASIC_WEAKNESS) {
      return (
        <View style={styles.buttonContainer}>
          <Button
            text={(card.hidden || backFirst) ? t`Show back` : t`Show front`}
            onPress={this._toggleShowBack}
          />
        </View>
      );
    }

    const isTablet = Platform.OS === 'ios' && DeviceInfo.isTablet();
    return (
      <View style={styles.container}>
        <View style={[
          styles.card,
          { borderColor: card.faction2_code ?
              FACTION_BACKGROUND_COLORS.dual :
              ((card.faction_code && FACTION_COLORS[card.faction_code]) || '#000000') },
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
                    <CardFlavorTextComponent text={card.flavor} />
                  }
                  { isTablet && this.renderCardText(card, backFirst, isHorizontal, flavorFirst) }
                </View>
                { this.renderImage(card) }
              </View>
              { !isTablet && this.renderCardText(card, backFirst, isHorizontal, flavorFirst) }
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
      (!!card.double_sided || (card.linked_card && !card.linked_card.hidden)) &&
      !(isHorizontal || !card.spoiler) &&
      card.type_code !== 'scenario';

    const sideA = backFirst && this.renderCardBack(card, backFirst, isHorizontal, flavorFirst, !notFirst);
    const sideB = this.renderCardFront(card, !!backFirst, isHorizontal, flavorFirst, !notFirst && !sideA);
    const sideC = !backFirst && this.renderCardBack(card, !!backFirst, isHorizontal, flavorFirst, !notFirst && !sideA && !sideB);
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
    marginBottom: s,
    marginLeft: xs,
  },
  metadataBlock: {
    marginBottom: s,
  },
  container: {
    marginTop: s,
    marginLeft: s,
    marginRight: s,
    marginBottom: s,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 600,
    marginTop: 2,
    borderWidth: 1,
    borderRadius: 4,
  },
  cardBody: {
    paddingTop: xs,
    paddingLeft: s,
    paddingRight: s + 1,
    paddingBottom: xs,
  },
  cardTitle: {
    paddingRight: s,
    paddingTop: xs,
    paddingBottom: xs,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  gameTextBlock: {
    borderLeftWidth: 4,
    paddingLeft: xs,
    marginBottom: s,
    marginRight: s,
  },
  statsBlock: {
    marginBottom: s,
  },
  slotBlock: {
    marginBottom: s,
  },
  setRow: {
    marginBottom: xs,
  },
  typeBlock: {
    marginTop: xs,
  },
  typeText: {
    fontWeight: isBig ? '500' : '700',
  },
  traitsText: {
    fontWeight: isBig ? '500' : '700',
    fontStyle: 'italic',
  },
  illustratorText: {
    marginBottom: xs,
  },
  buttonContainer: {
    marginLeft: s,
    marginTop: xs,
    marginBottom: xs,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  costIcon: {
    marginLeft: xs,
  },
  testIconRow: {
    flexDirection: 'row',
  },
  testIcon: {
    marginLeft: 2,
  },
  factionIcon: {
  },
});
