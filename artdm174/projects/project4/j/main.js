/*
Author: Josh T
File Name: main.js for Lab 6
*/

//run this js code after the DOM has finished loading
document.addEventListener('DOMContentLoaded', init);

function getValue() {
    // Get the input element by its ID
    let inputField = document.getElementById("myInput");

    // Get the value of the input field
    let value = inputField.value;

    // Display the value in an alert
    console.log("Input value: " + value);

    return value;
}


function init()
{

    const searchBtn = document.getElementById("searchButton");
    searchBtn.addEventListener("click",  search);

}

async function search()
{
    const container = document.getElementById("searchResults");

    const userInput = getValue();
    let foundPerson = null;



    for(let i = 1; i < 10; i++)
    {
        foundPerson = await searchPage(i, userInput);

        if(foundPerson != null)
        {
            console.log("We break");
            break;
        }
        else
        {
            console.log(userInput + " not found in page " + i);
        }
    }

    console.log(foundPerson);

    let html = "<h1>" + await foundPerson.name + "</h1>";
    html += "<h2> <b>Birth Year:</b> " + await foundPerson.birth_year + "</h2>";
    html += "<h2> <b>Gender:</b> " + await foundPerson.gender + "</h2>";
    html += "<h2> <b>Height:</b> " + await foundPerson.height + "</h2>";
    html += "<h2> <b>Hair Color:</b> " + await foundPerson.hair_color + "</h2>";
    html += "<h2> <b>Eye Color:</b> " + await foundPerson.eye_color + "</h2>";
    html += "<h2> <b>Eye Color:</b> " + await foundPerson.eye_color + "</h2>";

    container.innerHTML = html;



}

async function searchPage(pageNumber, value)
{
    //fetch the information in the houses.json file
    let starWarsData = await fetch("https://swapi.dev/api/people/?page=" + pageNumber);

    //store that response as json
    let response = await starWarsData.json();

    console.log(await response);
    
    //try to run the following code
    try
    {

        let person = 0;

       for(let i = 0; i < await response.results.length; i++)
        {
            person = await response.results[i];

            if(person.name === value)
            {
                return person;
            }
        
        
        };

        return null;

    }
    //this only runs if there is an error during the above process
    catch
    {
        err => console.log("Oops!", err);
    }

}