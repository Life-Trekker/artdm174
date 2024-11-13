/*
Author: Josh T
File Name: main.js for Lab 6
*/


document.addEventListener('DOMContentLoaded', init);

//This code does NOT create any global variables.
//Promises can be chained together, with the previous promise
// passing its results to the next one in the chain.
// the format is: fetch().then().then().catch()
//it's easier to read if we put each step in its own line,
//that's why the periods start the then lines.

function init()
{
    fetch("houses.json")
        .then((response) => response.json())
        .then((data) => {
            //create a temp holder to append all the html generated inside the forEach iterator
            let html = "<dl>";


            //the argument "house" passed to the arrow function
            //holds each item in the array in turn.
            data.forEach((house) => {

                // generate the html snippet for one array item
                //to be added to the "html" temp holder.
                let objInfo = `<div id="` + house.code + `">  <dt class="house">` + house.name + `</dt>`;

                for(let i = 0; i < house.members.length; i++)
                {

                    objInfo += `<dd class="folks">` + house.members[i] + `</dd>`;
                }
                

                html += objInfo;
                html += `<img src=images/` + house.name + `Logo.png> </div>`;
            });

            html += "</dl>"

            //make a reference to the html container where
            //the info will be displayed.
            const container = document.querySelector("#container");
            container.innerHTML = html;
        })
        .catch((err) => console.log("Oops!", err));
        //this only runs if there is an error during the above process


        fetch('https://randomuser.me/api/')
        .then(response => response.json())
        .then(data => {
            const color = data.info.seed.substring(0, 6);
            

            const background = document.querySelector("body");
            background.style.backgroundColor = "#" + color;

        })
        .catch(err => {
            console.log("Oops!", err);
        });

  



}