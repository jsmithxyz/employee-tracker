var mysql = require("mysql");
var inquirer = require("inquirer");
var console_table = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "yourRootPassword",
    database: "employee_trackerDB"
});

//creates connection and runs application
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    runApp();
});

function runApp() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees by Department",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View All Employees":
                    allEmployees();
                    break;
                case "View All Employees by Department":
                    allEmployeesByDepartment();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Delete Employee":
                    deleteEmployee();
                    break;
                case "Update Employee Role":
                    updateRole();
                    break;
            }
        });
}

//function to view all employees
function allEmployees() {
    console.log("\nViewing all employees...\n");
    connection.query(
        "SELECT employee.id, first_name AS FIRSTNAME, last_name AS LASTNAME, title AS POSITION, name AS DEPARTMENT, salary as SALARY FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id;", function (err, res) {
            if (err) throw err;
            // Log all results of the SELECT statement in table format
            console.table('ALL EMPLOYEES', res);
        });
}