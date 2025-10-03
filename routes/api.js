const express = require("express");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");
const router = express.Router();

// Endpoint Login

router.post("/auth", (req, res)=>{
    const {email, password} = req.body;

    if(email === process.env.EMAIL && password === process.env.PASSWORD){
        //generar token
        const token = jwt.sign(
            {email:email}, 
            process.env.JWT_SECRET, 
            {expiresIn: "4h"}
        );
        return res.status(200).json({token:token});
    }else{
        return res.status(400).json({error: "invalid credentials"});
    } 
});

//Endpoint protect to search pokemon
router.post("/pokemonDetails", verifyToken, async (req, res)=>{
    const { pokemonName} =req.body;

    if(!pokemonName){
        return res.status(400).json({
            name: "",
            species: "",
            weight: "",
            img_url: "",
        });
    }

    try{
        const response = await fetch(
            `${process.env.POKEAPI_URL}/pokemon/${pokemonName.toLowerCase()}`
        );

        if(!response.ok){
            return res.status(400).json({
                name: "",
                species: "",
                weight: "",
                img_url: "",
            });
        }

        const data = await response.json();

        const pokemonData={// Transformar data 
            name: data.name,
            species: data.species.name,
            weight: data.weight.toString(),
            img_url: data.sprites.front_default,
        };
        return res.status(200).json(pokemonData);

        
        
    }catch(error){
        console.error("Error al consultar PokeApi: ", error);
        return res.status(400).json({
            name: "",
            species: "",
            weight: "",
            img_url: "",
        });
    }

});

module.exports = router;