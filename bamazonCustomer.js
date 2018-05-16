var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Selma2014",
    database: "bamazon_DB"
  });
// connect to the mysql server and sql database
    connection.connect(function(err) {
        if (err) throw err;
    // run the start function after the connection is made to prompt the user
    displayItems();
  });
  function displayItems(){
   connection.query( "SELECT * FROM products", function(err, result) {
    if (err) throw err;
    // instantiate
var table = new Table({
    head: ['ITEM ID', 'NAME',"DEPARTMENT",'PRICE']
  , colWidths: [5,80,40,10]

});
for (var i = 0; i < result.length; i++) {
    table.push([result[i].item_id, result[i].product_name,result[i].department_name,result[i].price]
    );           
}
console.log(table.toString());
selectitem();
   });

  };
function selectitem(){
    inquirer.prompt([{
        name: "item",
        type: "input",
        message: "What would you like to buy?"
       },{
        name: "quantity",
        type: "input",
        message: "How many would you like to buy?"   
       }]).then(function(answers) {
    var item = answers.item;
    var quantity = answers.quantity;
    var queryStr = 'SELECT * FROM products WHERE ?';
    connection.query(queryStr, {item_id: item}, function(err, res){
        if(err)throw err;
        
        var productData = res[0];
        // If the quantity requested by the user is in stock
        if (quantity <= productData.stock_quantity) {
            console.log('Congratulations, the product you requested is in stock! Placing order!'.yellow);
            // Construct the updating query string
            var updateQueryStr = 'UPDATE products SET stock_quantity = ' + (productData.stock_quantity - quantity) + ' WHERE item_id = ' + item;
            var totalcost = productData.price * quantity;
            // var rev=productData.product_sales+totalcost;
            // var updaterevenue = 'UPDATE products SET  product_sales = ' +rev + ' WHERE item_id = ' + item;
            // connection.query(updaterevenue, function(err, res) {						
            //     if (err) throw err;
            //     console.log('Your Revenue for this Product is generated! Your total is $'.green + rev);

            //     console.log("\n---------------------------------------------------------------------\n");

                // End the database connection
            //})
            connection.query(updateQueryStr, function(err, res) {						
                if (err) throw err;
                console.log('Your order has been placed! Your total is $' + totalcost);
                console.log('Thank you for shopping with us!');
                console.log("\n---------------------------------------------------------------------\n");
                // End the database connection
                connection.end();
            })
        } else {
            console.log('Sorry, there is not enough product in stock, your order can not be placed as is.');
            console.log('Please modify your order.');
            console.log("\n---------------------------------------------------------------------\n");

            displayitems();
        }
    })
})
}
        
