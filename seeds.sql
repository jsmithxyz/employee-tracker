USE employee_trackerDB;

-- populate departments in table 'department'
INSERT INTO department (name)
VALUES ("Sales");

INSERT INTO department (name)
VALUES ("Engineering");

INSERT INTO department (name)
VALUES ("Finance");

INSERT INTO department (name)
VALUES ("Legal");

-- populate roles in table 'role'
INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 80000, 4);

INSERT INTO role (title, salary, department_id)
VALUES ("Lead Engineer", 85000, 1);

INSERT INTO role (title, salary, department_id)
VALUES ("Lawyer", 90000, 3);

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant", 70000, 2);
