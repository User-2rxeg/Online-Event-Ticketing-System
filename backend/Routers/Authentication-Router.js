const router = require("express").Router();
const { register, login, forgetPassword } = require("../Controllers/Authentication-Controller");

// /api/v1/register
router.post("/register", register);
// /api/v1/login
router.post("/login", login);
// /api/v1/forgetPassword
router.put("/forgetPassword", forgetPassword);

module.exports = router;



// TESTED ALL AUTHENTICATION ROUTES:
// Register: (Successful)
// Login: (Successful)
//forget Password (Successful)