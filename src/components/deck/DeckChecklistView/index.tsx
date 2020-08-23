import React from 'react';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';

import { Slots } from '@actions/types';
import withPlayerCards, { PlayerCardProps } from '@components/core/withPlayerCards';
import { ScrollView } from 'react-native-gesture-handler';
import { AppState, getDeckChecklist } from '@reducers';
import { NavigationProps } from '@components/nav/types';
import { setDeckChecklistCard, resetDeckChecklist } from '@components/deck/actions';
import CardSelectorComponent from '@components/cardlist/CardSelectorComponent';
import { forEach } from 'lodash';

export interface DeckChecklistProps {
  investigator: string;
  id: number;
  slots: Slots;
}

interface ReduxProps {
  checklist: string[];
}

interface ReduxActionProps {
  resetDeckChecklist: (id: number) => void;
  setDeckChecklistCard: (id: number, card: string, value: boolean) => void;
}

type Props = DeckChecklistProps & PlayerCardProps & ReduxProps & ReduxActionProps & NavigationProps;

class DeckChecklistView extends React.Component<Props> {
  _toggleCard = (code: string, value: boolean) => {
    const { setDeckChecklistCard, id } = this.props;
    setDeckChecklistCard(id, code, value);
  };

  render() {
    const { componentId, slots, checklist } = this.props;
    const counts: Slots = {};
    forEach(checklist, code => {
      counts[code] = 1;
    });
    return (
      <CardSelectorComponent
        componentId={componentId}
        slots={slots}
        counts={counts}
        toggleCard={this._toggleCard}
      />
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: NavigationProps & DeckChecklistProps & PlayerCardProps
): ReduxProps {
  return {
    checklist: getDeckChecklist(state, props.id),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    setDeckChecklistCard,
    resetDeckChecklist,
  } as any, dispatch);
}

export default withPlayerCards<NavigationProps & DeckChecklistProps>(
  connect<ReduxProps, ReduxActionProps, NavigationProps & DeckChecklistProps & PlayerCardProps, AppState>(
    mapStateToProps,
    mapDispatchToProps
  )(DeckChecklistView)
);