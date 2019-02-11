
DROP DATABASE IF EXISTS tooltech;
CREATE DATABASE tooltech;

\c tooltech;

CREATE TABLE tech (
  ID SERIAL PRIMARY KEY,
  name VARCHAR,
  location VARCHAR,
  date VARCHAR,
  image VARCHAR,
  info VARCHAR
);

INSERT INTO tech (name, location, date,image, info)
  VALUES ('React', 'Banglaore', 3, 'M');