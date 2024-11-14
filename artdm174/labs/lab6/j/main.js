/*
Author: Josh T
File Name: main.js for Lab 6
*/

//run this js code after the DOM has finished loading
document.addEventListener('DOMContentLoaded', init);



function init()
{

    //PART 1

    //fetch the information in the houses.json file
    fetch("houses.json")
        .then((response) => response.json())
        .then((data) => {
            //create a temp holder to append all the html generated inside the forEach iterator
            //add a h1 heading to this temp as well as an opening dl tag
            let html = "<h1>GAME OF THRONES<br>CHARACTERS</h1> <dl>";


            //the argument "house" passed to the arrow function holds each item in the array in turn.
            data.forEach((house) => {

                // generate the html snippet for one array item to be added to the "html" temp holder.

                //add a opening div tag with an id that matches that house's code
                //within this div, add a dt element with the house's name and a class of house
                let objInfo = `<div id="` + house.code + `">  <dt class="house">` + house.name + `</dt>`;

                //for every member in this house's member array
                for(let i = 0; i < house.members.length; i++)
                {

                    //add that member's name in a dd element with the folks class
                    objInfo += `<dd class="folks">` + house.members[i] + `</dd>`;
                }
                

                //add these new lines to the temp
                html += objInfo;

                //cap off the info for this house by adding an image element whose source is this house's banner
                //finally, add a closing div tag
                html += `<img src=images/` + house.name + `Logo.png> </div>`;
            });

            //after all the houses have been added, add a closing dl tag
            html += "</dl>"

            //make a reference to the html container where
            //the info will be displayed.
            const container = document.querySelector("#container");

            //set the inner html of that container to the temp html string, thus displaying it on the page
            container.innerHTML = html;
        })
        .catch((err) => console.log("Oops!", err));
        //this only runs if there is an error during the above process



        //PART 2

        //first we need to create a random hexadecimal color code to add the the api url

        //create a variable to hold the api url
        let url = 'https://www.thecolorapi.com/id?hex=';

        //create another variable to hold each digit of the code
        let next = 0;

        //generate a random hexadecimal digit six times
        for(let i = 0; i < 6; i++)
        {
            //set next to a random number from 0 to 15
            next = Math.floor(Math.random() * 16);

            //if this number is from 0 to 9,  store it as is

            //if it is over 9, convert it the the corresponding hexadecimal letter

            if(next === 10)
            {
                next = 'A';
            }
            else if(next === 11)
            {
                next = 'B';
            }
            else if(next === 12)
            {
                next = 'C';
            }
            else if(next === 13)
            {
                    next = 'D';
            }
            else if(next === 14)
            {
                next = 'E';
            }
            else if(next === 15)
            {
                next = 'F';
            }


            url += "" + next;
        }

        //fetch the color data from this url
        fetch(url)
            .then(response => response.json())
            .then(data => {

                //get a reference to the body of our html page
                const background = document.querySelector("body");
                
                //set its background color to the rgb value returned by the data
                background.style.backgroundColor = data.rgb.value;

                //set the default text color to the contrasting value returned by the data
                background.style.color = data.contrast.value;

            })
            //create an error that only runs if there is a problem with the process above
            .catch(err => {
                console.log("There is an error getting the random background color", err);
            });
            
  



}