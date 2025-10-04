// app.js
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');
const fs = require('fs');
const child_process = require('child_process');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// === Hardcoded Secret ===
const GITHUB_TOKEN = "ghp_abcd1234efgh5678ijkl9012mnop3456qrst"; // 🚨 Hardcoded secret

// === Insecure DB Connection ===
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password', // 🚨 Hardcoded DB password
    database: 'demo'
});

// === Insecure Home route with sensitive info ===
app.get('/', (req, res) => {
    res.send(`
        <h1>DevSecOps Demo App</h1>
        <p>This app contains common web vulnerabilities for testing purposes.</p>
        <ul>
            <li><a href="/user?username=admin">SQL Injection Test</a></li>
            <li><a href="/greet?name=test">XSS Test</a></li>
            <li><a href="/exec?cmd=ls">Command Injection Test</a></li>
            <li><a href="/read?file=/etc/passwd">Path Traversal Test</a></li>
        </ul>
    `);
});

// === SQL Injection ===
app.get('/user', (req, res) => {
    const username = req.query.username;
    const query = `SELECT * FROM users WHERE username = '${username}'`; // 🚨 Vulnerable to SQLi

    db.query(query, (err, result) => {
        if (err) {
            res.status(500).send(`<pre>SQL Error: ${err.message}</pre>`);
        } else {
            res.send(result.length ? result : 'No user found');
        }
    });
});

// === Reflective XSS ===
app.get('/greet', (req, res) => {
    const name = req.query.name || 'Guest';
    res.send(`<h1>Hello ${name}</h1>`); // 🚨 Vulnerable to XSS
});

// === Command Injection ===
app.get('/exec', (req, res) => {
    const cmd = req.query.cmd; // 🚨 User-controlled input
    child_process.exec(cmd, (err, stdout, stderr) => {
        if (err) return res.status(500).send(stderr);
        res.send(`<pre>${stdout}</pre>`);
    });
});

// === Path Traversal / Local File Read ===
app.get('/read', (req, res) => {
    const filePath = req.query.file; // 🚨 Unsanitized input
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return res.status(500).send(err.message);
        res.send(`<pre>${data}</pre>`);
    });
});

// === Insecure Cookie ===
app.get('/setcookie', (req, res) => {
    res.cookie("session", "admin-session-12345"); // 🚨 No HttpOnly, No Secure, No SameSite
    res.send("Insecure cookie set!");
});

// === Sensitive Data Exposure ===
app.get('/debug', (req, res) => {
    res.json({
        secretKey: "supersecret",   // 🚨 Leaks sensitive info
        dbPassword: "password",     // 🚨 Exposed credential
        env: process.env            // 🚨 Exposes environment variables
    });
});

app.listen(3000, '0.0.0.0', () => {
    console.log('App running on http://0.0.0.0:3000');
});
