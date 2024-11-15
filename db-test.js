require('dotenv').config();
const mysql = require('mysql2');


console.log(process.env.DATABASE_URL);

// Ensure that process.env.DATABASE_URL is correctly set
if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined');
    process.exit(1);
}

const connection = mysql.createConnection(process.env.DATABASE_URL);

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Successfully connected to the database');
    connection.end();
});