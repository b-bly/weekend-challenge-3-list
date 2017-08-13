CREATE TABLE list (
	id SERIAL PRIMARY KEY,
	item VARCHAR(200) NOT NULL,
	complete VARCHAR(1) NOT NULL
);

INSERT INTO list (item, complete)
VALUES ('fix bike', 'n'),
('play with nephew', 'n'),
('make an awesome sandwich', 'n'),
('don''t swim in the lake anymore (dog days)', 'n');
