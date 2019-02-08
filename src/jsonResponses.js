// function to send a response
const respond = (request, response, code, content, type) => {
  if (type[0] === 'text/xml') {
    response.writeHead(code, { 'Content-Type': 'text/xml' });
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${content.message}</message>`;
    responseXML = `${responseXML} <id>${content.id}</id>`;
    responseXML = `${responseXML} </response>`;
    response.write(responseXML);
  } else {
    response.writeHead(code, { 'Content-Type': 'application/json' });
    response.write(JSON.stringify(content));
  }
  response.end();
};

// function to show a success status code
const success = (request, response, responseType) => {
  // message to send
  const responseObj = {
    message: 'This is a successful response',
    id: 'Success',
  };
  return respond(request, response, 200, responseObj, responseType);
};


// function to show a bad request without the correct parameters
const badRequest = (request, response, params, responseType) => {
  // message to send
  const responseObj = {
    message: 'This request has the required parameters',
    id: 'badRequest',
  };

  // if the request does not contain a valid=true query parameter
  if (!params.valid || params.valid !== 'true') {
    // set our error message
    responseObj.message = 'Missing valid query parameter set to true';
    // give the error a consistent id
    responseObj.id = 'badRequest';

    return respond(request, response, 400, responseObj, responseType);
  }

  return respond(request, response, 400, responseObj, responseType);
};


// function to show a unauthorized without the correct parameters
const unauthorized = (request, response, params, responseType) => {
  // if the request does not contain a valid=true query parameter
  if (!params.loggedIn || params.loggedIn !== 'yes') {
    const responseObj = {
      message: 'Missing loggedIn query parameter set to yes.',
      id: 'unauthorized',
    };

    return respond(request, response, 200, responseObj, responseType);
  }

  const responseObj = {
    message: 'You have access to view this page.',
    id: 'authorized',
  };
  return respond(request, response, 401, responseObj, responseType);
};


// function to show forbidden error
const forbidden = (request, response, responseType) => {
  // error message with a description and consistent error id
  const responseObj = {
    message: 'You do not have access to this content.',
    id: 'forbidden',
  };

  return respond(request, response, 403, responseObj, responseType);
};


// function to show internal error
const internal = (request, response, responseType) => {
  // error message with a description and consistent error id
  const responseObj = {
    message: 'Internal Server Error. Something went wrong.',
    id: 'internalError',
  };

  return respond(request, response, 500, responseObj, responseType);
};


// function to show internal error
const notImplemented = (request, response, responseType) => {
  // error message with a description and consistent error id
  const responseObj = {
    message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
    id: 'notImplemented',
  };

  return respond(request, response, 501, responseObj, responseType);
};


const notFound = (request, response, responseType) => {
  const responseObj = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };
  return respond(request, response, 404, responseObj, responseType);
};

// exports to set functions to public.
// In this syntax, you can do getIndex:getIndex, but if they
// are the same name, you can short handle to just getIndex,
module.exports = {
  success,
  badRequest,
  unauthorized,
  forbidden,
  internal,
  notImplemented,
  notFound,
};
