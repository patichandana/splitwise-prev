CREATE TABLE users (
  user_id bigserial,
  email_id varchar(100) UNIQUE NOT NULL,
  password varchar(100) NOT NULL,
  name varchar(100) NOT NULL,
  created_at timestamptz NOT NULL,
  PRIMARY KEY(user_id)
);

CREATE TABLE grouptype(
  grouptype_id bigserial PRIMARY KEY,
  category_name VARCHAR[100] NOT NULL UNIQUE,
  created_at timestamptz NOT NULL
);


CREATE TABLE groups(
  group_id BIGSERIAL PRIMARY KEY,
  group_name VARCHAR[100] NOT NULL UNIQUE,
  type_id BIGINT REFERENCES grouptype(grouptype_id)  NOT NULL,
  created_by BIGINT REFERENCES users(user_id) NOT NULL,
  created_at timestamptz NOT NULL
);


CREATE TABLE currencies(
  currency_id BIGSERIAL PRIMARY KEY,
  name VARCHAR[25] NOT NULL UNIQUE
);

CREATE TABLE expense_categories(
  expense_category_id BIGSERIAL PRIMARY KEY,
  expense_category_name VARCHAR[100] NOT NULL UNIQUE,
  created_at TIMESTAMPTZ
);


CREATE TABLE expenses(
  expense_id BIGSERIAL PRIMARY KEY,
  group_id BIGINT REFERENCES groups(group_id) NOT NULL,
  expense_name VARCHAR(100) NOT NULL,
  expense_category_id BIGINT REFERENCES expense_categories(expense_category_id),
  description VARCHAR(500),
  amount NUMERIC(10,5) NOT NULL,
  currency_id BIGINT REFERENCES currencies(currency_id) NOT NULL,
  picture BYTEA,
  date DATE,
  created_at TIMESTAMPTZ NOT NULL,
  created_by BIGINT REFERENCES users(user_id),
  last_updated_at TIMESTAMPTZ,
  last_updated_by BIGINT REFERENCES users(user_id)
);

CREATE TABLE comments(
  comment_id BIGSERIAL PRIMARY KEY,
  expense_id BIGINT REFERENCES expenses(expense_id),
  comment TEXT NOT NULL,
  commented_by BIGINT REFERENCES users(user_id),
  commented_at TIMESTAMP NOT NULL
);

CREATE TABLE debts(
  debt_id BIGSERIAL PRIMARY KEY,
  expense_id BIGINT REFERENCES expenses(expense_id),
  amount NUMERIC(10,5) NOT NULL, 
  updated_by BIGINT NOT NULL,
  updated_at TIMESTAMPTZ
);
