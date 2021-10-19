var util = require('util');
const Client = require('pg').Client
const express = require('express')
const app = express()
const port = 3000



var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

const client = new Client({
    connectionString: "postgres://bxfqmiva:UTn8x6X1jpew3yFT3dCHmXnoe3nYnjge@isilo.db.elephantsql.com:5432/bxfqmiva",
})

client.connect()



app.get('/teams', (req, res) => {
    client.query("SELECT team_name FROM teams", (err, respond) => {
        var array = []
        respond.rows.forEach((val, key) => array.push(val["team_name"]))
        res.send(array)
    })
})

app.get('/players', (req, res) => {
    client.query("SELECT player_name FROM players WHERE team_name = $1",[req.query.team], (err, respond) => {
        var array = []
        respond.rows.forEach((val, key) => array.push(val["player_name"]))
        res.send(array)
    })
})

app.post("/insert", (req, res) => {
    var match_id = req.body.match_id;
    var away_team_name = req.body.away_team_name;
    var home_team_name = req.body.home_team_name;
    var player_id = req.body.player_id;
    var description = req.body.description;
    var x = req.body.x;
    var y = req.body.y;
    var time = req.body.time;
    var type = req.body.type;
    var current_home_score = req.body.current_home_score;
    var current_away_score = req.body.current_away_score;
    var home_action = req.body.home_action;

    client.query("INSERT INTO actions VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)",
                [match_id, away_team_name, home_team_name, player_id, description,
                x, y, time, type, current_home_score, current_away_score, home_action],
                (err, responder) => {
                    if (err) {
                        res.send(err)
                    } else {
                        res.send(200)
                    }
                }) 
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))