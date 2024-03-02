-- ALTER TABLE Users
-- ADD FOREIGN KEY(watchHistory) REFERENCES Videos(id); -- parent table is Videos

ALTER TABLE Videos
ADD FOREIGN KEY(user_id) REFERENCES Users(id); -- User is parent table 

ALTER TABLE WatchHistory 
ADD FOREIGN KEY(user_id) REFERENCES Users(id),
ADD FOREIGN KEY (video_id) REFERENCES Videos(id);

ALTER TABLE Tweets
ADD FOREIGN KEY(user_id) REFERENCES Users(id);

ALTER TABLE Subscriptions
ADD FOREIGN KEY(subscriber_id) REFERENCES Users(id),
ADD FOREIGN KEY(channel_id) REFERENCES Users(id);

ALTER TABLE Comments
ADD FOREIGN KEY(user_id) REFERENCES Users(id),
ADD FOREIGN KEY(video_id) REFERENCES Videos(id);

ALTER TABLE Likes
ADD FOREIGN KEY(video_id) REFERENCES Videos(id),
ADD FOREIGN KEY(user_id) REFERENCES Users(id);

ALTER TABLE Playlists
ADD FOREIGN KEY(user_id) REFERENCES Users(id),
ADD FOREIGN KEY(video_id) REFERENCES Videos(id);



