import ExpoModulesCore
import Firebase
import GoogleSignIn

@main
class AppDelegate: EXAppDelegateWrapper, RNAppAuthAuthorizationFlowManager {

  // react-native-app-auth support
  weak var authorizationFlowManagerDelegate: RNAppAuthAuthorizationFlowManagerDelegate?
  var currentAuthorizationFlow: OIDAuthorizationFlowSession?

  // react-native-keyevent support
  var keyEvent: RNKeyEvent?

  override var keyCommands: [UIKeyCommand]? {
    var keys: [UIKeyCommand] = []

    if keyEvent == nil {
      keyEvent = RNKeyEvent()
    }

    if let keyEvent = keyEvent, keyEvent.isListening() {
      let namesArray = keyEvent.getKeys().components(separatedBy: ",")

      for name in namesArray {
        keys.append(UIKeyCommand(input: name, modifierFlags: [], action: #selector(keyInput(_:))))
        keys.append(UIKeyCommand(input: name, modifierFlags: .shift, action: #selector(keyInput(_:))))
      }
    }

    return keys
  }

  @objc func keyInput(_ sender: UIKeyCommand) {
    if let input = sender.input {
      keyEvent?.sendKeyEvent(input)
    }
  }

  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]? = nil
  ) -> Bool {
    self.moduleName = "arkhamcards"
    self.initialProps = [:]

    // Call super FIRST to initialize Expo/React Native
    let result = super.application(application, didFinishLaunchingWithOptions: launchOptions)

    // Then configure Firebase
    if FirebaseApp.app() == nil {
      FirebaseApp.configure()
    }

    return result
  }

  // Deep linking support for react-native-app-auth and Google Sign-In
  override func application(
    _ app: UIApplication,
    open url: URL,
    options: [UIApplication.OpenURLOptionsKey: Any] = [:]
  ) -> Bool {
    // Handle react-native-app-auth flow
    if let delegate = authorizationFlowManagerDelegate,
       delegate.resumeExternalUserAgentFlow(with: url) {
      return true
    }

    // Handle Google Sign-In
    if GIDSignIn.sharedInstance.handle(url) {
      return true
    }

    // Handle React Native deep links
    return RCTLinkingManager.application(app, open: url, options: options)
  }

  override func sourceURL(for bridge: RCTBridge) -> URL? {
    return bundleURL()
  }

  func bundleURL() -> URL? {
    #if DEBUG
    return RCTBundleURLProvider.sharedSettings().jsBundleURL(forBundleRoot: "index")
    #else
    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
    #endif
  }
}
