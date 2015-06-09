var port = process.env.PORT || 8080;

module.exports={
/*
* This file contains the configurations information of Twitter login app.
* It consists of Twitter app information, database information.
*/

	"facebook_api_key" 		: 			"819814544764038",
	"facebook_api_secret"	:				"d8817a92f941ca5f80068dedd7c4a9f6",
	"callback_url"				:				"http://localhost:8080/auth/facebook/callback",
	// "callback_url"				:				"http://frozen-beach-1850.herokuapp.com/auth/facebook/callback",
	"use_database"				:				"false",
	"host"								:				"localhost",
	"username"						:				"root",
	"password"						:				"",
	"database"						:				""
}
