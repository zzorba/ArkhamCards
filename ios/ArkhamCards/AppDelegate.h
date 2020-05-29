#import <UIKit/UIKit.h>
#import <React/RCTBridgeDelegate.h>
#import "RNAppAuthAuthorizationFlowManager.h"

@protocol OIDAuthorizationFlowSession;

@interface AppDelegate : UIResponder <UIApplicationDelegate, RNAppAuthAuthorizationFlowManager, RCTBridgeDelegate>
@property(nonatomic, weak)id<RNAppAuthAuthorizationFlowManagerDelegate>authorizationFlowManagerDelegate;
@property(nonatomic, strong, nullable) id<OIDAuthorizationFlowSession> currentAuthorizationFlow;

@property (nonatomic, strong) UIWindow *window;

@end
