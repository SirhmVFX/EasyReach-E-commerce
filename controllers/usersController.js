exports.homepage = function(req, res) {
    res.render("homepage")
}

exports.login = function(req, res) {
    res.render("login", {pageTitle: "Sign In - EasyReach"})
}

exports.signup = function(req, res) {
    res.render("signup", {pageTitle: "SignUp - EasyReach"} )
}

