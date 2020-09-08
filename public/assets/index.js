let pepegalizer = 
{
    colors: { /* Default ones from Chart.js */
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    },
    pastelHex: [
        'C33C23',
        'DC453D',
        'FF6961',
        'FFFD96',
        'FFB447',
        'B399D4',
        'F5E1FD',
        'CE9DD9',
        'ADE6D0',
        'F1F0CF',
        'EBCEED',
        '799FCB',
        'F9665E',
        'FEBCC8',
        'D3EEFF',
        '85DE77'
    ],
    emotes: {
        // You should change the list below
        list: ["FeelsRectangleMan","xqcPls","HAMMERS","xqcCD","gachiGASM","EZ","monkaX","PepePls","gachiBASS","OMEGALUL","FeelsGladMan","nymnCorn","monkaGun","monkaSHAKE","Citto","WaitWhat","KKool","ZULUL","POGGERS","pepeSmoke","COGGERS","sumSmash","xqcSmash","ricardoFlick","FeelsRainMan","PepegaPls","gachiHYPER","GachiPls","forsenPls","TriKool","ppOverheat","HACKERMANS","GuitarTime","TeaTime","xqcJAM","peepoSad","xqcSlam","forsenWC","xqcDisco","TriDance","WAYTOODANK","peepoClap","yikesJAM","PepegaAim","pepeMeltdown","pepeJAM","xqcDitch","xqcSpin","ppHop","pepeD","WEEBSOUT","3Kool","TriFi","ModTime","PepegaDriving","PepegaShower","MufasaPls","xqcADHD","PepegaCredit","CokeTime","PepegaReading","SHUNGITE","PETTHESCHNOZER","FeelsLagMan","xqcBless","xqcTechno","DonoWall","xqcCoomer","PianoTime","catJAM","Pepepains","xqcMald","PepegaChat","modCheck","xqcFlushed","ViolinTime", "3Head","4Heed","4House","4Shrug","5Head","AYAYA","AYAYAY","BOGGED","FeelsDankMan","FeelsOkayMan","FeelsStrongMan","FeelsWeirdMan","FeelsWeirdManW","HYPERDANSGAME","HYPERS","HandsUp","KKomrade","KKonaW","KKrikey","Kapp","LULW","MEGALUL","MaN","OkayChamp","PagChomp","PauseChamp","PeepoGlad","PepeHands","PepeLaugh","Pepega","PepegaBlind","Pog","PogU","Sadge","TriEasy","VaN","WeirdChamp","WideHard","cooBruh","forsenCD","haHAA","monkaEyes","monkaHmm","monkaTOS","monkaW","peepoWTF","widepeepoHappy","widepeepoSad"],
        top: [],
        recentTop: [],
        nSorted: []
    }
};

let config = {
    type: 'pie',
    data: {
        datasets: [{
            borderWidth: 0,
            data: [
                
            ],
            backgroundColor: [
                pepegalizer.colors.red,
                pepegalizer.colors.orange,
                pepegalizer.colors.yellow,
                pepegalizer.colors.green,
                pepegalizer.colors.blue,
            ],
            label: 'Dataset 1'
        }],
        labels: [
            
        ]
    },
    options: {
        responsive: true
    }
};

/* Probably not the best way, but the simplest I found to copy config array without fucking with dependencies and references */
let recentConfig = JSON.parse(JSON.stringify(config));

/**
 * @param {Function} randomNumber Get a random number between two values: min, max
 * @param {Number} min Inclusive minimum number
 * @param {Number} max Inclusive maximum number
 */
let randomNumber = (min=0, max=10) => Math.floor(Math.random() * (max-min + 1) + min);

/**
 * @param {Function} toRGB Converts hex colors to RGB
 */
String.prototype.toRGB = function(){
    console.log(this);
    let rgbhexarray = this.toString().match(/.{1,2}/g);
    let rgbarray = [
        parseInt(rgbhexarray[0], 16),
        parseInt(rgbhexarray[1], 16),
        parseInt(rgbhexarray[2], 16)
    ];
    return rgbarray;
}

window.onload = () => {
    window.totalPieChart = new Chart(document.getElementById('canvas').getContext('2d'), config);
    window.recentPieChart = new Chart(document.getElementById('recentTop').getContext('2d'), recentConfig);

    /*
    Socket.io
    */

    let socket = io();
    socket.on(`data`, (data) => {
        /*

            #######################
            #                     #
            #   Total Pie Chart   #
            #                     #
            #######################

        */
        let tempKeySort = Object.keys(data.emotes.total).sort((a,b)=>data.emotes.total[a].counter-data.emotes.total[b].counter).reverse();

        config.data.datasets[0].data = [], config.data.labels = [], pepegalizer.emotes.top = [];

        for(let i=0;i<5;i++) {
            pepegalizer.emotes.top.push({ name: tempKeySort[i], value: data.emotes.total[tempKeySort[i]].counter });
        }
        console.log(pepegalizer.emotes.top);
        for(let i=0;i<5;i++) {
            config.data.datasets[0].data.push(pepegalizer.emotes.top[i].value);
            config.data.labels.push(`${pepegalizer.emotes.top[i].name}`);
        }
        window.totalPieChart.update();

        /*

            #########################
            #                      #
            #   Recent Pie Chart   #
            #                      #
            ########################

        */

       tempKeySort = Object.keys(data.emotes.recent).sort((a,b)=>data.emotes.recent[a].counter-data.emotes.recent[b].counter).reverse();

       recentConfig.data.datasets[0].data = [], recentConfig.data.labels = [], pepegalizer.emotes.recentTop = [];

       for(let i=0;i<5;i++) {
           pepegalizer.emotes.recentTop.push({ name: tempKeySort[i] ? tempKeySort[i]: "...", value: data.emotes.recent[tempKeySort[i]] ? data.emotes.recent[tempKeySort[i]].counter : 0 });
       }
       console.log(pepegalizer.emotes.recentTop);
       for(let i=0;i<5;i++) {
           recentConfig.data.datasets[0].data.push(pepegalizer.emotes.recentTop[i].value);
           recentConfig.data.labels.push(pepegalizer.emotes.recentTop[i].name);
       }
       window.recentPieChart.update();

        /*

            #########################
            #                       #
            #      Emote Usage      #
            #                       #
            #########################

        */

        let usageConfig = {
            type: 'bar',
            data: {
                labels: ["Emotes"],
                datasets: []
            }
        };

        window.emoteUsageBarChart = new Chart(document.getElementById('emoteUsage').getContext('2d'), usageConfig);

        usageConfig.data.datasets = [];
        addnSorted(data, Object.keys(data.emotes.total));
        for(let i=0;i<20;i++) {
            usageConfig.data.datasets.push({
                label: pepegalizer.emotes.nSorted[i].name,
                backgroundColor: pepegalizer.emotes.nSorted[i].color,
                borderWidth: 1,
                data: [
                    pepegalizer.emotes.nSorted[i].value
                ]
            });
        }
        window.emoteUsageBarChart.update();
    });
}

let addnSorted = (data, keys) => {
    for(let i=0;i<20;i++) {
        let pickedColor = pepegalizer.pastelHex[randomNumber(0, pepegalizer.pastelHex.length - 1)].toRGB();
        pepegalizer.emotes.nSorted.push({ name: keys[i], value: data.emotes.total[keys[i]].counter, color: `rgb(${pickedColor[0]}, ${pickedColor[1]}, ${pickedColor[2]})` });
    }

    // Removing the Loading wrapper here, because everything should already have been loaded by now.
    $(".loading").fadeOut("slow");

    addnSorted = (data, keys) => {
        for(let i=0;i<20;i++) {
            pepegalizer.emotes.nSorted[i].value = data.emotes.total[keys[i]].counter;
        }
    };
}


function darkModeSwitch() {
    let dms = $('#darkSwitch');
    if(dms[0].checked) {
        $('body, nav').each(function(){ $(this).addClass('dark-theme'); })
        $('nav').removeClass('navbar-light bg-light');
        $('nav').addClass('navbar-dark bg-dark');
    }
    else {
        $('body, nav').each(function(){ $(this).removeClass('dark-theme'); })
        $('nav').addClass('navbar-light bg-light');
        $('nav').removeClass('navbar-dark bg-dark');
    }
}