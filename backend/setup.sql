CREATE TABLE teams (
    team_name VARCHAR (50) PRIMARY KEY
);

CREATE TABLE players (
    player_id BIGINT PRIMARY KEY,
    player_name VARCHAR (50) NOT NULL,
    team_name VARCHAR (50)  REFERENCES teams (team_name)
);

CREATE TABLE actions (
    match_id TEXT PRIMARY KEY,
    away_team_name VARCHAR (50) REFERENCES teams (team_name),
    home_team_name  VARCHAR (50) REFERENCES teams (team_name),
    player_id  BIGINT  REFERENCES players (player_id),
    description   TEXT,
    x FLOAT,
    y FLOAT,
    time INT,
    type TEXT,
    current_home_score INT,
    current_away_score INT,
    home_action boolean
);
