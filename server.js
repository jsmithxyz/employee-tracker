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

    connection.query("SELECT * from role", function (error, res) {
        showroles = res.map(role => ({ name: role.title, value: role.id }))
      });

    connection.query("SELECT * from employee", function (error, res) {
        showemployees = res.map(employee => ({ name: `${employee.first_name} ${employee.last_name}`, value: employee.id }))
      });

    runApp();
});

function runApp() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "View All Employees by Department",
                "Add Employee",
                "Remove Employee",
                "Update Employee Role",
                "Exit Application"
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
                case "Remove Employee":
                    deleteEmployee();
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Exit Application":
                    connection.end();
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
            runApp();
        });
}

//function to view employees by department choice
function allEmployeesByDepartment() {
    inquirer.prompt({
        name: "dept",
        type: "list",
        message: "What department would you like to view?",
        choices: [
            "Sales",
            "Engineering",
            "Finance",
            "Legal"
        ]
    })
        .then(function (answer) {
            connection.query(
                "SELECT employee.id, first_name AS FIRSTNAME, last_name AS LASTNAME, title AS POSITION, name AS DEPARTMENT, salary as SALARY FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id WHERE department.name = ? ORDER BY title", [answer.dept], function (err, res) {
                    if (err) throw err;
                    // Log all results of the SELECT statement in table format
                    console.table('\nALL EMPLOYEES BY DEPARTMENT\n', res);
                    runApp();
                });
        });
}



//function to add an employee
function addEmployee() {

    inquirer.prompt([
        {
            type: "input",
            name: "firstname",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "lastname",
            message: "What is the employee's last name?"
        },
        {
            name: "position",
            type: "list",
            message: "What is this employee's position?",
            choices: showroles
        }
        ]).then(function (answer) {
            console.log(answer);
            var query = connection.query(
                "INSERT INTO employee SET ?", 
                {
                    first_name: answer.firstname,
                    last_name: answer.lastname,
                    role_id: answer.position,
                  },
                function (err, res) {
                    if (err) throw err;
                    console.table("\nNew Employee Added Successfully!\n");
                    runApp();
                });
        });
}

//function to delete employee
function deleteEmployee() {

    inquirer.prompt([
        {
            name: "removal",
            type: "list",
            message: "What employee would you like to remove?",
            choices: showemployees
        }
        ]).then(function (answer) {
            console.log(answer);
            var query = connection.query(
                "DELETE FROM employee WHERE employee.id = ?", 
                [answer.removal],
                function (err, res) {
                    if (err) throw err;
                    console.table("\nEmployee Removed from Database!\n");
                    runApp();
                });
        });
}


    function addEmployee() {

        inquirer.prompt([
            {
                type: "input",
                name: "firstname",
                message: "What is the employee's first name?"
            },
            {
                type: "input",
                name: "lastname",
                message: "What is the employee's last name?"
            },
            {
                name: "position",
                type: "list",
                message: "What is this employee's position?",
                choices: showroles
            }
            ]).then(function (answer) {
                console.log(answer);
                var query = connection.query(
                    "INSERT INTO employee SET ?", 
                    {
                        first_name: answer.firstname,
                        last_name: answer.lastname,
                        role_id: answer.position,
                      },
                    function (err, res) {
                        if (err) throw err;
                        console.table("\nNew Employee Added Successfully!\n");
                        runApp();
                    });
            });
    }
    
    //function to update Employee role
    function updateEmployeeRole() {
    
        inquirer.prompt([
            {
                name: "updateEmp",
                type: "list",
                message: "Which employee would you like to update?",
                choices: showemployees
            },
            {
                name: "updateRole",
                type: "list",
                message: "Which role would like you to assign to this employee?",
                choices: showroles
            }
            ]).then(function (answer) {
                console.log(answer);
                var query = connection.query(
                    "UPDATE employee SET ? WHERE ?", [
                    {
                        role_id: answer.updateRole
                    },
                    {
                        id: answer.updateEmp
                    }],
                    function (err, res) {
                        if (err) throw err;
                        console.table("\nEmployee's Role has been Updated!\n");
                        runApp();
                    });
            });
    }





