const nba = require('nba-api-client');
const fs = require('fs');
var util = require('util');
const Client = require('pg').Client


const client = new Client({
    connectionString: "postgres://bxfqmiva:UTn8x6X1jpew3yFT3dCHmXnoe3nYnjge@isilo.db.elephantsql.com:5432/bxfqmiva",
})

client.connect()
 



nba.allPlayersList().then((res ,err) => {
    var teams = new Map();
    var data = res.CommonAllPlayers
    for(var id in data){
        var team_name = data[id]["TEAM_NAME"]
        if (team_name !== "") {
            if (!teams.has(team_name)) {
                teams.set(team_name, {
                    "players": []
                })
            }
            teams.get(team_name).players.push(
                [data[id]["DISPLAY_FIRST_LAST"],data[id]["PERSON_ID"]])
        }
        
    }
    teams.forEach((value, key) => {
        client.query("INSERT INTO teams VALUES ($1)", [key], (error, results) => {
            if (err) {
                throw err
            }
            value.players.forEach(value => {
                client.query("INSERT INTO players VALUES ($1, $2, $3)", [value[1], value[0],key], (err,res) => {
                    if (err) {
                        throw err
                    }
                })
            })
        })}
    )
})

