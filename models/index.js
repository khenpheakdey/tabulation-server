const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const db = {};
db.mongoose = mongoose;

db.user = require("./userModel");
db.role = require("./roleModel");
db.refreshToken = require("./refreshTokenModel");
db.event = require("./eventModel");
db.individualScore = require("./individualScoreModel");
db.groupScore = require("./groupScoreModel");
db.criteria = require("./criteriaModel");
db.candidate = require("./candidateModel");
db.criteriaLevel = require("./criteriaLevelModel");
db.group = require("./groupModel");

db.ROLES = ["admin", "examiner"];

module.exports = db;