const express = require("express");
const { mongoose } = require("./db");
const routes = require("./controllers");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(routes);

mongoose.once("open", () => {
  app.listen(PORT, () =>
    console.log("Database connected! Now listening on ", PORT)
  );
});
 