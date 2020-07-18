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
import withDimensions, { DimensionsProps } from '@components/core/withDimensions';
import { setPackSpoiler, setCyclePackSpoiler } from '@actions';
import PackListComponent from '@components/core/PackListComponent';
import { NavigationProps } from '@components/nav/types';
import { getAllPacks, getPackSpoilers, AppState } from '@reducers';
import space from '@styles/space';

interface ReduxProps {
  packs: Pack[];
  show_spoilers: { [pack_code: string]: boolean };
}

interface ReduxActionProps {
  setPackSpoiler: (code: string, value: boolean) => void;
  setCyclePackSpoiler: (cycle: number, value: boolean) => void;
}

type Props = NavigationProps & ReduxProps & ReduxActionProps & DimensionsProps;

class SpoilersView extends React.Component<Props> {
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
      fontScale,
    } = this.props;
    if (!packs.length) {
      return (
        <View>
          <Text>{ t`Loading` }</Text>
        </View>
      );
    }
    return (
      <PackListComponent
        componentId={componentId}
        packs={packs}
        fontScale={fontScale}
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
)(
  withDimensions(SpoilersView)
);

const styles = StyleSheet.create({
  headerText: {
    fontFamily: 'System',
    fontSize: 14,
  },
});
