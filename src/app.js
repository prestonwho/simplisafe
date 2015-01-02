/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
//var URL = 'http://api.openweathermap.org/data/2.5/weather?q=London,uk';

var main = new UI.Card({
  title: 'Pebble.js',
  icon: 'images/menu_icon.png',
  subtitle: 'Hello World!',
  body: 'Press any button.'
});

// Show splash
var splashCard = new UI.Card({
  title: "Please Wait",
  body: "Downloading..."
});


main.show();

splashCard.show();

// Login
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

       // Get location list next
       ajax({ url: 'https://simplisafe.com/mobile/' + json.uid + '/locations',
              method: 'POST',
              type: 'text',
              data: 'no_persist=1&XDEBUG_SESSION_START=session_name',
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            },
            // Successful location list
            function(text) {
              var locations = JSON.parse(text,2);
              console.log('location count: ' + locations.num_locations);
              
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
               menu.on('select', function(e) {
                 console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
                 console.log('The item is titled "' + e.item.title + '"');
                 
                 switch(e.itemIndex) {
                   case 0: //Off;
                     break;
                   case 1: //Away;
                     break;
                   case 2: //Home;
                     break;
                 }
               });
                 
               //});
               menu.show();
              
            },
            // Failed location list
            function(error) {
              
            }
          );
       
       
         // Use data to show a weather forecast Card
         //var resultsCard = new UI.Card({
         //  title: 'Logged In',
         //  body: 'Result: ' + json.return_code + '\nUser: ' + json.username,
         //});
      
         // Show results, remove splash card
         //resultsCard.show();
         
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
         menu.on('select', function(e) {
           console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
           console.log('The item is titled "' + e.item.title + '"');
           
           switch(e.itemIndex) {
             case 0: //Off;
               break;
             case 1: //Away;
               break;
             case 2: //Home;
               break;
           }
         });
           
         //});
         menu.show();
     
         splashCard.hide();
         main.body = "All done!";
         //console.log(json.weather[0].main + '\nTemp: ' + temp);
       },
       function(error) {
         console.log('Ajax failed: ' + error);
       }
);


main.on('click', 'up', function(e) {
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
        subtitle: 'Arm doors but not motion',
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

main.on('click', 'select', function(e) {
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
});
