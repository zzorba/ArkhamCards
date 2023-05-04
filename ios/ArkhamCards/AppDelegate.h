#import <RCTAppDelegate.h>
#import <UIKit/UIKit.h>
#import "RNAppAuthAuthorizationFlowManager.h"

@protocol OIDAuthorizationFlowSession;

@interface AppDelegate : RCTAppDelegate <UIApplicationDelegate, RNAppAuthAuthorizationFlowManager, RCTBridgeDelegate>
@property(nonatomic, weak)id<RNAppAuthAuthorizationFlowManagerDelegate>authorizationFlowManagerDelegate;
@property(nonatomic, strong, nullable) id<OIDAuthorizationFlowSession> currentAuthorizationFlow;

@end
