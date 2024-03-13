-- Create Database if not exists
SELECT 'CREATE DATABASE social_media'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'social_media')\gexec


-- Connect to the database
\c social_media;

-- Delete database user if exists
DROP USER IF EXISTS social_media_api;

-- Create database user and grant privileges
CREATE USER social_media_api WITH PASSWORD 'demo123';
-- NOTE: The grant commands needs to be run seperately in psql
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO social_media_api;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO social_media_api;

-- Create User Table
CREATE TABLE app_user (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255) DEFAULT '/default.jpg',
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Friendship Table
CREATE TABLE friendship (
    friendship_id SERIAL PRIMARY KEY,
    user_id1 INT,
    user_id2 INT,
    status VARCHAR(20) DEFAULT 'pending',
    FOREIGN KEY (user_id1) REFERENCES app_user(user_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id2) REFERENCES app_user(user_id) ON DELETE CASCADE
);

-- Create Post Table
CREATE TABLE post (
    post_id SERIAL PRIMARY KEY,
    user_id INT,
    content TEXT,
    img VARCHAR(255),
    post_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE CASCADE
);

-- Create Like Table
CREATE TABLE post_like (
    like_id SERIAL PRIMARY KEY,
    post_id INT,
    user_id INT,
    like_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE CASCADE
);

-- Create Comment Table
CREATE TABLE post_comment (
    comment_id SERIAL PRIMARY KEY,
    post_id INT,
    user_id INT,
    content TEXT,
    comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE CASCADE
);

-- Create Share Table
CREATE TABLE post_share (
    share_id SERIAL PRIMARY KEY,
    post_id INT,
    user_id INT,
    share_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES post(post_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE CASCADE
);

-- Create Notification Table
CREATE TABLE notification (
    notification_id SERIAL PRIMARY KEY,
    user_id INT,
    notification_type VARCHAR(255),
    notification_content TEXT,
    notification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES app_user(user_id) ON DELETE CASCADE
);