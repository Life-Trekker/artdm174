/*
Author: Josh T
File Name: index.html for Project 3
*/


//call the init function once the DOM loads
document.addEventListener('DOMContentLoaded', init);

// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
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



// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
var done = false;

let myTimer;

function onPlayerStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.PLAYING:
            myTimer = setInterval(getTime, 1000);
            break;
        case !YT.PlayerState.PLAYING:
            if (!myTimer) {
                console.log("no timer");
            }
            break;
        default:
            clearInterval(myTimer);
            console.log("stopping timer");
    }
}

// 6. get the currentTime of the video and trigger the
// manageCues function if we are watching the inital video.
function getTime() {
    time = Math.floor(player.getCurrentTime());

    manageCues(time);

}

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

var currentPageSet = 1;

function init() {

    const controls = document.getElementById("controls");
    controls.style.display = "block";

    const playBtn = document.getElementById("start");
    playBtn.addEventListener("click", playMedia);

    const pauseBtn = document.getElementById("pause");
    pauseBtn.addEventListener("click", pauseMedia);

    const stopBtn = document.getElementById("stop");
    stopBtn.addEventListener("click", stopMedia);

    //get the fast forward option and have it increase the video playback rate to 2X
    const ffBtn = document.getElementById("fast-forward");
    ffBtn.addEventListener("click", changeMediaSpeed);

    //get the faster option and have it increase the video playback rate to 1.5X
    const fasterBtn = document.getElementById("faster-speed");
    fasterBtn.addEventListener("click", changeMediaSpeed);

    //get the normal option and have it set the video playback rate to the standard rate
    const normalBtn = document.getElementById("normal-speed");
    normalBtn.addEventListener("click", changeMediaSpeed);

    //get the slower option and have it decrease the video playback rate to 0.5X
    const slowerBtn = document.getElementById("slower-speed");
    slowerBtn.addEventListener("click", changeMediaSpeed);

    //get the slow motion option and have it decrease the video playback rate to 0.25X
    const slowBtn = document.getElementById("slow-motion");
    slowBtn.addEventListener("click", changeMediaSpeed);


    const pageNextBtn = document.getElementById("flipNext");
    pageNextBtn.addEventListener("click", () => { flipToPage(currentPageSet + 1); });

    const pagePrevBtn = document.getElementById("flipPrev");
    pagePrevBtn.addEventListener("click", () => { flipToPage(currentPageSet - 1); });



    const skipBtns = document.getElementById("skip-to-controls");
    let skipTimes = [60, 435, 1279, 670];

    for (let i = 1; i < skipBtns.children.length; i++) {
        skipBtns.children[i].addEventListener("click", (e) => { player.seekTo(skipTimes[i - 1], true); player.playVideo(); });
    }



    function playMedia() {
        player.playVideo();
    }


    function pauseMedia() {
        player.pauseVideo();
    }

    function stopMedia() {
        player.stopVideo();
    }

    function changeMediaSpeed(event) {

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


function flipToPage(newPageSet) {


    if (newPageSet >= 1 && newPageSet <= 5 && newPageSet != currentPageSet) {


        const leftPage = document.getElementById("leftPage");
        const topPage = document.getElementById("topPage");
        const bottomPage = document.getElementById("bottomPage");



        const pageSources = ["images/rulebookPages/page1.jpeg", "images/rulebookPages/page2.jpeg", "images/rulebookPages/page3.jpeg", "images/rulebookPages/page4.jpeg", "images/rulebookPages/page5.jpeg", "images/rulebookPages/page6.jpeg", "images/rulebookPages/page7.jpeg", "images/rulebookPages/page8.jpeg"];


        topPage.style.display = "block";

        if (newPageSet > currentPageSet) {
            topPage.src = bottomPage.src;
            topPage.style.animation = "flipToNext 0.8s ease";


            if (newPageSet === 5) {
                leftPage.style.display = 'none';
                bottomPage.src = pageSources[7];
                afterNextAnim();
            }
            else {
                bottomPage.src = pageSources[2 * (newPageSet - 1)];
                setTimeout(afterNextAnim, 795);
            }


        }
        else {

            leftPage.src = pageSources[2 * (newPageSet - 1) - 1];

            topPage.style.animation = "flipToPrevious 0.8s ease";

            if (newPageSet === 1) {
                topPage.src = pageSources[0];
                leftPage.style.display = 'none';
                setTimeout(afterPrevAnim, 795);
            }
            else if (currentPageSet === 5) {
                afterPrevAnim();
            }
            else {
                topPage.src = pageSources[2 * (newPageSet - 1)];
                setTimeout(afterPrevAnim, 795);
            }


        }



        function afterNextAnim() {
            topPage.style.display = 'none';

            if (newPageSet != 5) {
                leftPage.style.display = 'block';
                leftPage.src = pageSources[2 * (newPageSet - 1) - 1];
            }
        }

        function afterPrevAnim() {
            topPage.style.display = 'none';

            if (newPageSet != 1) {
                leftPage.style.display = 'block';
                leftPage.src = pageSources[2 * (newPageSet - 1) - 1];
            }

            bottomPage.src = pageSources[2 * (newPageSet - 1)];
        }

        currentPageSet = newPageSet;

    }



}

