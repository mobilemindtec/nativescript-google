var Application = require("@nativescript/core").Application
var RC_SIGN_IN = 9001

var GoogleSignInOptions = com.google.android.gms.auth.api.signin.GoogleSignInOptions
var GoogleSignIn = com.google.android.gms.auth.api.signin.GoogleSignIn
var GoogleSignInClient = com.google.android.gms.auth.api.signin.GoogleSignInClient
var Task = com.google.android.gms.tasks.Task
var OnCanceledListener = com.google.android.gms.tasks.OnCanceledListener
var OnCompleteListener = com.google.android.gms.tasks.OnCompleteListener
var OnFailureListener  = com.google.android.gms.tasks.OnFailureListener 


var Google = function(){

    var scopes = [ "profile", "email" ]

    // args = {scopes, shouldFetchBasicProfile, clientID}
    Google.initSdk = function(args) {

        var self = this
        var activity = Application.android.foregroundActivity || Application.android.startActivity;
        // Configure sign-in to request the user's ID, email address, and basic
        // profile. ID and basic profile are included in DEFAULT_SIGN_IN.
        var gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
            .requestEmail()
            .requestId()
            .build();

        // Build a GoogleApiClient with access to the Google Sign-In API and the
        // options specified by gso.
        this._googleApiClient = GoogleSignIn.getClient(Application.android.context, gso)
       
        console.log("## initSdk")
    }


    Google.registerCallback = function(successCallback, failCallback){
        this._successCallback = successCallback
        this._failCallback = failCallback
    }

    Google.handleSignInResult = function(task) {

        console.log("## handleSignInResult = " + task.isSuccessful())

        try{
             var account = task.getResult()

            // Signed in successfully, show authenticated UI.
            if(this._successCallback)
                this._successCallback(account);

            if(this._profileInfoCallback){
                var result = {
                    userId: account.getId(),                  // For client-side use only!
                    idToken: account.getIdToken(), // Safe to send to the server
                    fullName: account.getDisplayName(),
                    email: account.getEmail(),                        
                }

                this._profileInfoCallback(result)                
            }

        }catch(err){

            console.log("handleSignInResult error: " + err)

            if(this._failCallback)
                this._failCallback("Error: " + err);
        }

       
    }


    Google.logOut = function(callback){

        if(this._googleApiClient)
            this._googleApiClient.signOut() 
    }

    Google.logIn = function(profileInfoCallback, failCallback){

        this._profileInfoCallback = profileInfoCallback
        
        if(failCallback)
            this._failCallback = failCallback

        var signInIntent = this._googleApiClient.getSignInIntent();

        var act = Application.android.foregroundActivity || Application.android.startActivity;

        var self = this

        Application.android.on("activityResult", function(eventData) {

            Application.android.off("activityResult")

            if (eventData.requestCode === RC_SIGN_IN) {
                var task = GoogleSignIn.getSignedInAccountFromIntent(eventData.intent)

                task.addOnCanceledListener(new OnCanceledListener({
                    onCanceled: function(){
                        console.log("login cancelled")
                    }
                }))

                task.addOnFailureListener(new OnFailureListener({
                    onFailure: function(err){
                        console.log("google login error: " + err)
                        if(self._failCallback)
                            self._failCallback("Login error: " + err)
                    }
                }))

                task.addOnCompleteListener(new OnCompleteListener({
                    onComplete: function(task0){

                        if(task0.isCanceled()){
                            console.log("login cancelled")
                        }else{
                            self.handleSignInResult(task0);
                        }

                    }
                }))                
            }else{
                console.log("cannot handle activityResult code " + eventData.requestCode 
                        + ", expected is " + RC_SIGN_IN)
            }

        })


        
        act.startActivityForResult(signInIntent, RC_SIGN_IN); 
    }

    Google.isLoggedIn = function(){
        var account = GoogleSignIn.getLastSignedInAccount(this)
        return !!account
    }

       

    return Google
}

exports.Google = Google