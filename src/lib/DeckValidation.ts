import {
  groupBy,
  mapValues,
  forEach,
  find,
  findKey,
  filter,
  map,
  minBy,
  indexOf,
  sumBy,
  sortBy,
  partition,
} from "lodash";
import { t } from "ttag";

import {
  DeckInvestigatorProblemType,
  DeckMeta,
  DeckProblem,
  DeckProblemType,
  INVALID_CARDS,
  INVESTIGATOR_PROBLEM,
  Slots,
  TOO_FEW_CARDS,
  TOO_MANY_CARDS,
  TOO_MANY_COPIES,
} from "@actions/types";
import {
  ANCESTRAL_KNOWLEDGE_CODE,
  UNDERWORLD_MARKET_CODE,
  UNDERWORLD_SUPPORT_CODE,
  BODY_OF_A_YITHIAN,
  ON_YOUR_OWN_CODE,
  VERSATILE_CODE,
  FORCED_LEARNING_CODE,
  PRECIOUS_MEMENTO_FORMER_CODE,
  PRECIOUS_MEMENTO_FUTURE_CODE,
} from "@app_constants";
import Card, { InvestigatorChoice } from "@data/types/Card";
import DeckOption, { localizeDeckOptionError } from "@data/types/DeckOption";
import {
  BONDED_WEAKNESS_COUNTS,
  THE_INSANE_CODE,
} from "@data/deck/specialCards";
import DeckRequirement from "@data/types/DeckRequirement";

const THE_INSANE_TAG = "the_insane";

interface SpecialCardCounts {
  ancestralKnowledge: number;
  versatile: number;
  underworldSupport: number;
  underworldMarket: number;
  forcedLearning: number;
}

// Code taken from:
// https://github.com/Kamalisk/arkhamdb/blob/4c194c54fcbc381e45b93f0f1bcb65a37ae581a9/src/AppBundle/Resources/public/js/app.deck.js
/* eslint-disable */

interface DeckOptionsCount {
  limit: number;
  atleast: {
    [code: string]: number;
  };
}

interface InsaneData {
  traits: { [trait: string]: number | undefined };
  weaknessCount: number;
}

const SIGNATURE_CARD_OPTION = new DeckOption();

function partitionDeckOptions(options: DeckOption[]): {
  negated: DeckOption[];
  normal: DeckOption[];
  limited: DeckOption[];
} {
  const [negated, other] = partition(options, option => !!option.not);
  const [limited, normal] = partition(other, option => option.limit !== undefined);

  return {
    negated,
    normal,
    limited,
  }
}

export default class DeckValidation {
  investigator: InvestigatorChoice;
  slots: Slots;
  meta?: DeckMeta;
  problem_list: string[] = [];
  deck_options_counts: DeckOptionsCount[] = [];

  for_query: boolean;
  all_options: boolean;
  all_customizations: boolean;
  random_deck: boolean;
  extra_deck: boolean;
  insane_data: InsaneData | undefined;
  hide_versatile: boolean;

  /**
   *
   * @param investigator
   * @param slots
   * @param meta
   * @param all_options
   */
  constructor(
    investigator: InvestigatorChoice,
    slots: Slots,
    meta: DeckMeta | undefined,
    {
      for_query,
      all_options,
      all_customizations,
      random_deck,
      extra_deck,
      hide_versatile
    }: {
      for_query?: boolean;
      all_options?: boolean;
      all_customizations?: boolean;
      random_deck?: boolean;
      extra_deck?: boolean;
      hide_versatile?: boolean;
    } = {}
  ) {
    this.investigator = investigator;
    this.slots = slots;
    this.meta = meta;
    this.all_options = all_options ?? false;
    this.all_customizations = all_customizations ?? false;
    this.random_deck = random_deck ?? false;
    this.extra_deck = extra_deck ?? false;
    this.hide_versatile = hide_versatile ?? false;
    this.for_query = for_query ?? false;
  }

  specialCardCounts(): SpecialCardCounts {
    return {
      ancestralKnowledge: this.slots[ANCESTRAL_KNOWLEDGE_CODE] || 0,
      versatile: this.slots[VERSATILE_CODE] || 0,
      underworldSupport: this.slots[UNDERWORLD_SUPPORT_CODE] || 0,
      underworldMarket: this.slots[UNDERWORLD_MARKET_CODE] || 0,
      forcedLearning: this.slots[FORCED_LEARNING_CODE] || 0,
    };
  }

  deckRequirements(): DeckRequirement | undefined {
    return this.extra_deck
      ? this.investigator.back.side_deck_requirements
      : this.investigator.back.deck_requirements;
  }

  getDeckSize(cards: Card[]): number {
    const deckOptions = this.deckOptions(cards);
    const specialCards = this.specialCardCounts();
    var size: number = 30;
    const requirements = this.deckRequirements();
    if (requirements) {
      if (requirements.size) {
        size = requirements.size;
      }
      if (
        this.meta &&
        this.meta.deck_size_selected &&
        deckOptions.find((option) => option.deck_size_select?.length)
      ) {
        size = parseInt(this.meta.deck_size_selected, 10);
      }
    }
    const extraSize = sumBy(cards, card => (
      card.type_code === 'investigator' ? 0 :
      card.deck_requirements?.size ?? 0
    ));

    return (
      size +
      extraSize +
      5 *
        (specialCards.versatile +
          specialCards.ancestralKnowledge +
          specialCards.forcedLearning * 3) +
      10 * specialCards.underworldMarket +
      sumBy(deckOptions, (o) => o.size || 0) -
      5 * specialCards.underworldSupport
    );
  }

  getPhysicalDrawDeck(cards: Card[]): Card[] {
    return filter(
      cards,
      (card) => card && !card.permanent && !card.double_sided
    );
  }

  getDrawDeck(cards: Card[]): Card[] {
    return filter(
      this.getPhysicalDrawDeck(cards),
      (card) => card && card.xp !== null
    );
  }

  getDrawDeckSize(cards: Card[]): number {
    var draw_deck = this.getDrawDeck(cards);
    return draw_deck.length;
  }

  getTraits(card: Card): string[] {
    return filter(
      map(card.real_traits?.split(".") ?? [], (t) => t.trim()),
      (t) => !!t
    );
  }

  getInsaneData(cards: Card[]): InsaneData {
    const result: { [trait: string]: number | undefined } = {};
    let weaknessCount = 0;
    forEach(cards, (c) => {
      if (c.subtype_code) {
        weaknessCount++;
        // Weaknesses don't count
        return;
      }
      weaknessCount += BONDED_WEAKNESS_COUNTS[c.code] ?? 0;

      if (!c.encounter_code) {
        // Story cards and weakness cards don't count for traits.
        forEach(this.getTraits(c), (t) => {
          result[t] = (result[t] ?? 0) + 1;
        });
      }
    });
    return {
      traits: result,
      weaknessCount: weaknessCount + (this.random_deck ? 5 : 0),
    };
  }

  getCopiesAndDeckLimit(cards: Card[]) {
    const specialCards = this.specialCardCounts();
    return mapValues(
      groupBy(cards, (card) =>
        card
          ? `${card.real_name}${card.encounter_code ? card.code : ""}${
              card.subtype_code === "basicweakness" ? card.code : ""
            }${card.has_restrictions ? card.code : ""}`
          : "Unknown Card"
      ),
      (group) => {
        const card = group[0];
        if (
          !(
            card.restrictions_investigator ||
            card.xp === undefined ||
            card.xp === null
          ) &&
          (specialCards.underworldSupport > 0 || this.extra_deck)
        ) {
          return {
            nb_copies: group.length,
            deck_limit: 1,
          };
        }
        const isPreciousMemento =
          card.code === PRECIOUS_MEMENTO_FORMER_CODE ||
          card.code === PRECIOUS_MEMENTO_FUTURE_CODE;
        const smallestDeckLimitCard = minBy(group, (g) => g.deck_limit || 0);
        // Let's assume if one is myriad, then they all are.
        const deck_limit =
          card && card.myriad
            ? 3
            : // Otherwise take the smallest limit found, to make OYO(3*2) work.
              (smallestDeckLimitCard && smallestDeckLimitCard.deck_limit) || 0;

        return {
          nb_copies: group.length,
          deck_limit: isPreciousMemento ? 2 : deck_limit,
        };
      }
    );
  }

  getProblem(
    cards: Card[],
    ignoreInvestigatorRequirements?: boolean
  ): DeckProblem | undefined {
    const problem = this.getProblemHelper(
      cards,
      ignoreInvestigatorRequirements
    );
    if (!problem) {
      return undefined;
    }
    return {
      reason: problem.reason,
      investigatorReason: problem.investigatorReason,
      invalidCards: problem.invalidCards,
      problems: [...this.problem_list],
    };
  }

  getProblemHelper(
    cards: Card[],
    ignoreInvestigatorRequirements?: boolean
  ): null | {
    reason: DeckProblemType;
    investigatorReason?: DeckInvestigatorProblemType;
    invalidCards: Card[];
  } {
    // get investigator data
    var card = this.investigator;
    const requirements = this.deckRequirements();
    if (card.back.code === THE_INSANE_CODE) {
      this.insane_data = this.getInsaneData(cards);
    }

    const size = this.getDeckSize(cards);

    // too many copies of one card
    const copiesAndDeckLimit = this.getCopiesAndDeckLimit(cards);
    const invalidCards = this.getInvalidCards(cards);

    // store list of all problems
    this.problem_list = [];
    if (card && requirements && !ignoreInvestigatorRequirements) {
      // console.log(requirements);
      // must have the required cards
      if (requirements.card) {
        const failedReq = find(
          requirements.card,
          (req) =>
            !find(cards, (theCard) => theCard.code === req.code) &&
            !find(
              cards,
              (theCard) => theCard.alternate_required_code === req.code
            ) &&
            !(
              req.alternates?.length &&
              find(req.alternates, (code) =>
                find(cards, (theCard) => theCard.code === code)
              )
            )
        );
        if (failedReq) {
          return {
            reason: INVESTIGATOR_PROBLEM,
            investigatorReason: "required",
            invalidCards,
          };
        }
      }
    }

    if (
      findKey(
        copiesAndDeckLimit,
        (value) => value.nb_copies > value.deck_limit
      ) != null
    ) {
      return {
        reason: TOO_MANY_COPIES,
        invalidCards,
      };
    }

    // no invalid card
    if (invalidCards.length > 0) {
      return {
        reason: INVALID_CARDS,
        invalidCards,
      };
    }

    const deck_options = this.deckOptions(cards);
    for (let i = 0; i < deck_options.length; i++) {
      const option = deck_options[i];
      if (!option) {
        continue;
      }
      if (this.deck_options_counts[i].limit && option.limit) {
        if (this.deck_options_counts[i].limit > option.limit) {
          const error = localizeDeckOptionError(option.error);
          if (error) {
            this.problem_list.push(error);
          }

          return {
            reason: INVESTIGATOR_PROBLEM,
            investigatorReason: "limit",
            invalidCards,
          };
        }
      }
      const atleast = option.atleast;
      if (atleast) {
        if (atleast.factions && atleast.min) {
          var faction_count = 0;
          forEach(this.deck_options_counts[i].atleast, (value) => {
            if (value >= atleast.min) {
              faction_count++;
            }
          });
          if (faction_count < atleast.factions) {
            const error = localizeDeckOptionError(option.error);
            if (error) {
              this.problem_list.push(error);
            }
            return {
              reason: INVESTIGATOR_PROBLEM,
              investigatorReason: "atleast",
              invalidCards,
            };
          }
        } else if (atleast.types && atleast.min) {
          var type_count = 0;
          forEach(this.deck_options_counts[i].atleast, (value) => {
            if (value >= atleast.min) {
              type_count++;
            }
          });
          if (type_count < atleast.types) {
            const error = localizeDeckOptionError(option.error);
            if (error) {
              this.problem_list.push(error);
            }

            return {
              reason: INVESTIGATOR_PROBLEM,
              investigatorReason: "atleast",
              invalidCards,
            };
          }
        }
      }
    }

    const drawDeckSize = this.getDrawDeckSize(cards);
    // at least 60 others cards
    if (drawDeckSize < size) {
      const removeCount = size - drawDeckSize;
      this.problem_list.push(t`Not enough cards (${drawDeckSize} / ${size}).`);
      return {
        reason: TOO_FEW_CARDS,
        invalidCards,
      };
    }

    // at least 60 others cards
    if (drawDeckSize > size) {
      const removeCount = size - drawDeckSize;
      this.problem_list.push(t`Too many cards (${drawDeckSize} / ${size}).`);
      return {
        reason: TOO_MANY_CARDS,
        invalidCards,
      };
    }
    return null;
  }

  private initDeckOptionsCounts(cards: Card[]) {
    this.deck_options_counts = [];
    const options = this.deckOptions(cards);
    forEach(options, () => {
      this.deck_options_counts.push({
        limit: 0,
        atleast: {},
      });
    });
  }

  getInvalidCards(cards: Card[]): Card[] {
    this.initDeckOptionsCounts(cards);
    return filter(
      sortBy(cards, (c) => -(c.xp ?? 0)),
      (card) => !this.canIncludeCard(card, true, cards)
    );
  }

  isCardLimited(card: Card, allCards: Card[]): boolean {
    const option = this.matchingDeckOption(card, false, allCards);
    return !!(option && option.limit && !option.dynamic_id && !option.not);
  }


  deckOptions(cards: Card[]): DeckOption[] {
    const specialCards = this.specialCardCounts();
    var deck_options: DeckOption[] = []

    const dynamicOptions = partitionDeckOptions(cards.flatMap((card) => {
      if (card.type_code !== 'investigator' && card.deck_options) {
        return map(card.deck_options, o => {
          return {
            ...o,
            dynamic_id: card.code,
          };
        });
      }
      return [];
    }));

    if (!this.all_options && !this.for_query) {
      deck_options.push({
        limit: 1,
        trait: ["Covenant"],
        ignore_match: true,
        error: t`Limit 1 Covenant per deck.`,
        dynamic_id: "convenant",
      });
    }
    if (specialCards.ancestralKnowledge&& !this.for_query) {
      deck_options.push(
        DeckOption.parse({
          type: ["skill"],
          ignore_match: true,
          atleast: {
            types: 1,
            min: 10,
          },
          restrictions: false,
          error: t`Decks with Ancestral Knowledge must include at least 10 skills.`,
        })
      );
    }
    const investigator_deck_options = this.extra_deck
      ? this.investigator.back.side_deck_options
      : this.investigator.back.deck_options;
    if (investigator_deck_options && investigator_deck_options.length) {
      forEach(investigator_deck_options, (deck_option) => {
        if (deck_option.option_select) {
          const option =
            this.meta && this.meta.option_selected
              ? find(
                  deck_option.option_select,
                  (o) => o.id === this.meta?.option_selected
                )
              : undefined;
          if (option) {
            deck_options.push(DeckOption.parse(option));
          } else {
            if (this.all_options) {
              for (let k = 0; k < deck_option.option_select.length; k++) {
                const o = deck_option.option_select[k];
                deck_options.push(DeckOption.parse(o));
              }
            } else {
              deck_options.push(DeckOption.parse(deck_option.option_select[0]));
            }
          }
        } else if (
          this.insane_data &&
          find(deck_option.tag, (t) => t === THE_INSANE_TAG)
        ) {
          deck_options.push({
            ...deck_option,
            limit: this.insane_data.weaknessCount,
          });
        } else {
          deck_options.push(deck_option);
        }
      });
    }
    if (specialCards.versatile > 0 && !this.hide_versatile) {
      deck_options.push(
        DeckOption.parse({
          level: {
            min: 0,
            max: 0,
          },
          faction: ["guardian", "seeker", "rogue", "mystic", "survivor"],
          limit: specialCards.versatile,
          error: t`Too many off-class cards for Versatile`,
        })
      );
    }
    const [limited, other] = partition(deck_options, (option) => option.limit !== undefined);
    return [
      ...dynamicOptions.negated,
      ...other,
      ...dynamicOptions.normal,
      ...limited,
      ...dynamicOptions.limited,
    ];
  }

  canIncludeCard(card: Card, processDeckCounts: boolean, allCards: Card[]): boolean {
    const matchingOption = this.matchingDeckOption(card, processDeckCounts, allCards);
    if (matchingOption?.not) {
      if (
        matchingOption.dynamic_id === ON_YOUR_OWN_CODE &&
        card.encounter_code === "the_midwinter_gala"
      ) {
        // ON YOUR OWN doesn't block the midwinter gala story assets,
        // because of obscure deckbuilding reasons.
        return true;
      }
      return false;
    }
    return (
      !!matchingOption ||
      card.code === BODY_OF_A_YITHIAN ||
      // Handle weird story cards that break the rules
      (card.encounter_code === "the_midwinter_gala" &&
        (card.deck_limit ?? 0) > 0)
    );
  }

  private matchingDeckOption(
    card: Card,
    processDeckCounts: boolean,
    allCards: Card[]
  ): DeckOption | undefined {
    const investigator = this.investigator;

    // hide investigators
    if (card.type_code === "investigator") {
      return undefined;
    }
    if (card.faction_code === "mythos") {
      return undefined;
    }

    // reject cards restricted
    if (card.restrictions_all_investigators) {
      if (
        find(
          card.restrictions_all_investigators,
          (code) =>
            code === investigator.back.code ||
            code === investigator.back.alternate_of_code
        )
      ) {
        return SIGNATURE_CARD_OPTION;
      }
      return undefined;
    }
    if (card.restrictions_trait) {
      const gator_traits =
        investigator.front.real_traits_normalized?.split(",") ?? [];
      if (
        !find(gator_traits, (t) => card.restrictions_trait?.indexOf(t) !== -1)
      ) {
        // This card is restricted and you don't match the requirements.
        return undefined;
      }
    }
    if (card.restrictions_faction) {
      const faction = `#${investigator.front.faction_code}#`;
      if (card.restrictions_faction.indexOf(faction) === -1) {
        // This card is restricted and you don't match the requirements.
        return undefined;
      }
    }

    //var investigator = app.data.cards.findById(investigator_code);
    const deck_options: DeckOption[] = this.deckOptions(allCards);
    if (deck_options.length) {
      for (let i = 0; i < deck_options.length; i++) {
        const finalOption = i === deck_options.length - 1;
        var option = deck_options[i];
        if (DeckOption.deckSizeOnly(option)) {
          continue;
        }
        if (option.restrictions !== undefined) {
          if (option.restrictions != !!card.restrictions_investigator) {
            continue;
          }
        }

        if (option.permanent !== undefined && option.permanent !== null) {
          if (option.permanent !== (card.permanent ?? false)) {
            continue;
          }
        }
        if (option.faction && option.faction.length) {
          // needs to match at least one faction
          var faction_valid = false;
          for (var j = 0; j < option.faction.length; j++) {
            var faction = option.faction[j];
            if (
              card.faction_code == faction ||
              card.faction2_code == faction ||
              card.faction3_code == faction
            ) {
              faction_valid = true;
            }
          }

          if (!faction_valid) {
            continue;
          }
        }
        if (option.faction_select && option.faction_select.length) {
          let selected_faction: Set<string> = new Set(
            this.all_options
              ? option.faction_select
              : [option.faction_select[0]]
          );
          if (this.meta) {
            const selection = option.id
              ? this.meta[option.id]
              : this.meta.faction_selected;
            if (selection && indexOf(option.faction_select, selection) !== -1) {
              selected_faction = new Set([selection]);
            }
          }
          if (
            !find(card.factionCodes(), (code) => selected_faction.has(code))
          ) {
            continue;
          }
        }
        if (option.type_code && option.type_code.length) {
          // needs to match at least one faction
          var type_valid = false;
          for (var j = 0; j < option.type_code.length; j++) {
            if (card.type_code === option.type_code[j]) {
              type_valid = true;
            }
          }

          if (!type_valid) {
            continue;
          }
        }

        if (option.slot && option.slot.length) {
          // needs to match at least one trait
          var slot_valid = false;
          for (var j = 0; j < option.slot.length; j++) {
            var slot = option.slot[j];
            if (card.customization_options && this.all_customizations) {
              // Permissive mode, don't handle removal for now since I don't think we use it.
              if (
                find(
                  card.customization_options,
                  (c) =>
                    c.real_slot &&
                    c.real_slot
                      ?.toUpperCase()
                      .indexOf(trait.toUpperCase() + ".") !== -1
                )
              ) {
                slot_valid = true;
              }
            } else if (
              card.real_slot &&
              card.real_slot.toUpperCase().indexOf(slot.toUpperCase()) !== -1
            ) {
              slot_valid = true;
            }
          }
          if (!slot_valid) {
            continue;
          }
        }

        if (option.trait && option.trait.length) {
          // needs to match at least one trait
          var trait_valid = false;

          for (var j = 0; j < option.trait.length; j++) {
            var trait = option.trait[j];
            if (
              card.real_traits &&
              card.real_traits
                .toUpperCase()
                .indexOf(trait.toUpperCase() + ".") !== -1
            ) {
              trait_valid = true;
            }
            if (card.customization_options && this.all_customizations) {
              // Permissive mode
              if (
                find(
                  card.customization_options,
                  (o) =>
                    o.real_traits &&
                    o.real_traits
                      ?.toUpperCase()
                      .indexOf(trait.toUpperCase() + ".") !== -1
                )
              ) {
                trait_valid = true;
              }
            }
          }

          if (!trait_valid) {
            continue;
          }
        }

        if (option.uses && option.uses.length) {
          // needs to match at least one trait
          var uses_valid = false;

          for (var j = 0; j < option.uses.length; j++) {
            var uses = option.uses[j];
            if (
              card.real_text &&
              card.real_text
                .toUpperCase()
                .indexOf("" + uses.toUpperCase() + ").") !== -1
            ) {
              uses_valid = true;
            }
          }

          if (!uses_valid) {
            continue;
          }
        }

        if (option.tag && option.tag.length) {
          var tag_valid = false;
          for (var j = 0; j < option.tag.length; j++) {
            var tag = option.tag[j];
            if (find(card.tags, (t) => t === tag)) {
              tag_valid = true;
            }
            if (card.customization_options && this.all_customizations) {
              // Permissive mode
              if (
                find(
                  card.customization_options,
                  (o) => !!find(o.tags, (t) => t === tag)
                )
              ) {
                tag_valid = true;
              }
            }
            if (!tag_valid && tag === THE_INSANE_TAG) {
              if (!this.insane_data) {
                // Shouldn't happen, but hard to guarantee.
                continue;
              }
              const traits = this.getTraits(card);
              if (!traits.length) {
                // No traits, so it can't fulfill the rule.
                continue;
              }
              for (var k = 0; k < traits.length; k++) {
                const trait = traits[k];
                if ((this.insane_data.traits[trait] ?? 0) <= 2) {
                  // There is a trait with less than 2 copies in the deck, so it works!
                  tag_valid = true;
                  break;
                }
              }
              if (tag_valid) {
              }
              if (
                this.deck_options_counts[i].limit >=
                this.insane_data.weaknessCount
              ) {
                // Out of crazy slots;
                continue;
              }
            }
          }
          if (!tag_valid) {
            continue;
          }
        } else if (option.text && option.text.length) {
          var text_valid = false;
          for (var j = 0; j < option.text.length; j++) {
            var text = option.text[j];
            if (card.real_text && card.real_text.match(text)) {
              text_valid = true;
            }
          }
          if (!text_valid) {
            continue;
          }
        }

        if (option.level) {
          var level_valid = false;
          if (card.xp !== undefined && option.level) {
            if (card.customization_options && this.all_customizations) {
              // Permissive mode, any XP could work for this investigator.
              level_valid = true;
            } else if (
              card.xp >= option.level.min &&
              card.xp <= option.level.max
            ) {
              level_valid = true;
            } else {
              continue;
            }
          }
        }

        if (option.not) {
          // Failed a not condition, that's final.
          return option;
        } else {
          if (processDeckCounts && option.atleast && card.faction_code) {
            if (option.atleast.factions) {
              if (!this.deck_options_counts[i].atleast[card.faction_code]) {
                this.deck_options_counts[i].atleast[card.faction_code] = 0;
              }
              this.deck_options_counts[i].atleast[card.faction_code] += 1;

              if (card.faction2_code) {
                if (!this.deck_options_counts[i].atleast[card.faction2_code]) {
                  this.deck_options_counts[i].atleast[card.faction2_code] = 0;
                }
                this.deck_options_counts[i].atleast[card.faction2_code] += 1;
              }
              if (card.faction3_code) {
                if (!this.deck_options_counts[i].atleast[card.faction3_code]) {
                  this.deck_options_counts[i].atleast[card.faction3_code] = 0;
                }
                this.deck_options_counts[i].atleast[card.faction3_code] += 1;
              }
            } else if (option.atleast.types) {
              if (!this.deck_options_counts[i].atleast[card.type_code]) {
                this.deck_options_counts[i].atleast[card.type_code] = 0;
              }
              this.deck_options_counts[i].atleast[card.type_code] += 1;
            }
          }
          if (processDeckCounts && option.limit) {
            if (
              finalOption ||
              this.deck_options_counts[i].limit < option.limit
            ) {
              this.deck_options_counts[i].limit += 1;
              if (option.ignore_match) {
                continue;
              }
              return option;
            }
          } else {
            if (option.ignore_match) {
              continue;
            }
            return option;
          }
        }
      }
    }
    return undefined;
  }
}
