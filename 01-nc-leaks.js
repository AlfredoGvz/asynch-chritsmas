/*
### Task 1

Write a function called `getPeople` that will retrieve list of all the available 
people on the `northcoders` server . This should:

1. Use node's `https` module to make a request to `https://nc-leaks.herokuapp.com/api/people`.
2. Once you have the response as a useable object, look through the people to find anyone who 
has `northcoders` as the workplace.
3. Save these `northcoders` employees to a file called `northcoders.json` - remember 
that the data argument of `fs.writeFile` must be of type string\* so you may need to 
manipulate the data before saving it.

\* _Or Buffer, Typedarray or DataView but these won't be as relevant to you!_

> Note: If you have `prettier` installed, you can go into this `.json` file, 
press save and prettier can format your data in a more readable way.

*/
const https = require("node:https");
const fs = require("fs");

async function getPeople() {
  const options = {
    hostname: "nc-leaks.herokuapp.com",
    path: "/api/people",
    method: "GET",
  };
  const request = await https.request(options, (response) => {
    let packetBody = "";
    let dataObject;
    response.on("data", (packets) => {
      packetBody += packets.toString();
    });
    response.on("end", () => {
      dataObject = JSON.parse(packetBody);
      const northcoders = dataObject.people.filter(
        (person) => person.job.workplace === "northcoders"
      );
      const northcodersString = JSON.stringify(northcoders);
      fs.promises.writeFile("./DataBase/northcoders.json", northcodersString);
    });
  });
  request.end();
}

getPeople();

/*
#### Task 2

Write a function called `getInterests` that uses the newly found usernames for each northcoder to retrieve information on everyone's interests. This function should:

1. Use `fs` to read the `northcoders.json` file you created in task 1
2. For every person, use their `username` and make a request to `https://nc-leaks.herokuapp.com/api/people/:username/interests` to get their interests.
3. Each response will be an object with a person key. Collect up the data at this `person` key into an array.
4. Once you have all responses in the array, save it to a file called `interests.json`.

*/

async function getInterests() {
  try {
    const fileRead = await fs.promises.readFile("./DataBase/northcoders.json");
    const fileObject = JSON.parse(fileRead.toString());
    const interests = [];

    for (let person in fileObject) {
      const options = {
        hostname: "nc-leaks.herokuapp.com",
        path: `/api/people/${fileObject[person].username}/interests`,
      };

      let packetString = "";
      let bodyOfInfo;

      const request = await https.request(options, (response) => {
        response.on("data", (packets) => {
          packetString += packets.toString();
        });
        response.on("end", () => {
          bodyOfInfo = JSON.parse(packetString);
          interests.push(bodyOfInfo.person);
          fs.promises.writeFile(
            "./DataBase/interests.json",
            JSON.stringify(interests)
          );
        });
      });
      request.end();
    }
  } catch (error) {
    console.log("Error, something went wrong here! Probably my life :(");
  }
}

getInterests();

/*
### Task 3

Write a function called `getPets` that does the 
same as the Task 2 but for pets. 
The endpoint is `https://nc-leaks.herokuapp.com/api/people/:username/pets`;

> Note: Some of the users do not have pets and so the server will 
give a 404 response! These responses should not be included in 
the `pets.json`. Consider how to you will use the status code 
to inform when to include some pets.

*/

async function getPets() {
  try {
    const fileRead = await fs.promises.readFile("./DataBase/northcoders.json");
    const fileObject = JSON.parse(fileRead.toString());
    const pets = [];

    for (const person in fileObject) {
      const options = {
        hostname: "nc-leaks.herokuapp.com",
        path: `/api/people/${fileObject[person].username}/pets`,
        method: "GET",
      };
      let packetString = "";
      let bodyOfInfo;
      const request = await https.request(options, (response) => {
        if (response.statusCode < 400) {
          response.on("data", (packets) => {
            packetString += packets.toString();
          });
        }
        response.on("end", () => {
          bodyOfInfo = JSON.parse(packetString);
          pets.push(bodyOfInfo.person);
          console.log(pets);
          fs.promises.writeFile("./DataBase/pets.json", JSON.stringify(pets));
        });
      });
      request.end();
    }
  } catch (error) {
    console.log(error);
  }
}

getPets();
