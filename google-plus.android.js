var applicationModule = require("application");
var _isInit = false;
var _AndroidApplication = applicationModule.android;
var _act;
var RC_SIGN_IN = 9001
var mGoogleApiClient;
var mFailCallback
var mConnectionFailCallback
var mSuccessCallback
var signInIntent 

function init() { 
    var activity = _AndroidApplication.foregroundActivity
    // Configure sign-in to request the user's ID, email address, and basic
    // profile. ID and basic profile are included in DEFAULT_SIGN_IN.
    var gso = new com.google.android.gms.auth.api.signin.GoogleSignInOptions.Builder(com.google.android.gms.auth.api.signin.GoogleSignInOptions.DEFAULT_SIGN_IN)
        .requestEmail()
        .requestId()
        .build();

    // Build a GoogleApiClient with access to the Google Sign-In API and the
    // options specified by gso.
    mGoogleApiClient = new com.google.android.gms.common.api.GoogleApiClient.Builder(_AndroidApplication.context.getApplicationContext())
        .addOnConnectionFailedListener(new com.google.android.gms.common.api.GoogleApiClient.OnConnectionFailedListener({
            onConnectionFailed: function(){
                if(mConnectionFailCallback)
                    mConnectionFailCallback()
            }
        }))
        .addApi(com.google.android.gms.auth.api.Auth.GOOGLE_SIGN_IN_API, gso)
        .build();

    signInIntent = com.google.android.gms.auth.api.Auth.GoogleSignInApi.getSignInIntent(mGoogleApiClient);
}

exports.init = init;

function registerCallback(successCallback, failCallback, connectionFailCallback){
    mSuccessCallback = successCallback
    mFailCallback = failCallback
    mConnectionFailCallback = connectionFailCallback
}

exports.registerCallback = registerCallback;


function handleSignInResult(result) {
    if (result.isSuccess()) {
        // Signed in successfully, show authenticated UI.
        var acct = result.getSignInAccount();
        mSuccessCallback(acct);
    } else {
        // Signed out, show unauthenticated UI.
        mFailCallback();
    }
}

function logIn() {

    var signInIntent = com.google.android.gms.auth.api.Auth.GoogleSignInApi.getSignInIntent(mGoogleApiClient);
     var previousResult = _AndroidApplication.onActivityResult;

      _AndroidApplication.onActivityResult = function (requestCode, resultCode, data) {
     
       _AndroidApplication.onActivityResult = previousResult;
     
        if (requestCode === RC_SIGN_IN && resultCode === android.app.Activity.RESULT_OK) {
            var result = com.google.android.gms.auth.api.Auth.GoogleSignInApi.getSignInResultFromIntent(data);
            handleSignInResult(result);
        }else{
            mFailCallback()
        }
     }

    _AndroidApplication.currentContext.startActivityForResult(signInIntent, RC_SIGN_IN); 

}
exports.logIn = logIn;
