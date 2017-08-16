-- create vending_machine database

CREATE SCHEMA `vending_machine` ;


-- create items table
CREATE TABLE `vending_machine`.`items` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL,
  `price` INT NULL,
  `stock` INT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));

-- transactions table
CREATE TABLE `vending_machine`.`transactions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `item` VARCHAR(45) NOT NULL,
  `price` INT NOT NULL,
  `money_provided` INT NOT NULL,
  `change_returned` INT NOT NULL,
  `stock` INT NOT NULL,
  `ledger` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC));

