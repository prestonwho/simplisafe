/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */


var UI = require('ui');
var ajax = require('ajax');
var Settings = require('settings');

var user = Settings.option('user');
var pass = Settings.option('pass');
var uid = Settings.option('uid');
var lid = Settings.option('lid');

var stateNums = { 2: 'Off', 4: 'Home', 5: 'Away', };
var currentState = "";

// global ui element definitions
var menu;



// Set a configurable with the open callback
Settings.config(
  {
    url: 'https://dl.dropboxusercontent.com/u/2051985/sites/prestonwho.com/pebble/simplisafe/config.html?user=' +
      Settings.option('user') + '&pass=' + Settings.option('pass'),
    autoSave: true
  },
  function(e) {
    console.log('opening configurable');
  },
  function(e) {
    console.log('closed configurable');
    // Show the parsed response
    
    console.log(JSON.stringify(e.options));

    console.log("Settings.option('user'): " + Settings.option('user'));
    
    // Show the raw response if parsing failed
    if (e.failed) {
      console.log(e.response);
    }
  }
);


// splash card
var splashCard = new UI.Card({
  //title: "SimpliSafe",
  //subtitle: 'Starting Up.',
  //body: "Logging In...",
  banner: 'simplisafe.png',
});


// error card
var errorCard = new UI.Card({
  title: "SimpliSafe",
  subtitle: 'Error',
  body: "Generic Error Screen. Sorry. :-(",
});


if(user)
{
  splashCard.show();
  //login();
}
else
{
  // Show help for first login
  var firstCard = new UI.Card(
  {
    title: 'SimpliSafe',
    subtitle: 'First Start',
    body: 'Please configure using Pebble phone app.',
  });
  
  firstCard.show();
}





// Login
function login()
{
  ajax(
    { 
      url: 'https://simplisafe.com/mobile/login/?mobile=true',
      method: 'POST',
      type: 'text',
      data: 'name=' + user + '&pass=' + pass + '&device_name=my_iphone&device_uuid=51644e80-1b62-11e3-b773-0800200c9a66&version=1200&no_persist=0&XDEBUG_SESSION_START=session_name',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
    // Successful Login
    function(text) {
      console.log('got text ' + text); //json.stringify);
      var json = JSON.parse(text,2);
         
      if(json.return_code === 0)
      {
        errorCard.show();
        splashCard.hide();
        return;
      }
         
      uid = json.uid;
      Settings.option('uid',uid);
      getLocations();
    },
    // Failed Login
    function(error) {
      console.log('Ajax failed: ' + error);
         
      return null;
    }
  );
}


  
// Get location list next
function getLocations()
{
  showMenu();
    
  ajax(
    {
      url: 'https://simplisafe.com/mobile/' + uid + '/locations',
      method: 'POST',
      type: 'text',
      data: 'no_persist=0&XDEBUG_SESSION_START=session_name',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
    // Successful location list
    function(text) {
      console.log('got text ' + text);
      var locations = JSON.parse(text,2);
      var numLocations = locations.num_locations;
         
      if(numLocations == 1)
      {
        currentState = locations.locations[(Object.keys(locations.locations)[0])].system_state;
         
        console.log('location count: ' + numLocations);
        console.log('loc 0: ' + locations.locations[(Object.keys(locations.locations)[0])].system_state);
         
        lid = Object.keys(locations.locations)[0];
        Settings.option('lid',lid);
      }
      else
      {
        // do something here to select a location if I have >1.
      }
      updateMenu();
         
         //return locations[0];
    },
    // Failed location list
    function(error) {
      console.log('location list failed: ' + error);
         
      return null;
    }
  );
}

function updateMenu()
{
  menu.item(0, 0, {
            title: 'Off' + (currentState.toLowerCase()=="off"?" (current)":""),
            subtitle: 'Disable Alarm',
          });
  menu.item(0, 1, {
            title: 'Away' + (currentState.toLowerCase()=="away"?" (current)":""),
            subtitle: 'Arm Alarm',
          });
  menu.item(0, 2, {
            title: 'Home' + (currentState.toLowerCase()=="home"?" (current)":""),
            subtitle: 'Arm doors, not motion',
          });
}

function showMenu()
{
menu = new UI.Menu();

updateMenu();


menu.on('select', function(e)
{  
  var newstate;
     
  console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
  console.log('The item is titled "' + e.item.title + '"');

  switch(e.itemIndex) {
    case 0:
      newstate='off';
      break;
    case 1:
      newstate='away';
      break;
    case 2:
      newstate='home';
      break;
  }
   
  var waitCard = new UI.Card({
    title: "Changing State",
    body: "To " + newstate + '.',
  });
  
  waitCard.show();
  //menu.hide();
  
  ajax(
    {
      url: 'https://simplisafe.com/mobile/' + uid + '/sid/' + lid + '/set-state',
      method: 'POST',
      type: 'text',
      data: 'state=' + newstate + '&mobile=1&no_persist=0&XDEBUG_SESSION_START=session_name',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },

    function(text) {
      console.log('got text ' + text);
      var feedback = JSON.parse(text,2);
      currentState = stateNums[feedback.result];
      
      waitCard.title("SimpliSafe");
      waitCard.subtitle("State updated.");
      waitCard.body("Alarm is now set to " + currentState + ".");
      waitCard.show();
      //waitCard.hide();
      setTimeout(function() { updateMenu(); waitCard.hide(); }, 3000);
    },
    // Failed location list
    function(error) {
      console.log('menu ' + newstate + ' failed: ' + error);
         
      var errorCard = new UI.Card({
        title: "SimpliSafe",
        subtitle: 'Error:',
        body: error,
      });
  
      errorCard.show();
         
      waitCard.hide();
      menu.hide();

         //return null;
    });
        
  });


  menu.show();
  
  splashCard.hide();
}
