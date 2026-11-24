CREATE TABLE IF NOT EXISTS records (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title VARCHAR(80) NOT NULL,
  category VARCHAR(40) NOT NULL,
  description VARCHAR(300) NOT NULL,
  status VARCHAR(20) NOT NULL
    CHECK (status IN ('Pending', 'In progress', 'Completed')),
  CONSTRAINT records_title_length CHECK (char_length(title) BETWEEN 3 AND 80),
  CONSTRAINT records_category_length CHECK (char_length(category) BETWEEN 2 AND 40),
  CONSTRAINT records_description_length CHECK (char_length(description) BETWEEN 5 AND 300)
);
