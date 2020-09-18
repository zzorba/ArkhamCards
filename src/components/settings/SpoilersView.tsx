import React from 'react';
import {
  StyleSheet,
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

interface ReduxProps {
  packs: Pack[];
  show_spoilers: { [pack_code: string]: boolean };
}

interface ReduxActionProps {
  setPackSpoiler: (code: string, value: boolean) => void;
  setCyclePackSpoiler: (cycle: number, value: boolean) => void;
}

type Props = NavigationProps & ReduxProps & ReduxActionProps;

class SpoilersView extends React.Component<Props> {
  static contextType = StyleContext;
  context!: StyleContextType;

  _renderHeader = (): React.ReactElement => {
    return (
      <View style={space.paddingS}>
        <Text style={styles.headerText}>
          { t`Mark the scenarios you've played through to make the results start showing up in search results.` }
        </Text>
      </View>
    );
  };

  render() {
    const {
      componentId,
      packs,
      show_spoilers,
      setPackSpoiler,
      setCyclePackSpoiler,
    } = this.props;
    const { typography } = this.context;
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
        setChecked={setPackSpoiler}
        setCycleChecked={setCyclePackSpoiler}
      />
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

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'System',
    fontSize: 14,
  },
});
