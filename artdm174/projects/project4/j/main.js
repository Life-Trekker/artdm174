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
    searchBtn.addEventListener("click",  async () => { displayInfo( await search(getValue()) ) } );

}

async function search(userInput)
{
    const container = document.getElementById("searchResults");
    container.innerHTML = "<h1>SEARCHING...</h1>";

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
    return foundPerson;

}

async function displayInfo(foundPerson)
{
    const container = document.getElementById("searchResults");



    let html = "<h1>" + foundPerson.name + "</h1>";
    html += "<h2> <b>Birth Year:</b> " + foundPerson.birth_year + "</h2>";
    html += "<h2> <b>Gender:</b> " + foundPerson.gender + "</h2>";
    html += "<h2> <b>Height:</b> " + foundPerson.height + "</h2>";
    html += "<h2> <b>Hair Color:</b> " + foundPerson.hair_color + "</h2>";
    html += "<h2> <b>Eye Color:</b> " + foundPerson.eye_color + "</h2>";
    html += "<h2> <b>Skin Color:</b> " + foundPerson.skin_color + "</h2>";
    html += "<h2> <b>Homeworld:</b> " + await getHomeworld(foundPerson.homeworld) + "</h2>";
    html += "<h2> <b>Has Appeared In:</b> </h2>" + await getListOfFilms(foundPerson.films);


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

async function getListOfFilms(filmLinks)
{

    let filmData;
    let response;
    let result = "<ul>";

    for(let i = 0; i < filmLinks.length; i++)
    {
        filmData = await fetch(filmLinks[i]);
        response = await filmData.json();

        try
        {
    
            result += "<li>Episode " + response.episode_id + " - " + response.title + "</li>";
    
            
    
        }
        //this only runs if there is an error during the above process
        catch
        {
            err => console.log("Oops!", err);
        }
    


    }

    return result + "</ul>";
}

async function getHomeworld(planetLink)
{

        const planetData = await fetch(planetLink);
        const response = await planetData.json();

        try
        {
    
            let result = response.name;

            if(response.climate != "unknown")
            {
                if(response.climate.charAt(0) === 'a' || response.climate.charAt(0) === 'e' || response.climate.charAt(0) === 'i' 
                || response.climate.charAt(0) === 'o' || response.climate.charAt(0) === 'u')
                {
                    result += " - an ";
                }
                else
                {
                    result += " - a ";
                }

                result += " " + response.climate;
            
                if(response.terrain != "unknown")
                {
                     result += ", " + response.terrain;
                }

                return result + " world";
            }
            else if (response.terrain != "unknown")
            {
                if(response.terrain.charAt(0) === 'a' || response.terrain.charAt(0) === 'e' || response.terrain.charAt(0) === 'i' 
                || response.terrain.charAt(0) === 'o' || response.terrain.charAt(0) === 'u')
                {
                    result += " - an ";
                }
                else
                {
                    result += " - a ";
                }

                result += response.terrain;

                return result + " world";
            }
            else
            {
                return result;
            }
            


    
            
    
        }
        //this only runs if there is an error during the above process
        catch
        {
            err => console.log("Oops!", err);
        }
    


}

