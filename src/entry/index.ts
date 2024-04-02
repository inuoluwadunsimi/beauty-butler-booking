/* istanbul ignore file */
// entry/main file
import errorHandler from "errorhandler";

import app from "../app";
import { connectMongo } from "../helpers/mongodb.connector";

//error handler
app.use(errorHandler());

(async () => {
  // Initialize server
  const server = app.listen(process.env.APP_PORT || 8000, () => {
    console.log(`⚡[server]: connected successfully `);
    connectMongo();
  });

  // Nodemon dev hack
  process.once("SIGUSR2", function () {
    server.close(function () {
      process.kill(process.pid, "SIGUSR2");
    });
  });
})();
