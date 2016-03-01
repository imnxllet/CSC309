http = require('http');
fs = require('fs');
path = require('path');
url = require("url");
favs = require('./favs.json');

PORT = 3000;

/*-------------------------------------------------
--------------------Server-------------------------
---------------------------------------------------*/

http.createServer(function(request, response) {
	var uri = url.parse(request.url).pathname,
  filename = path.join(process.cwd(), uri);
  console.log('Request: ' + request.url);

  /*-------Serve index.html------*/
  if (request.url == '/') {
    if (fs.statSync(filename).isDirectory())
        filename += '/index.html';
        console.log(filename);
        
        fs.readFile(filename, "binary", function(err, file) {
          if(err) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(err + "\n");
            response.end();
            return;
          }

          response.writeHead(200);
          response.write(file, "binary");
          response.end();
        });
  
  /*-------Serve css file.------*/
  }else if (request.url == '/style.css'){
    if (fs.statSync(filename).isDirectory())
        filename += '/style.css';
        console.log(filename);

        fs.readFile(filename, "binary", function(err, file) {
          if(err) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(err + "\n");
            response.end();
            return;
          }

          response.writeHead(200);
          response.write(file, "binary");
          response.end();
        });
 
   /*-------Handle favicon request------*/
  }else if (request.url == '/favicon.ico') {
          response.writeHead(200, {'Content-Type': 'image/x-icon'} );
          response.end();
          console.log('favicon requested');
          //return;

  /*-------Serve javascript file.------*/
  }else if (request.url == '/script.js'){
    if (fs.statSync(filename).isDirectory())
      filename += '/script.js';
      console.log(filename);

            /*HTML file serving*/

      fs.readFile(filename, "binary", function(err, file) {
        if(err) {
          response.writeHead(500, {"Content-Type": "text/plain"});
          response.write(err + "\n");
          response.end();
          return;
        }

        response.writeHead(200);
        response.write(file, "binary");
        response.end();
      }); 
   /*-------Handle request asking for all tweets.------*/ 
  }else if (request.url == '/alltweet') {
    console.log('alltweet request receive');
    response.writeHead(200, {'Content-Type': 'text/plain'});
    var json = getAllTweets(favs);
    response.write(JSON.stringify(json));
    response.end();

   /*-------Handle request asking for all users.------*/ 
  }else if (request.url == '/alluser') {
    console.log('allusers request receive');
    response.writeHead(200, {'Content-Type': 'text/plain'});
    var json = getAllUsers(getTweetToUsers(favs), getReplyUsers(favs), getMentionedUsers( favs));
    response.write(JSON.stringify(json));
    response.end();
  /*-------Handle request asking for all links.------*/ 
  }else if (request.url == '/alllinks') {
    console.log('alllinks request receive');
    response.writeHead(200, {'Content-Type': 'text/plain'});
    var json = getURL(favs);
    response.write(JSON.stringify(json));
    response.end();
     /*-------Handle request for searching tweet.------*/ 
  }else if (request.url == '/searchtweet') {
    console.log('searchtweet request receive');
    //var tweetid = "";
    response.writeHead(200, {'Content-Type': 'text/plain'});
    request.on('data', function(chunk) {
    var tweetid = chunk.toString();
    response.writeHead(200, {'Content-Type': 'text/plain'});
    var json = getTweetByID(favs,tweetid);
    response.write(JSON.stringify(json));
    response.end()
    });
     /*-------Handle request for searching user.------*/ 
  }else if (request.url == '/searchuser') {
    console.log('searchuser request receive');
    //var tweetid = "";
    response.writeHead(200, {'Content-Type': 'text/plain'});
    request.on('data', function(chunk) {
    var username = chunk.toString();
    response.writeHead(200, {'Content-Type': 'text/plain'});
    var json = getUserByName(favs,username);
    response.write(JSON.stringify(json));
    response.end()
    });
   /*-------Handle invald url.------*/ 
  } else {
    response.writeHead(500, {"Content-Type": "text/plain"});
    response.write("404 Not Found.");
    response.end();
    return;
  }
}).listen(PORT);


/*------------------------------------------------------
    Functions to extract information from json file.
    ---------------------------------------------------*/
/*Extract all tweet*/
function getAllTweets(jsonobject){
  var tweetArray = [];
  for(i=0;i<jsonobject.length;i++){
    var tweet = {};
    tweet.TweetID = jsonobject[i].id_str;
    tweet.TimeCreated = jsonobject[i].created_at;
    tweet.Content = jsonobject[i].text;
    tweetArray.push(tweet);
  }

  return tweetArray;
}

/*Handle replicate user*/
function checkUser(userList, user){
  for(i=0;i<userList.length;i++){
    if(user.UserID == userList[i].UserID){
      return;
    }
  }
  userList.push(user);
  return userList;

}
/*Combine all three kinds of users.*/
function getAllUsers(tweetuser, replyuser, mentionuser){
if(replyuser != []){
  for(i=0;i<replyuser.length;i++){
    tweetuser = checkUser(tweetuser, replyuser[i]);
  }
}

if(mentionuser != []){
  for(j=0;j<mentionuser.length;j++){
    tweetuser = checkUser(tweetuser, mentionuser[j]);
  }
} 
return tweetuser; 
}

/*Extract user who sent tweet.*/
function getTweetToUsers(jsonobject){
    var userArray = [];
  for(i=0;i<jsonobject.length;i++){
    var user = {};
    if(jsonobject[i].user.id_str != null){
      user.ScreenName = jsonobject[i].user.screen_name;
      user.UserID = jsonobject[i].user.id_str;
      userArray.push(user);
    }
  }

  return userArray;
}

/*Extract user which the tweet replied to.*/
function getReplyUsers(jsonobject){
  var userArray = [];
  for(i=0;i<jsonobject.length;i++){
    var user = {};
    if(jsonobject[i].in_reply_to_user_id_str != null){
      user.ScreenName = jsonobject[i].in_reply_to_screen_name;
      user.UserID = jsonobject[i].in_reply_to_user_id_str;
      userArray.push(user);
    }
  }
  return userArray;
}

/*Extract user which the tweet mentioned.*/
function getMentionedUsers(jsonobject){
      var userArray = [];
  for(i=0;i<jsonobject.length;i++){
    
    if(jsonobject[i].entities.user_mentions != []){

      for(j=0; j<jsonobject[i].entities.user_mentions.length;j++){
        var user = {};
        user.ScreenName = jsonobject[i].entities.user_mentions[j].screen_name;
        user.UserID = jsonobject[i].entities.user_mentions[j].id_str;
        userArray.push(user);
      }
    }
  }
  return userArray;
}

/*Extract all urls.*/
function getURL(jsonobject){
  var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/gi;
  var regex = new RegExp(expression);
  var url = [];
  for(i=0;i<jsonobject.length;i++){
    var urlobject = {};
    urlobject.TweetID = jsonobject[i].id_str;
    var jsstring = JSON.stringify(jsonobject[i]);
    urlobject.URLs = jsstring.match(regex);
    url.push(urlobject);
  }
  return url;
}

/*Search tweet given json and tweet id.*/
function getTweetByID(jsonobject, id){
  var alltweet = getAllTweets(jsonobject);
  for(i=0;i<alltweet.length;i++){
    if(alltweet[i].TweetID == id){
      return alltweet[i];
    }
  }
  return {};
}


/*Search tweet given json and user screen name.*/
function getUserByName(jsonobject, name){
  var allUser = getAllUsers(getTweetToUsers(jsonobject), getReplyUsers(jsonobject), getMentionedUsers(jsonobject));
  for(i=0;i<allUser.length;i++){
    if(allUser[i].ScreenName == name){
      return allUser[i];
    }
  }

  return {};
  
}

console.log('Server running at http://127.0.0.1:' + PORT + '/');
