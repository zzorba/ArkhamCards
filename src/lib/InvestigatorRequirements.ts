import { dropRightWhile, find, flatMap } from "lodash";
import { Brackets } from "typeorm/browser";

import { DeckMeta, Slots } from "@actions/types";
import Card from "@data/types/Card";
import DeckOption, { DeckOptionQueryBuilder } from "@data/types/DeckOption";
import { combineQueries, combineQueriesOpt, STORY_CARDS_QUERY, where } from "@data/sqlite/query";
import FilterBuilder, { FilterState } from "./filters";
import DeckValidation from "./DeckValidation";

interface DeckOptionsContext {
  filters?: FilterState,
  isUpgrade?: boolean;
  hideSplash?: boolean;
  hideVersatile?: boolean;
  extraDeck?: boolean;
  side?: boolean;
  allOptions?: boolean;
  includeStory?: boolean;
}

function negativeQueryForInvestigator(
  investigator: Card,
  allOptions: DeckOption[],
  meta?: DeckMeta,
  context?: DeckOptionsContext

): Brackets | undefined {
  // We keep taking options until we find the first negative option.
  const options = dropRightWhile(
    allOptions,
    (option) => {
      return !option.not;
    }
  );
  const foundNegative = !!find(options, option => !!option.not);
  const inverted = foundNegative
    ? flatMap(options, (option, index) => {
        if (!option.not) {
          return (
            new DeckOptionQueryBuilder(option, index).toQuery(
              meta,
              context?.isUpgrade || context?.side,
              true
            ) || []
          );
        }
        return (
          new DeckOptionQueryBuilder(option, index).toQuery(
            meta,
            context?.isUpgrade || context?.side,
            false
          ) || []
        );
      })
    : [];

  let invertedClause: Brackets[] = [];
  if (inverted.length) {
    const [firstInverted, ...otherInverted] = inverted;
    invertedClause.push(combineQueries(firstInverted, otherInverted, 'and'));
  }

  const specialtyBuilder = new FilterBuilder("specialty");
  invertedClause.push(
    specialtyBuilder.illegalSpecialistFilter(
      investigator.real_traits_normalized?.split(",") ?? [],
      [investigator.faction_code ?? "neutral"]
    )
  );
  return combineQueriesOpt(invertedClause, "or", true);
}
/**
 * Turn the given realm card into a sqlite string, for use with investigators deckbuilding where.
 * There are no story
 */
export function queryForInvestigatorWithoutDeck(
  investigator: Card,
  meta: DeckMeta | undefined,
  context?: DeckOptionsContext
) {
  return queryForInvestigator(investigator, {} , meta, [], context);
}

/**
 * Turn the given realm card into a sqlite string.
 */
export function queryForInvestigator(
  investigator: Card,
  slots: Slots | undefined,
  meta: DeckMeta | undefined,
  cards: Card[],
  context?: DeckOptionsContext
): Brackets {
  const validation = new DeckValidation(investigator, slots ?? {}, meta, {
    extra_deck: context?.extraDeck,
    all_options: context?.allOptions,
    all_customizations: context?.allOptions,
    hide_versatile: context?.hideVersatile,
    for_query: true,
  });
  const deck_options = validation.deckOptions(cards);
  // const [on_your_own, deck_options] = partition(all_options, option => option.dynamic_id === ON_YOUR_OWN_CODE);
  const invertedClause = negativeQueryForInvestigator(
    investigator,
    deck_options,
    meta,
    context,
  );

  // We assume that there is always at least one normalClause.
  const normalQuery = combineQueriesOpt(
    flatMap(deck_options, (option, index) => {
      if (option.not) {
        return [];
      }
      if (option.limit && context?.hideSplash) {
        return [];
      }
      if (option.level && context?.filters?.levelEnabled) {
        if (option.level.max < context?.filters.level[0]) {
          return [];
        }
        if (option.level.min > context?.filters.level[1]) {
          return [];
        }
      }
      return (
        new DeckOptionQueryBuilder(option, index).toQuery(
          meta,
          context?.isUpgrade || context?.side
        ) || []
      );
    }),
    "or"
  );
  const mainClause = combineQueriesOpt(
    [
      ...(invertedClause ? [invertedClause] : []),
      ...(normalQuery ? [normalQuery] : []),
    ],
    "and"
  );

  const requiredCardsQuery = context?.extraDeck ?
    where("c.code IN (:...values)", {
      values: flatMap(
        investigator.side_deck_requirements?.card ?? [],
        (card) => [
          ...(card.code ? [card.code] : []),
          ...(card.alternates ?? []),
        ]
      ),
    })
  : where(
      "c.restrictions_investigator IN (:...values) OR c.alternate_required_code IN (:...values)",
      {
        values: [
          investigator.code,
          ...(investigator.alternate_of_code
            ? [investigator.alternate_of_code]
            : []),
        ],
      }
    );
  let combined = combineQueries(
    requiredCardsQuery,
    mainClause ? [mainClause] : [],
    "or"
  );
  if (!context?.extraDeck && context?.includeStory) {
    combined = combineQueries(STORY_CARDS_QUERY, [combined], 'or');
  }
  return combined;
}
