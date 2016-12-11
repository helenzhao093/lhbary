CREATE TABLE Cardholder(
	card_id VARCHAR(10) NOT NULL,
	cname VARCHAR(50) NOT NULL,
	address CHAR(100) NOT NULL,
	contact NUMERIC(10,0) NOT NULL,
	fine 	NUMERIC (5,2),
	delinquent BOOLEAN,
	PRIMARY KEY (card_id)
);

CREATE TABLE Library(
	lib_id 	VARCHAR(10) NOT NULL,
	lib_name VARCHAR(50) NOT NULL,
	address CHAR(100) NOT NULL,
	PRIMARY KEY (lib_id)
);

CREATE TABLE Authors(
	author_id VARCHAR(10) NOT NULL,
	name CHAR(50) NOT NULL,
	birthyear NUMERIC(4,0), 
	deathyear NUMERIC (4,0),  
	PRIMARY KEY (author_id)
);

CREATE TABLE Media(
	ISBN NUMERIC(13,0) NOT NULL, 
	insta_no NUMERIC(3,0) NOT NULL, 	
	lib_id VARCHAR(10) NOT NULL, 
	status CHAR(20),
	title CHAR(100) NOT NULL, 
	genre CHAR(50),
	language CHAR(50),
	publisher CHAR(50),
	year NUMERIC(4,0),
	subject CHAR(50),
	keywords CHAR(100),
	PRIMARY KEY (ISBN, insta_no),
	CHECK (status in ('AVAILABLE', 'NOT AVAILABLE'))
);

CREATE TABLE Book(
	ISBN NUMERIC(13,0) NOT NULL, 
	insta_no NUMERIC(3,0) NOT NULL,
	no_pages NUMERIC(4,0),
	PRIMARY KEY (ISBN, insta_no),
	FOREIGN KEY (ISBN, insta_no) REFERENCES Media (ISBN, insta_no)
);

CREATE TABLE Video(
	ISBN NUMERIC(13,0) NOT NULL, 
	insta_no NUMERIC(3,0) NOT NULL, 	
	length VARCHAR(10), 
	director CHAR(100),
	PRIMARY KEY (ISBN, insta_no),
	FOREIGN KEY (ISBN, insta_no) REFERENCES Media (ISBN, insta_no)
);

CREATE TABLE Periodical(
	ISBN 	NUMERIC(13,0) NOT NULL, 
	insta_no NUMERIC(3,0) NOT NULL,
	vol_no 	NUMERIC(4,0) NOT NULL, 	
	issue_no 	NUMERIC(4,0) NOT NULL,
	PRIMARY KEY (ISBN, insta_no), 
	FOREIGN KEY (ISBN, insta_no) REFERENCES Book (ISBN, insta_no)
);

CREATE TABLE Authored(
	ISBN NUMERIC(13,0) NOT NULL,
	insta_no NUMERIC(3,0) NOT NULL,
	author_id VARCHAR(10) NOT NULL,
	PRIMARY KEY (ISBN, insta_no, author_id),
	FOREIGN KEY (ISBN, insta_no) REFERENCES Media (ISBN, insta_no),
	FOREIGN KEY (author_id) REFERENCES Authors (author_id)
); 

CREATE TABLE Checkout(
	ISBN NUMERIC(13,0) NOT NULL, 
	insta_no NUMERIC(3,0) NOT NULL,
	card_id VARCHAR(10) NOT NULL, 
	dateout DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, 
	expiry DATETIME NOT NULL,
	# should be system variable
	renewals INT DEFAULT 0,
	PRIMARY KEY (ISBN, insta_no, card_id),
	FOREIGN KEY (ISBN, insta_no) REFERENCES Media (ISBN, insta_no),
	FOREIGN KEY (card_id) REFERENCES Cardholder (card_id)
);

CREATE TABLE Reserve(
	ISBN NUMERIC(13,0) NOT NULL, 
	insta_no NUMERIC(3,0) NOT NULL,
	card_id VARCHAR(10) NOT NULL, 	
	dest_lib VARCHAR(10) NOT NULL,
	reserveDate DATE NOT NULL,
	expiry DATE NOT NULL,
	PRIMARY KEY (ISBN, insta_no, card_id),
	FOREIGN KEY (ISBN, insta_no) REFERENCES Media (ISBN, insta_no),
	FOREIGN KEY (card_id) REFERENCES Cardholder (card_id)
);

CREATE TABLE Loan(
	loanlib_id VARCHAR(10) NOT NULL, 
	brwlib_id VARCHAR(10) NOT NULL,
	ISBN NUMERIC(13,0) NOT NULL, 
	insta_no NUMERIC(3,0) NOT NULL,
	PRIMARY KEY (loanlib_id, brwlib_id, ISBN, insta_no),
	FOREIGN KEY (loanlib_id) REFERENCES Library (lib_id),
	FOREIGN KEY (brwlib_id) REFERENCES Library (lib_id),
	FOREIGN KEY (ISBN, insta_no) REFERENCES Media (ISBN, insta_no)
);
