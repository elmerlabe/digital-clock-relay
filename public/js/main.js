function loop() {

    var socket = io();
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
            return i;
        }
        function announce(h, m) {
            var breaktime = false;
            var b = "Breaktime";
            var w = "";
            var ot = "Pamugas Mode";
            var ul = "Pahuway Mode";
            
            
                switch (h) {
                    case '09': {
                        if (m >= 45) {
                            breaktime();
                        }
                        break;
                    }
                    case 12: {
                        if (m >= 0) {
                            breaktime();
                        }
                        break;
                    }
                    case 15: {
                        if (m <= 14) {
                            breaktime();
                        }
                        else {
                            workTime();
                            break;
                        }
                        break;
                    }
                    case 16:
                    case 17: {
                        if (m >= 0) {
                            overtime();
                        }
                        break;
                    }
                    case 18:
                    case 19:
                    case 20:
                    case 21:
                    case 22:
                    case 23:
                    case '00':
                    case '01':
                    case '02':
                    case '03':
                    case '04':
                    case '05':
                    case '06': {
                        if (m >= 0) {
                            document.getElementById("info").innerHTML = ul;
                            breaktime = true;
                            emit_data(breaktime);
                        }
                        break;

                    }
                    default: {
                        workTime();
                        break;
                    }
                    
                                    
                    function breaktime() {
                        document.getElementById("info").innerHTML = b;
                        breaktime = true;
                        emit_data(breaktime);
                    }
                    
                    function workTime() {
                        document.getElementById("info").innerHTML = w;
                        breaktime = false;
                        emit_data(breaktime);
                    }
                    
                    function overtime() {
                        document.getElementById("info").innerHTML = ot;
                        breaktime = false;
                        emit_data(breaktime);
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




