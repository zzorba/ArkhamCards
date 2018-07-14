import React from 'react';
import PropTypes from 'prop-types';
import { keys, map, partition } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CampaignItem from './CampaignItem';
import Button from '../../core/Button';
import * as Actions from '../../../actions';
import { getPacksInCollection } from '../../../reducers';

const CAMPAIGNS = {
  core: 'Night of the Zealot',
  rtnotz: 'Return to the Night of the Zealot',
  dwl: 'The Dunwich Legacy',
  ptc: 'The Path To Carcosa',
  tfa: 'The Forgotten Age',
};

class SelectCampaignDialog extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    campaignChanged: PropTypes.func.isRequired,
    in_collection: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._onPress = this.onPress.bind(this);
    this._editCollection = this.editCollection.bind(this);
  }

  componentDidMount() {
    this.props.navigator.setTitle({
      title: 'Select Campaign',
    });
  }

  onPress(packCode, text) {
    const {
      campaignChanged,
      navigator,
    } = this.props;

    campaignChanged(packCode, text);
    navigator.pop();
  }

  editCollection() {
    this.props.navigator.push({
      screen: 'CollectionEdit',
    });
  }

  renderCampaign(packCode) {
    return (
      <CampaignItem
        key={packCode}
        packCode={packCode}
        onPress={this._onPress}
        text={packCode === 'custom' ? 'Custom' : CAMPAIGNS[packCode]}
      />
    );
  }

  render() {
    const {
      in_collection,
    } = this.props;

    const partitionedCampaigns = partition(
      keys(CAMPAIGNS),
      pack_code => in_collection[pack_code]);
    const myCampaigns = partitionedCampaigns[0];
    const otherCampaigns = partitionedCampaigns[1];

    return (
      <ScrollView style={styles.flex}>
        { myCampaigns.length > 0 && (
          <View style={styles.headerRow}>
            <Text style={styles.header}>
              My Campaigns
            </Text>
          </View>
        ) }
        { map(myCampaigns, pack_code => this.renderCampaign(pack_code)) }
        { this.renderCampaign('custom') }
        <View style={styles.button}>
          <Button onPress={this._editCollection} text="Edit Collection" />
        </View>
        { otherCampaigns.length > 0 && (
          <View style={styles.headerRow}>
            <Text style={styles.header}>
              Other Campaigns
            </Text>
          </View>
        ) }
        { map(otherCampaigns, pack_code => this.renderCampaign(pack_code)) }
      </ScrollView>
    );
  }
}

function mapStateToProps(state) {
  return {
    in_collection: getPacksInCollection(state),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectCampaignDialog);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    fontFamily: 'System',
    fontSize: 22,
    marginLeft: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    height: 50,
  },
  button: {
    marginTop: 8,
  },
});
