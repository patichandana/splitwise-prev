const pg_promise = require("pg-promise")();
const node_cache = require("node-cache");
const nodeMailer = require("nodemailer");
require('dotenv').config();

const DB = pg_promise({
    host: "192.168.228.2",
    port: 5432,
    database: "postgres_db",
    user: "postgres_user",
    password: "password"
});
const CACHE = new node_cache();
const TRANSPORTOR = nodeMailer.createTransport(
    {
        port: 587,
        host: 'smtp.sendgrid.net',
        auth: {
            user: 'apikey',
            pass: process.env.SENDGRID_API_KEY
        },
        // secure: true
        tls: {
            ciphers: 'SSLv3'
        }
    }
);

console.log(DB);
module.exports = {DB: DB, CACHE: CACHE, TRANSPORTOR: TRANSPORTOR}