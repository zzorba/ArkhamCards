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
import { t, jt } from 'ttag';

import {
  RANDOM_BASIC_WEAKNESS,
} from '@app_constants';
import InvestigatorStatLine from '@components/core/InvestigatorStatLine';
import HealthSanityLine from '@components/core/HealthSanityLine';
import { isBig, xs, s } from '@styles/space';
import AppIcon from '@icons/AppIcon';
import ArkhamIcon from '@icons/ArkhamIcon';
import CardTabooTextBlock from '@components/card/CardTabooTextBlock';
import CardFlavorTextComponent from '@components/card/CardFlavorTextComponent';
import CardTextComponent from '@components/card/CardTextComponent';
import { CardFaqProps } from '@components/card/CardFaqView';
import { CardTabooProps } from '@components/card/CardTabooView';
import { InvestigatorCardsProps } from '@components/cardlist/InvestigatorCardsView';
import Button from '@components/core/Button';
import BasicButton from '@components/core/BasicButton';
import Card from '@data/Card';

import PlayerCardImage from '../PlayerCardImage';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import CardDetailHeader from './CardDetailHeader';
import CardFooterInfo from './CardFooterInfo';
import CardFooterButton from './CardFooterButton';

const BLURRED_ACT = require('../../../../../assets/blur-act.jpeg');
const BLURRED_AGENDA = require('../../../../../assets/blur-agenda.jpeg');
const PLAYER_BACK = require('../../../../../assets/player-back.png');
const ENCOUNTER_BACK = require('../../../../../assets/encounter-back.png');
const SKILL_ICON_SIZE = isBig ? 26 : 16;
const MAX_WIDTH = 768;

const SKILL_FIELDS = [
  'skill_willpower',
  'skill_intellect',
  'skill_combat',
  'skill_agility',
  'skill_wild',
];

function num(value: number | null | undefined) {
  if (value === null || value === undefined) {
    return '-';
  }
  if (value < 0) {
    return 'X';
  }
  return value;
}

interface Props {
  componentId?: string;
  card: Card;
  linked?: boolean;
  notFirst?: boolean;
  simple?: boolean;
  width: number;
}

interface State {
  showBack: boolean;
}

export default class TwoSidedCardComponent extends React.Component<Props, State> {
  static contextType = StyleContext;
  context!: StyleContextType;

  constructor(props: Props) {
    super(props);

    this.state = {
      showBack: false,
    };
  }

  editSpoilersPressed() {
    const { componentId } = this.props;
    if (componentId) {
      Navigation.push(componentId, {
        component: {
          name: 'My.Spoilers',
        },
      });
    }
  }

  _showTaboo = () => {
    const {
      componentId,
      card,
    } = this.props;
    if (componentId) {
      Navigation.push<CardTabooProps>(componentId, {
        component: {
          name: 'Card.Taboo',
          passProps: {
            id: card.code,
          },
          options: {
            topBar: {
              title: {
                text: card.name,
              },
              subtitle: {
                text: `Taboos`,
              },
            },
          },
        },
      });
    }
  };

  _showFaq = () => {
    const {
      componentId,
      card,
    } = this.props;
    if (componentId) {
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
    }
  };

  showInvestigatorCards() {
    const {
      componentId,
      card,
    } = this.props;
    if (componentId) {
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
  }

  _toggleShowBack = () => {
    this.setState({
      showBack: !this.state.showBack,
    });
  };

  renderType(card: Card) {
    const { typography } = this.context;
    if (card.type_code === 'investigator') {
      return null;
    }
    if (!card.subtype_name && !card.type_name) {
      return null;
    }
    return (
      <Text style={[typography.cardText, styles.typeText]}>
        { card.subtype_name ?
          `${card.type_name}. ${card.subtype_name}` :
          card.type_name }
        { (card.type_code === 'agenda' || card.type_code === 'act') ? ` ${card.stage}` : '' }
      </Text>
    );
  }

  renderMetadata(card: Card) {
    const { typography } = this.context;
    return (
      <View style={styles.metadataBlock}>
        { this.renderType(card) }
        { !!card.traits && (
          <Text style={[typography.cardText, styles.traitsText]}>
            { card.traits }
          </Text>
        ) }
        { card.type_code === 'investigator' && (
          <>
            <View style={styles.statLineRow}>
              <InvestigatorStatLine
                investigator={card}
              />
            </View>
            <HealthSanityLine
              investigator={card}
            />
          </>
        ) }
      </View>
    );
  }

  renderTestIcons(card: Card) {
    const { colors, fontScale, typography } = this.context;
    if (card.type_code === 'investigator') {
      return null;
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
            name={skill.substring(6)}
            size={SKILL_ICON_SIZE * fontScale}
            color={colors.darkText}
          />))
        }
      </View>
    );
  }

  renderSlot(card: Card) {
    const { typography } =this.context;
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
    const { colors, typography } = this.context;
    if (card.type_code === 'scenario') {
      return null;
    }
    const doom = num(card.doom);
    const shroud = num(card.shroud);
    const clues = num(card.clues);
    const perInvestigatorClues = (card.clues && card.clues > 0 && !card.clues_fixed) ?
      <ArkhamIcon name="per_investigator" size={12} color={colors.darkText} /> :
      '';
    return (
      <View style={styles.statsBlock}>
        { card.type_code === 'agenda' && (
          <Text style={typography.cardText}>
            { t`Doom: ${doom}` }
          </Text>
        ) }
        { !!(card.type_code === 'act' && card.clues && card.clues > 0) && (
          <Text style={typography.cardText}>
            { jt`Clues: ${clues}${perInvestigatorClues}` }
          </Text>
        ) }
        { this.renderTestIcons(card) }
        { this.renderSlot(card) }
        { this.renderHealthAndSanity(card) }
        { card.type_code === 'location' && (
          <Text style={typography.cardText}>
            { jt`Shroud: ${shroud}. Clues: ${clues}${perInvestigatorClues}.` }
          </Text>)
        }
      </View>
    );
  }

  renderHealthAndSanity(card: Card) {
    const { colors, typography } = this.context;
    if (card.type_code === 'enemy') {
      return (
        <Text style={typography.cardText}>
          { `${t`Fight`}: ${num(card.enemy_fight)}. ${t`Health`}: ${num(card.health)}` }
          { !!card.health_per_investigator && <ArkhamIcon name="per_investigator" size={12} color={colors.darkText} /> }
          { `. ${t`Evade`}: ${num(card.enemy_evade)}. ` }
          { '\n' }
          { `${t`Damage`}: ${num(card.enemy_damage)}. ${t`Horror`}: ${num(card.enemy_horror)}. ` }
        </Text>
      );
    }
    return null;
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
    isFirst: boolean,
    key: string
  ) {
    const {
      componentId,
      simple,
      width,
    } = this.props;
    const { colors, backgroundStyle, typography } = this.context;
    if (card.linked_card) {
      return (
        <View key={key}>
          <TwoSidedCardComponent
            componentId={componentId}
            card={card.linked_card}
            linked
            notFirst={!isFirst}
            width={width}
            simple={simple}
            key="linked"
          />
        </View>
      );
    }
    if (!card.double_sided) {
      return null;
    }

    if (!backFirst && card.spoiler && !this.state.showBack && card.type_code !== 'scenario') {
      return (
        <View style={[styles.container, styles.buttonContainerPadding, { width }]} key={key}>
          <BasicButton title={t`Show back`} onPress={this._toggleShowBack} />
        </View>
      );
    }
    const noHeader = (card.name === card.back_name || !card.back_name);
    return (
      <View style={[styles.container, styles.containerPadding, { width }]} key={key}>
        <View style={[styles.card, backgroundStyle, {
          borderColor: colors.faction[
            card.faction2_code ? 'dual' : card.factionCode()
          ].background,
          borderTopWidth: noHeader ? 1 : 0,
        }]}>
          { noHeader && <CardDetailHeader card={card} back width={Math.min(768, width)} linked={!!this.props.linked} /> }
          <View removeClippedSubviews style={[
            styles.cardBody,
            {
              backgroundColor: noHeader ? 'transparent' : colors.background,
            },
          ]}>
            <View style={styles.typeBlock}>
              { card.type_code !== 'investigator' && (
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
              ) }
              { !!card.back_flavor && flavorFirst &&
                <CardFlavorTextComponent text={card.back_flavor} />
              }
              { !!card.back_text && (
                <View style={[styles.gameTextBlock, {
                  borderColor: colors.M,
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
          { isFirst && <CardFooterButton icon="faq" title={t`FAQ`} onPress={this._showFaq} /> }
        </View>
      </View>
    );
  }

  renderTabooButton() {
    const { fontScale } = this.context;
    return (
      <Button
        grow
        color="purple"
        text={t`Taboo`}
        onPress={this._showTaboo}
        icon={<ArkhamIcon name="tablet" size={20 * fontScale} color="white" />}
      />
    );
  }

  renderFaqButton() {
    const { fontScale } = this.context;
    return (
      <Button
        grow
        text={t`FAQ`}
        onPress={this._showFaq}
        icon={<AppIcon name="faq" size={24 * fontScale} color="white" />}
      />
    );
  }

  renderCardFooter(card: Card) {
    /*
            { !!componentId && (
          <View style={styles.twoColumn}>
            <View style={[styles.halfColumn, { paddingRight: s }]}>
              { this.renderFaqButton() }
            </View>
            <View style={[styles.halfColumn, { paddingLeft: s }]}>
              { (card.taboo_set_id === 0 || card.taboo_placeholder) && (
                this.renderTabooButton()
              ) }
            </View>
          </View>
        ) }
  */
    return (
      <>
        <View style={[styles.column, styles.flex]}>
          <CardFooterInfo card={card} />
        </View>
      </>
    );
  }

  renderImage(card: Card) {
    if (card.type_code === 'story' || card.type_code === 'scenario') {
      return null;
    }
    return (
      <View style={styles.column}>
        <View style={styles.playerImage}>
          <PlayerCardImage
            card={card}
            componentId={this.props.componentId}
          />
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
    const { simple } = this.props;
    const { colors, typography } = this.context;
    return (
      <>
        { !!card.text && (
          <View style={[styles.gameTextBlock, {
            borderColor: colors.M,
          }]}>
            <CardTextComponent text={card.text} />
          </View>)
        }
        { ('victory' in card && card.victory !== null) &&
          <Text style={[typography.cardText, styles.typeText]}>
            { t`Victory: ${card.victory}.` }
          </Text>
        }
        { ('vengeance' in card && card.vengeance !== null) &&
          <Text style={[typography.cardText, styles.typeText]}>
            { t`Vengeance: ${card.vengeance}.` }
          </Text>
        }
        { !simple && !!card.flavor && !flavorFirst &&
          <CardFlavorTextComponent text={card.flavor} />
        }
        <CardTabooTextBlock card={card} />
      </>
    );
  }

  renderCardFront(
    card: Card,
    backFirst: boolean,
    isHorizontal: boolean,
    flavorFirst: boolean,
    isFirst: boolean,
    key: string
  ) {
    const {
      simple,
      width,
    } = this.props;
    const { colors, backgroundStyle } = this.context;
    if ((card.hidden || backFirst) &&
      ((card.hidden && card.type_code !== 'investigator') || card.spoiler) &&
      !this.state.showBack &&
      card.code !== RANDOM_BASIC_WEAKNESS
    ) {
      return (
        <View style={[styles.container, styles.buttonContainerPadding, { width }]} key={key}>
          <BasicButton title={(card.hidden || backFirst) ? t`Show back` : t`Show front`} onPress={this._toggleShowBack} />
        </View>
      );
    }

    const isTablet = Platform.OS === 'ios' && DeviceInfo.isTablet();
    return (
      <View style={[styles.container, styles.containerPadding]} key={key}>
        <View style={[
          styles.card,
          {
            borderColor: colors.faction[
              card.faction2_code ? 'dual' : card.factionCode()
            ].background,
          },
        ]}>
          <CardDetailHeader card={card} width={Math.min(768, width)} linked={!!this.props.linked} />
          <View style={[
            styles.cardBody,
            backgroundStyle,
          ]}>
            <View style={[styles.typeBlock, backgroundStyle]}>
              <View style={styles.row}>
                <View style={styles.mainColumn}>
                  { this.renderMetadata(card) }
                  { this.renderPlaydata(card) }
                  { !!card.flavor && (simple || flavorFirst) &&
                    <CardFlavorTextComponent text={card.flavor} />
                  }
                  { isTablet && this.renderCardText(card, backFirst, isHorizontal, flavorFirst) }
                </View>
                { this.renderImage(card) }
              </View>
              { !isTablet && this.renderCardText(card, backFirst, isHorizontal, flavorFirst) }
              { (card.type_code !== 'enemy' && card.type_code !== 'investigator' && (
                (card.health && card.health > 0) || (card.sanity && card.sanity > 0))
              ) && (
                <HealthSanityLine investigator={card} />
              ) }
              { isFirst && !simple && this.renderCardFooter(card) }
            </View>
          </View>
          { isFirst && !simple && <CardFooterButton icon="faq" title={t`FAQ`} onPress={this._showFaq} /> }
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

    const sideA = backFirst && this.renderCardBack(card, backFirst, isHorizontal, flavorFirst, !notFirst, 'sideA');
    const sideB = this.renderCardFront(card, !!backFirst, isHorizontal, flavorFirst, !notFirst && !sideA, 'sideB');
    const sideC = !backFirst && this.renderCardBack(card, !!backFirst, isHorizontal, flavorFirst, !notFirst && !sideA && !sideB, 'sideC');
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
  containerPadding: {
    paddingTop: s,
    paddingLeft: s,
    paddingRight: s,
    paddingBottom: s,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  card: {
    position: 'relative',
    width: '100%',
    maxWidth: MAX_WIDTH,
    marginTop: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderTopWidth: 0,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.25,
  },
  cardBody: {
    paddingTop: xs,
    paddingLeft: s,
    paddingRight: s + 1,
    paddingBottom: xs,
  },
  gameTextBlock: {
    borderLeftWidth: 2,
    paddingLeft: s,
    marginBottom: s,
    marginRight: s,
  },
  statsBlock: {
    marginBottom: s,
  },
  slotBlock: {
    marginBottom: s,
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
  buttonContainerPadding: {
    paddingLeft: s,
    paddingRight: s,
    paddingTop: xs,
    paddingBottom: xs,
  },
  testIconRow: {
    flexDirection: 'row',
  },
  statLineRow: {
    flexDirection: 'row',
    marginTop: s,
  },
  testIcon: {
    marginLeft: 2,
  },
});
