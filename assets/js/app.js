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

var database = firebase.database();

var name = "";
var destination = "";
var firstTime;
var frequency;

// Capture Button Click
$("#submit").on("click", function () {
    // Don't refresh the page!
    event.preventDefault();

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
        frequency + "</td><td>" + nextArrival + "</td><td>" + untilNextTime + "</td></tr>");
    $("#currently").append(currentTimeDisplay);
});

function update() {
    $("#currently").html(moment().format("dddd, MMMM Do YYYY, h:mm:ss a"));
}
setInterval(update, 1000);