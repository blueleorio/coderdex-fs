const fs = require("fs");
const csv = require("csvtojson");

const createPoke = async () => {
  let newData = await csv().fromFile(
    "D:\\VSCODE\\coderdex-fs\\server\\pokemon.csv"
  );
  let data;
  try {
    data = JSON.parse(
      fs.readFileSync("D:\\VSCODE\\coderdex-fs\\server\\db.json")
    );
  } catch (error) {
    data = {};
  }
  newData = newData.slice(0, 721).map((poke, index) => {
    return {
      id: index + 1,
      name: poke.Name,
      types: [poke.Type1, poke.Type2].filter((type) => type !== ""),
      url: `http://localhost:5000/images/pokemon_transparent/${index + 1}.png`,
    };
  });
  data.data = newData;
  data.totalPokemons = newData.length;

  fs.writeFileSync(
    "D:\\VSCODE\\coderdex-fs\\server\\db.json",
    JSON.stringify(data)
  );
};

createPoke();
