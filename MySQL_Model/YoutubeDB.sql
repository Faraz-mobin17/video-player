CREATE DATABASE IF NOT EXISTS Youtube;
USE Youtube;
-- drop table Users;
-- drop table Users , Comments, Videos, Subscriptions, Playlist, Tweets, Likes;
show tables;
use youtube;
select * from videos;

CREATE TABLE Users (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    avatar VARCHAR(255),
    coverImage VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Videos (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL, -- Users table parent
    videoFile VARCHAR(255) NOT NULL,
    thumbnail VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT NOT NULL,
    views INT NOT NULL,
    isPublished BOOLEAN NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT video_duration_check CHECK (duration > 0),
    CONSTRAINT video_title_check CHECK (title IS NOT NULL AND title <> ''),
    CONSTRAINT video_description_check CHECK (description IS NOT NULL AND description <> ''),
    FOREIGN KEY(user_id) REFERENCES Users(id)
);

CREATE TABLE WatchHistory (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL, -- Foreign key referencing Users table
    video_id INT NOT NULL, -- Foreign key referencing Videos table
    watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (video_id) REFERENCES Vidoes(id)
);

CREATE TABLE Tweets (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES Users(id)
);

CREATE TABLE Subscriptions (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    subscriber_id INT NOT NULL,
    channel_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (subscriber_id) REFERENCES Users(id),
    FOREIGN KEY (channel_id) REFERENCES Users(id)
);

CREATE TABLE Comments (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    video_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES Users(id),
    FOREIGN KEY(video_id) REFERENCES Videos(id)
);

CREATE TABLE Likes (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    video_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (video_id) REFERENCES Videos (id)
);

CREATE TABLE Playlists (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    user_id int not null,
    video_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT playlist_name_check CHECK (name IS NOT NULL AND name <> ''),
    CONSTRAINT playlist_description_check CHECK (description IS NOT NULL AND description <> ''),
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (video_id) REFERENCES Videos(video_id)
);


