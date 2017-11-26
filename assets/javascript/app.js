
var trivQuest = [];
var questTimer;
var intervalTimer;
var nextTimer;
var timeVal = 10;
var score = {
    correct:0,
    incorrect:0,
    missed:0
}
var correct_answer;
getQuestions();

function getQuestions(){
    $(".sectChoices").show();
    var queryURL = "https://opentdb.com/api.php?amount=10&category=18&difficulty=hard&type=multiple";
    $.ajax({
      url: queryURL,
      method: 'GET'
    }).done(function(response) {
      trivQuest = response.results;
      getRanQuestion();
    })
    
}

function getRanQuestion(){
    var allAnswers = [];
    $('.form-check-input').prop('checked', false);
    var ranNum = Math.floor((Math.random() * trivQuest.length) + 0);
    allAnswers = trivQuest[ranNum].incorrect_answers;
    correct_answer = trivQuest[ranNum].correct_answer;
    allAnswers.push(trivQuest[ranNum].correct_answer);
    allAnswers.sort(function(a, b){return 0.5 - Math.random()});
    $.each(allAnswers, function(index, value){
        $('#lbl'+index).html('<input class="form-check-input" type="radio" name="exampleRadios" id="Rad'+index+'" value="'+value+'"> '+value);
    })
    $(".sectAnswer").html("");
    $(".sectQuestion").html(trivQuest[ranNum].question)
    decreaseTimer();
    
    trivQuest.splice(ranNum,1);
    $( ".form-check-input" ).on( "click", function() {
        console.log(this);
        $( ".form-check-input" ).attr("disabled", true);
            clearTimeout(questTimer);
            clearInterval(intervalTimer);
            var guess = this.value;
            checkChoice(guess); 
    });
    
    questionTimer(correct_answer);
    
}




function decreaseTimer(){
    if(intervalTimer){
        clearInterval(intervalTimer);
        intervalTimer = setInterval(timer, 1000);
    }else{
        intervalTimer = setInterval(timer, 1000);
    }
  }

function timer(){ 
    timeVal--;
    $(".timer").html(timeVal);
  }

function questionTimer(answer){
    if(questTimer){
         clearTimeout(questTimer);
         questTimer = setTimeout(showAnswer, 10000, answer);
    }else{
        questTimer = setTimeout(showAnswer, 10000, answer);
    }
    
   

}

function nextQuestion(){
    if(trivQuest.length>0){
        if(!nextTimer){
            nextTimer = setTimeout(getRanQuestion, 3000);
        }else{
            clearTimeout(nextTimer);
            nextTimer = setTimeout(getRanQuestion, 3000);
        }
        
        timeVal = 10;
    }else{
        $(".sectQuestion").html("Game Over");
        $(".sectAnswer").html("Game stats: <br> Correct: "+score.correct+
        "<br> Incorrect: "+score.incorrect+
        "<br> Missed: "+score.missed);
        $(".sectAnswer").append("<br><button type='button' id='newGame' class='btn btn-primary-outline'>New Game</button>");
        $(".sectChoices").hide();
        $( "#newGame" ).on( "click", function() {
            score = {
                correct:0,
                incorrect:0,
                missed:0
            };
            timeVal = 10;
            getQuestions();
        });
    }
}

function showAnswer(answer){
    score.missed++;
    clearInterval(intervalTimer);
    $(".timer").html("");
    $(".sectAnswer").html("Correct answer is: "+answer) 
    nextQuestion();
}



function checkChoice(guess){
        $(".timer").html("");
        if(guess == correct_answer){
            score.correct++;
            $(".sectAnswer").html("You are correct!")    
        }else{
            score.incorrect++;
            $(".sectAnswer").html("You are incorrect! <br> Correct answer is : "+correct_answer);
        }
        
        nextQuestion();
}








