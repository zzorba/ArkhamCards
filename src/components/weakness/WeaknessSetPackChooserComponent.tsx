import React from 'react';
import { filter, forEach, map, uniqBy } from 'lodash';
import { connect } from 'react-redux';

import PackListComponent from 'components/core/PackListComponent';
import { BASIC_WEAKNESS_QUERY } from 'data/query';
import { AppState } from 'reducers';
import { Pack } from 'actions/types';
import withWeaknessCards, { WeaknessCardProps } from './withWeaknessCards';

interface OwnProps {
  componentId: string;
  onSelectedPacksChanged: (packs: string[]) => void;
  compact?: boolean;
}

interface ReduxProps {
  in_collection: { [pack_code: string]: boolean };
  packs?: Pack[];
}

type Props = OwnProps & ReduxProps & WeaknessCardProps;

interface State {
  override: { [pack_code: string]: boolean };
}

class WeaknessSetPackChooserComponent extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      override: { core: true },
    };
  }

  componentDidMount() {
    this._syncSelectedPacks();
  }

  _onPackCheck = (pack: string, value: boolean) => {
    this.setState({
      override: Object.assign({}, this.state.override, { [pack]: !!value }),
    }, this._syncSelectedPacks);
  };

  _syncSelectedPacks = () => {
    const {
      in_collection,
      onSelectedPacksChanged,
    } = this.props;

    const {
      override,
    } = this.state;
    const includePack = Object.assign({}, in_collection, override);
    const packs: string[] = [];
    forEach(this.weaknessPacks(), pack => {
      if (includePack[pack.code]) {
        packs.push(pack.code);
      }
    });
    onSelectedPacksChanged(packs);
  };

  weaknessPacks() {
    const {
      cards,
      packs,
    } = this.props;
    const weaknessPackSet = new Set(
      uniqBy(
        map(cards, card => card.pack_code),
        code => code
      ));
    return filter(packs, pack => weaknessPackSet.has(pack.code));
  }

  render() {
    const {
      componentId,
      in_collection,
      compact,
    } = this.props;
    const {
      override,
    } = this.state;
    const weaknessPacks = this.weaknessPacks();
    return (
      <PackListComponent
        componentId={componentId}
        packs={weaknessPacks}
        checkState={Object.assign({}, in_collection, override)}
        setChecked={this._onPackCheck}
        baseQuery={BASIC_WEAKNESS_QUERY}
        compact={compact}
        whiteBackground
        noFlatList
      />
    );
  }
}

const EMPTY_IN_COLLECTION = {};
function mapStateToProps(state: AppState): ReduxProps {
  return {
    packs: state.packs.all,
    in_collection: state.packs.in_collection || EMPTY_IN_COLLECTION,
  };
}

export default connect<ReduxProps, {}, OwnProps, AppState>(mapStateToProps)(
  withWeaknessCards(WeaknessSetPackChooserComponent)
);
