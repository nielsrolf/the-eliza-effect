

function showNextThing() {
    fetch("http://localhost:5000/display").then(function(response) {
        return response.json();
    }).then(function(data) {
        console.log(data);
        document.getElementById("text").innerHTML = data.text;
        setTimeout(showNextThing, 1000 + data.duration * 1000);
    }).catch(function() {
        console.log("Booo");
    });
}

function init() {
    document.getElementById("text").innerHTML = "";
    showNextThing();
}


document.addEventListener('DOMContentLoaded', init, false);