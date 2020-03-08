import React from 'react';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import { setTabooSet } from './actions';
import TabooSetPicker from 'components/core/TabooSetPicker';
import { AppState, getTabooSet } from 'reducers';
import { COLORS } from 'styles/colors';

interface ReduxProps {
  cardsLoading?: boolean;
  tabooSetId?: number;
}

interface ReduxActionProps {
  setTabooSet: (id?: number) => void;
}

type Props = ReduxProps & ReduxActionProps;

class SettingsTabooPicker extends React.Component<Props> {
  render() {
    const {
      cardsLoading,
      tabooSetId,
      setTabooSet,
    } = this.props;

    return (
      <TabooSetPicker
        color={COLORS.lightBlue}
        tabooSetId={tabooSetId}
        setTabooSet={setTabooSet}
        disabled={cardsLoading}
        description={t`Changes the default taboo list for newly created decks and search.`}
      />
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    tabooSetId: getTabooSet(state),
    cardsLoading: state.cards.loading,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    setTabooSet,
  }, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, {}, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(SettingsTabooPicker);
