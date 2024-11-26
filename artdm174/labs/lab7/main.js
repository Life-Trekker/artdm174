/*
Author: Josh T
File Name: main.js for Lab 7
*/

//run this js code after the DOM has finished loading
document.addEventListener('DOMContentLoaded', init);

var shouldResetScoreboard = false;

function init()
{
    const button = document.querySelector("#startBtn");
    button.addEventListener("click", () => { newRound(shouldResetScoreboard) } );

    const container = document.querySelector("#container");
    let HTML = "<h3>Welcome to</h3> <h1>Ultimate Rock-Paper-Scissors</h1>";
    HTML += "<h3>Here's the Rules:</h3>";
    HTML += "<p>Each round you'll be presented with a selection of 5 objects.<br>Choose one by clicking on it's image and your opponent will choose another.<br>Then, these objects will face off.<br>First player to win 3 rounds, wins the game.<br>Good Luck!</p>";
    container.innerHTML = HTML;


}


async function getOptions()
{
    //fetch the color data from this url
    const objects = await fetch("https://rps101.pythonanywhere.com/api/v1/objects/all");

    //store that response as json
    const response = await objects.json();

    //try to run the following code
    try 
    {
        const optionArray = [];

        for(let i = 0; i < 5; i++)
        {
            optionArray[i] = await response[ Math.floor(Math.random() * 100) ];

        }

        return optionArray;

    }
    //create an error that only runs if there is a problem with the process above
    catch
    {
        err => console.log("There is an error getting the object options for this round", err);
    }
}

async function getImages(objects)
{
    let result = [];
    let k;
    let image;
    let response;

    k = await fetch("code.json");
    response = await k.json();

    try
    {
        k = response.code;

    }
    catch
    {
        err => console.log("There is an error getting info from external json", err);
    }

    for(let i = 0; i < 5; i++)
    {

        if(objects[i] === "Platimum")
        {
            //fetch the color data from this url
            image = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/imageSearch/Silver+Metal"); 
        }
        else if(objects[i] === "Pit")
        {
            image = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/imageSearch/Chasm");
        }
        else if(objects[i] === "Quicksand")
        {
            image = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/imageSearch/Desert");
        }
        else if(objects[i] === "Whip")
        {
            image = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/imageSearch/Whip+Animal");
        }
        else if(objects[i] === "Death")
        {
            image = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/imageSearch/Skull");
        }
        else if(objects[i] === "Community")
        {
            image = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/imageSearch/City");
        }
        else if(objects[i] === "T.V.")
        {
            image = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/imageSearch/Tv");
        }
        else
        {

            //fetch the color data from this url
            image = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/imageSearch/" + objects[i]);
        }



        //store that response as json
        response = await image.json();

        //try to run the following code
        try 
        {
            console.log(response);
            
            if(response.totalHits < 20)
            {
                result[i] = response.hits[ Math.floor(Math.random() * response.totalHits) ].webformatURL;
            }
            else
            {
                result[i] = response.hits[ Math.floor(Math.random() * 20) ].webformatURL;
            }

        }
        //create an error that only runs if there is a problem with the process above
        catch
        {
            err => console.log("There is an error getting an image for " + objects[i], err);
        }

    }

    return result;
}


async function newRound(reset)
{
    const button = document.querySelector("#startBtn");
    button.style.display = "none";


    if(reset)
    {
        updateScores(0);
        shouldResetScoreboard = false;
    }

    const scoreboard = document.querySelector("#scoreboard");
    scoreboard.style.display = "flex";

    const objects = ["Book", "Grass", "Bird", "School", "Sword"];
    console.log(objects);

    const images = await getImages(objects);

    let HTML = "<h3>The Objects For This Round Are:</h3>";
    HTML += "<div id=optionGrid>";

    for(let i = 0; i < 5; i++)
    {
        HTML += "<div class=object>";
        HTML += "<p>" + objects[i] + "</p>";
        HTML += "<img id=option" + i + " src=" + images[i] + ">";
        HTML += "</div>";

    }

    HTML += "</div>"

    

    const container = document.querySelector("#container");
    container.innerHTML = HTML;

    const computerChoice = objects[Math.floor(Math.random() * 5)];

    for(let i = 0; i < 5; i++)
    {
        document.querySelector("#option" + i).addEventListener("click", () => { determineWinner(computerChoice, objects[i]) });
    }
            
}

async function determineWinner(computerChoice, userChoice)
{

    const container = document.querySelector("#container");
    let HTML = "<h3><i>Your opponent ";



    //fetch the color data from this url
    const matchResult = await fetch("https://rps101.pythonanywhere.com/api/v1/match?object_one=" + userChoice + "&object_two=" + computerChoice);

    //store that response as json
    const response = await matchResult.json();


    //try to run the following code
    try 
    {
        let result = 0;

        if(response.winner === computerChoice)
        {
            HTML += "chose " + computerChoice + "</i> </h3>";
            HTML += "<h3>" + response.winner + " " + response.outcome + " " + response.loser + "</h3>";
            HTML += "<h3>You Lost!</h3>";
            result = -1;
        }
        else if(response.winner === userChoice)
        {
            HTML += "chose " + computerChoice + "</i> </h3>";
            HTML += "<h3>" + response.winner + " " + response.outcome + " " + response.loser + "</h3>";
            HTML += "<h3>You Won!</h3>";
            result = 1;
        }
        else if(computerChoice === userChoice)
        {
            HTML += "also chose " + computerChoice + "</i> </h3>"
            HTML += "<h3>It's a Tie!</h3>";
        }
        else
        {
            HTML += "chose " + computerChoice + "</i> </h3>"
            HTML += computerChoice + " and " + userChoice + " are so different that they simply can't be compared";
            HTML += "<h3>It's a Tie!</h3>";
        }

        container.innerHTML = HTML;
        
        const button = document.querySelector("#startBtn");
        button.textContent = "Play Again?"
        button.style.display = "inline-block";

        if(result != 0)
        {
            updateScores(result);
        }


    }
    //create an error that only runs if there is a problem with the process above
    catch
    {
        err => console.log("There is an error getting the object options for this round", err);
    }
    
}

function updateScores(newValue)
{
    const userScore = document.querySelector("#userScore");
    const computerScore = document.querySelector("#computerScore");
    let newContent = 0;


    if(newValue < 0)
    {
        newContent = newValue * -1 + parseInt(computerScore.textContent);
        computerScore.textContent = newContent;

        console.log(newContent);

        if(newContent >= 3)
        {
            gameComplete(-1);
        }
    }
    else if(newValue > 0)
    {
        newContent = newValue + parseInt(userScore.textContent);
        userScore.textContent = newContent;

        console.log(newContent);

        if(newContent >= 3)
        {
            gameComplete(1);
        }
    }
    else
    {
        computerScore.textContent = "0";
        userScore.textContent = "0";
    }

}


function gameComplete(result)
{

    const container = document.querySelector("#container");

    if(result > 0)
    {
        container.innerHTML += "<h1>And You've Won the Game!</h1>";
    }
    else if(result < 0)
    {
        container.innerHTML += "<h1>And You've Lost the Game!</h1>";
    }

    const button = document.querySelector("#startBtn");
    button.textContent = "Wanna Start a New Game?";
    shouldResetScoreboard = true;
}

