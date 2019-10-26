const firebaseConfig = {
    apiKey: "AIzaSyD92khrsPuhNNaLTUI-DicbW67SoqzCFMc",
    authDomain: "train-scheduler-cc19e.firebaseapp.com",
    databaseURL: "https://train-scheduler-cc19e.firebaseio.com",
    projectId: "train-scheduler-cc19e",
    storageBucket: "train-scheduler-cc19e.appspot.com",
    messagingSenderId: "417060822038",
    appId: "1:417060822038:web:f72e368605905e13f1a937",
    measurementId: "G-KDW4XDQMPN"
};

$(document).ready(function () {

    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    var database = firebase.database();

    // Initial Values
    var trainName = "";
    var destination = "";
    var firstTime = "";
    var frequency = 0;
    var trainCount = 1;

    // Capture Button Click
    $("#add-train").on("click", function (event) {
        event.preventDefault();

        // Grabbed values from text boxes
        trainName = $("#name-input").val().trim();
        destination = $("#destination-input").val().trim();
        firstTime = $("#time-input").val().trim();
        frequency = $("#frequency-input").val().trim();

        // if (trainName === ! "" && destination === ! "" && firstTime === ! "" && frequency === ! "") {
        // Code for handling the push
        database.ref("/trains/number").set({
            trainCount: trainCount
        });

        database.ref("/trains/train-" + trainCount).push({
            trainName: trainName,
            destination: destination,
            firstTime: firstTime,
            frequency: frequency,
            dateAdded: firebase.database.ServerValue.TIMESTAMP
        });

        // }
        trainCount++

        $("#name-input").val("");
        $("#destination-input").val("");
        $("#time-input").val("");
        $("#frequency-input").val("");
    });

    database.ref("/trains/train-"+trainCount).on("child_added", function (childSnapshot) {

        var trainName = childSnapshot.val().trainName;
        var destination = childSnapshot.val().destination;
        var firstTrain = childSnapshot.val().firstTime;
        var frequency = childSnapshot.val().frequency;

        //First time
        var firstTimeConverted = moment(firstTrain, "hh:mm").subtract(1, "years");

        // Current time
        var currentTime = moment();

        // Difference between times
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

        // Time apart
        var tRemainder = diffTime % frequency;

        // Mins until train
        var tMinutesTillTrain = frequency - tRemainder;

        // Next train
        var nextTrain = moment().add(tMinutesTillTrain, "minutes").format("hh:mm");

        var newRow = $("<tr>").append(
            $("<td>").text(trainName),
            $("<td>").text(destination),
            $("<td>").text(frequency),
            $("<td>").text(nextTrain),
            $("<td>").text(tMinutesTillTrain),
        );
        $("#schedule").append(newRow);

    })

})