var inquirer = require('inquirer');
var mysql = require('mysql');
var Table = require('cli-table');
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "",
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
    menuOptions();
});
function menuOptions() {
    inquirer.prompt([{
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: ["View Products for Sale", 
                "View Low Inventory", 
                "Add to Inventory", 
                "Add New Product"]
}]).then(function(answers) {
    // ('User has chosen: ' + JSON.stringify(answers));
    console.log(answers.menu);
        switch (answers.menu) {
        case "View Products for Sale":
            viewProducts();
        break;
  
        case "View Low Inventory":
            viewLowInventory();
        break;
  
        case "Add to Inventory":
            addToInventory();
        break;
  
        case "Add New Product":
            addNewProduct();
        break;
  
        default:
          throw new Error("None of these options are available.");
    }
});
} 

function viewProducts() {
    var queryStr = "SELECT * FROM products";
    connection.query(queryStr, function(err, res){
        if (err) throw err;
        console.log("Retrieving products: "); 
    var product = "";  
        for (var i = 0; i < res.length; i++) {
            product += "Item ID: " + res[i].item_id + "//";
            product += "Item ID: " + res[i].product_name + "//";
            product += "Item ID: " + res[i].price + "//";
            product += "Item ID: " + res[i].stock_quantity + "\n";
        };
    console.log(product);
    console.log("\n-----------------\n");
  })          
};
//If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
function viewLowInventory() {
    console.log("Listing all items with an inventory count lower than 5: \n");
    var queryStr = "SELECT * FROM products WHERE stock_quantity <5";
    connection.query(queryStr, function(err, res) {
        if (err) throw err;
        console.log("Low Inventory Products (below 5): ");
        var product = "";  
        for (var i = 0; i < res.length; i++) {
            product += "Item ID: " + res[i].item_id + "//";
            product += "Item ID: " + res[i].product_name + "//";
            product += "Item ID: " + res[i].price + "//";
            product += "Item ID: " + res[i].stock_quantity + "\n";
        };          
    console.log(product);
    console.log("\n-----------------\n");
  })
};
// Users can only insert integers when they type in numbers into Bamazon
function integers(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);
    if (integer && sign == 1) {
        return true;
    } else {
        return "Please enter a positive whole number.";
    }
}
//If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
function addToInventory() {
    console.log("Option to 'Add More' of items: \n");
    inquirer.prompt([{
        type: "input",
        name: "item_id",
        validate: integers,
        message: "Please enter the Item ID so that the stock count can be updated.",
        filter: Number
    },
    {
        type: "input",
        name: "stock_quantity",
        validate: integers,
        message: "Please enter the number of products you'd like to add.",
        filter: Number
    }]).then(function(input){
        var item = input.item_id;
        var quantity = input.stock_quantity;
        var queryStr = "SELECT * FROM products WHERE ?";
        connection.query(queryStr, `{item_id}`, function(err, res) {
            if (err) throw err;
            addToInventory();
        var updateQueryStr = "UPDATE products SET stock_quantity = " + quantity;
        connection.query(updateQueryStr, function(err, res){
            if (err) throw err;
        console.log("Stock quantity of" +  item  + "has been updated to " + quantity);
        console.log("\n-----------------\n");
    })
     
   });    
            
  })            
};
//If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
function addNewProduct() {
    inquirer.prompt ([{
        type: "input",
        name: "product_name",
        message: "Please enter the product name.",
    },
    {
        type: "input",
        name: "item_id",
        message: "Please enter the item ID.",
    },
    {
        type: "input",
        name: "department_name",
        message: "Which department does the product belong to?"
        
    },
    {
        type: "input",
        name: "price",
        message: "How much does the product cost?"
    },
    {
        type: "input",
        name: "stock_quantity",
        message: "How many stock quantities of the product are available?"

}]).then(function(input){
    console.log("Adding new product: \n product_name = " + input.product_name + "\n" + "department_name" + input.department_name + "\n" + "price" + input.price + "\n" + "stock_quantity" + input.stock_quantity);
    var queryStr = "INSERT INTO products SET ?";
    connection.query(queryStr, input, function(err, res){
        if (err) throw err;
    console.log("New product has been added by item ID: " + res.insertId + ".");
    console.log("\n-----------------\n");    
    }) 
})

};

}
