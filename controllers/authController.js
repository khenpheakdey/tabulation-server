const config = require("../config/auth/authConfig");
const db = require("../models");
var nodemailer = require('nodemailer');

const User = db.user;
const Role = db.role;
const RefreshToken = db.refreshToken;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "pkhen@paragoniu.edu.kh",
    pass: "rnD9V8xdad@$168"
  }
});



exports.signup = async (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  var mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: req.body.email,
    subject: 'Tabulation System: Invitation',
    text: `username: ${req.body.username}, password: ${req.body.password}`
  };

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    } 
    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles }
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          user.roles = roles.map(role => role._id);
          user.save(err => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
            res.send({ message: "User was registered successfully!" });
          });
        }
      );
    } else {
      Role.findOne({ name: "examiner" }, (err, role) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }
        user.roles = [role._id];
        user.save(err => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          return res.send({ message: "Examiner was registered successfully!" });
        });
      });
    }
  });
};

exports.login = async (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .populate("roles", "-__v")
    .exec(async (err, user)  => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var passwordIsValid = await bcrypt.compareSync(
        req.body.password,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }
      let token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });
      let refreshToken = await RefreshToken.createToken(user);
      var authorities = [];
      console.log(user.roles.length);
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      return res.cookie("jwt", token,{
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      }).status(200).json({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken,
      });
    });
};

exports.getUser = async(req,res) => {
  try {
    const cookie = req.cookies["jwt"] || req.get("Authorization").split(" ")[1];

    const claims = jwt.verify(cookie, config.secret);

    if(!claims){
      return res.status(401).send({
        message: "Unauthenthicated!",
      })
    }

    await User.findOne({_id: claims.id})
    .populate("roles", "-__v")
    .exec(async (err,user)=> {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }
      var authorities = [];
      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      return res.status(200).send({
        user:{
          id: user._id,
          username: user.username,
          email: user.email,
          roles: authorities,
        }
      });
    });

  } catch (error) {
    return res.status(401).send({
      message: "Unauthenthicated!",
    })
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }
  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });
    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }
    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
      
      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }
    let newAccessToken = jwt.sign({ id: refreshToken.user._id }, config.secret, {
      expiresIn: config.jwtExpiration,
    });
    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

exports.logout = async (req, res) => {
    return res.clearCookie("jwt").status(200).send({ message: "You've been signed out!" });
};
