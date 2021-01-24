CREATE TABLE user(
	user_id VARCHAR(30) NOT NULL UNIQUE,
	user_pw VARCHAR(30) NOT NULL,
	user_nickname VARCHAR(50) DEFAULT '#',
	PRIMARY KEY(user_id)
);

CREATE TABLE post(
	post_id INT AUTO_INCREMENT,
	post_title VARCHAR(100) NOT NULL,
	post_content TEXT(65535),
	post_createdate VARCHAR(50) NOT NULL,
	post_author VARCHAR(30) NOT NULL,
	PRIMARY KEY(post_id),
	FOREIGN KEY(post_author) REFERENCES user(user_id)
);

CREATE TABLE image(
	image_id INT AUTO_INCREMENT,
	image_link VARCHAR(1000) NOT NULL,
	image_author INT NOT NULL,
	PRIMARY KEY(image_id),
	FOREIGN KEY(image_author) REFERENCES post(post_id)
);

CREATE TABLE reply(
	reply_id INT AUTO_INCREMENT,
	reply_content TEXT(3000) NOT NULL,
	reply_createdate VARCHAR(50) NOT NULL,
	reply_post_author INT NOT NULL,
	reply_user_author VARCHAR(30) NOT NULL,
	PRIMARY KEY(reply_id),
	FOREIGN KEY(reply_post_author) REFERENCES post(post_id),
	FOREIGN KEY(reply_user_author) REFERENCES user(user_id)
);