    require("dotenv").config();
    const express = require("express");
    const cors = require("cors");
    const apiRoutes = require("./routes/api");

    const app = express();
    const PORT = process.env.PORT || 3000;

    //middlewares
    app.use(cors());
    app.use(express.json());

    //routess
    app.use("/api/v1", apiRoutes);

    //prueba
    app.get("/", (req, res) => {
        res.json({message: "Running"});
    });

    //inicializar server 
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });