INSERT INTO Users (id, watchHistory,username, email, fullname, avatar, coverImage, password)
VALUES (1, 1, 'user1', 'user1@example.com', 'User 1', 'avatar1', 'coverImage1', 'password1');

INSERT INTO Videos (videoFile, thumbnail, owner, title, description, duration, views, isPublished)
VALUES ('video1.mp4', 'thumbnail1.jpg', 1, 'Video 1', 'Description 1', 1, 100, 1);

INSERT INTO Tweets (id, owner, content)
VALUES (1, 1, 'Tweet 1');

INSERT INTO Subscriptions (id, subscriber, channel)
VALUES (1, 1, 2);

INSERT INTO Comments ( content, video, owner)
VALUES ('Comment 2',2, 2);

INSERT INTO Likes (comment, video, likedBy, tweet)
VALUES (1, 1, 1, 1);

INSERT INTO Playlists (id, name, description, videos, owner)
VALUES (1, 'Playlist 1', 'Description 1', 1, 1);



