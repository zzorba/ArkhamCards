
// Code taken from:
// https://github.com/Kamalisk/arkhamdb/blob/4c194c54fcbc381e45b93f0f1bcb65a37ae581a9/src/AppBundle/Resources/public/js/app.deck.js
/* eslint-disable */
import { groupBy, mapValues, keys, forEach, find, findKey, filter } from 'lodash';

export default class DeckValidator {
  constructor(investigator) {
    this.investigator = investigator;

    this.problem_list = [];
  }

  getDrawDeck(cards) {
    return filter(card => !card.permanent && !card.double_sided);
  }

  getDrawDeckSize(cards) {
    var draw_deck = this.getDrawDeck(cards);
	  return draw_deck.length;
  }

  getCopiesAndDeckLimit(cards) {
    return mapValues(
      groupBy(this.getDrawDeck(cards), card => card.real_name),
      group => {
        return {
          nb_copies: group.length,
          deck_limit: card.deck_limit,
        }
      });
  }

  getProblem(cards) {
    const reason = this.getProblemHelper(cards);
    if (!reason) {
      return null;
    }
    return {
      reason,
      problems: this.problem_list.slice(0),
    };
  }

  getProblemHelper(cards) {
	  // get investigator data
  	var card = this.investigator;
  	var size = 30;
  	// store list of all problems
  	this.problem_list = [];
  	if (card && card.deck_requirements){
  		if (card.deck_requirements.size){
  			size = card.deck_requirements.size;
  		}
  		//console.log(card.deck_requirements);
  		// must have the required cards
  		if (card.deck_requirements.card){
  			var req_count = 0;
  			var req_met_count = 0;
  			forEach(keys(card.deck_requirements.card), key => {
          const possible = card.deck_requirements.card[key];
  				req_count++;
  				var found_match = false;
  				forEach(keys(possible), code => {
            const code2 = possible[code];
            if (find(cards, theCard => theCard.code === code)){
  						found_match = true;
  					}
  				});
  				if (found_match) {
  					req_met_count++;
  				}
  			});
  			if (req_met_count < req_count) {
  				return "investigator";
  			}
  		}
  	} else {

  	}

  	// too many copies of one card
  	if(findKey(
        this.getCopiesAndDeckLimit(cards),
        value => value.nb_copies > value.deck_limit) != null) {
      return 'too_many_copies';
    }

  	// no invalid card
  	if(this.getInvalidCards(cards).length > 0) {
  		return 'invalid_cards';
  	}

    const investigator = this.investigator;
  	//console.log(investigator);
  	for (var i = 0; i < investigator.deck_options.length; i++){
  		//console.log(investigator.deck_options);
  		if (this.deck_options_counts[i].limit && investigator.deck_options[i].limit){
  			if (this.deck_options_counts[i].limit > investigator.deck_options[i].limit){
  				if (investigator.deck_options[i].error){
  					this.problem_list.push(investigator.deck_options[i].error);
  				}
  				return 'investigator';
  			}
  		}

  		if (investigator.deck_options[i].atleast){
  			if (investigator.deck_options[i].atleast.factions && investigator.deck_options[i].atleast.min){
  				var faction_count = 0;
          forEach(keys(investigator.deck_options_counts[i].atleast), key => {
            const value = investigator.deck_options_counts[i].atleast[key];
  					if (value >= investigator.deck_options[i].atleast.min){
  						faction_count++;
  					}
  				})
  				if (faction_count < investigator.deck_options[i].atleast.factions){
  					if (investigator.deck_options[i].error){
  						this.problem_list.push(investigator.deck_options[i].error);
  					}
  					return 'investigator';
  				}
  			}
  		}
  	}

    const drawDeckSize = this.getDrawDeckSize(cards);
  		// at least 60 others cards
  	if(drawDeckSize < size) {
  		return 'too_few_cards';
  	}

  	// at least 60 others cards
  	if(drawDeckSize > size) {
  		return 'too_many_cards';
  	}
    return null;
  }

  getInvalidCards(cards) {
    const investigator = this.investigator;

  	if (this.investigator) {
      this.deck_options_counts = [];
  		for (var i = 0; i < this.investigator.deck_options.length; i++){
  			this.deck_options_counts.push({
          limit: 0,
          atleast: 0
        });
  		}
  	}
  	return filter(cards, function (card) {
  		return !this.canIncludeCard(card, true);
  	});
  }

  canIncludeCard(card, processDeckCounts) {
    const investigator = this.investigator;

  	// hide investigators
  	if (card.type_code === "investigator") {
  		return false;
  	}
  	if (card.faction_code === "mythos") {
  		return false;
  	}

  	// reject cards restricted
  	if (card.restrictions && card.restrictions.investigator &&  card.restrictions.investigator[0] !== investigator.code){
  		return false;
  	}

  	//var investigator = app.data.cards.findById(investigator_code);

  	if (investigator && investigator.deck_options && investigator.deck_options.length) {

  		//console.log(card);
  		for (var i = 0; i < investigator.deck_options.length; i++) {
  			var option = investigator.deck_options[i];
  			//console.log(option);

  			var valid = false;

  			if (option.faction){
  				// needs to match at least one faction
  				var faction_valid = false;
  				for(var j = 0; j < option.faction.length; j++){
  					var faction = option.faction[j];
  					if (card.faction_code == faction){
  						faction_valid = true;
  					}
  				}

  				if (!faction_valid){
  					continue;
  				}
  				//console.log("faction valid");
  			}

  			if (option.type){
  				// needs to match at least one faction
  				var type_valid = false;
  				for(var j = 0; j < option.type.length; j++){
  					var type = option.type[j];
  					if (card.type_code == type){
  						type_valid = true;
  					}
  				}

  				if (!type_valid){
  					continue;
  				}
  				//console.log("faction valid");
  			}

  			if (option.trait){
  				// needs to match at least one trait
  				var trait_valid = false;

  				for(var j = 0; j < option.trait.length; j++){
  					var trait = option.trait[j];
  					//console.log(card.traits, trait.toUpperCase()+".");

  					if (card.real_traits && card.real_traits.toUpperCase().indexOf(trait.toUpperCase()+".") !== -1){
  						trait_valid = true;
  					}
  				}

  				if (!trait_valid){
  					continue;
  				}
  				//console.log("faction valid");
  			}

  			if (option.uses){
  				// needs to match at least one trait
  				var uses_valid = false;

  				for(var j = 0; j < option.uses.length; j++){
  					var uses = option.uses[j];
  					//console.log(card.traits, trait.toUpperCase()+".");

  					if (card.real_text && card.real_text.toUpperCase().indexOf(""+uses.toUpperCase()+").") !== -1){
  						uses_valid = true;
  					}
  				}

  				if (!uses_valid){
  					continue;
  				}
  				//console.log("faction valid");
  			}

  			if (option.level){
  				// needs to match at least one faction
  				var level_valid = false;
  				//console.log(option.level, card.xp, card.xp >= option.level.min, card.xp <= option.level.max);

  				if (typeof card.xp !== 'undefined' && option.level){
  					if (card.xp >= option.level.min && card.xp <= option.level.max){
  						level_valid = true;
  					} else {
  						continue;
  					}
  				}
  				//console.log("level valid");
  			}

  			if (option.not){
  				return false;
  			} else {
  				if (processDeckCounts && option.limit){
  					//console.log(card);
  					this.deck_options_counts.limit += 1;
  				}
  				if (processDeckCounts && option.atleast){
  					if (!this.deck_options_counts.atleast[card.faction_code]){
  						this.deck_options_counts.atleast[card.faction_code] = 0;
  					}
  					this.deck_options_counts.atleast[card.faction_code] += 1;
  				}
  				return true;
  			}

  		}
  	}

  	if (!card.xp){

  	}

  	return false;
  }
}
