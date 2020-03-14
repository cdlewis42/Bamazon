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
connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
  }
  loadProducts();
});

// Function to load the products table from the database and print results to the console
function loadProducts() {
  // Selects all of the data from the MySQL products table
  connection.query("SELECT * FROM products", function (err, res) {
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

    }]).then(function (answer) {
      promptCustomerForQuantity(answer)
    })

}

// Prompt the customer for a product quantity
function promptCustomerForQuantity(product) {
  var item = product.whichItem
  connection.query("SELECT * FROM products WHERE item_id=?", item, function (err, res) {
    if (err) throw err
    itemName=res[0].product_name
    itemPrice = res[0].price
    stockQuantity = res[0].stock_quantity
    sales_total = res[0].product_sales
  })
  inquirer
    .prompt({
      name: "howMany",
      type: "input",
      message: "How many would you like to purchase?"
    }).then(function (answer2) {
      var quantity = answer2.howMany

      if (quantity > stockQuantity){
        console.log("We do not have that many in inventory. We do have " + 
        stockQuantity + " in inventory.")
    
        loadProducts()
      }
      else{
      makePurchase(itemName, quantity,itemPrice, stockQuantity,item,sales_total)
      }
    })
}

// Purchase the desired quantity of the desired item
function makePurchase(product, quantity, price, paramStockQuantity,paramItem,paramSales) {
  var total = quantity * price
  var newSalesTotal = paramSales + total

  console.log("Your total is $" + total + ".")
  console.log("You have purchased " + quantity + " " + product + "s.")

  var newQuantity = paramStockQuantity - quantity

connection.query("UPDATE products SET stock_quantity = " + newQuantity + " WHERE item_id = " + paramItem, function (err, res) {
        if (err) throw err;
})
connection.query("UPDATE products SET product_sales = " + newSalesTotal + " WHERE item_id = " + paramItem, function (err, res) {
  if (err) throw err;
})
  inquirer
    .prompt({
      name: "shouldQuit",
      type: "list",
      message: "Quit or Continue?",
      choices: ["Quit", "Continue"]

    }).then(function(answer){
      var shouldQuitAnswer = answer.shouldQuit
      checkIfShouldExit(shouldQuitAnswer)
    })
}

// Check to see if the user wants to quit the program
function checkIfShouldExit(choice) {
  if (choice.toLowerCase() === "quit") {
    // Log a message and exit the current node process
    console.log("Goodbye!");
    process.exit(0);
  }
  else{
    loadProducts()
  }
}