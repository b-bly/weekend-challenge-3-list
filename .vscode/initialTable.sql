CREATE TABLE list (
	id SERIAL PRIMARY KEY,
	item VARCHAR(200) NOT NULL
);

INSERT INTO list (item)
VALUES ('fix bike'),
('play with nephew'),
('make an awesome sandwich'),
('don''t swim in the lake anymore (dog days)');
