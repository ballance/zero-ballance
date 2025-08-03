import UIKit
import React

@main
class AppDelegate: UIResponder, UIApplicationDelegate {
  
  var window: UIWindow?
  var bridge: RCTBridge!

  func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    
    let jsCodeLocation: URL
#if DEBUG
    jsCodeLocation = URL(string: "http://localhost:8081/index.bundle?platform=ios")!
#else
    jsCodeLocation = Bundle.main.url(forResource: "main", withExtension: "jsbundle")!
#endif
    
    bridge = RCTBridge(bundleURL: jsCodeLocation, moduleProvider: nil, launchOptions: launchOptions)
    
    let rootView = RCTRootView(bridge: bridge!, moduleName: "ZeroBallanceApp", initialProperties: nil)
    
    window = UIWindow(frame: UIScreen.main.bounds)
    let rootViewController = UIViewController()
    rootViewController.view = rootView
    window?.rootViewController = rootViewController
    window?.makeKeyAndVisible()
    
    return true
  }
}
