$(document).ready(function() {
  /*---------------------------
  On click functions for button
  -----------------------------*/

  $("#button0").on('click',function(){
    var instruction = "1) Run the server using command: node server.js <br/>";
    instruction += "2) Load the webpage using address http://http://127.0.0.1:3000/<br/>";
    instruction += "3) Use the buttons to display all favorite tweets, users, or links.<br/>";
    instruction += "4) Or you can look up a tweet or user by the tweet id or user screen name.<br/>";

    $("#display").html(instruction);


  });

  $("#button1").on('click',function(){
    $.ajax({
     url: 'http://127.0.0.1:3000/alltweet',
     type:'GET',
     dataType: 'json',
     success: function(data) {
         $("#display").html(jsontoString(data));
     },
     error: function(jqXHR, textStatus, errorThrown) {
         alert('error ' + textStatus + " " + errorThrown);
     }
    });
  });
  
  $("#button2").on('click',function(){
    $.ajax({
     url: 'http://127.0.0.1:3000/alluser',
     type:'GET',
     dataType: 'json',
     success: function(data) {
         $("#display").html(jsontoString(data));
     },
     error: function(jqXHR, textStatus, errorThrown) {
         alert('error ' + textStatus + " " + errorThrown);
     }
    });
  });
  
  $("#button3").on('click',function(){
    $.ajax({
     url: 'http://127.0.0.1:3000/alllinks',
     type:'GET',
     dataType: 'json',
     success: function(data) {
         $("#display").html(jsontoString(data));
     },
     error: function(jqXHR, textStatus, errorThrown) {
         alert('error ' + textStatus + " " + errorThrown);
     }
    });
  });

  $("#button4").on('click',function(){
    $.ajax({
     url: 'http://127.0.0.1:3000/searchtweet',
     type:'POST',
     data: $("#tweetid").val(),
     dataType: 'json',
     success: function(data) {
      if(JSON.stringify(data) == "{}"){
        $("#display").html("No Tweet Found!");
      }else{
        var new_data = [];
        new_data.push(data);
        $("#display").html(jsontoString(new_data));
     }},
     error: function(jqXHR, textStatus, errorThrown) {
         alert('error ' + textStatus + " " + errorThrown);
     }
    });
  }); 

  $("#button5").on('click',function(){
    $.ajax({
     url: 'http://127.0.0.1:3000/searchuser',
     type:'POST',
     data: $("#userid").val(),
     dataType: 'json',
     success: function(data) {
      if(JSON.stringify(data) == "{}"){
        $("#display").html("No User Found!");
      }else{
        var new_data = [];
        new_data.push(data);
        $("#display").html(jsontoString(new_data));
     }},
     error: function(jqXHR, textStatus, errorThrown) {
         alert('error ' + textStatus + " " + errorThrown);
     }
    });
  }); 
});

/*--------------------------------------------------
---------------Turn json object returned-------------
---------------by server to a better string-----------
---------------representation on html.----------------
-----------------------------------------------------*/
function jsontoString(json){
  result = "";
  for(i=0;i<json.length;i++){
    for(var attribute in json[i]){
      if(json[i][attribute].constructor == Array){
        result = result + "<property>" + attribute + "</property>";
        for(var index in json[i][attribute]){
          result = result + "<br/>"+ json[i][attribute][index];
        }
        result = result + "<br/>";

      }else{
        result = result + "<property>" + attribute + "</property>"+ "<br/>"+ json[i][attribute] + "<br/>";
      }
    }
    result = result + "<br/>" +"<hr/>"+"<br/>";
  }
  return result;
}
