# nativescript-google-plus

./demo - demo app

## Android

Read Google Login Documentation at https://developers.google.com/identity/sign-in/android/start-integrating

Atention!!!! Don't forget of add google-service.json at platforms/android app folder and update you android api, because gradle plugin
and dependencies use local libs

### Dependencies

```
buildscript {
    repositories {
        jcenter()
    }

    dependencies {
    	classpath 'com.android.tools.build:gradle:2.0.0-alpha3'
    	classpath 'com.google.gms:google-services:+'
    }
}
```

```
dependencies{
  compile "com.android.support:recyclerview-v7:+"
}
```

### Android configuration

Create a new entry at App_Resources/values/strings.xml with a api key value
```
<string name="nativescript_google_maps_api_key">your api key</string>
```
Change the AndroidManifest.xml to add in 

```
<application>
   <meta-data android:name="com.google.android.geo.API_KEY" android:value="@string/nativescript_google_maps_api_key"/>
</application>
```

## IOS

Read Google IOS Login Documentation https://developers.google.com/identity/sign-in/ios/start-integrating

Generate file GoogleService-Info.plist and add in App_Resources/iOS folder

#### Info.plist

Add and change with GoogleService-Info informations: {appurl}, {appreverseurl},{appbundleid}

```

<key>CLIENT_ID</key>
<string>{appurl}</string>
<key>EMAIL_ADDRESS</key>
<string>ricardo@mobilemind.com.br</string>

<key>REVERSED_CLIENT_ID</key>
<string>{appreverseurl}</string>

<key>CFBundleURLTypes</key>
<array>
	<dict>
		<key>CFBundleTypeRole</key>
		<string>Editor</string>
		<key>CFBundleURLSchemes</key>
		<array>
			<string>{appurl}</string>
		</array>
	</dict>
	<dict>
		<key>CFBundleTypeRole</key>
		<string>Editor</string>
		<key>CFBundleURLSchemes</key>
		<array>
			<string>{appbundleid}</string>
		</array>
	</dict>
</array>	

<key>LSApplicationQueriesSchemes</key>
<array>
	<string>{appurl}</string>
	<string>>{appbundleid}</string>
</array>

<key>LSRequiresIPhoneOS</key>
<true/>
<key>NSAppTransportSecurity</key>
<dict>
	<key>NSAllowsArbitraryLoads</key>
	<true/>
</dict>

```

### app.ios.js

```
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
```

## Use plugin

```
var GooglePlus = require("nativescript-google-plus").GooglePlus;

var googleHandler
var googleApi

exports.loaded = function(args) {
    var page = args.object;
    

    googleHandler = new GoogleHandler()
    googleHandler.init()
}

var GoogleHandler = function(){

	GoogleHandler.init = function(){
		if(!googleApi){
			googleApi = new GooglePlus()
			googleApi.initSdk()
			googleApi.registerCallback(this.loginSuccessCallback, this.loginCancelCallback, this.loginFailCallback)
		}
	}

	GoogleHandler.login = function(){	
		googleApi.logIn(this.profileInfoCallback)
	}

	GoogleHandler.profileInfoCallback = function(userProfie){
		viewModel.set("message", "Login success: " + JSON.stringify(userProfie))
	}

	GoogleHandler.loginSuccessCallback = function(){
		console.log("## login success")
	}
	
	GoogleHandler.loginCancelCallback = function(){
		viewModel.set("message", "action canceled by user")
	}

	GoogleHandler.loginFailCallback = function(error){
		viewModel.set("message",  "error: " + error)
	}

	return GoogleHandler
}

```
