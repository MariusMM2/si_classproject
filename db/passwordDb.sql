-- SQLite
PRAGMA FOREIGN_KEYS = ON;

DROP TABLE IF EXISTS Password;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Gender;

CREATE TABLE User
(
    Id         INTEGER PRIMARY KEY AUTOINCREMENT,
    NemId      TEXT    NOT NULL,
    Cpr        TEXT    NOT NULL UNIQUE,
    CreatedAt  DATE DEFAULT CURRENT_TIMESTAMP,
    ModifiedAt DATE DEFAULT CURRENT_TIMESTAMP,
    GenderId   INTEGER NOT NULL,
    Email      TEXT    NOT NULL,
    FOREIGN KEY (GenderId) REFERENCES Gender (Id)
);

CREATE TABLE Gender
(
    Id    INTEGER PRIMARY KEY AUTOINCREMENT,
    Label TEXT NOT NULL UNIQUE
);

CREATE TABLE Password
(
    Id           INTEGER PRIMARY KEY AUTOINCREMENT,
    UserId       INTEGER NOT NULL,
    PasswordHash TEXT    NOT NULL,
    CreatedAt    DATE    DEFAULT CURRENT_TIMESTAMP,
    IsValid      INTEGER DEFAULT TRUE,
    FOREIGN KEY (UserId) REFERENCES User (Id) ON DELETE CASCADE
);

INSERT INTO Gender(Label)
VALUES ('male'),
       ('female'),
       ('other');
INSERT INTO User(NemId, Cpr, GenderId, Email)
VALUES ('123123456', '0501001234', 1, 'hworld@email.com');
INSERT INTO Password(UserId, PasswordHash, IsValid)
-- password: "password"
VALUES (1, '$2b$10$I1iT0m/8kZI2N6SdY8nJK.ORMBQ9flD882m1SAkUU0EthNr5GV1mG', TRUE);
