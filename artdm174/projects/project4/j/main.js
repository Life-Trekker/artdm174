/*
Author: Josh T
File Name: main.js for Project 4
*/

//run this js code after the DOM has finished loading
document.addEventListener('DOMContentLoaded', init);

function getValue() {
    // Get the input element by its ID
    let inputField = document.getElementById("searchBox");

    // Get the value of the input field
    let value = inputField.value;

    storeNameInHistory(value);

    return value.toLowerCase();
}


function init()
{

    const searchBtn = document.getElementById("searchButton");
    searchBtn.addEventListener("click",  async () => { displayInfo( await search(getValue()) ) } );

    const randomBtn = document.getElementById("randomButton");
    randomBtn.addEventListener("click",  async () => { displayInfo( await getPersonByID( Math.floor( Math.random() * 82 ) + 1 ) ) } );

    updatePastSearches();

}

async function search(userInput)
{
    const container = document.getElementById("searchResults");

    container.innerHTML = "<h2>SEARCHING...</h2>";

    let foundPeople = await getPersonByName(userInput);


    console.log(foundPeople);

    if(foundPeople === null && userInput.includes(" ") === true)
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
        return foundPeople;
    }


}

async function displayInfo(foundPeople)
{

    console.log("Displaying Info");

    const container = document.getElementById("searchResults");

    if(foundPeople.length === 0)
    {
        container.innerHTML = "<h2>We weren't able to find what you wanted.</h2>";
    }
    else
    {
        container.innerHTML = "<h2>LOADING...</h2>";

        let html = "";

        if(foundPeople[0].name.charAt(foundPeople[0].name.length - 1) != '~')
        {
            html += "<h2>We couldn't find exactly what you wanted.  Did you mean:</h2>";
        }
        else
        {
            foundPeople[0].name = foundPeople[0].name.slice(0, foundPeople[0].name.length - 1);
        }

        for(let i = 0; i < foundPeople.length; i++)
        {
            html += "<div id=searchContent>" + "<h2>" + foundPeople[i].name + "</h2>";
            html += "<h3> <b>Birth Year:</b> " + foundPeople[i].birth_year + "</h3>";
            html += "<h3> <b>Gender:</b> " + foundPeople[i].gender + "</h3>";
            html += "<h3> <b>Height:</b> " + foundPeople[i].height + "</h3>";
            html += "<h3> <b>Hair Color:</b> " + foundPeople[i].hair_color + "</h3>";
            html += "<h3> <b>Eye Color:</b> " + foundPeople[i].eye_color + "</h3>";
            html += "<h3> <b>Skin Color:</b> " + foundPeople[i].skin_color + "</h3>";
            html += "<h3 id=planetInfo> <b>Homeworld:</b> " + await getHomeworld(foundPeople[i].homeworld) + "</h3>";
            html += "<div id=filmInfo> <h3> <b>Has Appeared In:</b> </h3>" + await getListOfFilms(foundPeople[i].films) + "</div>";
            html += "</div>";
        }


        container.innerHTML = html;
    }



}


async function getPersonByName(value)
{
    //fetch the information in the houses.json file
    let starWarsData = await fetch("https://swapi.dev/api/people/?search=" + value);

    //store that response as json
    let response = await starWarsData.json();

    console.log(await response);
    
    //try to run the following code
    try
    {

        if(response.results.length === 1 && response.results[0].name.toLowerCase() === value)
        {
            response.results[0].name += "~";
        }

        return response.results;



    }
    //this only runs if there is an error during the above process
    catch
    {
        err => console.log("Oops!", err);
    }

}

async function getPersonByID(id)
{
    //fetch the information in the houses.json file
    let starWarsData = await fetch("https://swapi.dev/api/people/" + id);

    //store that response as json
    let response = await starWarsData.json();

    console.log(await response);
    
    //try to run the following code
    try
    {
        storeNameInHistory(response.name);

        return [response];


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

function updatePastSearches()
{

    if(sessionStorage.pastSearches)
    {
        const pastSearchesSelectBox = document.getElementById("pastSearches");

        const pastNames = sessionStorage.pastSearches.split(";;");
    
        let HTML = "";
            
        for(let i = 0; i < pastNames.length - 1; i++)
        {
            HTML += "<option id=pastName" + i + ">" + pastNames[i] + "</option>";
    
        }

        HTML += "<option id=clearPastSearches>Clear Search History</option>";

        pastSearchesSelectBox.innerHTML = HTML;

        for(let i = 0; i < pastNames.length - 1; i++)
        {

            document.getElementById("pastName" + i).addEventListener("click", () => { retrievePastSearch(pastNames[i]) } );
        
        }

        document.getElementById("clearPastSearches").addEventListener("click", () => { clearSearchHistory() } );

    }


}


async function retrievePastSearch(pastName)
{

    document.getElementById("searchBox").value = pastName;

    displayInfo( await search(pastName.toLowerCase()) );
}

function clearSearchHistory()
{
    const pastSearchesSelectBox = document.getElementById("pastSearches");

    pastSearchesSelectBox.innerHTML = "";

    sessionStorage.removeItem("pastSearches");

}

function storeNameInHistory(value)
{
    if (sessionStorage.pastSearches) {
        const pastNames = sessionStorage.pastSearches.split(";;");
        
        for(let i = 0; i < pastNames.length; i++)
        {
            if (value === pastNames[i])
            {
                return;
            }
        }

        sessionStorage.pastSearches += value + ";;";
        updatePastSearches();
    } 
    else {
        sessionStorage.pastSearches = value + ";;";
        updatePastSearches();
    }
}