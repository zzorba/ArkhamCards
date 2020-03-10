import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import { bindActionCreators, Dispatch, Action } from 'redux';
import { connect } from 'react-redux';
import { t } from 'ttag';

import PackListComponent from 'components/core/PackListComponent';
import { NavigationProps } from 'components/nav/types';
import { Pack } from 'actions/types';
import { setInCollection, setCycleInCollection } from 'actions';
import { getAllPacks, getPacksInCollection, AppState } from 'reducers';

interface ReduxProps {
  packs: Pack[];
  in_collection: { [pack_code: string]: boolean };
}

interface ReduxActionProps {
  setInCollection: (code: string, value: boolean) => void;
  setCycleInCollection: (cycle: number, value: boolean) => void;
}
type Props = NavigationProps & ReduxProps & ReduxActionProps;

class CollectionEditView extends React.Component<Props> {
  static get options() {
    return {
      topBar: {
        title: {
          text: t`Edit Collection`,
        },
      },
    };
  }

  render() {
    const {
      componentId,
      packs,
      in_collection,
      setInCollection,
      setCycleInCollection,
    } = this.props;
    if (!packs.length) {
      return (
        <View>
          <Text>Loading</Text>
        </View>
      );
    }
    return (
      <PackListComponent
        coreSetName={t`Second Core Set`}
        componentId={componentId}
        packs={packs}
        checkState={in_collection}
        setChecked={setInCollection}
        setCycleChecked={setCycleInCollection}
      />
    );
  }
}

function mapStateToProps(state: AppState) {
  return {
    packs: getAllPacks(state),
    in_collection: getPacksInCollection(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return bindActionCreators({
    setInCollection,
    setCycleInCollection,
  }, dispatch);
}

export default connect<ReduxProps, ReduxActionProps, NavigationProps, AppState>(
  mapStateToProps,
  mapDispatchToProps
)(CollectionEditView);
