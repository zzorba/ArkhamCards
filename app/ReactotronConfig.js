import Reactotron from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'


// then add it to the plugin list
const reactotron = Reactotron
  .configure({ name: 'ArkhamCards' })
  .useReactNative()
  .use(reactotronRedux()) //  <- here i am!
  .connect(); //Don't forget about me!

export default reactotron;
