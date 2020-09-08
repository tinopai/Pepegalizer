/*

    ########################
    # Express & Socket.io! #
    #        Sadge         #
    ########################

*/

// Express
let express = require('express');
const { connected } = require('process');
let app = express();

// HTML
let http = require('http').createServer(app);

// Configuration and Socket.IO
let config = require(__dirname + `/config.json`);
let io = require('socket.io')(http);

// Helper functions
let pepegalizer = { 
    /**
     * @param {String} m The message you want to be printed on console
     */
    std: (m, t="Log", c="cyan", success=true) => {
        color = { red: `\x1b[31m`, cyan: `\x1b[36m`, yellow: `\x1b[33m` };
        if(!Object.entries(color).includes(c)) return { success: false, message: m, pvc_std_log: "Invalid color" };

        console.log(`${color[c]}[Pepegalizer-${t}]\x1b[0m ${m}`);
        return { success: success, message: m };
    },
    err: (m) => pepegalizer.std(m, "Error", "red", false),
    warn: (m) => pepegalizer.std(m, "Warning", "yellow"),
    log: (m) => pepegalizer.std(m)
};

// Set root
app.get('/', (req, res) => res.sendFile(__dirname + `/public/index.html`));
// Static assets
app.use(`/assets`, express.static(`public/assets`));

// APIs and thingies
app.get(`/stats`, (req, res) => { 
  res.setHeader(`X-Powered-By`, `Express and love`);
  res.json({
    success: true,
    emotes: {
      total: sentEmotes,
      recent: {
        cleared: recentEmotes.clear,
        emotes: recentEmotes.emotes
      }
    }
  });
  res.end();
});

/*
  Socket.io
*/
io.on('connection', (socket) => {
  pepegalizer.log(`${socket.conn.remoteAddress} connected! Sending data`);
  socket.emit(`data`, {
    success: true,
    emotes: {
      total: sentEmotes,
      recent: recentEmotes.emotes
    }
  });
});


/*

    ########################
    #     Twitch part!     #
    #         PogU         #
    ########################

*/

const tmi = require('tmi.js'), fs = require('fs');

// Define configuration options
const opts = {
  identity: {
    username: config.twitch.username, //       Read
    password: config.twitch.password  //    TwitchTMI.md
  },
  channels: [
    "xQcOW" // You can use any channel
  ]
};

// Create a client with our options
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

client.connect();

let 
    sentEmotes = JSON.parse(fs.readFileSync("emotes.json")),
    recentEmotes = { emotes: {}, clear: (new Date).getTime() },
    // You will need to manually update those from their respective websites, also I recommend using https://delim.co
    BTTV = ["FeelsRectangleMan","xqcPls","HAMMERS","xqcCD","gachiGASM","EZ","monkaX","PepePls","gachiBASS","OMEGALUL","FeelsGladMan","nymnCorn","monkaGun","monkaSHAKE","Citto","WaitWhat","KKool","ZULUL","POGGERS","pepeSmoke","COGGERS","sumSmash","xqcSmash","ricardoFlick","FeelsRainMan","PepegaPls","gachiHYPER","GachiPls","forsenPls","TriKool","ppOverheat","HACKERMANS","GuitarTime","TeaTime","xqcJAM","peepoSad","xqcSlam","forsenWC","xqcDisco","TriDance","WAYTOODANK","peepoClap","yikesJAM","PepegaAim","pepeMeltdown","pepeJAM","xqcDitch","xqcSpin","ppHop","pepeD","WEEBSOUT","3Kool","TriFi","ModTime","PepegaDriving","PepegaShower","MufasaPls","xqcADHD","PepegaCredit","CokeTime","PepegaReading","SHUNGITE","PETTHESCHNOZER","FeelsLagMan","xqcBless","xqcTechno","DonoWall","xqcCoomer","PianoTime","catJAM","Pepepains","xqcMald","PepegaChat","modCheck","xqcFlushed","ViolinTime"],
    FrankerFacez = [ "3Head","4Heed","4House","4Shrug","5Head","AYAYA","AYAYAY","BOGGED","FeelsDankMan","FeelsOkayMan","FeelsStrongMan","FeelsWeirdMan","FeelsWeirdManW","HYPERDANSGAME","HYPERS","HandsUp","KKomrade","KKonaW","KKrikey","Kapp","LULW","MEGALUL","MaN","OkayChamp","PagChomp","PauseChamp","PeepoGlad","PepeHands","PepeLaugh","Pepega","PepegaBlind","Pog","PogU","Sadge","TriEasy","VaN","WeirdChamp","WideHard","cooBruh","forsenCD","haHAA","monkaEyes","monkaHmm","monkaTOS","monkaW","peepoWTF","widepeepoHappy","widepeepoSad" ]
;


function onMessageHandler (target, context, msg, self) {
  if(self) return;
    let matches = { 
        ff: msg.match(`/(${FrankerFacez.join(")|(")})/gm`),
        bttv: msg.match(`/(${BTTV.join(")|(")})/gm`),
        both: msg.match(`/(${BTTV.join(")|(")})|(${FrankerFacez.join(")|(")})/gm`)
    };

    //let hasClap = msg.includes("Clap");
    if(matches.both != null) {
        if(sentEmotes[matches.both[0]]) {
            sentEmotes[matches.both[0]].counter++;
        }
        else 
            sentEmotes[matches.both[0]] = { counter: 1 };

        if(recentEmotes.emotes[matches.both[0]]) 
          recentEmotes.emotes[matches.both[0]].counter++;
        else 
          recentEmotes.emotes[matches.both[0]] = { counter: 1 };
    }
}

setInterval(() => {
  /* Send data to socket */
  io.emit(`data`, {
    success: true,
    emotes: {
      total: sentEmotes,
      recent: recentEmotes.emotes
    }
  });
  recentEmotes.emotes = {};
  recentEmotes.clear = (new Date).getTime();
  fs.writeFile("emotes.json", JSON.stringify(sentEmotes), () => {});
}, 15 * 1000);

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  pepegalizer.log(`> Connected to ${addr}:${port}`);
}



// Listen to HTTP Port
http.listen(config.port, () => pepegalizer.log(`Listening to *:${config.port}`));
