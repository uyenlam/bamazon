# bamazon


create database Bamazon;
use Bamazon;

create table products(
id integer auto_increment not null,
primary key (id),
product_name varchar(50) not null,
department_name varchar(50),
price integer(20) not null,
stock_quantity integer(50) not null
);

select * from products;

insert into products(product_name,department_name,price,stock_quantity)
values
("Acer S3 Laptop","Computer & Electronics",800,20),
("MacBook 2016","Computer & Electronics",1200, 12),
("Black Aldo Handbag","Bags & Wallets",80,25),
("Red Louis Vuitton Wallet","Bags & Wallets",800,4),
("Pandora Cross Necklace","Accessories",200,15),
("Capana Diamond Cubic Necklace","Accessories",220,8),
("Pandora Pink Sapphire Earring","Accessories",60,25),
("MAC True Color Foundation","Make-up",36,50),
("Mac True Color Face Powder","Make-up",36,50),
("MAC Passion Red Lipstick","Make-up",40,50),
("Chanel Coco Mademoiselle","Perfume",92,40);




