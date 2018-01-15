// Initialize Firebase
var config = {
    apiKey: "AIzaSyDI-Jf5LgEipjezTIGyhDeWCaWaY5z7HBk",
    authDomain: "train-scheduler-a89c3.firebaseapp.com",
    databaseURL: "https://train-scheduler-a89c3.firebaseio.com",
    projectId: "train-scheduler-a89c3",
    storageBucket: "train-scheduler-a89c3.appspot.com",
    messagingSenderId: "761418208608"
};

firebase.initializeApp(config);

// var provider = new firebase.auth.GoogleAuthProvider();

// firebase.auth().signInWithPopup(provider).then(function(result) {
//     // This gives you a Google Access Token. You can use it to access the Google API.
//     var token = result.credential.accessToken;
//     // The signed-in user info.
//     var user = result.user;
//     // ...
//   }).catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // The email of the user's account used.
//     var email = error.email;
//     // The firebase.auth.AuthCredential type that was used.
//     var credential = error.credential;
//     // ...
//   });

var database = firebase.database();

var name = "";
var destination = "";
var firstTime;
var frequency;

// Capture Button Click
$("#submit").on("click", function () {
    // Don't refresh the page!
    event.preventDefault();
    if ($("#name-input" || "#destination-input" || "#time-input" || "#frequency-input").val().trim() == "") {
        alert("Please complete the form");
    }
    else {
        name = $("#name-input").val().trim();
        destination = $("#destination-input").val().trim();
        firstTime = $("#time-input").val().trim();
        frequency = $("#frequency-input").val().trim();

        var newTime = {
            name: name,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency
        };

        database.ref().push(newTime);

        $("#name-input").val("");
        $("#destination-input").val("");
        $("#time-input").val("");
        $("#frequency-input").val("");
    }
});

database.ref().on("child_added", function (childSnapshot, prevChildKey) {
    name = childSnapshot.val().name;
    destination = childSnapshot.val().destination;
    firstTime = childSnapshot.val().firstTime;
    frequency = childSnapshot.val().frequency;

    //moment js
    var currentTime = moment();
    var currentTimeDisplay = currentTime.format("dddd, MMMM Do YYYY, h:mm:ss a");

    var firstTimeConverted = moment(firstTime, "hh:mm");

    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var remainingTime = diffTime % frequency;

    var untilNextTime = frequency - remainingTime;

    var nextArrival = moment().add(untilNextTime, "minutes").format("hh:mm");

    $("#train-schedule > tbody").append(
        "<tr><td>" + name + "</td><td>" + destination + "</td><td>" +
        frequency + "</td><td>" + nextArrival + "</td><td>" + untilNextTime + 
        // "</td><td>" + "<button type='button' class='btn btn-danger'>Remove</button>" + 
        "</td></tr>");
    $("#currently").append(currentTimeDisplay);
});

function update() {
    $("#currently").html(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
}
setInterval(update, 1000);