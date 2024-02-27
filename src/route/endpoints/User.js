const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
// const { verifyToken } = tokenCallback();

let routes = (app) => {
  app.post("/login", async (req, res) => {
    try {
      const { email, password } = {email: "admin@gmail.com", password: "12345"};
      const authuser = [
        { email: "admin@gmail.com", password: "$2b$12$Sq0.7YHJcuykYlPasUfhRebwCokmTkTsKMEhL/vxPTf8r3bOA4XI.", admin: true },
        { email: "user@gmail.com", password: "$2b$12$Sq0.7YHJcuykYlPasUfhRebwCokmTkTsKMEhL/vxPTf8r3bOA4XI.", admin: false },
      ];

       const user = authuser.filter((a,b)=>{
          if(email === a.email){
            return a
          }
      })
     
      if (!user[0]) return res.status(400).json({ msg: "This email does not exist." });

      const isMatch = await bcrypt.compare(password, user[0].password);
      if (!isMatch)
        return res.status(400).json({ msg: "Password is incorrect." });
    
        const token = createAccessToken({
        email: email,
        role: user[0].admin,
      });

      res.json({
        msg: "Login successful!",
        userID: email,
        access_token: token,
      });

    } catch (err) {
      console.log("error", err)
      res.status(500).send(err);
    }
  });

  app.post("/logout", async (req, res) => {
    try { 
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      return res.json({ msg: "Logged out." });
    } catch (err) {
      res.status(500).send(err);
    }
  });
};

function createAccessToken(payload) {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

function createRefreshToken(payload) {
  return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
}

module.exports = routes;
