import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import { Pack } from '@actions/types';
import { setPackSpoiler, setCyclePackSpoiler } from '@actions';
import PackListComponent from '@components/core/PackListComponent';
import { NavigationProps } from '@components/nav/types';
import { getAllPacks, getPackSpoilers, AppState } from '@reducers';
import space from '@styles/space';
import StyleContext, { StyleContextType } from '@styles/StyleContext';
import Database from '@data/Database';
import DatabaseContext, { DatabaseContextType } from '@data/DatabaseContext';

interface ReduxProps {
  packs: Pack[];
  show_spoilers: { [pack_code: string]: boolean };
}

interface ReduxActionProps {
  setPackSpoiler: (code: string, value: boolean, db: Database) => void;
  setCyclePackSpoiler: (cycle_code: string, value: boolean, db: Database) => void;
}

type Props = NavigationProps & ReduxProps & ReduxActionProps;

class SpoilersView extends React.Component<Props> {
  static contextType = DatabaseContext;
  context!: DatabaseContextType;

  _renderHeader = (): React.ReactElement => {
    return (
      <StyleContext.Consumer>
        { ({ typography }) => (
          <View style={space.paddingS}>
            <Text style={typography.small}>
              { t`Mark the scenarios you've played through to make the results start showing up in search results.` }
            </Text>
          </View>
        ) }
      </StyleContext.Consumer>
    );
  };

  _setPackSpoiler = (code: string, value: boolean) => {
    const { setPackSpoiler } = this.props;
    const { db } = this.context;
    setPackSpoiler(code, value, db);
  };

  _setCyclePackSpoiler = (cycle_code: string, value: boolean) => {
    const { setCyclePackSpoiler } = this.props;
    const { db } = this.context;
    setCyclePackSpoiler(cycle_code, value, db);
  };

  render() {
    const {
      componentId,
      packs,
      show_spoilers,
    } = this.props;
    return (
      <StyleContext.Consumer>
        { ({ typography }) => {
          if (!packs.length) {
            return (
              <View>
                <Text style={typography.text}>{ t`Loading` }</Text>
              </View>
            );
          }
          return (
            <PackListComponent
              componentId={componentId}
              packs={packs}
              renderHeader={this._renderHeader}
              checkState={show_spoilers}
              setChecked={this._setPackSpoiler}
              setCycleChecked={this._setCyclePackSpoiler}
            />
          );
        } }
      </StyleContext.Consumer>
    );
  }
}

function mapStateToProps(state: AppState): ReduxProps {
  return {
    packs: getAllPacks(state),
    show_spoilers: getPackSpoilers(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>): ReduxActionProps {
  return bindActionCreators({
    setPackSpoiler,
    setCyclePackSpoiler,
  }, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, NavigationProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(SpoilersView);
