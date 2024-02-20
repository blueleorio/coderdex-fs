const { faker } = require("@faker-js/faker");

function generateRandomPokemon() {
  const pokemonTypes = [
    "bug",
    "dragon",
    "fairy",
    "fire",
    "ghost",
    "ground",
    "normal",
    "psychic",
    "steel",
    "dark",
    "electric",
    "fighting",
    "flying",
    "grass",
    "ice",
    "poison",
    "rock",
    "water",
  ];
  const sample = (arr) => {
    const len = arr == null ? 0 : arr.length;
    return len ? arr[Math.floor(Math.random() * len)] : undefined;
  };
  return {
    id: faker.number.int({ min: 800, max: 999 }),
    name: faker.person.firstName(),
    types: [sample(pokemonTypes), sample(pokemonTypes)],
    url: faker.image.url({ width: 256, height: 256 }),
  };
}

console.log(JSON.stringify(generateRandomPokemon()));
