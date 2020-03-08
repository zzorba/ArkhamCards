import React from 'react';
import { find, map } from 'lodash';
import { BackHandler } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import {
  SORT_BY_TYPE,
  SORT_BY_FACTION,
  SORT_BY_COST,
  SORT_BY_PACK,
  SORT_BY_TITLE,
  SORT_BY_ENCOUNTER_SET,
  SortType,
} from 'actions/types';
import DialogPicker from 'components/core/DialogPicker';

interface Props {
  componentId: string;
  sortChanged: (sort: SortType) => void;
  selectedSort: SortType;
  hasEncounterCards: boolean;
}

export default class CardSortDialog extends React.Component<Props> {
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this._handleBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress);
  }

  _handleBackPress = () => {
    Navigation.dismissOverlay(this.props.componentId);
    return true;
  };

  static sortToCopy(sort: SortType): string {
    switch (sort) {
      case SORT_BY_TYPE:
        return t`Type`;
      case SORT_BY_FACTION:
        return t`Faction`;
      case SORT_BY_COST:
        return t`Cost`;
      case SORT_BY_PACK:
        return t`Pack`;
      case SORT_BY_TITLE:
        return t`Title`;
      case SORT_BY_ENCOUNTER_SET:
        return t`Encounter Set`;
      default: {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const _exhaustiveCheck: never = sort;
        return '';
      }
    }
  }

  _onSortChanged = (sortString: string) => {
    const sort: SortType =
      find(this.sorts(), sort => CardSortDialog.sortToCopy(sort) === sortString) ||
      SORT_BY_TYPE;
    this.props.sortChanged(sort);
  };

  sorts(): SortType[] {
    const {
      selectedSort,
      hasEncounterCards,
    } = this.props;

    const sorts: SortType[] = [
      SORT_BY_TYPE,
      SORT_BY_FACTION,
      SORT_BY_COST,
      SORT_BY_PACK,
      SORT_BY_TITLE,
    ];
    if (hasEncounterCards || selectedSort === SORT_BY_ENCOUNTER_SET) {
      sorts.push(SORT_BY_ENCOUNTER_SET);
    }
    return sorts;
  }

  render() {
    const {
      componentId,
      selectedSort,
    } = this.props;

    const sorts = this.sorts();
    return (
      <DialogPicker
        componentId={componentId}
        options={map(sorts, CardSortDialog.sortToCopy)}
        onSelectionChanged={this._onSortChanged}
        header={t`Sort by`}
        selectedOption={CardSortDialog.sortToCopy(selectedSort)}
      />
    );
  }
}
