// Initializes the npm packages used
var mysql = require("mysql");
var inquirer = require("inquirer");
require("console.table");

// Initializes the connection variable to sync with a MySQL database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "celeste",

  // Your password
  password: "1234",
  database: "bamazon"
});

// Creates the connection with the server and loads the product data upon a successful connection
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  loadProducts();
});

// Function to load the products table from the database and print results to the console
function loadProducts() {
  // Selects all of the data from the MySQL products table
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;

    // Draw the table in the terminal using the response
    console.table(res);

    // Then prompt the customer for their choice of product, pass all the products to promptCustomerForItem
    promptCustomerForItem(res);
  });
}

// Prompt the customer for a product ID
function promptCustomerForItem(inventory) {
  // Prompts user for what they would like to purchase
  inquirer
    .prompt([{
      name: "whichItem",
      type: "input",
      message: "Which item ID would you like to purchase?"

    }]).then(promptCustomerForQuantity(answer))
 
}

// Prompt the customer for a product quantity
function promptCustomerForQuantity(product) {
var item = product.whichItem
connection.query("SELECT * FROM products WHERE item_id=?", item, function (err, res){
if (err) throw err
  })
  inquirer
    .prompt({
      name: "howMany",
      type: "input",
      message: "How many would you like to purchase?"
    })
}

// Purchase the desired quantity of the desired item
function makePurchase(product, quantity) {
  
}

// Check to see if the product the user chose exists in the inventory
function checkInventory(choiceId, inventory) {
 
}

// Check to see if the user wants to quit the program
function checkIfShouldExit(choice) {
  if (choice.toLowerCase() === "q") {
    // Log a message and exit the current node process
    console.log("Goodbye!");
    process.exit(0);
  }
}