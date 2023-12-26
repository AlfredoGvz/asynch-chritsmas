/*
This file works only to fetch the instructions 
for the sprint. 
*/

const https = require("node:https");
const fs = require("fs");
// "https://nc-leaks.herokuapp.com/";
async function requestData() {
  const options = {
    hostname: "nc-leaks.herokuapp.com",
    path: "/api/confidential",
    method: "GET",
  };
  const request = await https.request(options, (response) => {
    let packetsTring = "";
    response.on("data", (packets) => {
      packetsTring += packets.toString();
    });
    response.on("end", () => {
      const dataJSON = JSON.parse(packetsTring);

      const instrucctions = dataJSON.instructions;
      fs.promises.writeFile("./DataBase/secret-message.md", instrucctions);
    });
  });
  request.end();
}

requestData();
