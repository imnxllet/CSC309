
var infoBar = document.getElementById("infobar");//Canvas of Info Bar.
var canvas = document.getElementById("game");//Canvas of game view port.
var infocontext = infoBar.getContext("2d");
var context = canvas.getContext("2d");
var clickX, clickY;//Mouse coordinate when clicks.
var score=0;
var score1, score2;
var timeLeft = 10;
var pause = 0;
var gamelevel = 0;//level of game; 0 mean start page, 1 is level 1, etc.
//Food's position.
var foodArray = [[50, 300],[10, 450],[150, 400],[250, 450],[350, 300]];


infoBar.addEventListener("click", handlePauseClick);//infoBar react to clicked.


                        /*============================
                        ==============================
                          Start Page's functions.
                        ==============================
                        ============================*/
/*----------------------------
Set default highest score s 0.
------------------------------*/
if(!localStorage.getItem("highest1")){
  localStorage.setItem("highest1", 0)
}
if(!localStorage.getItem("highest2")){
  localStorage.setItem("highest2", 0)
}
/*-------------------------------
Show highest score in start page.
--------------------------------*/
function gethighest(level){
  var level;
  if(level == 1){
    document.getElementById("score").innerHTML = ("Highest Score: "+ localStorage.getItem("highest1"));
  }else{
    document.getElementById("score").innerHTML = ("Highest Score: "+ localStorage.getItem("highest2"));
  }
}
/*------------------------------------
      Onclick function of start button
      in start page.
--------------------------------------*/
function show(elementID) {
  // try to find the requested page and alert if it's not found
    var ele = document.getElementById(elementID);
    if (!ele) {
      alert("no such element");
      return;
    }
    // get all pages, loop through them and hide them
    var pages = document.getElementsByClassName('page');
    for(var i = 0; i < pages.length; i++) {
       pages[i].style.display = 'none';
    }
    // then show the requested page
    ele.style.display = 'block';

    //Enter level 1 page.
    gamelevel = 1;
    foodArray = [[50, 300],[10, 450],[150, 400],[250, 450],[350, 300]];
    produceLevelOneBug();
    timer();
    updatescore();
    return;
    }


                          /*============================
                          ==============================
                                 Infor bar section
                          (Game over Type1 : time's up)
                          ==============================
                          ============================*/

/*-------------------------------
  Function to pause the game.
--------------------------------*/

infocontext.fillStyle = 'black';
infocontext.fillRect(167,13, 67, 40);
drawPause(179,13);

function handlePauseClick(e){
  //Get mouse coordinate.
  var rect = infoBar.getBoundingClientRect();
  clickX = e.clientX - rect.left;
  clickY = e.clientY - rect.top;
  //To pause.
  if((pause == 0) && (167 <= clickX) && (clickX <= 234)
  && (13<= clickY) && (clickY <=53)){
    pause = 1;
    infocontext.globalAlpha = 1 ;
    infocontext.clearRect(167,13, 67, 40);
    infocontext.fillStyle = 'black';
    infocontext.fillRect(167,13, 67, 40);
    drawPlay(179,13);

  //To resume.
  }else if ((pause == 1) && (167 <= clickX) && (clickX <= 234)
  && (13<= clickY) && (clickY <=53)) {
    pause = 0;
    infocontext.globalAlpha = 1 ;
    //infocontext.fillStyle = 'white';
    infocontext.clearRect(167,13, 67, 40);

    infocontext.fillStyle = 'black';
    infocontext.fillRect(167,13, 67, 40);
    drawPause(179,13);

  }else{
    return;
  }
}

/*-------------------------------
  Function to set up the timer.
--------------------------------*/

function timer(){
  infocontext.globalAlpha = 1 ;
  infocontext.fillStyle = 'white';
  infocontext.clearRect(13, 13, 140, 40);

  infocontext.fillStyle = 'yellow';
  infocontext.fillRect(13, 13, 140, 40);
  infocontext.fillStyle = 'black';
  infocontext.font = "16pt sans-serif";

  infocontext.fillText("Time Left:" + timeLeft, 20, 40);
  if(pause == 0){//If game is not paused.

    if(timeLeft>0){//Time running.
        timeLeft = timeLeft - 1;
    }else{//Time's up.
      //Time's up in level 1.
      if(gamelevel == 1){
        gamelevel = 2;
        score1 = score;//save level1 score.
        score = 0; //clear up score.
        //Rebuild the food.
        foodArray = [[50, 300],[10, 450],[150, 400],[250, 450],[350, 300]];
        timeLeft = 10;

        //start level 2.
        produceLevelTwoBug();
        alert('Awesome!\nReady for Level 2?');
        timer();
        return;
      }else{//time's up in level 2.
        gamelevel = 0;
        score2 = score;
        score = 0;
        timeLeft = 10;
        sethighscore(score1, 1);
        sethighscore(score2, 2);
        alert('Game Over!\n' + 'Level 1 Score: ' + score1 + '\nLevel 2 Score: ' + score2);
        //Go back to start page.
        window.location.href = "a2.html";
         return;
      }
      return;
    }
    //Timer keep running.
    setTimeout(function(){requestAnimationFrame(timer);}, 1000);
  }else{
    requestAnimationFrame(timer);
  }
}


/*------------------------------------
  Function to set up the score board.
--------------------------------------*/

function updatescore(){
  infocontext.globalAlpha = 1 ;
  infocontext.fillStyle = 'white';
  infocontext.clearRect(247, 13, 140, 40);

  infocontext.fillStyle = 'red';
  infocontext.fillRect(247, 13, 140, 40);
  infocontext.fillStyle = 'black';
  infocontext.font = "16pt sans-serif";
  infocontext.fillText("Score:" + score, 260, 40);

  requestAnimationFrame(updatescore);
}


                      /*=====================
                      =======================
                      ====Main game Loop=====
                      =======================
                      ========================*/

/*------------------------------------
  Main loop for level 1 game.
  One bug will produced each loop.
--------------------------------------*/


function produceLevelOneBug(){
  if(pause ==0 && gamelevel == 1){
     //ind means food's index the food list.
      var startX, startY=0, targerX, targerY, ind;
      startX = (Math.random() * 390 + 10);

      targerX = findCloestFood(startX, startY)[0];
      targerY = findCloestFood(startX, startY)[1];
      ind = findCloestFood(startX, startY)[2];

      //Randomly select which bug to produce.
      if (Math.random() <= 0.3){
        BugtoFood(startX, startY, targerX, targerY, ind, 150, 'black',gamelevel);
      }else if (0.3 < Math.random() <= 0.6) {
        BugtoFood(startX, startY, targerX, targerY, ind, 75, 'red',gamelevel);
      }else{
        BugtoFood(startX, startY, targerX, targerY, ind, 60, 'orange',gamelevel);
      }

      setTimeout(function(){
            requestAnimationFrame(produceLevelOneBug);
      }, (Math.random() * 2000 + 1000));
    }else{
     requestAnimationFrame(produceLevelOneBug);
    }

  }


  /*------------------------------------
    Main loop for level 2 game.
    One bug will produced each loop.
  --------------------------------------*/
function produceLevelTwoBug(){
  if(pause ==0 & gamelevel == 2){
      var startX, startY=0, targerX, targerY, ind;
      startX = (Math.random() * 390 + 10);

      targerX = findCloestFood(startX, startY)[0];
      targerY = findCloestFood(startX, startY)[1];
      ind = findCloestFood(startX, startY)[2];


      if (Math.random() <= 0.3){
        BugtoFood(startX, startY, targerX, targerY, ind, 200, 'black',gamelevel);
      }else if (0.3 < Math.random() <= 0.6) {
        BugtoFood(startX, startY, targerX, targerY, ind, 100, 'red',gamelevel);
      }else{
        BugtoFood(startX, startY, targerX, targerY, ind, 80, 'orange',gamelevel);
      }

      setTimeout(function() {
            requestAnimationFrame(produceLevelTwoBug);
        }, (Math.random() * 2000 + 1000));
    }else{
     requestAnimationFrame(produceLevelTwoBug);
    }
}



                      /*==========================
                      =============================
                      ==Bug's Movement and kill.==
                      Game over Type2: Food's gone)
                      =============================
                      =============================*/

/*------------------------------------
  Function to control Bug's movement.
  Direct them to their target food.
--------------------------------------*/
function BugtoFood(x1, y1, x2, y2, ind, bugSpeed, color,level) {
  canvas.addEventListener("click", handleClick);
  var x, y, x1, y1, x2, y2,
      f = 0, //progress
      speed,// speed based on dist/steps
      dist,
      bugSpeed,//Required speed.
      steps = bugSpeed / 59.5,//Scale to make required speed.
      ind,
      killed = 0, color;
    /// if we are moving, return
    if (f !== 0) return;

    context.fillStyle = 'rgba(160, 160, 160,0.5)';
    context.fillRect(0,0,canvas.width, 400);
    x= x1;
    y = y1;

    //A bug is produced in the starting position.
    makeBug(x, y, color);
  /*--code to test speed;
      var testx2 = findCloestFood(x, y)[0];
      var testy2 = findCloestFood(x, y)[1];
      var testdx = testx2 - x1;
      var testdy = testy2 - y1;
      road = Math.abs(Math.sqrt(testdx * testdx + testdy * testdy));
      starttime = new Date();
      /// speed will be number of steps / distance
      //speed = steps / dist;
      /// move player --*/
      /*if (pause == 0){
        loop();
      }else{
        BugtoFood(x, y, x2, y2, ind, bugSpeed, color);
      }*/


    /*------------------------------------
      Main loop for bug keep moving!
    --------------------------------------*/
   loop();
    function loop() {
      if(pause==0 && gamelevel == level){
        /// clear current drawn bug.
        context.globalAlpha = 0.3 ;
        context.fillStyle = 'rgba(160, 160, 160,0.5)';
        drawFood();
        f = 0;
        //get updated food position.
        x2 = findCloestFood(x, y)[0];
        y2 = findCloestFood(x, y)[1];

        dx = x2 - x;
        dy = y2 - y;
        dist = Math.abs(Math.sqrt(dx * dx + dy * dy));
        speed = steps / dist;
        f += speed;

        x = x + (x2 - x) * f;
        y = y + (y2 - y) * f;

        //Haven't arrived to food.
        if (f < 1) {
              if (killed == 1){//Bug is killed.
                updateScore(color);
                drawFood();
                return;

              }else{//bug keeps going.
                if(pause == 0){//Game paused.
                context.fillRect(0,0,canvas.width, 500);
                drawFood();
                makeBug(x, y, color);
                requestAnimationFrame(loop);
                }else{
                    requestAnimationFrame(loop);
                }
             }
        }else{//Arrive the food. Kill FOOD.
            if((findCloestFood(x, y)[2]) == ind){
                foodArray.splice(ind, 1);
            }else{//Two bugs eat the food at the same time. Deal with it.
                nextX = findCloestFood(x, y)[0];
                nextY = findCloestFood(x, y)[1];
                ind = findCloestFood(x, y)[2];
                BugtoFood(x, y, nextX, nextY, ind, bugSpeed, color,level);
              }
            //If no more food left, game over.
            if (foodArray.length==0){
                context.clearRect(0, 0, canvas.width, canvas.height);

                //Game over in level 1.
                if(level == 1){
                  score1 = score;
                  score = 0;
                  sethighscore(score1, 1);
                  alert('Game Over!\n' + 'Level 1 Score: ' + score1);
                  window.location.href = "a2.html";

                }else{//Game over in level 2.
                  score2 = score;
                  score = 0;
                  sethighscore(score1, 1);
                  sethighscore(score2, 2);
                  alert('Game Over!\n' + 'Level 1 Score: ' + score1 + '\nLevel 2 Score: ' + score2);
                  window.location.href = "a2.html";
                }
            }
              //After eat the food, redirect the bug.
              drawFood();

              nextX = findCloestFood(x2, y2)[0];
              nextY = findCloestFood(x2, y2)[1];
              ind = findCloestFood(x2, y2)[2];
              BugtoFood(x2, y2, nextX, nextY, ind, bugSpeed, color,level);
              f = 0;//reset.
          }

      }else{//Game is paused.
        loopid = requestAnimationFrame(loop);
      }
  }


    /*------------------------------------
      Add point when bug is killed.
    --------------------------------------*/
    function updateScore(bugType){
      if(bugType == 'black'){
          score += 5;
      }else if (bugType == 'red') {
          score += 3;
      }else{
          score += 1;
      }
    }
    /*------------------------------------
      Handle clicks in the game view port.
    --------------------------------------*/
    function handleClick(e){
      if(pause ==0){
      var rect = canvas.getBoundingClientRect();

      clickX = e.clientX - rect.left;
      clickY = e.clientY - rect.top;

        var xDiff = x - clickX;
        var yDiff = y - clickY;
        var dist = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
        if(dist <= 40){
          killed = 1;
        }else{
           killed = 0;
        }
      }else{
        return;
      }
    }
}

                        /*=====================
                        =======================
                               Helpers
                        =======================
                        ========================*/


/*------------------------------------
      Find the closest food fod bug.
--------------------------------------*/

function findCloestFood(x, y){
  var distance=1000000, xDiff, yDiff, x ,y, ind=0, result;
  for(i=0; i<foodArray.length;i++){
    xDiff = x - foodArray[i][0];
    yDiff = y - foodArray[i][1];
    temp = Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    if (temp < distance){
      distance = temp;
      ind = i;
    }
  }
  result = [foodArray[ind][0], foodArray[ind][1], ind];
  return result;
}
/*------------------------------------
  Save the new higest score.
--------------------------------------*/

function sethighscore(score, level){
if (typeof(Storage) !== "undefined") {
 // Store
   var highest = localStorage.getItem("highest" + level);
   if(score > highest){
       localStorage.setItem("highest" + level, score);
   }else {
       return;
   }
}else {
 alert("Sorry, your browser does not support Web Storage...");
}
}

                      /*=====================
                      =======================
                      Functions to draw stuff.
                      =======================
                      ========================*/

/*------------------------------------
  Draw the food pieces.
--------------------------------------*/
function drawFood(){
  for(i=0;i<foodArray.length;i++){
      makeFood(foodArray[i][0], foodArray[i][1]);
  }
}

function makeFood(x, y){
  var base_image = new Image();
  base_image.src = './burger.png';
  base_image.onload = function(){
      context.drawImage(base_image, x, y, 60, 40);
  }
}

/*------------------------------------
      Draw the play & pause button.
--------------------------------------*/
function drawPlay(x, y){
  var base_image = new Image();
  base_image.src = './play.png';
  base_image.onload = function(){
  infocontext.drawImage(base_image, x, y, 40, 40);
  }
}
function drawPause(x, y){
  var base_image = new Image();
  base_image.src = './pause.png';
  base_image.onload = function(){
  infocontext.drawImage(base_image, x, y, 40, 40);
  }
}

/*------------------------------------
  Function to draw the bug on canvas.
--------------------------------------*/
 function makeBug(x, y, color){

       color1 = color;
       alpha = ".5";

       //http://www.w3schools.com/tags/canvas_globalalpha.asp
       context.globalAlpha = alpha;



       /*--  --*/
        context.beginPath();
       context.moveTo(x+5, y+21);
       context.bezierCurveTo(x, y+10, x, y+30, x+5, y+8);
       context.moveTo(x+5, y+21);
       context.bezierCurveTo(x+10, y+10, x+10, y+30, x+5, y+8);
       context.fillStyle = color;
       context.lineWidth = 1;
       context.strokeStyle = "#996633"
       context.stroke();
       context.fill();
       /*-- head --*/
       context.beginPath();
       context.arc(x+5, y+25, 7, 0, 4*Math.PI);
       context.moveTo(x+5, y+21);
       context.fillStyle = color;
       context.lineWidth = 1;
       context.strokeStyle = "#996633"
       context.stroke();
       context.fill();
       /*-- eyes --*/
       context.beginPath();
       context.arc(x+7, y+23, 1, 0, 4*Math.PI);
       context.moveTo(x+5, y+21);
       context.fillStyle = color1;
       context.lineWidth = 1;
       context.strokeStyle = "#996633"
       context.stroke();
       context.fill();
       context.beginPath();
       context.arc(x+2, y+23, 1, 0, 4*Math.PI);
       context.moveTo(x+5, y+21);
       context.fillStyle = color1;
       context.lineWidth = 1;
       context.strokeStyle = "#996633"
       context.stroke();
       context.fill();
       /*-- body --*/
       context.beginPath();
       context.arc(x+5, y+42, 7, 0, 1.0*Math.PI);
       context.moveTo(x+5, y+21);
       context.fillStyle = color;
       context.lineWidth = 1;
       context.strokeStyle = "#996633"
       context.stroke();
       context.fill();
       context.beginPath();
       context.rect(x-1, y+30,12,12);
       context.fillStyle = color;
       context.lineWidth = 1;
       context.strokeStyle = "#996633"
       context.stroke();
       context.fill();
       /*-- legs --*/
       context.beginPath();
       context.moveTo(x+11, y+32);
       context.lineTo(x+20, y+32);
       context.lineWidth = 3;
       context.stroke();
       context.beginPath();
       context.moveTo(x+11, y+38);
       context.lineTo(x+20, y+38);
       context.stroke();
       context.beginPath();
       context.moveTo(x-11, y+32);
       context.lineTo(x-2, y+32);
       context.stroke();
       context.beginPath();
       context.moveTo(x-11, y+38);
       context.lineTo(x-2, y+38);
       context.stroke();
       context.beginPath();
       context.moveTo(x+11, y+45);
       context.lineTo(x+16, y+50);
       context.stroke();
       context.beginPath();
       context.moveTo(x-2, y+45);
       context.lineTo(x-7, y+50);
       context.stroke();
   }
