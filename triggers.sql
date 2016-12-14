# Cardholder can not reserved more than 20 media items. 
CREATE TRIGGER MaxReserve  
	BEFORE INSERT ON Checkout  
	FOR EACH ROW 
	IF (SELECT COUNT(*) FROM Reserve WHERE card_id = NEW.card_id) = 20 THEN  
		CALL RAISE_APPLICATION_ERROR (3001, 'Reserve Denied!'); 
	END IF;

# Cardholder can not checkout more than 20 media items.
CREATE TRIGGER MaxCheckout  
	BEFORE INSERT ON Checkout  
	FOR EACH ROW 
	IF (SELECT COUNT(*) FROM Checkout WHERE card_id = NEW.card_id) = 20 THEN 
		CALL RAISE_APPLICATION_ERROR (3001, 'Checkout Denied!'); 
	END IF;

# The cardholder can not renew a book more than 2 times. When a cardholder renews a checked out book, the expiry date extends 3 weeks. 
CREATE TRIGGER Renewal
	BEFORE UPDATE ON Checkout 
	FOR EACH ROW 
	UPDATE Checkout SET NEW.expiry = DATE_ADD(OLD.expiry, INTERVAL 3 WEEK);

ALTER TABLE Checkout 
	ADD CONSTRAINT maxRenewals CHECK (renewals < 3) ;

# When a medium is checked out, the expiry date is by default 3 weeks after check out date. When a medium is reserved, the reservation expires in 3 weeks. 
CREATE TRIGGER checkoutDate 
	BEFORE INSERT ON Checkout 
	FOR EACH ROW 
	SET NEW.expiry = DATE_ADD(NEW.dateout, INTERVAL 3 WEEK);

CREATE TRIGGER reservationExpiry
	BEFORE INSERT ON Reserve
	FOR EACH ROW 
	SET NEW.expiry = DATE_ADD(NEW.checkout, INTERVAL 3 WEEK);

# When a medium is checked out, the availability is changed to unavailable. 
CREATE TRIGGER unavailable 
AFTER INSERT ON Checkout
	FOR EACH ROW
	UPDATE Media
	SET status = "unavailable"
	WHERE ISBN = NEW.ISBN and insta_no = NEW.insta_no 

# When reservations expire, they are deleted. 
CREATE TRIGGER deleteExpireReservations
	AFTER UPDATE ON Auxiliary
	FOR EACH ROW  
	DELETE FROM Reserve 
	WHERE DATEDIFF(expiry, NEW.today) < 0 ;

# When the user reserves a media to be picked up at a library that does not own the media, a loan is made between the two libraries
CREATE TRIGGER createLoan 
	AFTER INSERT ON Reserve 
	FOR EACH ROW 
	BEGIN 
		DECLARE home_lib varchar(10); 
		SELECT lib_id FROM Media 
		WHERE ISBN = NEW.ISBN AND insta_no = NEW.insta_no INTO home_lib; 
		IF home_lib <> NEW.dest_lib THEN 
		INSERT INTO Loan (loanlib_id, brwlib_id, ISBN, insta_no) 
		VALUES (home_lib, NEW.dest_lib, NEW.ISBN, NEW.insta_no); 
		END IF; 
	END;

# When the date updates, the fines of cardholders with overdue books are updated.
CREATE TRIGGER fines 
	AFTER UPDATE ON Auxiliary 
	FOR EACH ROW 
	BEGIN 
		DECLARE user varchar(10); 
		SELECT card_id FROM RESERVES 
		WHERE DATEDIFF((SELECT expiry FROM Reserve), NEW.today) < 0 INTO user;  UPDATE Cardholder 
		SET fine = fine + 1  WHERE card_id = user; 
	END;

# When a cardholder has a fine greater than 20, then the delinquent status is updated to true. 
CREATE TRIGGER delinquency 
	AFTER UPDATE ON Cardholder  
	FOR EACH ROW 
	BEGIN 
		IF (SELECT fine FROM Cardholder) > 20 THEN 
		UPDATE Cardholder SET NEW.delinquent = TRUE; 
		END IF; 
	END;

# A cardholder with a delinquent status can not checkout a book. 
CREATE TRIGGER delinquent 
	BEFORE INSERT ON Checkout  
	FOR EACH ROW 
	BEGIN 
		DECLARE status BOOLEAN; 
		SELECT delinquent INTO status FROM Cardholder WHERE card_id = NEW.card_id;
		IF status  = TRUE THEN 
			CALL RAISE_APPLICATION_ERROR(3001, 'Delinquent cannot checkout book!'); 
		END IF; 
	END;

# When the cardholder checks out a reserved book, the reservation is deleted. 
CREATE TRIGGER deleteReserve 
	AFTER UPDATE ON Checkout  
	FOR EACH ROW 
	BEGIN 
		IF (SELECT COUNT(*) FROM Reserve WHERE card_id = NEW.card_id AND ISBN = NEW.ISBN AND insta_no = NEW.insta_no) > 0 THEN  
			DELETE FROM Reserve WHERE card_id = NEW.card_id AND ISBN = NEW.ISBN AND insta_no = NEW.insta_no; 
		END IF; 
	END;

# When a medium is returned to a library, 
# If the library owns the medium and there are no reservations, then the status of the medium is updated to available.  
UPDATE Media
	SET status = “available” WHERE ISBN = “input_ISBN” AND insta_no = “input_instance”;

# The checked out tuple for the medium is deleted. 
CREATE TRIGGER returnedBook  
	AFTER UPDATE ON Media 
	FOR EACH ROW 
	IF NEW.status = "available" THEN  
		DELETE FROM Checkout WHERE ISBN = NEW.ISBN AND insta_no = NEW.insta_no; 
	END IF;
