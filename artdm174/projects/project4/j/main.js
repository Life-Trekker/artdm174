/*
Author: Josh T
File Name: main.js for Project 4
*/

//run this js code after the DOM has finished loading
document.addEventListener('DOMContentLoaded', init);



function init() {

    const searchBar = document.getElementById("searchBar");
    searchBar.style.display = "grid";

    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "<h2>The information for the character you searched will display here.<h2>" +
        "<p>All Star Wars data courtesay of <a href=https://swapi.dev/>SWAPI</a>.   Data is current up until Episode 3.  " +
        "Searching for characters who first appeared in subseqent releases, such as those in Episodes 7 through 9, may yield unexpected results.</p>";

    const searchBtn = document.getElementById("searchButton");
    searchBtn.addEventListener("click", async () => { displayInfo(await search(getValue())); });

    const randomBtn = document.getElementById("randomButton");
    randomBtn.addEventListener("click", async () => { displayInfo(await getPersonByID(Math.floor(Math.random() * 82) + 1)); });

    updatePastSearches();

}

function getValue() {
    // Get the input element by its ID
    let inputField = document.getElementById("searchBox");

    // Get the value of the input field
    let value = inputField.value;

    storeNameInHistory(value);

    return value.toLowerCase();
}

async function search(userInput) {
    const container = document.getElementById("searchResults");

    container.innerHTML = "<h2>SEARCHING...</h2>";

    let foundPeople = await getPersonByName(userInput);


    console.log(foundPeople);

    if (foundPeople === null && userInput.includes(" ") === true) {
        const wordsWithinInput = userInput.split(" ");
        let newResults;

        for (let i = 0; i < wordsWithinInput.length; i++) {
            newResults = await search(wordsWithinInput[i]);

            console.log("newResults = " + newResults);

            if (newResults != null) {
                return newResults;
            }
        }

        return null;

    }
    else {
        return foundPeople;
    }


}

async function displayInfo(foundPeople) {

    console.log("Displaying Info");

    const container = document.getElementById("searchResults");

    if (foundPeople.length === 0) {
        container.innerHTML = "<h2>We weren't able to find what you wanted.</h2>";
    }
    else {
        container.innerHTML = "<h2>LOADING...</h2>";

        let html = "";

        if (foundPeople[0].name.charAt(foundPeople[0].name.length - 1) != '~') {
            html += "<h2>We couldn't find exactly what you wanted.  Did you mean:</h2>";
        }
        else {
            foundPeople[0].name = foundPeople[0].name.slice(0, foundPeople[0].name.length - 1);
        }

        for (let i = 0; i < foundPeople.length; i++) {
            html += "<div id=searchContent>" + "<h2>" + foundPeople[i].name + "</h2>";
            html += "<h3> <b>Birth Year:</b> " + foundPeople[i].birth_year + "</h3>";
            html += "<h3> <b>Gender:</b> " + foundPeople[i].gender + "</h3>";
            html += "<h3> <b>Height:</b> " + foundPeople[i].height + "cm</h3>";
            html += "<h3> <b>Mass:</b> " + foundPeople[i].mass + "kg</h3>";
            html += "<h3> <b>Hair Color:</b> " + foundPeople[i].hair_color + "</h3>";
            html += "<h3> <b>Eye Color:</b> " + foundPeople[i].eye_color + "</h3>";
            html += "<h3> <b>Skin Color:</b> " + foundPeople[i].skin_color + "</h3>";
            html += "<h3 id=speciesInfo> <b>Species:</b> " + await getSpecies(foundPeople[i].species[0]) + "</h3>";
            html += "<h3 id=planetInfo> <b>Homeworld:</b> " + await getHomeworld(foundPeople[i].homeworld) + "</h3>";
            // html += "<div id=filmInfo> <h3> <b>Has Appeared In:</b> </h3>" + await getListOfFilms(foundPeople[i].films) + "</div>";
            html += "</div>";
        }


        container.innerHTML = html;

    }



}


async function getPersonByName(value) {
    //fetch the information in the houses.json file
    let starWarsData = await fetch("https://swapi.dev/api/people/?search=" + value);

    //store that response as json
    let response = await starWarsData.json();

    console.log(await response);

    //try to run the following code
    try {

        if (response.results.length === 1 && response.results[0].name.toLowerCase() === value) {
            response.results[0].name += "~";
        }

        return response.results;



    }
    //this only runs if there is an error during the above process
    catch {
        err => console.log("Oops!", err);
    }

}

async function getPersonByID(id) {
    //fetch the information in the houses.json file
    let starWarsData = await fetch("https://swapi.dev/api/people/" + id);

    //store that response as json
    let response = await starWarsData.json();

    console.log(await response);

    //try to run the following code
    try {
        storeNameInHistory(response.name);

        document.getElementById("searchBox").value = response.name;

        response.name += "~";

        return [response];


    }
    //this only runs if there is an error during the above process
    catch {
        err => console.log("Oops!", err);
    }
}

async function getListOfFilms(filmLinks) {

    let filmData;
    let response;
    let result = "<ul>";

    for (let i = 0; i < filmLinks.length; i++) {
        filmData = await fetch(filmLinks[i]);
        response = await filmData.json();

        try {
            result += "<li>" + await getFilmInfo(response.episode_id) + "<li>";

        }
        //this only runs if there is an error during the above process
        catch {
            err => console.log("Oops!", err);
        }



    }

    return result + "</ul>";
}

async function getFilmInfo(episodeNumber) {

    let movieTitle = "star+wars+:+episode+";
    switch (episodeNumber) {
        case 1:
            movieTitle += "I";
            break;

        case 2:
            movieTitle += "II";
            break;

        case 3:
            movieTitle += "III";
            break;

        case 4:
            movieTitle += "IV";
            break;

        case 5:
            movieTitle += "V";
            break;

        case 6:
            movieTitle += "VI";
            break;

        case 7:
            movieTitle += "VII";
            break;



    }

    const filmInfo = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/filmSearch/" + movieTitle);
    const response = await filmInfo.json();

    let result = "";

    try {

        result = "<h3>" + response.Title + "</h3>";
        result += "<p>" + response.Plot + "</p>";
        result += "<div id=posterAndText>"
        result += "<p><b>Released On:  </b>" + response.Released + "</p>";
        result += "<p><b>Runtime:  </b>" + response.Runtime + "</p>";
        result += "<p><b>Director:   </b>" + response.Director + "</p>";
        result += "<p><b>Writers:  </b><br>" + response.Writer.replaceAll(",", "<br>") + "</p>";
        result += "<p><b>Lead Actors:  </b><br>" + response.Actors.replaceAll(",", "<br>") + "</p>";
        result += "<p><b>Awards:  </b><br>" + response.Awards.replaceAll(".", ".<br>") + "</p>";
        result += "<img src=" + response.Poster + "> </div>";

        return result;
    }
    catch {
        err => console.log("Oops!", err);
    }

}

async function getHomeworld(planetLink) {


    const planetData = await fetch(planetLink);
    const response = await planetData.json();

    try {

        let result = response.name;

        if (response.climate != "unknown") {
            if (response.climate.charAt(0) === 'a' || response.climate.charAt(0) === 'e' || response.climate.charAt(0) === 'i'
                || response.climate.charAt(0) === 'o' || response.climate.charAt(0) === 'u') {
                result += " - an ";
            }
            else {
                result += " - a ";
            }

            result += " " + response.climate;

            if (response.terrain != "unknown") {

                return result + formatTerrain(response.terrain);

            }
        }
        else if (response.terrain != "unknown") {
            if (response.terrain.charAt(0) === 'a' || response.terrain.charAt(0) === 'e' || response.terrain.charAt(0) === 'i'
                || response.terrain.charAt(0) === 'o' || response.terrain.charAt(0) === 'u') {
                result += " - an ";
            }
            else {
                result += " - a ";
            }

            return result + formatTerrain(response.terrain);
        }
        else {
            return result;
        }






    }
    //this only runs if there is an error during the above process
    catch {
        err => console.log("Oops!", err);
    }


}

function formatTerrain(terrainString) {
    let result = "";

    if (terrainString.includes(",")) {
        result += " world with ";

        for (let i = 0; i < terrainString.split(",").length; i++) {
            let terrainType = terrainString.split(",")[i];

            console.log(terrainType);

            if (terrainType.trim().at(terrainType.trim().length - 1) != "s") {
                terrainType = " "+ terrainType + "s";
            }

            if (terrainType.trim() === "urbans") {
                terrainType = " urban areas";
            }


            if (i === terrainString.split(",").length - 1) {
                result += " and" + terrainType;
            }
            else {
                result += terrainType;

                if (i != terrainString.split(",").length - 2) {
                    result += ",";
                }
            }
        }

    }
    else {
        result += ", " + terrainString + " world";
    }

    return result;
}

async function getSpecies(speciesLink) {

    if (!speciesLink) {
        console.log("NULL");
        return "Human";
    }

    const speciesData = await fetch(speciesLink);
    const response = await speciesData.json();

    try {

        return response.name;



    }
    //this only runs if there is an error during the above process
    catch {
        err => console.log("Oops!", err);
    }


}

function updatePastSearches() {

    if (sessionStorage.pastSearches) {
        const pastSearchesSelectBox = document.getElementById("pastSearches");

        const pastNames = sessionStorage.pastSearches.split(";;");

        let HTML = "";

        for (let i = 0; i < pastNames.length - 1; i++) {
            HTML += "<option id=pastName" + i + ">" + pastNames[i] + "</option>";

        }

        HTML += "<option id=clearPastSearches>Clear Search History</option>";

        pastSearchesSelectBox.innerHTML = HTML;

        for (let i = 0; i < pastNames.length - 1; i++) {

            document.getElementById("pastName" + i).addEventListener("click", () => { retrievePastSearch(pastNames[i]) });

        }

        document.getElementById("clearPastSearches").addEventListener("click", () => { clearSearchHistory() });

    }


}


async function retrievePastSearch(pastName) {

    document.getElementById("searchBox").value = pastName;

    displayInfo(await search(pastName.toLowerCase()));
}

function clearSearchHistory() {
    const pastSearchesSelectBox = document.getElementById("pastSearches");

    pastSearchesSelectBox.innerHTML = "";

    sessionStorage.removeItem("pastSearches");

}

function storeNameInHistory(value) {
    if (sessionStorage.pastSearches) {
        const pastNames = sessionStorage.pastSearches.split(";;");

        for (let i = 0; i < pastNames.length; i++) {
            if (value === pastNames[i]) {
                return;
            }
        }

        sessionStorage.pastSearches += value + ";;";
    }
    else {
        sessionStorage.pastSearches = value + ";;";
    }

    updatePastSearches();
}