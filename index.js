const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const connectDb = require("./config/dbConnection");
const { urlencoded } = require("body-parser");
const dotenv = require("dotenv").config();

connectDb();
const app = express();
app.use(express.json());
app.use(urlencoded({extended:true}));
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.use("/api/contacts", require("./routes/contactRoute"));
app.use("/api/users", require("./routes/userRoutes"));

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`)
})