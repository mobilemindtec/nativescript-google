"use strict";
var application = require("application");
var MyDelegate = (function (_super) {
    __extends(MyDelegate, _super);
    function MyDelegate() {
        _super.apply(this, arguments);
    }
    MyDelegate.prototype.applicationDidFinishLaunchingWithOptions = function (application, launchOptions) {
        try {
            var configureError = new interop.Reference();
            GGLContext.sharedInstance().configureWithError(configureError);
            
            var signIn = GIDSignIn.sharedInstance();            
            return true;
        }
        catch (error) {
            console.log(error);
        }
    };
    MyDelegate.prototype.applicationOpenURLSourceApplicationAnnotation = function (application, url, sourceApplication, annotation) {
        return GIDSignIn.sharedInstance().handleURLSourceApplicationAnnotation(url, sourceApplication, annotation);
    };
    MyDelegate.prototype.applicationDidBecomeActive = function (application) {
    };
    MyDelegate.prototype.applicationWillTerminate = function (application) {
        //Do something you want here
    };
    MyDelegate.prototype.applicationDidEnterBackground = function (application) {
        //Do something you want here
    };
    MyDelegate.ObjCProtocols = [UIApplicationDelegate];
    return MyDelegate;
}(UIResponder));
application.ios.delegate = MyDelegate;
application.start({ moduleName: "main-page" });
//# sourceMappingURL=app.ios.js.map
