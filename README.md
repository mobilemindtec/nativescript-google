# nativescript-gplus-login

Read Google Login Documentation at https://developers.google.com/identity/sign-in/android/start-integrating

Atention!!!! Don't forget of add google-service.json at platforms/android app folder and update you android api, because gradle plugin
and dependencies use local libs

## Dependencies

Add in classpath 'com.google.gms:google-services:1.5.0' in buildScript dependencies
```
buildscript {
    repositories {
        jcenter()
    }

    dependencies {
        classpath "com.android.tools.build:gradle:1.3.1"
        classpath 'com.google.gms:google-services:1.5.0'
    }
}
```

Add in dependencies 

```
  // run tns install, add this line before compile
  compile "com.android.support:recyclerview-v7:$suppotVer"

  compile "com.google.android.gms:play-services-auth:8.3.0"
```

## Android configuration

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

## Use in app

```
var GplusLogin = require("../../modules/nativescript-gplus-login"); 

// callback

var gplusSuccessCallback = function(result) {  
		if (app.android){
  		alert("nome=" + result.getDisplayName() + ", email=" + result.getEmail() + ", id=" + result.getId())
  		console.log("IdToken="+result.getIdToken())
  	}else{

  	}
}

var gplusCancelCallback = function() {
    alert("Login was cancelled");
}
  
var gplusFailCallback = function() {
    alert("Unexpected error: Cannot get access token");
}

exports.signInGplus = function(){
	GplusLoginHandler.init();
	GplusLoginHandler.registerCallback(gplusSuccessCallback, gplusCancelCallback, gplusFailCallback)
	GplusLoginHandler.logIn();
}

```
