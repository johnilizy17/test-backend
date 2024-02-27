const express = require("express")
const cors = require("cors")
const routes = require('./src/route')
const bodyparser = require('body-parser')

const app = express();
const PORT = process.env.PORT || 4000

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cors());
app.use(routes)

app.get("/", (req,res) =>{
    res.send("fine")
});

app.listen(PORT);
console.log(`APP is running on port: ${PORT}`)