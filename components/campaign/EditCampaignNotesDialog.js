import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
} from 'react-native';

import EditNameDialog from '../core/EditNameDialog';
import EditCampaignNotesComponent from './EditCampaignNotesComponent';

export default class EditCampaignNotesDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    updateCampaignNotes: PropTypes.func.isRequired,
    campaignNotes: PropTypes.object,
    investigators: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      campaignNotes: Object.assign({}, props.campaignNotes),
      viewRef: null,
      dialogVisible: false,
      dialogParams: {
        title: 'Placeholder',
        text: '',
      },
    };

    props.navigator.setButtons({
      rightButtons: [
        {
          title: 'Save',
          id: 'save',
          showAsAction: 'ifRoom',
        },
      ],
    });
    props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this._showDialog = this.showDialog.bind(this);
    this._toggleDialog = this.toggleDialog.bind(this);
    this._captureViewRef = this.captureViewRef.bind(this);
    this._updateCampaignNotes = this.updateCampaignNotes.bind(this);
  }

  onNavigatorEvent(event) {
    if (event.type === 'NavBarButtonPress') {
      if (event.id === 'save') {
        this.props.updateCampaignNotes(this.state.campaignNotes);
        this.props.navigator.pop();
      }
    }
  }

  captureViewRef(ref) {
    this.setState({
      viewRef: ref,
    });
  }

  toggleDialog() {
    this.setState({
      dialogVisible: false,
    });
  }

  showDialog(title, text, onChange) {
    this.setState({
      dialogVisible: true,
      dialogParams: {
        title,
        text,
        onChange,
      },
    });
  }

  updateCampaignNotes(campaignNotes) {
    this.setState({
      campaignNotes,
    });
  }

  renderDialog() {
    const {
      dialogVisible,
      viewRef,
      dialogParams: {
        title,
        text,
        onChange,
      },
    } = this.state;
    if (!viewRef) {
      return null;
    }

    return (
      <EditNameDialog
        visible={dialogVisible}
        viewRef={viewRef}
        title={title}
        name={text}
        onNameChange={onChange}
        toggleVisible={this._toggleDialog}
      />
    );
  }

  render() {
    const {
      investigators,
    } = this.props;
    const {
      campaignNotes,
    } = this.state;
    return (
      <View>
        <View ref={this._captureViewRef}>
          <EditCampaignNotesComponent
            campaignNotes={campaignNotes}
            investigators={investigators}
            updateCampaignNotes={this._updateCampaignNotes}
            showDialog={this._showDialog}
          />
        </View>
        { this.renderDialog() }
      </View>
    );
  }
}
