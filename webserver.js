var app = require('http').createServer(handler);
var url = require('url');
var fs = require('fs');
var io = require('socket.io')(app)
var Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
var LED = new Gpio(3, 'out'); //use GPIO pin 3 as output
var pushButton = new Gpio(2, 'in', 'both'); //use GPIO pin 2 as input, and 'both' button presses, and releases should be handled



//This will open a server at localhost:8080. Navigate to this in your browser.
app.listen(8080);

// Http handler function
function handler (req, res) {

  // Using URL to parse the requested URL
  var path = url.parse(req.url).pathname;
  // Managing the root route
  if (path == '/') {
      index = fs.readFile(__dirname+'/public/index.html', 
          function(error,data) {
              if (error) {
                  res.writeHead(500);
                  return res.end("Error: unable to load index.html");
              }
              res.writeHead(200,{'Content-Type': 'text/html'});
              res.end(data);
          });
  // Managing the route for the javascript files
  } else if( /\.(js)$/.test(path) ) {
      index = fs.readFile(__dirname+'/public'+path, 
          function(error,data) {
              if (error) {
                  res.writeHead(500);
                  return res.end("Error: unable to load " + path);
              }
              res.writeHead(200,{'Content-Type': 'text/plain'});
              res.end(data);
          });
  // Managing the route for the css files            
  } else if( /\.(css)$/.test(path) ) {
    index = fs.readFile(__dirname+'/public'+path, 
        function(error,data) {
            if (error) {
                res.writeHead(500);
                return res.end("Error: unable to load " + path);
            }
            res.writeHead(200,{'Content-Type': 'text/css'});
            res.end(data);
        }); 
  // Managing the route for the ttf font files 
  } else if( /\.(ttf)$/.test(path) ) {
    index = fs.readFile(__dirname+'/public'+path, 
        function(error,data) {
            if (error) {
                res.writeHead(500);
                return res.end("Error: unable to load " + path);
            }
            res.writeHead(200,{'Content-Type': 'font'});
            res.end(data);
        }); 

  } else {
          res.writeHead(404);
          res.end("Error: 404 - File not found.");
    }    

}


io.sockets.on('connection', function (socket) {// WebSocket Connection
  var sw_active = false;

  // Fall back switch instance
  pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
    }
    
    if (value == 0) {
      LED.writeSync(0);
      sw_active = true;
      console.log('Relay deactivated');
      
    }
    
    else {
     
      LED.writeSync(1);
      sw_active = false;
      console.log('Relay activated');
    
    }
    
  });
  
  
  // Send date object and switch status to client every 1 sec. 
  setInterval(function() {
  socket.emit('datetime', {'datetime': new Date()}, sw_active);
  }, 1000);
  
  // Data from client
  socket.on('relay', function(data) { //get status from client
    
    if (data) {
      LED.writeSync(1);
      console.log('Relay activated');
    }
    else {
      LED.writeSync(0);
      console.log('Relay deactivated');
    }
  });
});

process.on('SIGINT', function() { //on ctrl+c
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport LED GPIO to free resources
  pushButton.unexport(); // Unexport Button GPIO to free resources
  console.log("---- Server shutdown! ----");
  process.exit(); //exit completely
  
});



