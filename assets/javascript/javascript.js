//Initialize Firebase
    var config = {
        apiKey: "AIzaSyDVpEc6Skfj1Q9qoqpUbFhptWNOM0j__oo",
        authDomain: "rpsgame-9aed3.firebaseapp.com",
        databaseURL: "https://rpsgame-9aed3.firebaseio.com",
        projectId: "rpsgame-9aed3",
        storageBucket: "rpsgame-9aed3.appspot.com",
        messagingSenderId: "105917966385"
    };

    firebase.initializeApp(config);

    var database = firebase.database();
//End Initialize Firebase

    var train = {
      name: "",
      destination: "",
      frequency: 0,
      firstTrain: 0,
      nextArrivalTime: 0,
      minutesAway: "",
    }

    $(document).ready(function() {

        $("#submit").on("click", function(event) {
            event.preventDefault();
   
            train.name = $("#trainName").val().trim();
            train.destination = $("#destination").val().trim();
            train.frequency = $("#frequency").val().trim();
            train.firstTrain = $("#firstTrain").val().trim();

            var times = getTimes(train.firstTrain, train.frequency);

            train.nextArrivalTime = times[0];
            train.minutesAway = times[1];

            database.ref().push({
                name: train.name,
                destination: train.destination,
                frequency: train.frequency,
                firstTrain: train.firstTrain,
                nextArrivalTime: train.nextArrivalTime,
                minutesAway: train.minutesAway,
            });
        });

        database.ref().on("child_added", function(snapshot) {  
        //Create table row
            var sv = snapshot.val();

            $(tableBody).append(
                "<tr class='tableRow'>" +
                "<td class='tableCell'>" + sv.name + "</td>" +
                "<td class='tableCell'>" + sv.destination + "</td>" +
                "<td class='tableCell'>" + sv.frequency + "</td>" +
                "<td class='tableCell'>" + sv.nextArrivalTime + "</td>" +
                "<td class='tableCell'>" + sv.minutesAway + "</td>" +
                "</tr>"
            );
        });
    });

    function getTimes(firstTrain, frequency) {
        var times = []; //create an array to hold the times

        //stuff
        var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
        var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
        var tRemainder = diffTime % frequency;
        var tMinutesTillTrain = frequency - tRemainder;
        var nextTrain = moment().add(tMinutesTillTrain, "minutes");

        //populate array
        times.push(moment(nextTrain).format("hh:mm")); //index 0
        times.push(tMinutesTillTrain); // index 1

        return times //return the array with next train and minutes untill
    };







