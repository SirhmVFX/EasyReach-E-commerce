const express = require("express")
const app = express()

app.get("/", function(req, res) {
    res.send("welcome to the app")
})
app.listen(3000)