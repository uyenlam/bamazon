var mysql = require('mysql');
var inquirer = require('inquirer');
// var Table = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "Bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as id " + connection.threadId);
    navigate();
})


var navigate = function() {
    inquirer.prompt({
        type: "list",
        name: "selection",
        message: "Welcome to Bamazon. Please select a usermode.",
        choices: ["Customer View", "Manager View", "Exit App"]
    }).then(function(ans) {
        switch (ans.selection) {
            case "Customer View":
                customerPage();
                break;

            case "Manager View":
                managerPage();
                break;

            case "Exit App":
                console.log("Thanks for using Bamazon");
                connection.end();
        }
    })
}

var customerPage = function() {
    connection.query('Select * from products', function(err, res) {
        if (err) throw err;


    	console.log("Here are the products that we have available.");
        for (var i = 0; i < res.length; i++){
        	console.log("Product ID: " + res[i].id);
        	console.log("Product Name: " + res[i].product_name);
        	console.log("Price: " + res[i].price);
        	console.log("================");
        }
        
        customerAction();
   
    })

    //functions within the customerPage group of functions

    var customerAction = function() {
        inquirer.prompt({
            type: "confirm",
            name: "action",
            message: "Would you like to make a purchase?",
            default: true,
        }).then(function(ans) {
            if (ans.action === true) {
                customerBuy();
            } else if (ans.selection === false) {
                console.log("No problem. You will be re-directed to the navigation page.");
                navigate();
            }
        });
    };

    var customerBuy = function() {
        inquirer.prompt([{
            type: 'input',
            name: 'productId',
            message: 'Enter the product ID you want to buy'
        }, {
            type: 'input',
            name: 'quantity',
            message: 'Enter the quantity you want to buy'
        }]).then(function(ans) {
            connection.query('Select * from products where id=?', [ans.productId], function(err, res1) {
            	console.log(res1[0].stock_quantity);

                if (err) {
                	console.log("Sorry, the product does not exist. Please try again.");
                    customerAction();
                };
                

                if (ans.quantity > res1[0].stock_quantity) {
                    console.log('Insufficient Quantity! Please enter another quantity.');
                    customerAction();
                }

                if (ans.quantity <= res1[0].stock_quantity) {

                	var promise = new Promise(function(success, failure){
                		connection.query('Update products set stock_quantity=? where id=?', [res1[0].stock_quantity - ans.quantity, ans.productId], function(err, res2) {
	                        // console.log("Purchase successful!");
	                        // var totalcost = ans.quantity * res2[0].price;
	                        // console.log("Your total cost is " + totalcost + " dollars.");
	                        console.log(res2,err);


	                        if (err){
	                        	failure(err);
	                        } else {
	                        	success(res2);
	                        }
	                    })

                	}).then(function(res2) {
                        inquirer.prompt({
                            type: 'confirm',
                            name: 'again',
                            message: 'Would you like to place another order?',
                            default: true
                        }).then(function(answer) {
                            if (answer.again === true) {
                            	customerPage();
                            } else if(answer.again === false){
                            	console.log("Thanks for shopping. You will be re-directed to the navigation page.")
                            	navigate();
                            }

                        })
                    })
                };
            })
        })
    }
}

connectToDb().then(function(){
	console.log('you\'re connected as ' + connection.threadId);
	return showAllProducts();
}).then(function(products){
	return takeOrder(products);
}.then(function(product){
	if (!product){
		// choose another product
	} else {
		return getQuantity(product).then(function(requested_quantity){
			var db_quantity;
			if (product.stock_quantity >= requested_quantity){
				// do the transaction
				// return a promise here
				db_quantity = prduct.stock_quantity - requested_quantity;
				items_sold = requested_quantity + product.product_sales;
				return changeStock(product.item_id,db_quantity).then(function(){
					console.log("Congratulations, you are the new proud owner of " + requested_quantity + '' 
					+ product.product_name + '(s) for $' + (requested_quantity*product.price));
					
				})
			} else {
				// don't do the transaction
			}	
		});
	}
}.then(function(){
	return showAllProducts();
}.catch(function(err){ //this is where we catch the failure
	console.log(err);
});






function changeStock(item_id, stock_quantity, product_sales){
	return queryDB('UPDATE products SET stock_quantity = ?, product_sales = ? WHERE item_id = ?',[stock_quantity,product_sales,item_id]);
}


function connectToDb(){
	return new Promise(function (success,failure){
		connection.connect(function(err,res){
			if (err){
				failure(err);
			} else {
				success();
			}
		})
	})
}

function queryDb(string,data){
	return new Promise(function (success, failure){
		connection.query(string,data,function(err, res){
			if (err){
				failure();
			} else{
				success(response);
			}
		})
	})
}

function takeOrder(){
	return inquirer.prompt([{
		type:'input',
		name:'item_id',
		message:'Enter item_id',
	}]).then(function (answer){
		return products.find(function(item){
			return item.item_id == answer.item_id;
		});
		if (!product){
			//error
		} else {
			return product;
		}
	});
}

function getQuantity(product){ //the product was returned from the then in takeOrder
	return inquirer.prompt([{
		type: 'input',
		name: 'quantity',
		message: 'How many ' + product.product_name + ' do you want?'
	}]).then(function(ans){
		return ans.quantity;
	});
}