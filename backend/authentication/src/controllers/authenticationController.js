const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const superagent = require('superagent');

exports.loginUser = function(req, res) {  
  const url = 'http://account:3000/account/get_user_by_username';
  
  superagent.get(url)
  .query({ username: req.body.username})
  .set('Accept', 'application/json')
  .end((err, response) => {
    
  if (err) { 
    res.status(404).json({ error: 'User does not exist: ' + req.body.username })
    console.log(err); 
  }
  console.log(response.body);

  const usr = response.body.usr
    if (usr != null) {
      if (bcrypt.compareSync(req.body.password, usr.password)) {
        const payload = { _id: usr._id }
        // JWT generation
        const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 30 * 86400}) //expiresIn expressed in seconds
        const cookieConfig = {
          httpOnly: true,
          maxAge: 30 * 86400 * 1000, // 30 days cookie
          signed: true
        }
        res.cookie('jwt', token, cookieConfig)
        res.json({ profile_type: response.body.profile_type, _id: usr._id })
      } else {
        res.json({ error: 'Wrong password' })
      }
    } else {
      res.status(404).json({ error: 'User does not exist: ' + req.body.username })
    }
  });
};

exports.logoutUser = function(req, res) {
	if (req.signedCookies.jwt != null) {
        const token = req.signedCookies.jwt;
        try {
          jwt.verify(token, process.env.SECRET_KEY);
          res.clearCookie("jwt");
          res.json({ description: "Logout succeded" })
        } catch (error) {
          res.sendStatus(401).json({error: "unauthorized user, invalid token"}); // The JWT is not valid - verify method failed
        }
      } else {
        res.sendStatus(401).json({error: "unauthorized user, no token"}); // No JWT specified
      }
};
