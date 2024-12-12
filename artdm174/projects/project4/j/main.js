/*
Author: Josh T
File Name: main.js for Project 4
*/

//run this js code after the DOM has finished loading
document.addEventListener('DOMContentLoaded', init);


// this init function will run as soon as the DOM Loads to initialuize the page
function init() {

    //display the search bar when JS is enabled
    const searchBar = document.getElementById("searchBar");
    searchBar.style.display = "grid";

    //when JS is enabled, replace the default message with a more specific one
    const searchResults = document.getElementById("searchResults");
    searchResults.innerHTML = "<h2>The information for the character you searched will display here.<h2>" +
        "<p>All Star Wars data courtesay of <a href=https://swapi.dev/>SWAPI</a>.   Film data is from <a href=https://www.omdbapi.com>OMDBAPI</a> Data is current up until Episode 3.  " +
        "Searching for characters who first appeared in subseqent releases, such as those in Episodes 7 through 9, may yield unexpected results.</p>";

    //add an event listener to the search button
    const searchBtn = document.getElementById("searchButton");

    //when the search button is clicked,
    //get the words in the input tag using the getValue function
    //search for those words in the SWAPI using the search function
    //display the info for the characters gotten from the search using the displayInfo function
    searchBtn.addEventListener("click", async () => { displayInfo(await search(getValue())); });

    //add an event listener to the random button
    const randomBtn = document.getElementById("randomButton");

    //when the random button is clicked,
    //generate a random ID number between 1 and 82
    //get the character with that ID from the SWAPI using the getPersonByID function
    //display the info for this character using the displayInfo function
    randomBtn.addEventListener("click", async () => { displayInfo(await getPersonByID(Math.floor(Math.random() * 82) + 1)); });

    //update the search history with the names from the local storage
    updateSearchHistory();

}


//this getValue function will get the name the user typed into the input tag
function getValue() {
    //get the input element by its ID
    let inputField = document.getElementById("searchBox");

    //get the value of the input field
    let value = inputField.value;

    //store that value in local storage and in the select box using the storeNameInHistory function
    storeNameInHistory(value);

    //return the name the user entered, with all the letters transformed to lowercase
    return value.toLowerCase();
}

//this search function will return an array of json objects based on what name was put into the parameter userInput
async function search(userInput) {

    //to let the user know we have started searching, change the subheading in the main container
    const container = document.getElementById("searchResults");
    container.innerHTML = "<h2>SEARCHING...</h2>";

    //search
    let foundPeople = await getPersonByName(userInput);

    //if we didn't find anyone with this name and the user's input contains multiple words
    if (foundPeople === null && userInput.includes(" ") === true) {

        //split the input into seperate words
        const wordsWithinInput = userInput.split(" ");
        let newResults;

        //search each word individually
        for (let i = 0; i < wordsWithinInput.length; i++) {
            newResults = await search(wordsWithinInput[i]);

            //if we found something, return that
            if (newResults != null) {
                return newResults;
            }
        }

        //if we still haven't found any characters based on the input,
        //return null
        return null;

    }
    else {
        
        ///if we found someone by just searching the user's input before breaking it up into words,
        //return the json of those people
        return foundPeople;
    }


}


//this displayInfo function takes in an array of json and displays it on the page as HTML
async function displayInfo(foundPeople) {


    const container = document.getElementById("searchResults");

    //if the parameter array is empty
    if (foundPeople.length === 0) {

        //let the user know we weren't able to find what they wanted
        container.innerHTML = "<h2>We weren't able to find what you wanted.</h2>";
    }
    else {

        //change the DOM to let the user know their content is being gathered
        container.innerHTML = "<h2>LOADING...</h2>";

        //create a variable to hold the html that will display on the page
        let html = "";

        //if there isn't a ~ at the end of the first character's name, we weren't able to find a character with this exact name
        if (foundPeople[0].name.charAt(foundPeople[0].name.length - 1) != '~') {
            html += "<h2>We couldn't find exactly what you wanted.  Did you mean:</h2>";
        }
        //if there is a ~ at the end of the first character's name, slice it off
        else {
            foundPeople[0].name = foundPeople[0].name.slice(0, foundPeople[0].name.length - 1);
        }

        //for each object in the json array
        for (let i = 0; i < foundPeople.length; i++) {

            //add an opening div tag and the character's name
            html += "<div id=searchContent>" + "<h2>" + foundPeople[i].name + "</h2>";

            //add the character's birth year
            html += "<h3> <b>Birth Year:</b> " + foundPeople[i].birth_year + "</h3>";

            //add the character's gender
            html += "<h3> <b>Gender:</b> " + foundPeople[i].gender + "</h3>";

            //add the character's height
            html += "<h3> <b>Height:</b> " + foundPeople[i].height + " cm</h3>";

            //add the character's mass
            html += "<h3> <b>Mass:</b> " + foundPeople[i].mass + " kg</h3>";

            //add the character's hair color
            html += "<h3> <b>Hair Color:</b> " + foundPeople[i].hair_color + "</h3>";

            //add the character's eye color
            html += "<h3> <b>Eye Color:</b> " + foundPeople[i].eye_color + "</h3>";

            //add the character's skin color
            html += "<h3> <b>Skin Color:</b> " + foundPeople[i].skin_color + "</h3>";

            //add the character's species using the getSpecies function
            html += "<h3 id=speciesInfo> <b>Species:</b> " + await getSpecies(foundPeople[i].species[0]) + "</h3>";

            //add the character's homeworld using the getHomeworld function
            html += "<h3 id=planetInfo> <b>Homeworld:</b> " + await getHomeworld(foundPeople[i].homeworld) + "</h3>";

            //add the information about the films this character has been in using the getListOfFilms function
            html += "<div id=filmInfo> <h3> <b>Has Appeared In:</b> </h3>" + await getListOfFilms(foundPeople[i].films) + "</div>";

            //add a closing div tag
            html += "</div>";
        }

        //set the inner HTML of the container to this variable
        container.innerHTML = html;

    }



}

//this getPersonByName function returns an array of json objects based on the value passed in
async function getPersonByName(value) {

    //fetch the information in the from SWAPI
    let starWarsData = await fetch("https://swapi.dev/api/people/?search=" + value);

    //store that response as json
    let response = await starWarsData.json();

    //try to run the following code
    try {

        //if the response is just one character and this character's name exactly matches the value
        if (response.results.length === 1 && response.results[0].name.toLowerCase() === value) {

            //add a ~ to the end of the first character's name to signal to the displayInfo function that this was an exact match
            response.results[0].name += "~";
        }

        //return the json array
        return response.results;

    }
    //this only runs if there is an error during the above process
    catch {
        err => console.log("Error getting a character using getPersonByName()", err);
    }

}

//this getPersonByID function returns an array with a single json object based on the id passed in
async function getPersonByID(id) {

    //fetch the information in the from SWAPI
    let starWarsData = await fetch("https://swapi.dev/api/people/" + id);

    //store that response as json
    let response = await starWarsData.json();

    //try to run the following code
    try {

        //store the name of the response in the search history
        storeNameInHistory(response.name);

        //change the text in the input tag to the name in the response 
        document.getElementById("searchBox").value = response.name;

        //add a ~ to the end of the first character's name to signal to the displayInfo function that this was an exact match
        response.name += "~";

        //return the response as an array
        return [response];


    }
    //this only runs if there is an error during the above process
    catch {
        err => console.log("Error getting a character using getPersonByID()", err);
    }
}

//this getListOfFilms function will get the information for each film
async function getListOfFilms(filmLinks) {

    //create a variable to hold the info from SWAPI
    let filmData;

    //create a variable to hold the json response
    let response;

    //create a variable to hold the html to display on the page
    let result = "<ul>";

    //for each film in the filmLink array
    for (let i = 0; i < filmLinks.length; i++) {

        //fetch the information in the from SWAPI
        filmData = await fetch(filmLinks[i]);

        //store that response as json
        response = await filmData.json();

        //try to run the following code
        try {

            //add a list element with the info from this film gathered from getFilmInfo
            result += "<li>" + await getFilmInfo(response.episode_id) + "<li>";

        }
        //this only runs if there is an error during the above process
        catch {
            err => console.log("Error getting film info using getListOfFilms()", err);
        }



    }

    //return the result plus a closing tag
    return result + "</ul>";
}

//this getFilmInfo function will grab info on a particular star wars movie from the OMBDAPI
async function getFilmInfo(episodeNumber) {

    //create a variable to hold the movie's title
    let movieTitle = "star+wars+:+episode+";

    //based on the number passed into this function, add the corresponding roman numeral
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

    //fetch the information from the OMBDAPI via a custom server
    const filmInfo = await fetch("https://1c9374c4-dadb-496d-9704-63e851db8798-00-130hiq61lnsv3.worf.replit.dev/filmSearch/" + movieTitle);

    //store that response as json
    const response = await filmInfo.json();

    //create a variable to hold the html info 
    let result = "";

    try {

        //add the film's Title
        result = "<h3>" + response.Title + "</h3>";

        //add the film's Plot
        result += "<p>" + response.Plot + "</p>";

        //add an opening div tag
        result += "<div id=posterAndText>";

        //add the film's release date 
        result += "<p><b>Released On:  </b>" + response.Released + "</p>";

        //add the film's runtime
        result += "<p><b>Runtime:  </b>" + response.Runtime + "</p>";

        //add the film's director's name
        result += "<p><b>Director:   </b>" + response.Director + "</p>";

        //add the film's writers with each name on a new line
        result += "<p><b>Writers:  </b><br>" + response.Writer.replaceAll(",", "<br>") + "</p>";

        //add the film's lead actors with each name on a new line
        result += "<p><b>Lead Actors:  </b><br>" + response.Actors.replaceAll(",", "<br>") + "</p>";

        //add the film's awards with each sentence on a new line
        result += "<p><b>Awards:  </b><br>" + response.Awards.replaceAll(".", ".<br>") + "</p>";

        //add this film's poster and a closing div tag
        result += "<img src=" + response.Poster + "> </div>";

        //return the html info
        return result;
    }
    catch {
        err => console.log("Error getting the film info using getFilmInfo()", err);
    }

}

//this getHomeworld function gets the information about a planet from a link to the SWAPI
async function getHomeworld(planetLink) {

    //fetch the information from the SWAPI
    const planetData = await fetch(planetLink);

    //store that response as json
    const response = await planetData.json();

    try {

        //create a variable to hold the planet's name and it's info
        let result = response.name;

        //if this planet has climate info
        if (response.climate != "unknown") {

            //determine if the planet description should start with an or with a based on the starting letter of the climate info
            if (response.climate.charAt(0) === 'a' || response.climate.charAt(0) === 'e' || response.climate.charAt(0) === 'i'
                || response.climate.charAt(0) === 'o' || response.climate.charAt(0) === 'u') {
                result += " - an ";
            }
            else {
                result += " - a ";
            }

            result += " " + response.climate;

            //if there is also terrain info
            if (response.terrain != "unknown") {

                //add the formatted terrain info
                return result + formatTerrain(response.terrain);

            }
        }
        //if this planet has no climate info, but it does have terrain info
        else if (response.terrain != "unknown") {

            //determine if the planet description should start with an or with a based on the starting letter of the terrain info
            if (response.terrain.charAt(0) === 'a' || response.terrain.charAt(0) === 'e' || response.terrain.charAt(0) === 'i'
                || response.terrain.charAt(0) === 'o' || response.terrain.charAt(0) === 'u') {
                result += " - an ";
            }
            else {
                result += " - a ";
            }

            //add the formatted terrain info
            return result + formatTerrain(response.terrain);
        }

        //if this planet has no terrain info or climate info, just return the name of the plantet
        else {
            return result;
        }

    }
    //this only runs if there is an error during the above process
    catch {
        err => console.log("Error getting homeworld information using getHomeworld()", err);
    }


}

//this formatTerrain function formats a terrain description
function formatTerrain(terrainString) {

    //create a variable to hold the result
    let result = "";

    //if there are multiple terrains
    if (terrainString.includes(",")) {

        //add the terrain descriptions after the world name
        result += " world with ";

        //for each terrain
        for (let i = 0; i < terrainString.split(",").length; i++) {

            //get each terrain description individually
            let terrainType = terrainString.split(",")[i];

            //if this terrain description isn't plural
            if (terrainType.trim().at(terrainType.trim().length - 1) != "s") {

                //add an s to it
                terrainType = " "+ terrainType + "s";
            }

            //if this terrain description is urbans
            if (terrainType.trim() === "urbans") {

                //change it to urban areas
                terrainType = " urban areas";
            }

            //if this is the last terrain description
            if (i === terrainString.split(",").length - 1) {

                //add and before the terrain description
                result += " and" + terrainType;
            }
            else {
                //otherwise, add the terrain descrption
                result += terrainType;

                //if this isn't the second to last terrain description, add a comma
                if (i != terrainString.split(",").length - 2) {
                    result += ",";
                }
            }
        }

    }
    //if there is just one terrain
    else {

        //add a comma and then the terrain description
        result += ", " + terrainString + " world";
    }

    return result;
}

//this getSpecies function returns the species from a SWAPI link
async function getSpecies(speciesLink) {

    //if there is no link,
    if (!speciesLink) {

        //return Human
        return "Human";
    }

    //fetch the information in the from SWAPI
    const speciesData = await fetch(speciesLink);

    //store that response
    const response = await speciesData.json();

    try {

        //return the name of that species
        return response.name;

    }
    //this only runs if there is an error during the above process
    catch {
        err => console.log("Error getting ", err);
    }


}

//this function updates the search history select box based on the values in local storage
function updateSearchHistory() {

    //if there are past searches in local storage
    if (localStorage.pastSearches) {

        //get a reference to the select box
        const pastSearchesSelectBox = document.getElementById("pastSearches");

        //get each name in an array
        const pastNames = localStorage.pastSearches.split(";;");

        //make a variable to store the array
        let HTML = "";

        //add an option to the search history select box for each name in the local storage
        for (let i = 0; i < pastNames.length - 1; i++) {
            HTML += "<option id=pastName" + i + ">" + pastNames[i] + "</option>";

        }

        //add an option that will clear the search history
        HTML += "<option id=clearPastSearches>Clear Search History</option>";

        //set this HTML to 
        pastSearchesSelectBox.innerHTML = HTML;

        //add an event listener to each option tag in the search history select box so that when that option is clicked, the name there is searched
        for (let i = 0; i < pastNames.length - 1; i++) {

            document.getElementById("pastName" + i).addEventListener("click", () => { retrievePastSearch(pastNames[i]) });

        }

        //add an event listener to the final option tag in the select box so the history is cleared when it is clicked
        document.getElementById("clearPastSearches").addEventListener("click", () => { clearSearchHistory() });

    }


}

//this function will get the search results of a character called pastName in the search history
async function retrievePastSearch(pastName) {

    //replace the text in the input tag with the pastName
    document.getElementById("searchBox").value = pastName;

    //plug pastName into the search function and display that info using the displayInfo function
    displayInfo(await search(pastName.toLowerCase()));
}

//this function will clear the search history select box and will clear the pastSearches variable from the local storage
function clearSearchHistory() {

    //get a reference to the search history select box
    const pastSearchesSelectBox = document.getElementById("pastSearches");

    //remove the options from the search history select box
    pastSearchesSelectBox.innerHTML = "";

    //remove the pastSearches variable from the local storage
    localStorage.removeItem("pastSearches");

}

//this function stores a new name called value in the pastSearches variable in local storage
function storeNameInHistory(value) {

    //if pastSearches already exists in local storage
    if (localStorage.pastSearches) {

        //get an array of the stored past names
        const pastNames = localStorage.pastSearches.split(";;");

        //if this new name is already in the search history,
        for (let i = 0; i < pastNames.length; i++) {

            if (value === pastNames[i]) {

                //don't store it
                return;
            }
        }

        //if this new name isn't in the search history, add it and two semi-colons as a divider
        localStorage.pastSearches += value + ";;";
    }
    //if pastSearches doesn't exist in local storage,
    else {

        //create it and add this new name and two semi-colons as a divider
        localStorage.pastSearches = value + ";;";
    }

    //call the updateSearchHistory function to add this new name to the search history select box
    updateSearchHistory();
}