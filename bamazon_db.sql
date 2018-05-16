DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_DB;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(500)NULL,
department_name VARCHAR(550)NULL,
price DECIMAL(10,2) NULL,
stock_quantity INT NULL,
PRIMARY KEY (item_id)
);

SELECT * FROM products;
	
CREATE TABLE departments (
department_id INT NOT NULL AUTO_INCREMENT,
department_name VARCHAR(550)NULL,
over_head_costs DECIMAL(10,2)NULL,
total_profits DECIMAL(10,2) NULL,
PRIMARY KEY (department_id)
);
