var cql = require('node-cassandra-cql');
var client = new cql.Client({hosts: ['192.241.240.26:9042'], keyspace: 'solace', username: 'cassandra', password: 'cassandra'});

var thisSocket;

var getComments = function(){
    
    var returnValue = '';
    
    client.execute('SELECT * FROM solace.main', [], function(err, result) {

        if (err) {
            console.log('execute failed', err);
            returnValue = "Execute Failed";

        } else {
            for (var i = 0; i < result.rows.length; i++) {
                returnValue += ('id=' + result.rows[i].get('topic_id') + ' test_value=' + result.rows[i].get('content'));
            }
        }
        
        console.log(returnValue);
        
        return returnValue;
    });
};




// export function for listening to the socket
module.exports = function (socket) {

	
	socket.on('connection', function (socket) {
        socket.emit('message', {message: 'welcome to the chat' });
    });
    
    
    
    socket.on('send', function(data){
		
        console.log('executed', data);	

		client.execute("INSERT INTO solace.main (topic_id, event_time, content) values('1234ABCD',  '2013-04-03 07:02:00','72F')", [], function(err, result) {
			
	        if (err) {

	            console.log('execute failed', err);
	
	        } else {
	        
                socket.broadcast.emit('message', data);
	        }
	      
        });
 		
    });
    

    socket.on('sendtemp', function(data){
		
        var obj = "{ message : \"Raj\" }";
		
		client.execute('SELECT * FROM solace.main', [], function(err, result) {
			
	        if (err) {

	            console.log('execute failed', err);
	            returnValue = "Execute Failed";
	
	        } else {
	            for (var i = 0; i < result.rows.length; i++) {
	                console.log('id=' + result.rows[i].get('topic_id') + ' test_value=' + result.rows[i].get('content'));
	            }
	            
                socket.emit('message',  {message: 'welcome to the chat' });
	        }
	        
	      
        });
       
 		
    });
};