//class object for the dog
class Dog{
  constructor(name, imgSrc, description){
    this.name = name;
    this.imgSrc = imgSrc;
    this.description = description;
  }
}

//example data
const testDog1 = new Dog("Scout", "https://hips.hearstapps.com/ghk.h-cdn.co/assets/17/30/1500922382-brittany-spaniel.jpg", "Scout is the best doggo");
const testDog2 = new Dog("Waylon", "https://ybxzcgnc7b-flywheel.netdna-ssl.com/wp-content/uploads/2016/12/yellow-english-lab.jpg", "Waylon is a fun and energetic English Lab who enjoys playing fetch.")

// Note this object is purely in memory
// When node shuts down this will be cleared.
// Same when your heroku app shuts down from inactivity
// We will be working with databases in the next few weeks.
const users = [];
users.push(testDog1);
users.push(testDog2);


// function to respond with a json object
// takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

// function to respond without json body
// takes request, response and status code
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

// return user object as JSON
const getUsers = (request, response) => {
  const responseJSON = {
    users,
  };

  respondJSON(request, response, 200, responseJSON);
};

// function to add a user from a POST body
const addUser = (request, response, body) => {
  // default json message
  const responseJSON = {
    message: 'Name, and image are both required.',
  };
  //console.log(body);
  // check to make sure we have both fields
  // We might want more validation than just checking if they exist
  // This could easily be abused with invalid types (such as booleans, numbers, etc)
  // If either are missing, send back an error message as a 400 badRequest
  //!body.name || !body.age
  if (!body.name || !body.imgSrc ) {
    
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let newDog = new Dog(body.name, body.imgSrc, body.description);
  

  // default status code to 201 created
  let responseCode = 201;

  // if that user's name already exists in our object
  // then switch to a 204 updated status
  let duplicateDog = false;
  for(let x=0; x<users.length; x++){
    
    if (users[x].name === body.name && users[x].imgSrc === body.imgSrc){
      duplicateDog = true;
      //responseCode = 204;
    }
  }

  if (duplicateDog) {
    responseCode = 204;
  } else {
    // otherwise create an object with that name
    users.push(newDog);
  }

  // add or update fields for this user name
  //users[body.name].name = body.name;
  //users[body.name].age = body.age;

  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  // 204 has an empty payload, just a success
  // It cannot have a body, so we just send a 204 without a message
  // 204 will not alter the browser in any way!!!
  return respondJSONMeta(request, response, responseCode);
};


const notFound = (request, repsonse) => {
  const message = {
    message: 'The page you were looking for was not found',
  };
  return respondJSON(request, repsonse, 404, message);
};

// public exports
module.exports = {
  getUsers,
  addUser,
  notFound,
};
