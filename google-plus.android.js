var applicationModule = require("application");
var _AndroidApplication = applicationModule.android;
var RC_SIGN_IN = 9001

var GooglePlus = function(){

    var scopes = [ "profile", "email" ]

    // args = {scopes, shouldFetchBasicProfile, clientID}
    GooglePlus.initSdk = function(args) {

        var self = this
        var activity = _AndroidApplication.foregroundActivity
        // Configure sign-in to request the user's ID, email address, and basic
        // profile. ID and basic profile are included in DEFAULT_SIGN_IN.
        var gso = new com.google.android.gms.auth.api.signin.GoogleSignInOptions.Builder(com.google.android.gms.auth.api.signin.GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestId()
            .build();

        // Build a GoogleApiClient with access to the Google Sign-In API and the
        // options specified by gso.
        this._googleApiClient = new com.google.android.gms.common.api.GoogleApiClient.Builder(_AndroidApplication.context.getApplicationContext())
            .addOnConnectionFailedListener(new com.google.android.gms.common.api.GoogleApiClient.OnConnectionFailedListener({
                onConnectionFailed: function(){
                    if(self._connectionFailCallback)
                        self._connectionFailCallback()
                }
            }))
            .addApi(com.google.android.gms.auth.api.Auth.GOOGLE_SIGN_IN_API, gso)
            .build();
       
        console.log("## initSdk")
    }


    GooglePlus.registerCallback = function(successCallback, failCallback, connectionFailCallback){
        this._successCallback = successCallback
        this._failCallback = failCallback
        this._connectionFailCallback = connectionFailCallback

    }

    GooglePlus.handleSignInResult = function(result) {
        if (result.isSuccess()) {
            // Signed in successfully, show authenticated UI.
            var acct = result.getSignInAccount();
            this._successCallback(acct);

            if(this._profileInfoCallback){
                var result = {
                    userId: acct.getId(),                  // For client-side use only!
                    idToken: acct.getIdToken(), // Safe to send to the server
                    fullName: acct.getDisplayName(),
                    email: acct.getEmail(),                        
                }

                this._profileInfoCallback(result)                
            }


        } else {
            // Signed out, show unauthenticated UI.
            this._failCallback('logIn');
        }
    }


    GooglePlus.disconnect = function(callback){

        var resultCallback = new com.google.android.gms.common.api.ResultCallback({             
            onResult: function(status) {
                if(callback)
                    callback()
            }
        })

        com.google.android.gms.auth.api.Auth.GoogleSignInApi.revokeAccess(this._googleApiClient).setResultCallback(resultCallback)
    }

    GooglePlus.logOut = function(callback){

        var resultCallback = new com.google.android.gms.common.api.ResultCallback({             
            onResult: function(status) {
                if(callback)
                    callback()
            }
        })
        
        com.google.android.gms.auth.api.Auth.GoogleSignInApi.signOut(this._googleApiClient).setResultCallback(resultCallback)            
    }

    GooglePlus.logIn = function(profileInfoCallback){

        this._profileInfoCallback = profileInfoCallback

        var signInIntent = com.google.android.gms.auth.api.Auth.GoogleSignInApi.getSignInIntent(this._googleApiClient);
        var previousResult = _AndroidApplication.onActivityResult;
        var self = this
        _AndroidApplication.onActivityResult = function (requestCode, resultCode, data) {
         
            _AndroidApplication.onActivityResult = previousResult;
         
            if (requestCode === RC_SIGN_IN && resultCode === android.app.Activity.RESULT_OK) {
                var result = com.google.android.gms.auth.api.Auth.GoogleSignInApi.getSignInResultFromIntent(data);
                self.handleSignInResult(result);
            }else{
                self._failCallback()
            }
         }

        var act = _AndroidApplication.foregroundActivity || _AndroidApplication.startActivity;
        act.startActivityForResult(signInIntent, RC_SIGN_IN); 
    }

    GooglePlus.isLoggedIn = function(){
        var opr = com.google.android.gms.auth.api.Auth.GoogleSignInApi.silentSignIn(this._googleApiClient);
        return opr.isDone()
    }

    GooglePlus.share = function(){
        //contentURL, contentTitle, imageURL, contentDescription

        var activity = _AndroidApplication.foregroundActivity
        var builder = new com.google.android.gms.plus.PlusShare.Builder(activity)
        
        if(params.imageURL){    
            var imageUri

            if(params.imageURL.substring(0, 'http'.length) == 'http') // remote not work!!
                imageUri = android.net.Uri.parse(params.imageURL)
            else // local file
                imageUri = android.net.Uri.fromFile(new java.io.File(params.imageURL))

            //builder.setType("image/*")
            builder.setStream(imageUri)        

        }else{
        }
        
        builder.setType("text/plain")

        //if(params.contentDescription)    
        builder.setText(params.contentDescription + " " + params.contentURL)


        //if(params.contentURL)
        //    builder.setContentUrl(android.net.Uri.parse(params.contentURL))

        var intent = builder.getIntent()

        /*
        var intent = new com.google.android.gms.plus.PlusShare.Builder(activity)
                .setText("Hello Android!")
                .setType("image/png")
                .setContentDeepLinkId("testID",
                        "Test Title",
                        "Test Description",
                        android.net.Uri.parse("https://developers.google.com/+/images/interactive-post-android.png"))
                .getIntent()
        */

        if (intent.resolveActivity(_AndroidApplication.context.getPackageManager()) != null) {
            var previousResult = _AndroidApplication.onActivityResult;
            _AndroidApplication.onActivityResult = function (requestCode, resultCode, data) {            
                _AndroidApplication.onActivityResult = previousResult;
            }
            _AndroidApplication.currentContext.startActivityForResult(intent, 0)
        }else{
            var browserIntent = new android.content.Intent(android.content.Intent.ACTION_VIEW, android.net.Uri.parse("market://details?id=com.google.android.apps.plus"));        
            _AndroidApplication.currentContext.startActivity(browserIntent);                
        }        
    }    

    return GooglePlus
}

exports.GooglePlus = GooglePlus