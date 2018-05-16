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
    head: ['department_id', 'department_name',"overhead_costs",'product_sales', "total_profit"],
    colWidths: [5,80,40,10]
});
    for (var i = 0; i < result.length; i++) {
        table.push([result[i].department_id, result[i].department_name,result[i].overhead_costs,result[i].product_sales, result[i].total_profit]);           
    }
    console.log(table.toString());
    menuOptions();
        
        
});
    }
function menuOptions() {
    inquirer.prompt([{
        type: "list",
        name: "menu",
        message: "What would you like to do?",
        choices: ["View Product Sales by Department", "Create New Department"]
}]).then(function(answers) {
    // ('User has chosen: ' + JSON.stringify(answers));
    console.log(answers.menu);
        switch (answers.menu) {
        case "View Product Sales by Department":
            viewProductSales();
        break;
        case "Create New Department":
            createNewDepartment();
        break;
  
        default:
          throw new Error("None of these options are available.");
    }
});
}

function viewProductSales() {
    connection.query("SELECT * FROM departments", function(err, res) {
        if (err) throw err;
        console.log("Product Sales by Department: ");
        console.log("\n-------------------------\n");
        for (var i = 0; i < res.length; i++) {
            console.log("Department ID: " + res[i].department_id + "|" + "Department Name: " + res[i].department_name + "Overhead costs: ");
            console.log("\n-----------------------------------------------------------\n");
        }
    });
}

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

function createNewDepartment() {
    console.log("Creating new department: ");
    inquirer.prompt([{
        type: "input",
        name: "department_name",
        message: "Department Name: ",
    },
    {
        type: "input",
        name: "overhead_costs",
        message: "Overhead Costs: ", 
        default: 0,
        validate: function(value){
            if (isNan(value) === false) {
                return true;
            } else {
                return false;
            }
        }    
    },
    {
        type: "input",
        name: "product_sales",
        message: "Product Sales: ", 
        default: 0,
        validate: function(value){
            if (isNan(value) === false) {
                return true;
            } else {
                return false;
            }
        }           
}]).then(function(answers) {
connection.query("INSERT INTO departments SET ?", {
    DepartmentId: answers.department_id,
    DepartmentName: answers.department_name,
    OverheadCosts: answers.overhead_costs,
    TotalSales: answers.product_sales
}), function(err, res) {
        if (err) throw err;
        console.log("Congratulations! Another department was added! ");
    }
  });
}