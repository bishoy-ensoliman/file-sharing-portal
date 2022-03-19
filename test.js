// QUnit.test( "admin test", function( assert ) {
//   assert.ok( 1=='1', "Passed!" );
// });

// QUnit.test( "Instructor test", function( assert ) {
//   assert.ok( isInst("admin@admin.com","admin1","127.0.0.1","localhost").state == undefined, "Passed!" );
// });
//var expect = require('chai').expect;
expect = chai.expect;

it('Admin Check right login data', function(done) {
	this.timeout(0);
	//setTimeout(done, );
  var trueValue = true;

  var result = isAdmin("admin@admin.com","admin1","127.0.0.1","localhost");

  return result.then(function(data) {
    expect(data).to.equal(trueValue);
    done();
  });
});

it('Admin Check wrong password', function(done) {
  this.timeout(0);
  var trueValue = false;

  var result = isAdmin("admin@admin.com","123456","127.0.0.1","localhost");

  return result.then(function(data) {
    expect(data).to.equal(trueValue);
    done();
  });
});

it('Sign in as admin with wrong data', function(done) {
	this.timeout(0);
  //setTimeout(done, 600000);
  var trueValue = false;

  var result = isAdmin("ahmed@gmail.com","123456","127.0.0.1","localhost");

  return result.then(function(data) {
    expect(data).to.equal(trueValue);
    done();
  });
});

it('Instructor Check right login data', function(done) {
	this.timeout(0);
  //setTimeout(done, 600000);
  var trueValue = true;

  var result = isInst("salah@gmail.com","123456","127.0.0.1","localhost");

  return result.then(function(data) {
    expect(data).to.equal(trueValue);
    done();
  });
});

it('Instructor login wrong password', function(done) {
  this.timeout(0);
  var trueValue = false;

  var result = isInst("salah@gmail.com","987456","127.0.0.1","localhost");

  return result.then(function(data) {
    expect(data).to.equal(trueValue);
    done();
  });
});

it('Check wrong email', function(done) {
  this.timeout(0);
  var trueValue = false;

  var result = isInst("ahmed1@gmail.com","123456","127.0.0.1","localhost");

  return result.then(function(data) {
    expect(data).to.equal(trueValue);
    done();
  });
});

it('Check existing email', function(done) {
  this.timeout(0);
  var trueValue = true;

  var result = checkOntest("andrew@gmail.com");

  return result.then(function(data) {
    expect(data).to.equal(trueValue);
    done();
  });
});

it('Check non-existing email', function(done) {
  this.timeout(0);
  var trueValue = false;

  var result = checkOntest("iiiiiiiiiiii@gmail.com");

  return result.then(function(data) {
    expect(data).to.equal(trueValue);
    done();
  });
});

it('login with empty email and password', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = validateLogintest("","","127.0.0.1","localhost");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
});

it('login with invalid email', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = validateLogintest("dkglfdglkf","123456","127.0.0.1","localhost");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
});

it('login with password < 6 chars', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = validateLogintest("admin@admin.com","12345","127.0.0.1","localhost");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
});

it('login with a student email', function(done) {
  this.timeout(0);
  var trueValue = false;

  var result = validateLogintest("andrew@gmail.com","123456","127.0.0.1","localhost");

  return result.then(function(data) {
    expect(data).to.equal(trueValue);
    done();
  });
});


it('update by check id but empty', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = take_input_to_update(true,false,"","");
    console.log("entered here");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });

it('update by check email but empty', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = take_input_to_update(false,true,"","");
    console.log("entered here");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });

it('update by no checked options', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = take_input_to_update(false,false,"","");
    console.log("entered here");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });

it('update by check id and has value', function() {
    var trueValue = true;
    //name,email,pass,confirmpass
    var result = take_input_to_update(true,false,5,"");
    console.log("entered here");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });

it('update by not valid email', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = take_input_to_update(false,true,"","hdjh");
    console.log("entered here");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
});

it('update by valid email', function() {
    var trueValue = true;
    //name,email,pass,confirmpass
    var result = take_input_to_update(false,true,"","mirona@yahoo.com");
    console.log("entered here");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
});


it('update by not found email', function(done) {
  this.timeout(0);
  var trueValue = false;

  var result = checkUpdatedStudent(false,true,"","mirona@yahoo.com");

  return result.then(function(data) {
    expect(data).to.equal(trueValue);
    done();
  });
});

it('update by not found id', function(done) {
  this.timeout(0);
  var trueValue = false;

  var result = checkUpdatedStudent(true,false,"3","");

  return result.then(function(data) {
    expect(data).to.equal(trueValue);
    done();
  });
});

it('update by true id', function(done) {
  this.timeout(0);
  var trueValue = true;

  var result = checkUpdatedStudent(true,false,"0","");

  return result.then(function(data) {
    expect(data).to.equal(trueValue);
    done();
  });
});


it('update with not valid email', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = updateDataTest("jdhj","123456","123456");
    console.log("entered here");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
});

it('password not equal confirm password', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = updateDataTest("jdhj","12345678","123456");
    console.log("entered here");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
});

it('password less than 6 characters', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = updateDataTest("jdhj","123","123456");
    console.log("entered here");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
});

it('update with true email and password', function() {
    var trueValue = true;
    //name,email,pass,confirmpass
    var result = updateDataTest("mirona@yahoo.com","123456","123456");
    console.log("entered here");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
});


//bishoy
var assert = chai.assert;
describe('Insert Student', function() {
  it('with empty data', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = insertStudentTest("","","","");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });
  it('with only name', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = insertStudentTest("bishoy","","","");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });
  it('with only name,email', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = insertStudentTest("bishoy","bishoy@gmail.com","","");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });
  it('with invalid email', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = insertStudentTest("bishoy","bishoykdfjls.com","123456","123456");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });
  it('with only name,email,password', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = insertStudentTest("bishoy","bishoy@gmail.com","123456","");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });
  it('with password < 6 chars', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = insertStudentTest("bishoy","bishoy@gmail.com","12345","12345");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });
  it('with password != confirm password', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = insertStudentTest("bishoy","bishoy@gmail.com","123456","612345");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });
  it('with already existing email', function(done) {
    this.timeout(0);
    var trueValue = true;

    var result = insertStudentTest("bishoy","bishoy@gmail.com","123456","123456");

    return result.then(function(data) {
      expect(data).to.equal(trueValue);
      done();
    });
  });
  it('with new student good data', function(done) {
    this.timeout(0);
    var trueValue = false;

    var result = insertStudentTest("mirona","mirona@gmail.com","123456","123456");

    return result.then(function(data) {
      expect(data).to.equal(trueValue);
      done();
    });
  });
});

describe('Insert Instructor', function() {
  it('with empty data', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = insertInstructorTest("","","","");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });
  it('with only name', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = insertInstructorTest("bishoy","","","");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });
  it('with only name,email', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = insertInstructorTest("bishoy","bishoy@gmail.com","","");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });
  it('with invalid email', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = insertInstructorTest("bishoy","bishoykdfjls.com","123456","123456");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });
  it('with only name,email,password', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = insertInstructorTest("bishoy","bishoy@gmail.com","123456","");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });
  it('with password < 6 chars', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = insertInstructorTest("bishoy","bishoy@gmail.com","12345","12345");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });
  it('with password != confirm password', function() {
    var trueValue = false;
    //name,email,pass,confirmpass
    var result = insertInstructorTest("bishoy","bishoy@gmail.com","123456","612345");
    expect(result).to.equal(trueValue);
    //assert.equal(result,trueValue);
  });
  it('with already existing email', function(done) {
    this.timeout(0);
    var trueValue = true;

    var result = insertInstructorTest("bishoy","salah@gmail.com","123456","123456");

    return result.then(function(data) {
      expect(data).to.equal(trueValue);
      done();
    });
  });
  it('with new Instructor good data', function(done) {
    this.timeout(0);
    var trueValue = false;

    var result = insertInstructorTest("mirona","mirona@gmail.com","123456","123456");

    return result.then(function(data) {
      expect(data).to.equal(trueValue);
      done();
    });
  });
});

describe('Add a Course', function() {
  it('already existing course in same departement', function(done) {
    this.timeout(0);
    var trueValue = true;

    var result = addCourseTest("DataMining","CSE");

    return result.then(function(data) {
      expect(data).to.equal(trueValue);
      done();
    });
  });
  it('new course', function(done) {
    this.timeout(0);
    var trueValue = false;

    var result = addCourseTest("Machine Learning","CSE");

    return result.then(function(data) {
      expect(data).to.equal(trueValue);
      done();
    });
  });
});

// describe('hello node', function () {
//         it('world', function (done) {
//             create(function (ph) {
//                 ph.createPage(function (page) {
//                     page.open("http://www.google.com", function (status) {
//                         console.log("opened google? ", status);
//                         page.evaluate(function () { return document.title; }, function (result) {
//                             console.log('Page title is ' + result);
//                             ph.exit();
//                             expect(result).to.equal("Google");
//                             done();
//                         });
//                     });
//                 });
//             });

//         });
//     }
// )

