/*
Author: Josh T
File Name: main.js for Lab 7
*/

//run this js code after the DOM has finished loading
document.addEventListener('DOMContentLoaded', init);

//create a global variable to determine if the score board should reset when the newRound function is called
//in essence, this variable will cause newRound to start a new RPS game when it is set to true 
//and will cause it to start a new round if it is false
var shouldResetScoreboard = false;

//create a function that initializes the page once the DOM content loads
function init()
{
    //get the start button on the page
    const button = document.querySelector("#startBtn");

    //make is visible
    button.style.display = "inline-block";

    //once it is clicked, run the newRound function
    button.addEventListener("click", () => { newRound(shouldResetScoreboard) } );

    //get the container div that will hold the page content
    const container = document.querySelector("#container");

    //create a variable to hold the html that will go within the container

    //add the title and instructions to it
    let HTML = "<h3>Welcome to</h3> <h1>Ultimate Rock-Paper-Scissors</h1>";
    HTML += "<h3>Here's the Rules:</h3>";
    HTML += "<p>Each round you'll be presented with a selection of 5 objects.<br>Choose one by clicking on it's image and your opponent will choose another.<br>Then, these objects will face off.<br>First player to win 3 rounds, wins the game.<br>Good Luck!</p>";
    
    //set the html within that container
    container.innerHTML = HTML;


}

//create a function to start a new round of the RPS game
//this will also reset the scoreboard if the reset parameter is true
async function newRound(reset)
{

    //get the start button on the page
    const button = document.querySelector("#startBtn");

    //hide this button
    button.style.display = "none";

    //if we want to reset the scoreboard and start a new game
    if(reset)
    {
        //call the updateScores function with 0
        updateScores(0);

        //set the global variable to false so we don't continually reset the scoreboard after each round
        shouldResetScoreboard = false;
    }

    //get a reference to the scoreboard div
    const scoreboard = document.querySelector("#scoreboard");

    //show the scoreboard
    scoreboard.style.display = "flex";

    //call the getOptions function to get an array of 5 random objects from the RPS-101 API
    //store this array in a constant variable called objects
    const objects = await getOptions();

    //call the getImages function to get an array of 5 images from the Pixabay API which are based on the objects we just got
    //store this array in a constant variable called images
    const images = await getImages(objects);

    //create a variable to hold the html that will display on the page
    //add a title
    let HTML = "<h3>The Objects For This Round Are:</h3>";

    //and add a div to hold a grid of choices
    HTML += "<div id=optionGrid>";

    //for each object in the object array
    for(let i = 0; i < objects.length; i++)
    {
        //add a div with the class of object
        HTML += "<div class=object>";

        //add the name of the object
        HTML += "<p>" + objects[i] + "</p>";

        //add the image of that object
        //give this image a unique id based on which number option it is
        HTML += "<img id=option" + i + " src=" + images[i] + ">";

        //add a closing tag for this div
        HTML += "</div>";

    }

    //add a closing tag for the outer div
    HTML += "</div>"

    
    //get the container div on the page
    const container = document.querySelector("#container");

    //change it's inner html, displaying these choices on the page
    container.innerHTML = HTML;

    //have the computer choose a random object
    //store that choice in a constant variable
    const computerChoice = objects[Math.floor(Math.random() * 5)];


    //for each image
    for(let i = 0; i < objects.length; i++)
    {
        //when an image is clicked that means user has chosen that object

        //get a reference to that image and add an event listener so when that image is clicked, 
        //the determineWinner function is called with the computer's choice and the image that was just clicked
        document.querySelector("#option" + i).addEventListener("click", () => { determineWinner(computerChoice, objects[i]) });
    }
            
}


//create a function to get 5 random objects from the RPS101 API
async function getOptions()
{
    //fetch the an array of all the possible objects from this RPS101 url
    const objects = await fetch("https://rps101.pythonanywhere.com/api/v1/objects/all");

    //store that response as json
    const response = await objects.json();

    //try to run the following code
    try 
    {
        //make an array that will hold 5 objects
        let optionArray = [0, 0, 0, 0, 0];

        //for each spot in the array
        for(let i = 0; i < optionArray.length; i++)
        {
            //add the object at a random index in the list returned from the API
            optionArray[i] = await response[ Math.floor(Math.random() * 100) ];

        }

        //return that array
        return optionArray;

    }
    //create an error that only runs if there is a problem with the process above
    catch
    {
        err => console.log("There is an error getting the object options for this round", err);
    }
}

//create a function to get images from the Pixabay API for each object in an array
async function getImages(objects)
{
    //create an array to store the resulting images
    let result = [];

    //create a variable to store the data from the API
    let image;

    //create a variable to store the response as json
    let response;

    //for each object in the parameter array
    for(let i = 0; i < objects.length; i++)
    {
        //get an image from the Pixabay API
        //normally this will be done by just searching that object's name in the Pixabay API, 
        //but there are a few objects from the RPS101 API where this won't work well

        //if the object is Platimum
        if(objects[i] === "Platimum")
        {
            //looking up Platimum images won't yield any results, since Platimum is misspelled

            //instead fetch the data from searching Silver Metal
            image = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/imageSearch/Silver+Metal"); 
        }
        //if the object is Pit
        else if(objects[i] === "Pit")
        {
            //looking up Pit images will main yield pictures of Pitbulls

            //fetch the data from searching Chasm instead
            image = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/imageSearch/Chasm");
        }
        //if the object is Quicksand
        else if(objects[i] === "Quicksand")
        {
            //looking up Quicksand images will get a few results, but Desert gets even more

            //fetch the data from searching Desert instead
            image = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/imageSearch/Desert");
        }
        //if the object is Whip
        else if(objects[i] === "Whip")
        {
            //looking up Whip images will mainly get images of someone waving a garden hosee

            //fetch the data from Whip Animal instead
            image = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/imageSearch/Whip+Animal");
        }
        //if the object is Death
        else if(objects[i] === "Death")
        {
            //looking up Death images doesn't yield many good results, since Death is an abstract concept

            //fetch the data from searching Skull images instead
            image = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/imageSearch/Skull");
        }
        //if the object is Community
        else if(objects[i] === "Community")
        {
            //looking up Community images doesn't yield many good results, since again Community is an abstract concept

            //fetch the data from searching City images instead
            image = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/imageSearch/City");
        }
        //if the object is T.V.
        else if(objects[i] === "T.V.")
        {
            //looking up T.V. images gets a few good results, but Tv gets even more

            //fetch that data from searching Tv images instead
            image = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/imageSearch/Tv");
        }

        //if the object isn't a special case
        else
        {

            //fetch the data from searching images of that object
            image = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/imageSearch/" + objects[i]);
        }


        //store that response as json
        response = await image.json();

        //try to run the following code
        try 
        {
            //if we got less than 20 images from a given search
            if(response.totalHits < 20)
            {
                //choose a random image from that list and add it to the result array
                result[i] = response.hits[ Math.floor(Math.random() * response.totalHits) ].webformatURL;
            }
            //if we got 20 or more images from a search
            else
            {
                //choose a random image from the first 20 images in that list and add it to the result array
                result[i] = response.hits[ Math.floor(Math.random() * 20) ].webformatURL;
            }

        }
        //create an error that only runs if there is a problem with the process above
        catch
        {
            err => console.log("There is an error getting an image for " + objects[i], err);
        }

    }

    //return the result array
    return result;
}

//create a function that should determine the winner of the match between the computer's chosen object (stored in computerChoice)
//and the object the player chose (in userChoice)
async function determineWinner(computerChoice, userChoice)
{

    //get the container div on the page
    const container = document.querySelector("#container");

    //create a variable to hold the html that will be displayed on the page
    let HTML = "<h3><i>Your opponent ";



    //fetch the result data for a match between the computer's object and the user's object from the RPS API
    const matchResult = await fetch("https://rps101.pythonanywhere.com/api/v1/match?object_one=" + userChoice + "&object_two=" + computerChoice);

    //store that response as json
    const response = await matchResult.json();


    //try to run the following code
    try 
    {
        //create a variable that will store a different number based on the winner of the match
        let result = 0;

        //if the winning object is the computer's object
        if(response.winner === computerChoice)
        {
            //add the computer's choice to the page
            HTML += "chose " + computerChoice + "</i> </h3>";

            //add the outcome of the match
            HTML += "<h3>" + response.winner + " " + response.outcome + " " + response.loser + "</h3>";

            //add that the player lost this round
            HTML += "<h3>You Lost!</h3>";

            //set the result variable to some negative number
            result = -1;
        }
        //if the winning object is the player's object
        else if(response.winner === userChoice)
        {
            //add the computer's choice to the page
            HTML += "chose " + computerChoice + "</i> </h3>";

            //add the outcome of the match
            HTML += "<h3>" + response.winner + " " + response.outcome + " " + response.loser + "</h3>";

            //add that the player won this round
            HTML += "<h3>You Won!</h3>";

            //set the result variable to some positive number
            result = 1;
        }
        //if neither won because the computer and player chose the same objects,
        else if(computerChoice === userChoice)
        {
            //add that the computer chose the same object to the page
            HTML += "also chose " + computerChoice + "</i> </h3>";
            
            //add that this round is a tie
            HTML += "<h3>It's a Tie!</h3>";

            //leave the result variable at zero
        }
        //if neither won because the two objects can't be compared,
        else
        {
            //add the computer's choice to the page
            HTML += "chose " + computerChoice + "</i> </h3>";

            //add that these objects can't be compared
            HTML += computerChoice + " and " + userChoice + " are so different that they simply can't be compared";

            //add that this round is a tie
            HTML += "<h3>It's a Tie!</h3>";

            //leave the result variable at zero
        }

        //update the content in the container div
        container.innerHTML = HTML;
        
        //get the start button
        const button = document.querySelector("#startBtn");

        //change the button's text
        button.textContent = "Play Again?"

        //display it
        button.style.display = "inline-block";

        //if this round wasn't a tie
        if(result != 0)
        {
            //call the updateScores function to update the scoreboard
            updateScores(result);
        }


    }
    //create an error that only runs if there is a problem with the process above
    catch
    {
        err => console.log("There is an error getting the object options for this round", err);
    }
    
}


//create a function that will change the scoreboard based on who won the round
//if newValue is negative, the computer won
//if newValue is positive, the player won
//the absolute value of newValue is the amount the winner's score will increase by

//if newValue is zero, reset both scoreboards
function updateScores(newValue)
{
    //get the text that holds the player's score
    const userScore = document.querySelector("#userScore");

    //get the text that holds the computer's score
    const computerScore = document.querySelector("#computerScore");

    //create a variable to hold the new score
    let newContent = 0;

    //if newValue is negative, the computer won
    if(newValue < 0)
    {
        //convert the computer score text on the page to a number
        //increase it by the newValue passed into this function
        newContent = newValue * -1 + parseInt(computerScore.textContent);

        //change the computer's score on the scoreboard
        computerScore.textContent = newContent;

        //if the computer has won 3 or more rounds
        if(newContent >= 3)
        {
            //call the gameComplete function and let it know the computer has won the game
            gameComplete(-1);
        }
    }
    //if newValue is negative, the player won
    else if(newValue > 0)
    {
        //convert the player score text on the page to a number
        //increase it by the newValue passed into this function
        newContent = newValue + parseInt(userScore.textContent);

        //change the player's score on the scoreboard
        userScore.textContent = newContent;

        //if the player has won 3 or more rounds
        if(newContent >= 3)
        {
            //call the gameComplete function and let it know the player has won the game
            gameComplete(1);
        }
    }
    //if newValue is zero, reset both scores
    else
    {
        //set the computer's score and the player's score on the page to zero
        computerScore.textContent = "0";
        userScore.textContent = "0";
    }

}

//create a function that changes the page once someone has won the game
//result is a parameter that tells this function
function gameComplete(result)
{

    //get the cotainer div on the page
    const container = document.querySelector("#container");

    //if a positive number was passed into this function, the player has won this game
    if(result > 0)
    {
        //add a win title to the page
        container.innerHTML += "<h1>And You've Won the Game!</h1>";
    }
    //if a negative number was passed into this function, the player has lost this game
    else if(result < 0)
    {
        //add a lose title to the page
        container.innerHTML += "<h1>And You've Lost the Game!</h1>";
    }

    //get the start button
    const button = document.querySelector("#startBtn");

    //change it's text
    button.textContent = "Wanna Start a New Game?";

    //we should also reset the scoreboard when the button is clicked,
    //so change the global shouldResetScoreboard to true
    shouldResetScoreboard = true;
}

