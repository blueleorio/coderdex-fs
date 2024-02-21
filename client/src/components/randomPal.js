import { fakerVI as faker } from "@faker-js/faker";
import { pokemonTypes } from "../pokemonTypes";

export const generateRandomPal = () => {
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
};
