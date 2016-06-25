var mongoose = require('mongoose'),
    bcrypt = require('bcrypt'),
    extend = require('mongoose-schema-extend'),
    schema = mongoose.Schema,
    ObjectId = mongoose.ObjectId,
    SALT_WORK_FACTOR = 10;
// ########################### SCHEMES DEFINITION  ########################### //
// USER -------------------------------------------------------------------------
var user = new schema({
  name: { type: String, required: true, index: { unique: true } },
  email: { type: String, required: true, index: { unique: true } },
  password: { type: String, required: true },
  firstName: String,
  lastName: String,
  dateOfBirth: Date,
  role: String
}, {
  collection: 'users',
  discriminatorKey: 'role'
});
// ------------------------------------------------------------------------------
// ProductOwner -----------------------------------------------------------------
var po = user.extend({
  po_ticket_field: String
})
// ------------------------------------------------------------------------------
// Developer --------------------------------------------------------------------
var dev = user.extend({
  dev_ticket_field: String
})
// ------------------------------------------------------------------------------
// ########################################################################### //
// ################################ FUNCTIONS ################################ //
// User -------------------------------------------------------------------------
user.pre('save', function(next) {
  var us = this;
  if (!us.isModified('password')) return next();
  // Salting
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next (err);    // Hashing
    bcrypt.hash(us.password, salt, function(err, hash) {
      if (err) return next(err);
      us.password = hash;
      next();
    })
  });
});
// Checking Password
user.methods.checkPass = function (testPass, cb) {
  bcrypt.compare(testPass, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
}
// ------------------------------------------------------------------------------
// Product Owner ----------------------------------------------------------------
po.methods.pocheckPass = user.methods.checkPass;
// ------------------------------------------------------------------------------
// Developer --------------------------------------------------------------------
// Checking Password
dev.methods.checkPass = user.methods.checkPass;
// ------------------------------------------------------------------------------
// ########################################################################### //
// ########################### MODULE EXPORTATIONS ########################### //
// User -------------------------------------------------------------------------
var User;
if (mongoose.models.User) {
  User = mongoose.model('User');
} else {
  User = mongoose.model('User', user);
}
// ------------------------------------------------------------------------------
// Product Owner ----------------------------------------------------------------
var ProductOwner;
if (mongoose.models.ProductOwner) {
  ProductOwner = mongoose.model('ProductOwner');
} else {
  ProductOwner = mongoose.model('ProductOwner', po);
}
// ------------------------------------------------------------------------------
// Developer --------------------------------------------------------------------
var Developer;
if (mongoose.models.Developer) {
  Developer = mongoose.model('Developer');
} else {
  Developer = mongoose.model('Developer', dev);
}
// ------------------------------------------------------------------------------

Users={
  User: User,
  ProductOwner: ProductOwner,
  Developer: Developer
}

module.exports = Users
// ------------------------------------------------------------------------------
