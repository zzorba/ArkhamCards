#import "AppDelegate.h"
#import <React/RCTRootView.h>
#import <React/RCTLinkingManager.h>
#import <React/RCTBundleURLProvider.h>

// Custom imports
#import <Firebase.h>
#import <GoogleSignIn/GoogleSignIn.h>
#import <RNKeyEvent.h>


@implementation AppDelegate

/*!
 * react-native-keyevent support
 */
RNKeyEvent *keyEvent = nil;

- (NSMutableArray<UIKeyCommand *> *)keyCommands {
  NSMutableArray *keys = [NSMutableArray new];

  if (keyEvent == nil) {
    keyEvent = [[RNKeyEvent alloc] init];
  }

  if ([keyEvent isListening]) {
    NSArray *namesArray = [[keyEvent getKeys] componentsSeparatedByString:@","];

    for (NSString* names in namesArray) {
      [keys addObject: [UIKeyCommand keyCommandWithInput:names modifierFlags:0 action:@selector(keyInput:)]];
      [keys addObject: [UIKeyCommand keyCommandWithInput:names modifierFlags:UIKeyModifierShift action:@selector(keyInput:)]];
    }
  }

  return keys;
}

- (void)keyInput:(UIKeyCommand *)sender {
  NSString *selected = sender.input;
  [keyEvent sendKeyEvent:selected];
}

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"arkhamcards";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  if ([FIRApp defaultApp] == nil) {
    [FIRApp configure];
  }

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// Remove the extraModulesForBridge method since we're not using RNN anymore

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  if ([self.authorizationFlowManagerDelegate resumeExternalUserAgentFlowWithURL:url]) {
    return YES;
  }
  return [GIDSignIn.sharedInstance handleURL:url] || [RCTLinkingManager application:application openURL:url options:options];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
    return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
