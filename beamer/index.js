function typingAnimate(slide) {
    let t = (slide.duration - 0.5 ) / slide.text.length;
    console.log("t", t)
    for(let i=0; i<slide.text.length; i+=1) {
        setTimeout(() => {
            document.getElementById("text").innerHTML += slide.text[i];
        }, i * t * 1000)
    }
}


function showSlide(slides) {
    console.log("slides", slides);
    if(slides.length == 0) {
        showNextThing();
        return;
    }
    let slide = slides.shift();
    console.log(slide);
    if(slide.animation=="slide"){
        document.getElementById("text").innerHTML = slide.text;
    }
    if(slide.animation=="input") {
        document.getElementById("text").innerHTML = "INPUT: "
        typingAnimate(slide);
    }
    if(slide.animation=="typing") {
        typingAnimate(slide);
    }
    setTimeout(() => showSlide(slides), slide.duration * 1000);
}


function showNextThing() {
    document.getElementById("text").innerHTML = "";
    fetch("http://localhost:5000/display").then(function(response) {
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
        console.log(err);
    });
}

function init() {
    document.getElementById("text").innerHTML = "";
    showNextThing();
}


document.addEventListener('DOMContentLoaded', init, false);