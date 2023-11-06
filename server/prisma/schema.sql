CREATE TABLE D_VISION.event (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    access_code VARCHAR(255) NOT NULL,
    access_code_type ENUM('text', 'QR', 'both') NOT NULL,
    state ENUM('OPEN', 'CLOSED') NOT NULL
);

CREATE TABLE D_VISION.event_group (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    state ENUM('OPEN', 'CLOSED') NOT NULL
);

CREATE TABLE D_VISION.event_group_event (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    event_group_id INT NOT NULL,
    FOREIGN KEY (event_id) REFERENCES event(id),
    FOREIGN KEY (event_group_id) REFERENCES event_group(id)
);

CREATE TABLE D_VISION.user (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role ENUM('participant', 'event organizer') NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255)
);

CREATE TABLE D_VISION.attendance (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    event_id INT NOT NULL,
    participant_id INT NOT NULL,
    attendence_time DATETIME NOT NULL,
    FOREIGN KEY (event_id) REFERENCES event(id),
    FOREIGN KEY (participant_id) REFERENCES user(id)
);