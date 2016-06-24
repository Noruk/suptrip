// Include part to have required modules ...
var mongoose = require('mongoose'),
  User = require('./../../models/user'),
  should= require('should');

// Connect to mongo DB as tester DB (DB only for TEST USAGE)
var connStr = 'mongodb://mongo_jiralo/tester';
mongoose.connect(connStr, function(err) {
  if (err) throw err;
});

var dbcon = mongoose.connection;
dbcon.on('error', console.error.bind(console, 'connection error:'));
dbcon.once('open', function callback() {
  dbcon.db.dropDatabase(function(err, result){
    // done();
  });
});

// create a user a new user
var testExistUser = new User({
  _id: 1,
  name: 'Noisette',
  password: 'ecureil',
  email: 'noisette@ecureil',
  firstName: 'Ngân',
  lastName: 'Cap',
  dateOfBirth: new Date(1989,08,26)
});
var testNewUser = new User({
  _id: 20,
  name: 'Bug',
  password: '2000',
  email: 'new@bug.2000',
  firstName: 'Bug',
  lastName: "De l'an 2000",
  dateOfBirth: new Date(2000,01,01)
});

// Add test user in DB 
testExistUser.save(function(err){
  if (err) return err;
});

describe("Users", function(){
  it("Add a new user", function(done){
    testNewUser.save(function(err){      
      should.not.exist(err);
      done();
    })
  })

  it("Try to add Duplicate user", function(done){
    testExistUser.save(function(err){
      should.not.exist(err);
      done();
    })
  })

  it('Should find an Existing user', function(done){
    User.findOne({name: 'Noisette'}, function(err, user) {
      should.not.exist(err);
      should.exist(user);
      user.name.should.equal('Noisette');
      done();
    });
  })

  it('Should not find an Imaginary user', function(done){
    User.findOne({name: 'Gasper'}, function(err, user) {
      should.not.exist(err);
      should.not.exist(user);
      done();
    })
  })
  
  it('Should validate correct Password', function(done){
    User.findOne({name: 'Noisette'}, function(err,user){
      should.not.exist(err);
      should.exist(user);
      user.checkPass('ecureil', function(err, isMatch) {
        should.not.exist(err);
        isMatch.should.equal(true);
        done();
      })
    })
  })

  it('Should not validate incorrect Password', function(done){
    User.findOne({name: 'Noisette'}, function(err,user){
      should.not.exist(err);
      should.exist(user);
      user.checkPass('PasBeau', function(err, isMatch) {
        should.not.exist(err);
        isMatch.should.equal(false);
        done();
      })
    })
  })
})
