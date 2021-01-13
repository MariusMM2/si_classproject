-- SQLite
PRAGMA FOREIGN_KEYS = ON;

DROP TABLE IF EXISTS OperationLog;
DROP TABLE IF EXISTS User;

CREATE TABLE User
(
    Id          INTEGER PRIMARY KEY AUTOINCREMENT,
    FirstName   TEXT NOT NULL,
    LastName    TEXT NOT NULL,
    DateOfBirth DATE NOT NULL,
    Cpr         TEXT NOT NULL UNIQUE,
    Email       TEXT NOT NULL,
    NemId       TEXT NOT NULL,
    CreatedAt   DATE DEFAULT CURRENT_TIMESTAMP,
    ModifiedAt  DATE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE OperationLog
(
    Id         INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId     INTEGER NOT NULL,
    CreatedAt  DATE    DEFAULT CURRENT_TIMESTAMP,
    Operation  TEXT    NOT NULL,
    Successful BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (UserId) REFERENCES User (Id) ON DELETE CASCADE
);

INSERT INTO User(FirstName, LastName, DateOfBirth, Cpr, Email, NemId)
VALUES ('hello', 'world', '2000-01-05', '0501001234', 'hworld@email.com', '123123456');
INSERT INTO OperationLog(UserId, Operation, Successful)
VALUES (1, 'authenticate', FALSE),
       (1, 'reset-nem-id-password', TRUE),
       (1, 'authenticate', TRUE);
