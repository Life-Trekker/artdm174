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

    value = value.toLowerCase();

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
    container.innerHTML = "<h2>SEARCHING...</h2>";

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

    if(foundPerson === null && userInput.includes(" ") === true)
    {
        const wordsWithinInput = userInput.split(" ");
        let newResults;

        for(let i = 0; i < wordsWithinInput.length; i++)
        {
            newResults = await search(wordsWithinInput[i]);

            console.log("newResults = " + newResults);

            if(newResults != null)
            {
                return newResults;
            }
        }

        return null;

    }
    else
    {
        return foundPerson;
    }


}

async function displayInfo(foundPerson)
{

    const container = document.getElementById("searchResults");

    if(foundPerson === null)
    {
        container.innerHTML = "<h2>We weren't able to find what you wanted.</h2>";
    }
    else
    {
        container.innerHTML = "<h2>LOADING...</h2>";

        let html = "";

        if(foundPerson.name.charAt(foundPerson.name.length - 1) === '~')
        {
            html += "<h2>We couldn't find exactly what you wanted.  Did you mean:</h2>";
            foundPerson.name = foundPerson.name.slice(0, foundPerson.name.length - 1);
        }

        html += "<div id=searchContent>" + "<h2>" + foundPerson.name + "</h2>";
        html += "<h3> <b>Birth Year:</b> " + foundPerson.birth_year + "</h3>";
        html += "<h3> <b>Gender:</b> " + foundPerson.gender + "</h3>";
        html += "<h3> <b>Height:</b> " + foundPerson.height + "</h3>";
        html += "<h3> <b>Hair Color:</b> " + foundPerson.hair_color + "</h3>";
        html += "<h3> <b>Eye Color:</b> " + foundPerson.eye_color + "</h3>";
        html += "<h3> <b>Skin Color:</b> " + foundPerson.skin_color + "</h3>";
        html += "<h3 id=planetInfo> <b>Homeworld:</b> " + await getHomeworld(foundPerson.homeworld) + "</h3>";
        html += "<div id=filmInfo> <h3> <b>Has Appeared In:</b> </h3>" + await getListOfFilms(foundPerson.films) + "</div>";


        container.innerHTML = html + "</div>";
    }



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
        let formattedName = "";

       for(let i = 0; i < await response.results.length; i++)
        {
            person = await response.results[i];

            formattedName = person.name.toLowerCase()

            if(formattedName === value)
            {
                return person;
            }
            else if (formattedName.includes(value))
            {
                person.name += "~";

                return person;
            }
            else if(formattedName.includes("-"))
            {
                formattedName = formattedName.replaceAll("-", "");

                if(formattedName === value)
                {
                    return person;
                }

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