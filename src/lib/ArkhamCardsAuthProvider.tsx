import React from 'react';
import { EventEmitter } from 'events';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import ArkhamCardsAuthContext from './ArkhamCardsAuthContext';

interface Props {
  children: React.ReactNode;
}

let eventListener: EventEmitter | null = null;
let currentUser: FirebaseAuthTypes.User | undefined = undefined;
let currentUserLoading: boolean = true;

interface State {
  user?: FirebaseAuthTypes.User;
  loading: boolean;
}
export default class ArkhamCardsAuthProvider extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    if (eventListener === null) {
      // We only want to listen to this once, hence the singleton pattern.
      eventListener = new EventEmitter();
      const callback = (user: FirebaseAuthTypes.User | null) => {
        currentUserLoading = false;
        currentUser = user || undefined;
        eventListener?.emit('onAuthStateChanged', currentUser);
      };
      auth().onAuthStateChanged(callback);
    }
    eventListener.addListener('onAuthStateChanged', this._authUserChanged);
    this.state = {
      user: currentUser,
      loading: currentUserLoading,
    };
  }

  componentWillUnmount() {
    eventListener?.removeListener('onAuthStateChanged', this._authUserChanged);
  }

  _authUserChanged = (user?: FirebaseAuthTypes.User) => {
    this.setState({
      user,
      loading: false,
    });
  };

  render() {
    return (
      <ArkhamCardsAuthContext.Provider value={{ user: this.state.user, loading: this.state.loading }}>
        { this.props.children }
      </ArkhamCardsAuthContext.Provider>
    );
  }
}
