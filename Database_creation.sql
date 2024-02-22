-- Create Database if not exists
CREATE DATABASE IF NOT EXISTS social_media;

-- Connect to the database
\c social_media;

-- Create User Table
CREATE TABLE "user" (
    userID SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    profile_picture BYTEA,
    registrationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Friendship Table
CREATE TABLE friendship (
    friendshipID SERIAL PRIMARY KEY,
    userID1 INT,
    userID2 INT,
    status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (userID1) REFERENCES "user"(userID),
    FOREIGN KEY (userID2) REFERENCES "user"(userID)
);

-- Create Post Table
CREATE TABLE post (
    postID SERIAL PRIMARY KEY,
    userID INT,
    content TEXT,
    img BYTEA,
    postDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES "User"(userID)
);

-- Create Like Table
CREATE TABLE like (
    likeID SERIAL PRIMARY KEY,
    postID INT,
    userID INT,
    likeDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postID) REFERENCES post(postID),
    FOREIGN KEY (userID) REFERENCES "user"(userID)
);

-- Create Comment Table
CREATE TABLE comment (
    commentID SERIAL PRIMARY KEY,
    postID INT,
    userID INT,
    content TEXT,
    commentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (postID) REFERENCES post(postID),
    FOREIGN KEY (userID) REFERENCES "user"(userID)
);

-- Create Notification Table
CREATE TABLE notification (
    notificationID SERIAL PRIMARY KEY,
    userID INT,
    notificationType VARCHAR(255),
    notificationContent TEXT,
    notificationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    isRead BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (userID) REFERENCES "user"(userID)
);