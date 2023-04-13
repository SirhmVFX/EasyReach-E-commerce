const express = require("express")
const app = express()

app.use(express.urlencoded({extended: false}))
app.use(express.json())

app.use(express.static("public"))
app.set("views", "views")
app.set("view engine", "ejs")

app.get("/", function(req, res) {
    res.send("login")
})

app.listen(3000)  