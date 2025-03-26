import http from "http";
import url from "url";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";

dotenv.config();

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

const client = new MongoClient(process.env.MONGO_URI);
const dbName = "pokemon_data";
let db, pokemonCollection;

// Connect to MongoDB Atlas
async function connectDB() {
  try {
    await client.connect();
    db = client.db(dbName);
    pokemonCollection = db.collection("pokemons");
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
}

// Start Server After DB Connection
connectDB().then(() => {
  const server = http.createServer(async (req, res) => {
    const queryObj = url.parse(req.url, true).query;
    const limit = Number(queryObj.limit) || 5;

    try {
      const pokemonList = await pokemonCollection
        .find({}, { projection: { _id: 0, pokeName: 1, pokeImageUrl: 1 } })
        .limit(limit)
        .toArray();

      res.writeHead(200, {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      });

      res.write(JSON.stringify(pokemonList));
      res.end();
    } catch (err) {
      console.error("❌ Database Query Error:", err);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
  });

  server.listen(process.env.PORT, () => console.log("🚀 Server running"));
});
