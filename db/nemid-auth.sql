-- SQLite
PRAGMA FOREIGN_KEYS = ON;

DROP TABLE IF EXISTS Token;
DROP TABLE IF EXISTS AuthAttempt;
DROP TABLE IF EXISTS State;

CREATE TABLE AuthAttempt
(
    Id            INTEGER PRIMARY KEY AUTOINCREMENT,
    StateId       INTEGER NOT NULL,
    NemId         TEXT    NOT NULL,
    GeneratedCode TEXT    NOT NULL,
    CreatedAt     DATE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (StateId) REFERENCES State (Id)
);

CREATE TABLE State
(
    Id    INTEGER PRIMARY KEY AUTOINCREMENT,
    Label TEXT NOT NULL UNIQUE
);

CREATE TABLE Token
(
    Id            INTEGER PRIMARY KEY AUTOINCREMENT,
    AuthAttemptId INTEGER NOT NULL,
    Token         TEXT    NOT NULL,
    CreatedAt     DATE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (AuthAttemptId) REFERENCES AuthAttempt (Id)
);

INSERT INTO State(Label)
VALUES ('pending'),
       ('successful'),
       ('failed');
INSERT INTO AuthAttempt(StateId, NemId, GeneratedCode)
VALUES (1, 'hello', 'code here'),
       (2, 'world', 'another code here'),
       (3, 'foobar', 'yach');
INSERT INTO Token(AuthAttemptId, Token)
-- password: "password"
VALUES (1, 'asdfrandomtokencantreadthis');
