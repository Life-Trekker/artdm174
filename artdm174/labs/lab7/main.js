/*
Author: Josh T
File Name: main.js for Lab 7
*/

//run this js code after the DOM has finished loading
document.addEventListener('DOMContentLoaded', init);

function init()
{
    const button = document.querySelector("#startBtn");
    button.addEventListener("click", newRound);

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
            image = await fetch("https://pixabay.com/api/?key=" + k + "&q=Silver+Metal&image_type=photo"); 
        }
        else if(objects[i] === "Pit")
        {
            image = await fetch("https://pixabay.com/api/?key=" + k + "&q=Chasm&image_type=photo");
        }
        else if(objects[i] === "Quicksand")
        {
            image = await fetch("https://pixabay.com/api/?key=" + k + "&q=Desert&image_type=photo");
        }
        else if(objects[i] === "Whip")
        {
            image = await fetch("https://pixabay.com/api/?key=" + k + "&q=Whip+Animal&image_type=photo");
        }
        else if(objects[i] === "Death")
        {
            image = await fetch("https://pixabay.com/api/?key=" + k + "&q=Skull&image_type=photo");
        }
        else if(objects[i] === "Community")
        {
            image = await fetch("https://pixabay.com/api/?key=" + k + "&q=City&image_type=photo");
        }
        else if(objects[i] === "T.V.")
        {
            image = await fetch("https://pixabay.com/api/?key=" + k + "&q=Tv&image_type=photo");
        }
        else
        {

            //fetch the color data from this url
            image = await fetch("https://pixabay.com/api/?key=" + k + "&q=" + objects[i] + "&image_type=photo");
        }



        //store that response as json
        response = await image.json();

        //try to run the following code
        try 
        {
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


async function newRound()
{

    const button = document.querySelector("#startBtn");
    button.style.display = "none";

    const objects = await getOptions();
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
    let HTML = "<h3>Your opponent ";



    //fetch the color data from this url
    const matchResult = await fetch("https://rps101.pythonanywhere.com/api/v1/match?object_one=" + userChoice + "&object_two=" + computerChoice);

    //store that response as json
    const response = await matchResult.json();


    //try to run the following code
    try 
    {
        if(response.winner === computerChoice)
        {
            HTML += "chose " + computerChoice + "</h3>";
            HTML += "<h3>" + response.winner + " " + response.outcome + " " + response.loser + "</h3>";
            HTML += "<h3>You Lost!</h3>";
        }
        else if(response.winner === userChoice)
        {
            HTML += "chose " + computerChoice + "</h3>";
            HTML += "<h3>" + response.winner + " " + response.outcome + " " + response.loser + "</h3>";
            HTML += "<h3>You Won!</h3>";
        }
        else if(computerChoice === userChoice)
        {
            HTML += "also chose " + computerChoice + "</h3>"
            HTML += "<h3>It's a Tie!</h3>";
        }
        else
        {
            HTML += "chose " + computerChoice + "</h3>"
            HTML += computerChoice + " and " + userChoice + " are so different that they simply cannot be compared";
            HTML += "<h3>It's a Tie!</h3>";
        }

        container.innerHTML = HTML;
        
        const button = document.querySelector("#startBtn");
        button.textContent = "Play Again?"
        button.style.display = "inline-block";


    }
    //create an error that only runs if there is a problem with the process above
    catch
    {
        err => console.log("There is an error getting the object options for this round", err);
    }
    
}

