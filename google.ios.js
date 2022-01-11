var Application = require("@nativescript/core").Application

var Google = function(){

    var scopes = [ "profile", "email" ]

    // args = {scopes, shouldFetchBasicProfile, clientID}
    Google.initSdk = function(args) {

        args = args || {shouldFetchBasicProfile: true}

        var signIn = GIDSignIn.sharedInstance();                    
        signIn.shouldFetchBasicProfile = args.shouldFetchBasicProfile;
        signIn.scopes = args.scopes || scopes;

        if(args.kClientId)
            signIn.clientID = args.clientID;

        var delegate = this.createSignInDelegate();
        signIn.delegate = delegate;
        signIn.uiDelegate = delegate;

        console.log("## initSdk")
    }


    Google.registerCallback = function(successCallback, failCallback){
        this._successCallback = successCallback;
        this._failCallback = failCallback;
    }

    Google.disconnect = function(){
        GIDSignIn.sharedInstance().disconnect();
    }

    Google.logOut = function(){
        GIDSignIn.sharedInstance().signOut();
    }

    Google.logIn = function(profileInfoCallback){
        this._profileInfoCallback = profileInfoCallback                    
        GIDSignIn.sharedInstance().signIn();            
    }

    Google.isLoggedIn = function(){
        return GIDSignIn.sharedInstance().hasAuthInKeychain()
    }

    Google.createSignInDelegate = function(){

        var self = this
        var MySignInDelegate = (function (_super) {
            __extends(MySignInDelegate, _super);

            function MySignInDelegate() {
                _super.apply(this, arguments);
            }

            MySignInDelegate.prototype.signInDidSignInForUserWithError = function(signIn, user, error){
                if(error){
                    self._failCallback('logIn')
                }else{

                    try{
                        var user = {
                            userId: user.userID,                  // For client-side use only!
                            idToken: user.authentication.idToken, // Safe to send to the server
                            fullName: user.profile.name,
                            givenName: user.profile.givenName,
                            familyName: user.profile.familyName,
                            email: user.profile.email,                        
                        }

                        self._successCallback('logIn')

                        if(self._profileInfoCallback)
                            self._profileInfoCallback(user)
                        else
                            console.log("## set profileInfoCallback on login")
                    }catch(error){
                        this._failCallback(error)
                    }

                }
            }

            MySignInDelegate.prototype.signInDidDisconnectWithUserWithError = function(signIn, user, error){
                try{
                    if(error)
                        self._failCallback(error.localizedDescription)
                    else
                        self._successCallback('logOut')
                }catch(error){
                    this._failCallback(error)
                }
            }

            MySignInDelegate.prototype.signInWillDispatchError = function(signIn, error) {
                    
            }

            MySignInDelegate.prototype.signInPresentViewController = function (signIn, viewController){         
                var uiview = applicationModule.ios.rootController;
                uiview.presentViewControllerAnimatedCompletion(viewController, true, null);
            }

            MySignInDelegate.prototype.signInDismissViewController = function(signIn, viewController){ 
                viewController.dismissViewControllerAnimatedCompletion(true, null);
            }

            MySignInDelegate.ObjCProtocols = [GIDSignInDelegate, GIDSignInUIDelegate];

            return MySignInDelegate;

        }(NSObject));        
    
        return new MySignInDelegate()
    }


    return Google
}

exports.Google = Google