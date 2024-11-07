/*
Author: Josh T
File Name: index.html for Project 3
*/


//call the init function once the DOM loads
document.addEventListener('DOMContentLoaded', init);

//This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

//This function creates an <iframe> (and YouTube player) after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'R1qh-lhxy9s',
        playerVars: {
            'playsinline': 1
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        }
    });
}



//The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

//   The API calls this function when the player's state changes.
var done = false;

//create a timer
let vidTimer;

function onPlayerStateChange(event) {
    switch (event.data) {
        // if the video is playing
        case YT.PlayerState.PLAYING:
            // start counting the playback time every second
            vidTimer = setInterval(getTime, 1000);
            break;
        // if the video isn't playing
        case !YT.PlayerState.PLAYING:
            // if there is no timer
            if (!vidTimer) {
                // output a console message
                console.log("no timer");
            }
            break;
        // otherwise,
        default:
            // stop counting the playback time
            clearInterval(vidTimer);
    }
}

//create a function that gets the currentTime of the video and triggers the manageCues function
function getTime() {

    // get the current time of the video
    // round this down to the nearest second
    time = Math.floor(player.getCurrentTime());

    // call the manageCues function with this time
    manageCues(time);

}

// this function will flip the rulebook to a different page based on where the video is currently
function manageCues(currentTime) {

    if (currentTime < 59) {
        flipToPage(1);
    }
    else if (currentTime >= 59 && currentTime < 331) {
        flipToPage(2);
    }
    else if (currentTime >= 331 && currentTime < 522) {
        flipToPage(3);
    }
    else if (currentTime >= 522 && currentTime < 545) {
        flipToPage(2);
    }
    else if (currentTime >= 545 && currentTime < 607) {
        flipToPage(3);
    }
    else if (currentTime >= 607 && currentTime < 669) {
        flipToPage(4);
    }
    else if (currentTime >= 669 && currentTime < 710) {
        flipToPage(5);
    }
    else if (currentTime >= 710 && currentTime < 754) {
        flipToPage(4);
    }
    else if (currentTime >= 754 && currentTime < 763) {
        flipToPage(5);
    }
    else if (currentTime >= 763 && currentTime < 779) {
        flipToPage(4);
    }
    else if (currentTime >= 779) {
        flipToPage(1);
    }
}

// create a global variable to hold the current page set the rulebook is on
var currentPageSet = 1;

// this function will run once the DOM loads
function init() {

    // get all the content that is hidden when JS is disabled
    const hiddenContent = document.getElementsByClassName("hidden");

    // show that content
    for(let i = 0; i < hiddenContent.length; i++)
    {
        hiddenContent[i].style.display = "block";
    }

    // get the main tag
    const main = document.getElementsByTagName("main");

    // make is display the video with its controls and the interactive rulebook in a 1 x 2 grid
    main[0].style.display = "grid";

    // hide the grid of book pages when JS is enabled
    const bookGrid = document.getElementById("bookGrid");
    bookGrid.style.display = "none";

    // when the play button is pressed, run the playMedia function
    const playBtn = document.getElementById("start");
    playBtn.addEventListener("click", playMedia);

    // when the pause button is pressed, run the pauseMedia function
    const pauseBtn = document.getElementById("pause");
    pauseBtn.addEventListener("click", pauseMedia);

    // when the stop button is pressed, run the stopMedia function
    const stopBtn = document.getElementById("stop");
    stopBtn.addEventListener("click", stopMedia);

    //get the fast forward option and have it run the changeMediaSpeed function
    const ffBtn = document.getElementById("fast-forward");
    ffBtn.addEventListener("click", changeMediaSpeed);

    //get the faster option and have it run the changeMediaSpeed function
    const fasterBtn = document.getElementById("faster-speed");
    fasterBtn.addEventListener("click", changeMediaSpeed);

    //get the normal option and have it run the changeMediaSpeed function
    const normalBtn = document.getElementById("normal-speed");
    normalBtn.addEventListener("click", changeMediaSpeed);

    //get the slower option and have it run the changeMediaSpeed function
    const slowerBtn = document.getElementById("slower-speed");
    slowerBtn.addEventListener("click", changeMediaSpeed);

    //get the slow motion option and have it run the changeMediaSpeed function
    const slowBtn = document.getElementById("slow-motion");
    slowBtn.addEventListener("click", changeMediaSpeed);


    // get the flip to next page button and have it run the flipToPage function with the page after the current one
    const pageNextBtn = document.getElementById("flipNext");
    pageNextBtn.addEventListener("click", () => { flipToPage(currentPageSet + 1); });

    // get the flip to previous page button and have it run the flipToPage function with the page before the current one
    const pagePrevBtn = document.getElementById("flipPrev");
    pagePrevBtn.addEventListener("click", () => { flipToPage(currentPageSet - 1); });


    // get all the skip buttons and place them in an array
    const skipBtns = document.getElementById("skip-to-controls");
    let skipTimes = [0, 60, 142, 404, 521, 587, 606, 670];

    // have them skip to a different time depending on where they are in the array
    for (let i = 1; i < skipBtns.children.length; i++) {
        skipBtns.children[i].addEventListener("click", () => { player.seekTo(skipTimes[i - 1], true); });
    }


    // create a playMedia function that will play the video
    function playMedia() {
        player.playVideo();
    }

    // create a pauseMedia function that will pause the video
    function pauseMedia() {
        player.pauseVideo();
    }

    // create a stopMedia function that will stop the video
    function stopMedia() {
        player.stopVideo();
    }

    // create a changeMediaSpeed function 
    function changeMediaSpeed(event) {

        // depending on what option called this,
        // adjust the video's playback speed
        switch (event.target.id)
        {
            case "fast-forward":
                player.setPlaybackRate(2);
                break;
            case "faster-speed":
                player.setPlaybackRate(1.5);
                break;
            case "normal-speed":
                player.setPlaybackRate(1);
                break;
            case "slower-speed":
                player.setPlaybackRate(0.5);
                break;
            case "slow-motion":
                player.setPlaybackRate(0.25);
                break;


        }


    }




}

// create a global variable to tell if the rulebook can be flipped or not
var canFlip = true;

// create an array of strings that correspond the the rulebook page images
const pageSources = ["images/rulebookPages/page1.jpeg", "images/rulebookPages/page2.jpg", "images/rulebookPages/page3.jpeg", "images/rulebookPages/page4.jpeg", 
                    "images/rulebookPages/page5.jpeg", "images/rulebookPages/page6.jpeg", "images/rulebookPages/page7.jpeg", "images/rulebookPages/page8.jpg"];

// the flipToPage function works by taking in a page set number
// these numbers correspond to the different configurations of pages
// 1:  Left page is hidden.  Right page is page 1
// 2:  Left page is page 2.  Right page is page 3
// 3:  Left page is page 4.  Right page is page 5
// 4:  Left page is page 6.  Right page is page 7
// 5:  Left page is hidden.  Right page is page 8


// create a function that will flip the to page set passed in
function flipToPage(newPageSet) {

    // if the number passed in to this function is not a valid page set (ie not 1, 2, 3, 4 or 5), do nothing
    // if the number passed in to this function is the same as the page set we're currently on, we don't need to flip to a new one, so do nothing
    // finally, if we can't flip to a new page according to the canFlip variable, do nothing
    if (newPageSet >= 1 && newPageSet <= 5 && newPageSet != currentPageSet && canFlip) {

        // get the left page, the top dummy page and the bottom right page
        const leftPage = document.getElementById("leftPage");
        const topPage = document.getElementById("topPage");
        const bottomPage = document.getElementById("bottomPage");

        // show the top page
        topPage.style.display = "block";

        // if we are flipping the book back
        if (newPageSet > currentPageSet) {
            // set the dummy page to what the actual right page was
            topPage.src = bottomPage.src;

            // play the flip to next animation to make it look like this page is being flipped
            topPage.style.animation = "flipToNext 0.8s ease";

            // if we're flipping to the final page in the book
            if (newPageSet === 5) {
                // hide the left page
                leftPage.style.display = 'none';
                
                // set the actual right page to the left page
                // this will make it look like we're closing the book on the current page
                bottomPage.src = leftPage.src;

                // set the dummy page to the final page
                topPage.src = pageSources[7];

                // play the flip to final animation
                topPage.style.animation = "flipToFinal 0.8s ease";

            }
            // if we're not flipping to the final page,
            else {
                // set the right page to the right page in the parameter's page set
                bottomPage.src = pageSources[2 * (newPageSet - 1)];
            }

            // prevent the book from flipping again until the current animation is finished
            canFlip = false;

            // after the animation has played, run the afterNextAnim helper function
            setTimeout(afterNextAnim, 795);


        }
        // if we are flipping the book forward,
        else {

            // set the left page to the left page in the parameter's page set
            leftPage.src = pageSources[2 * (newPageSet - 1) - 1];

            // play the flip to previous animation to make it look like this page is being flipped
            topPage.style.animation = "flipToPrevious 0.8s ease";

            //if we're flipping from the current
            if (currentPageSet === 5) {
                //don't play any animation, simply fun the afterPrevAnim helper function
                afterPrevAnim();
            }
            // if we're flipping to the cover page,
            else if (newPageSet === 1) {
                // set the dummy page to the cover page
                topPage.src = pageSources[0];

                // hide the left page
                leftPage.style.display = 'none';

                // prevent the book from flipping again until the current animation is finished
                canFlip = false;

                // after the animation has played, run the afterPrevAnim helper function
                setTimeout(afterPrevAnim, 795);

            }
            //if we're flipping from a middle page to another middle page
            else {
                //set the dummy page tothe right page in the parameter's page set
                topPage.src = pageSources[2 * (newPageSet - 1)];

                // prevent the book from flipping again until the current animation is finished
                canFlip = false;

                // after the animation has played, run the afterPrevAnim helper function
                setTimeout(afterPrevAnim, 795);
            }


        }


        //this helper function executes after the flipping animation when we flip backwards 
        function afterNextAnim() {

            // hide the dummy page
            topPage.style.display = 'none';

            // allow the book to flip again
            canFlip = true;

            // if we didn't flip to the final page set
            if (newPageSet != 5) {
                // show the left page
                leftPage.style.display = 'block';

                // and set it the the left page in the parameter's page set
                leftPage.src = pageSources[2 * (newPageSet - 1) - 1];
            }
            // if we did flip to the final page set
            else
            {
                // set the actual right page to the final page
                bottomPage.src = pageSources[7];
            }
        }

        //this helper function executes after the flipping animation when we flip forwards
        function afterPrevAnim() {
            
            // hide the dummy page
            topPage.style.display = 'none';

            // allow the book to flip again
            canFlip = true;

            // if we didn't flip to the first page set
            if (newPageSet != 1) {
                // show the left page
                leftPage.style.display = 'block';

                // and set it the the left page in the parameter's page set
                leftPage.src = pageSources[2 * (newPageSet - 1) - 1];
            }

            // set the actual right page to the right page in the parameter's page set
            bottomPage.src = pageSources[2 * (newPageSet - 1)];
        }

        // finally, set the currentPageSet tracker to the page set we just flipped to
        currentPageSet = newPageSet;

    }



}

