

var observable = require("data/observable")
var GooglePlus = require("nativescript-google-plus").GooglePlus;
var fs = require("file-system");
var viewModel = new observable.fromObject({
	message: ""
})

var googleHandler
var googleApi

exports.loaded = function(args) {
    var page = args.object;
    page.bindingContext = viewModel;

    googleHandler = new GoogleHandler()
    googleHandler.init()
}

exports.onLogin = function(){

	googleHandler.login()
}

exports.onShare = function(){
	googleHandler.share()
}

exports.onSharePhoto = function(){
	googleHandler.sharePhoto()
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

	GoogleHandler.share = function(){
		
	}

	GoogleHandler.sharePhoto = function(){
		if(googleApi.isLoggedIn()){

			var documents = fs.knownFolders.currentApp();
			var path = fs.path.join(documents.path, "res/icon.png")

		}else{
			viewModel.set("message", "you not is loggedin")
		}
	}	

	GoogleHandler.loginCancelCallback = function(){
		viewModel.set("message", "action canceled by user")
	}

	GoogleHandler.loginFailCallback = function(error){
		viewModel.set("message",  "error: " + error)
	}


	return GoogleHandler
}
