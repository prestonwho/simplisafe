/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
//var Vector2 = require('vector2');
//var URL = 'http://api.openweathermap.org/data/2.5/weather?q=London,uk';

var main = new UI.Card({
  title: 'SimpliSafe',
  icon: 'images/menu_icon.png',
  subtitle: 'Logging in.',
  body: 'Please wait...'
});

// Show splash
var splashCard = new UI.Card({
  title: "SimpliSafe",
  subtitle: 'Logging In.',
  body: "Please Wait..."
});


main.show();

splashCard.show();

// Login
function login()
{
  ajax({ url: 'https://simplisafe.com/mobile/login/?mobile=true',
         method: 'POST',
         type: 'text',
         data: 'name=prestonwho&pass=77B52sC_Bkqk9wKYu&device_name=my_iphone&device_uuid=51644e80-1b62-11e3-b773-0800200c9a66&version=1200&no_persist=1&XDEBUG_SESSION_START=session_name',
         headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
       },
       // Successful Login
       function(text) {
         console.log('got text ' + text); //json.stringify);
         var json = JSON.parse(text,2);

         getlocations(json.uid);
       },
       // Failed Login
       function(error) {
         console.log('Ajax failed: ' + error);
         
         return null;
       }
    );
}


  
// Get location list next
function getlocations(uid)
{
  ajax({ url: 'https://simplisafe.com/mobile/' + uid + '/locations',
        method: 'POST',
        type: 'text',
        data: 'no_persist=1&XDEBUG_SESSION_START=session_name',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
       },
       // Successful location list
       function(text) {
         console.log('got text ' + text);
         var locations = JSON.parse(text,2);
         console.log('location count: ' + locations.num_locations);
         console.log('loc 0: ' + locations.locations[(Object.keys(locations.locations)[0])].system_state);
         showmenu(uid,Object.keys(locations.locations)[0]);
         //return locations[0];
       },
       // Failed location list
       function(error) {
         console.log('location list failed: ' + error);
         
         return null;
       }
    );
}

function showmenu(uid,lid)
{
      var menu = new UI.Menu({
        sections: [{
          items: [{
            title: 'Off',
            //icon: 'images/menu_icon.png',
            subtitle: 'Disable Alarm',
          }, {
            title: 'Away',
            subtitle: 'Arm Alarm',
          }, {
            title: 'Home',
            subtitle: 'Arm doors, not motion',
          }]
        }]
      });
  
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
          body: "To " + newstate.toUpper() + '.',
        });
        
        waitCard.show();
        
        ajax({ url: 'https://simplisafe.com/mobile/' + uid + '/sid/' + lid + '/set-state',
              method: 'POST',
              type: 'text',
              data: 'state=' + newstate + '&mobile=1&no_persist=1&XDEBUG_SESSION_START=session_name',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
             },

             function(text) {
               console.log('got text ' + text);
               var feedback = JSON.parse(text,2);
               waitCard.hide();
             },
             // Failed location list
             function(error) {
               console.log('menu ' + newstate + ' failed: ' + error);
               waitCard.hide();

               return null;
             });
              
        });

  
        menu.show(); 
        
        //splashCard.hide();
      }


     
login();

  
  
/*main.on('click', 'select', function(e) {
  var wind = new UI.Window();
  var textfield = new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(144, 30),
    font: 'gothic-24-bold',
    text: 'Text Anywhere!',
    textAlign: 'center'
  });
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});*/
