import http from "http";
import url from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

// Pokémon Data
const pokeList = [
  {
    pokeName: "metapod",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/11.png",
  },
  {
    pokeName: "butterfree",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/12.png",
  },
  {
    pokeName: "weedle",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/13.png",
  },
  {
    pokeName: "kakuna",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/14.png",
  },
  {
    pokeName: "beedrill",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/15.png",
  },
  {
    pokeName: "pidgey",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/16.png",
  },
  {
    pokeName: "pidgeotto",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/17.png",
  },
  {
    pokeName: "pidgeot",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/18.png",
  },
  {
    pokeName: "rattata",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/19.png",
  },
  {
    pokeName: "raticate",
    pokeImageUrl:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/20.png",
  },
];

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/pokemon_data");
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
};

// Define Mongoose Schema & Model
const pokeSchema = new mongoose.Schema({
  pokeName: { type: String, required: true, unique: true },
  pokeImageUrl: { type: String, required: true },
});
const Pokemon = mongoose.model("Pokemon", pokeSchema);

// Insert Pokémon Data (if not already present)
const insertPokemonData = async () => {
  const count = await Pokemon.countDocuments();
  if (count === 0) {
    await Pokemon.insertMany(pokeList);
    console.log("✅ Pokémon Data Inserted Successfully");
  } else {
    console.log("ℹ️ Pokémon Data Already Exists, Skipping Insert");
  }
};

// Start Server After DB Connection & Data Insertion
connectDB().then(async () => {
  await insertPokemonData();

  const server = http.createServer(async (req, res) => {
    const queryObj = url.parse(req.url, true).query;
    const limit = Number(queryObj.limit) || 5;

    try {
      const pokemonList = await Pokemon.find({})
        .limit(limit)
        .select("pokeName pokeImageUrl -_id");

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });

      res.write(JSON.stringify(pokemonList));
      res.end();
    } catch (err) {
      console.error("❌ Database Query Error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });

  server.listen(5000, () =>
    console.log("🚀 Server running on http://localhost:5000")
  );
});
