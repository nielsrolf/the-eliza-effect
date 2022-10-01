const beamerId = Math.floor(Math.random() * 10000);

function typingAnimate(slide) {
    let t = (slide.duration - 0.5 ) / slide.text.length;
    console.log("t", t)
    for(let i=0; i<slide.text.length; i+=1) {
        setTimeout(() => {
            document.getElementById("text").innerHTML += slide.text[i];
        }, i * t * 1000)
    }
    setTimeout(() => {
        document.getElementById("text").innerHTML = "";
    }, slide.duration * 1000)
}

let stopThinking = true;
let stopTyping = true;

function think() {
    let text = document.getElementById("text").innerHTML;
    const randomChar = () => {
        let char = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
        if(char === " ") {
            return randomChar();
        }
        return char;
    }
    // replace char at random position
    const pos = Math.floor(Math.random() * text.length);
    //text = text.substring(0, pos) + randomChar() + text.substring(pos + 1);
    text = text.substring(0, pos) + ' ' + text.substring(pos + 1);
    document.getElementById("text").innerHTML = text;
    // document.getElementById("text").innerHTML = "think";
    if(!stopThinking) {
        setTimeout(think, 100);
    }
}

function typeEndless(slide) {
    document.getElementById("text").innerHTML = slide.text;
}

function showSlide(slides) {
    console.log("slides", slides);
    
    if(slides.length == 0) {
        showNextThing();
        return;
    }
    let slide = slides.shift();
    if(slide.animation!="thinking") {
        stopThinking=true;
    }
    console.log(slide);
    if(slide.animation=="video" || slide.animation=="question"){
        document.getElementById("text").innerHTML = slide.text;
    }
    if(slide.animation=="input") {
        document.getElementById("text").innerHTML = "INPUT: "
        typingAnimate(slide);
    }
    if(slide.animation=="typing") {
        typingAnimate(slide);
    }

    if(slide.animation=="thinking") {
        if(stopThinking) {
            stopThinking = false;
            document.getElementById("text").innerHTML = slide.text;
            think();
        }//if already thinking do nothing
    }

    if(slide.animation=="endless-typing") {
        if(stopTyping) {
            stopTyping = false;
            document.getElementById("text").innerHTML = slide.text;
            typeEndless(slide);
        }//if already thinking do nothing
    }
    setTimeout(() => showSlide(slides), slide.duration * 1000);
}


function showNextThing() {
    
    fetch(`http://localhost:8726/display/${beamerId}`).then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log("data", data);
        if(data.texts.length == 0) {
            console.log("nothibg")
            setTimeout(showNextThing, 100)
        }else{
            showSlide(data.texts);
        }
    }).catch(function(err) {
        document.getElementById("text").innerHTML = "Backend nicht verbunden, bitte Seite neu laden oder anderen Tab benutzen";
        console.log(err);
    });
}

async function waitForBackend() {
    document.getElementById("text").innerHTML = "waiting for backend...";
    while(true) {
        try {
            const response = await fetch(`http://localhost:8726/display/${beamerId}`);
            if(response.ok) {
                return;
            }
        } catch(err) {
            console.log(err);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

async function init() {
    await waitForBackend();
    document.getElementById("text").innerHTML = "";
    showNextThing();
}


document.addEventListener('DOMContentLoaded', init, false);