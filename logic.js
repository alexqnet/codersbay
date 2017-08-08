src="https://www.gstatic.com/firebasejs/4.2.0/firebase.js"

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBcSCE1d0gPDsw5SNGRGjh0dhzEoKbi_00",
    authDomain: "qdotclass-codersbay.firebaseapp.com",
    databaseURL: "https://qdotclass-codersbay.firebaseio.com",
    projectId: "qdotclass-codersbay",
    storageBucket: "",
    messagingSenderId: "555061907832"
  };
  firebase.initializeApp(config);

// Make sure to match the configuration to the script version number in the HTML
// (Ex. 3.0 != 3.7.0)

//Presence

// Create a variable to reference the database.
var database = firebase.database();

// -------------------------------------------------------------- (CRITICAL - BLOCK) --------------------------- //
// connectionsRef references a specific location in our database.
// All of our connections will be stored in this directory.
var connectionsRef = database.ref("/connections");

// '.info/connected' is a special location provided by Firebase that is updated every time
// the client's connection state changes.
// '.info/connected' is a boolean value, true if the client is connected and false if they are not.
var connectedRef = database.ref(".info/connected");

// When the client's connection state changes...
connectedRef.on("value", function(snap) {

  // If they are connected..
  if (snap.val()) {

    // Add user to the connections list.
    var con = connectionsRef.push(true);

    // Remove user from the connection list when they disconnect.
    con.onDisconnect().remove();
  }
});

// When first loaded or when the connections list changes...
connectionsRef.on("value", function(snap) {

  // Display the viewer count in the html.
  // The number of online users is the number of children in the connections list.
  $("#watchers").html(snap.numChildren());
});




// Initial Values
var initialBid = 0;
var initialBidder = "No one :-(";
var highPrice = initialBid;
var highBidder = initialBidder;

// --------------------------------------------------------------

// At the initial load and subsequent value changes, get a snapshot of the local data.
// This function allows you to update your page in real-time when the firebase database changes.
database.ref().on("value", function(snapshot) {
  console.log(snapshot.val());

  // If Firebase has a highPrice and highBidder stored (first case)
  if (snapshot.child("highBidder").exists() && snapshot.child("highPrice").exists()) {

    // Set the local variables for highBidder equal to the stored values in firebase.
    highPrice = snapshot.val().highPrice;
    highBidder = snapshot.val().highBidder;


    // change the HTML to reflect the newly updated local values (most recent information from firebase)
      $("#highest-price").html(highPrice);
      $("#highest-bidder").html(highBidder);

    // Print the local data to the console.
    console.log(highBidder);
    console.log(highPrice);





  }

  // Else Firebase doesn't have a highPrice/highBidder, so use the initial local values.
  else {

    // Change the HTML to reflect the local value in firebase
    highPrice = initialBid;
    highBidder = initialBidder;

      $("#highest-price").html(highPrice);
      $("#highest-bidder").html(highBidder);

    // Print the local data to the console.
    console.log(highPrice);
    console.log(highBidder);

  }


// If any errors are experienced, log them to console.
}, function(errorObject) {
  console.log("The read failed: " + errorObject.code);
});

// --------------------------------------------------------------

// Whenever a user clicks the submit-bid button
$("#submit-bid").on("click", function(event) {
  // Prevent form from submitting
  event.preventDefault();

  // Get the input values
      var bidderName = $("#bidder-name").val();
      var bidderPrice = $("#bidder-price").val();
      console.log (bidderName);
      console.log (bidderPrice);

  // Log the Bidder and Price (Even if not the highest)
  if (bidderPrice > highPrice) {

    // Alert
    alert("You are now the highest bidder.");

    // Save the new price in Firebase
database.ref().set({
        highBidder: bidderName,
        highPrice: bidderPrice
        // bidderName: highBidder,
        // bidderPrice: highPrice
      });

    // Log the new High Price
    console.log(highPrice);
    console.log(highBidder);

    // Store the new high price and bidder name as a local variable (could have also used the Firebase variable)



    // Change the HTML to reflect the new high price and bidder
      $("#highest-price").html(highPrice);
      $("#highest-bidder").html(highBidder);
  }

  else {
    // Alert
    alert("Sorry that bid is too low. Try again.");
  }

});
