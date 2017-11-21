'use strict';

const APIAI_TOKEN = '0bca16a37999442b809ef9570f7049e6 ';
const APIAI_SESSION_ID = 'ffcb8c2ed46e45e993e859d110b9d228';

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images

const server = app.listen(process.env.PORT || 3000, () => {
  console.log('Express server listening on port %d', server.address().port);
});

const io = require('socket.io')(server);
io.on('connection', function(socket){
  console.log('a user connected');
});

const apiai = require('apiai')(APIAI_TOKEN);

// Web UI
app.get('/', (req, res) => {
  res.sendFile('bot.html');
});

io.on('connection', function(socket) {
  socket.on('chat message', (text) => {
    console.log('Message: ' + text);

    // Get a reply from API.ai

    let apiaiReq = apiai.textRequest(text, {
      sessionId: APIAI_SESSION_ID
    });

    apiaiReq.on('response', (response) => {
      var x = 10;
      console.log("response json:" + JSON.stringify(response));
      console.log("intent name is" + response.result.metadata.intentName);
      let aiText = response.result.fulfillment.speech;
      console.log(aiText + x);

      console.log('Bot reply: ' + aiText);
      socket.emit('bot reply', aiText);
    });

    apiaiReq.on('error', (error) => {
      console.log(error);
    });

    apiaiReq.end();

  });
});
