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
}


async function getOptions()
{
    //fetch the color data from this url
    const color = await fetch("https://rps101.pythonanywhere.com/api/v1/objects/all");

    //store that response as json
    const response = await color.json();

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


async function newRound()
{


    const objects = await getOptions();

    console.log(objects);

    let HTML = "<h3>The Objects For This Round Are:</h3>";

    

    const container = document.querySelector("#container");
    container.innerHTML = HTML;
            
  



}