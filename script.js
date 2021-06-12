//global varaible
//equations
let questionAmount = 0;
let equationsArray = [];

//Game page
let firstNumber = 0 ;
let secondNumber = 0;
let equationObject ={};
let wrongFormat = [];

let playerGuessArray = [];
//scroll
let valueY=0;

//best score
let bestScoreArray = [];

//score
let timer;
let timePlayed = 0;
let bestTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0";

//First page
const startForm = document.getElementById("start-form");
const radioContainer = document.querySelectorAll(".radio-container");
const radioInputs = document.querySelectorAll("input");
const bestScores = document.querySelectorAll(".best-score-value");

const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countDownPage = document.getElementById("countdown-page");

//score page
const finalTimeEl = document.querySelector(".final-time");
const bestTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-button");


startForm.addEventListener('click',() => {
    radioContainer.forEach((radioEl) => {
        //console.log(radioEl);
        radioEl.classList.remove("selected-label");
        if(radioEl.children[1].checked){
            radioEl.classList.add("selected-label")
        }
    });
});

//get the value from selected radio buttons
function getRadioValue(){
    let redioValue;
    radioInputs.forEach((radioInput) => {
        if(radioInput.checked){
            radioValue = radioInput.value ;
        }
        
    });
    return radioValue;
}
//from that deside the amount of questions
function selectQuestionAmount(e){
    e.preventDefault();
    questionAmount = getRadioValue();
    //alert(questionAmount);
    console.log("Question amount value=",questionAmount);
    if(questionAmount){
        showCountDown();
    }
}
//getRadioValue();

//event listener
startForm.addEventListener('submit',selectQuestionAmount);

//Game pages:

const countdown = document.querySelector(".countdown");

function showCountDown(){
    countDownPage.hidden = false;
    splashPage.hidden = true;
    countDownStart();
    populateGamePage();
    // createEquations();
    setTimeout(showGamePage,4000);

}

//display 123 and Go
function countDownStart(){
    countdown.textContent = "3";
    setTimeout(() => {
        countdown.textContent = "2";
    },1000);
    setTimeout(() => {
        countdown.textContent = "1";
    },2000);
    setTimeout(() => {
        countdown.textContent = "Go!";
    },3000);
}

//random number upto max
function getRandomInt(max){
    return Math.floor(Math.random() * Math.floor(max));
}
//random equestion create correct / incorrect 
function createEquations(){
    //ranodm choose how many correct equations.
    const correctEquations = getRandomInt(questionAmount);
    const wrongEquations =questionAmount - correctEquations;

    //loop create equestions
    for(let i=0;i<correctEquations;i++){
        firstNumber = getRandomInt(9);
        secondNumber = getRandomInt(9);
        const equationValue = firstNumber * secondNumber;
        const equation = `${firstNumber} X ${secondNumber} = ${equationValue}`;
        equationObject ={value: equation, evaluated: 'true'};
        equationsArray.push(equationObject);

    }

    //loop create wrong equation and push into  array
    for(let i=0;i<wrongEquations;i++){
        firstNumber = getRandomInt(9);
        secondNumber = getRandomInt(9);
        const equationValue = firstNumber * secondNumber;
        wrongFormat[0] = `${firstNumber} X ${secondNumber+1} = ${equationValue}`;
        wrongFormat[1] = `${firstNumber+1} X ${secondNumber} = ${equationValue}`;
        wrongFormat[2] = `${firstNumber} X ${secondNumber+1} = ${equationValue+2}`;
        
        const formatChoice = getRandomInt(3);
        const equation = wrongFormat[formatChoice];
        equationObject ={value: equation, evaluated: 'false'};
        equationsArray.push(equationObject);
    }
    shuffleArray(equationsArray);
    //console.log("Equestion = ",equationsArray);
    //equationsToDOM();
}

function showGamePage(){
    gamePage.hidden = false;
    countDownPage.hidden = true;
}

const itemContainer = document.querySelector(".item-container");

function equationsToDOM(){
    equationsArray.forEach((equation) =>{
        const item = document.createElement("div");
        item.classList.add("item");

        //Equation Text
        const equationText = document.createElement("h1");
        equationText.textContent = equation.value;

        //append
        item.appendChild(equationText);
        itemContainer.appendChild(item);

    });
}

//dynamically added correct/incorrect equations..
function populateGamePage(){
    //Reset Dom,set Blank space above
    itemContainer.textContent = '';
    //spacer
    const topSpacer =document.createElement("div");
    topSpacer.classList.add("height-240");

    //selected items
    const selectedItem = document.createElement("div");
    selectedItem.classList.add("selected-item");

    //append
    itemContainer.append(topSpacer,selectedItem);
    createEquations();
    equationsToDOM();
 
    const bottomSpacer =document.createElement("div");
    bottomSpacer.classList.add("height-500");
    itemContainer.append(bottomSpacer);
}

function select(guess){
    //console.log("guess Array",playerGuessArray);
    valueY += 80;
    itemContainer.scroll(0, valueY);

    return guess ? playerGuessArray.push('true') : playerGuessArray.push('false');
}
//stop timer prcess result 
function checkTime(){
    //console.log(timePlayed);
    if(playerGuessArray.length == questionAmount){
        console.log("guess array",playerGuessArray)
        clearInterval(timer);
        //check for the wrong guess and add penalty time
        equationsArray.forEach((equation,index) => {
            if(equation.evaluated === playerGuessArray[index]){
                //no penalty
            }
            else{
                penaltyTime +=0.5;
            }
        });
        finalTime = timePlayed + penaltyTime;
        console.log("Time :",timePlayed);
        console.log("Penalty :",penaltyTime);
        console.log("finalTime :",finalTime);
        scoresToDOM();
    }
}

//add a tenth of a second to timeplayed
function addTime(){
    timePlayed += 0.1;
    checkTime();

}

//start the timer when game page is clicked
function startTimer(){
    timePlayed = 0;
    penaltyTime = 0;
    finalTime = 0 ;
    timer = setInterval(addTime,100);
    gamePage.removeEventListener('click',startTimer);
}

gamePage.addEventListener('click',startTimer);

function showScorePage(){
    setTimeout(() => {
        playAgainBtn.hidden =false;
    })
    gamePage.hidden = true;
    scorePage.hidden = false;
} 

function scoresToDOM(){
    
    finalTimeDisplay = finalTime.toFixed(1);
    bestTime = timePlayed.toFixed(1);
    penaltyTime = penaltyTime.toFixed(1);

    bestTimeEl.textContent = `base Time : ${bestTime}s`;
    penaltyTimeEl.textContent = `penalty : ${penaltyTime}s`;
    finalTimeEl.textContent = `${finalTimeDisplay}s`;
    
    updateBestScore();
    itemContainer.scrollTo({top:0, behavior:'instant'});
    showScorePage();
}


//reset game
function playAgain(){
    gamePage.addEventListener('click',startTimer);
    scorePage.hidden = true;
    splashPage.hidden =false ;
    equationsArray = [];
    playerGuessArray = [];
    valueY = 0;
    playAgainBtn.hidden = true;
}

function getSavedBestScores(){
    if(localStorage.getItem('bestScores')){
        bestScoreArray = JSON.parse(localStorage.bestScores);
    }
    else{
        bestScoreArray =[
            {questions:10, bestScore: finalTimeDisplay},
            {questions:25, bestScore: finalTimeDisplay},
            {questions:50, bestScore: finalTimeDisplay},
            {questions:100, bestScore: finalTimeDisplay}
        ];
        localStorage.setItem('bestScores',JSON.stringify(bestScoreArray));
    }
    bestScoreToDOM();
}
getSavedBestScores();

function bestScoreToDOM(){
    bestScores.forEach((bestScore,index)=>{
        const bestScoresEl = bestScore;
        bestScoresEl.textContent = `${bestScoreArray[index].bestScore}s`;
    });
}

//update the best score array
function updateBestScore(){
    //select correct best score to update
    bestScoreArray.forEach((score,index) => {
        if(questionAmount == score.questions){
            //return bast score as a number with one decimal
            const savedBestScore = Number(bestScoreArray[index].bestScore);
            
            //update new final score is less or replace zero
            if(savedBestScore ===0 || savedBestScore > finalTime){
               bestScoreArray[index].bestScore = finalTimeDisplay; 
            }
        }
    });
    //update Splash Page
    bestScoreToDOM();
    //saved to local storage
    localStorage.setItem('bestScores',JSON.stringify(bestScoreArray));
}






