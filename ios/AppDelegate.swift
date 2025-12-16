import UIKit
import React

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {

  var window: UIWindow?

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

    let rootView = RCTRootView(
      bundleURL: jsCodeLocation,
      moduleName: "colony_frontend",
      initialProperties: nil,
      launchOptions: launchOptions
    )

    let rootViewController = UIViewController()
    rootViewController.view = rootView

    window = UIWindow(frame: UIScreen.main.bounds)
    window?.rootViewController = rootViewController
    window?.makeKeyAndVisible()

    return true
  }
}
//
//  AppDelegate.swift
//  colony_frontend
//
//  Created by Ziggy on 29/11/2025.
//

