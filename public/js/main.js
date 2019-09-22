


/*var socket = io(); //load socket.io-client and connect to the host that serves the page
window.addEventListener("load", function(){ //when page loads
    var lightbox = document.getElementById("light"); 
    lightbox.addEventListener("change", function() { //add event listener for when checkbox changes
        socket.emit("light", Number(this.checked)); //send button status to server (as 1 or 0)
    });
});
socket.on('light', function (data) { //get button status from client
    document.getElementById("light").checked = data; //change checkbox according to push button on Raspberry Pi
    socket.emit("light", data); //send push button status to back to server
});*/


function loop() {

    var serverAdd = 'http://localhost:8080';
    var socket = io(serverAdd);
    socket.on('datetime', function (data1, data2) {

        var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
            'Sep', 'Oct', 'Nov', 'Dec'];

        var d = new Date(data1.datetime);
        var h = d.getHours();
        var m = d.getMinutes();
        var s = d.getSeconds();
        var month = d.getMonth();
        var day = d.getDay();
        var date = d.getDate();
        var year = d.getFullYear();
        h = addZero(h);
        m = addZero(m);
        s = addZero(s);

        document.getElementById('day').innerHTML = days[day];

        day = addZero(day);

        var time = h + ':' + m + ':' + s;
        var date = months[month] + '/' + date + '/' + year;
        announce(h, m);

        document.getElementById('time').innerHTML = time;
        document.getElementById('date').innerHTML = date;



        function addZero(i) {
            if (i < 10) { i = "0" + i };
            //location.reload(true);
            return i;
        }
        function announce(h, m) {
            var breaktime = false;
            
                switch (h) {
                    case '09': {
                        if (m >= 45) {
                            document.getElementById("info").innerHTML = "Breaktime";
                            breaktime = true;
                            emit_data(breaktime)
                            
                        }
                        break;
                    }

                    case 12: {
                        if (m >= 0) {
                            document.getElementById("info").innerHTML = "Breaktime";
                            breaktime = true;
                            emit_data(breaktime)
                            
                        }
                        break;
                    }

                    case 15: {
                        if (m <= 14) {
                            document.getElementById("info").innerHTML = "Breaktime";
                            breaktime = true;
                            emit_data(breaktime)
                            
                        }
                        else {
                            document.getElementById("info").innerHTML = "Pamugas Mode!";
                            breaktime = false;
                            emit_data(breaktime)
                            break;
                                
                        }
                        break;
                    }

                    default: {
                        document.getElementById("info").innerHTML = "Pamugas Mode!";
                        breaktime = false;
                        emit_data(breaktime)
                        break;
                    }


                }
            

        }
        
        function emit_data(status) {
            if (!data2) {
                socket.emit("relay", status );
            }
            
        }
 

    });


}




