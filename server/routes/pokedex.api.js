const express = require("express");
const router = express.Router();
const fs = require("fs");
const { faker } = require("@faker-js/faker");
/**
 * params: /
 * description: get all pals
 * query:
 * method: get
 */

router.get("/", (req, res, next) => {
  //input validation
  const allowedFilter = ["name", "types"];
  try {
    let { page, limit, ...filterQuery } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    //allow title,limit and page query string only
    const filterKeys = Object.keys(filterQuery);
    filterKeys.forEach((key) => {
      if (!allowedFilter.includes(key)) {
        const exception = new Error(`Query ${key} is not allowed`);
        exception.statusCode = 401;
        throw exception;
      }
      if (!filterQuery[key]) delete filterQuery[key];
    });
    //processing logic

    //Number of items skip for selection
    let offset = limit * (page - 1);

    //Read data from db.json then parse to JSobject
    let db = fs.readFileSync(
      "D:\\VSCODE\\coderdex-fs\\server\\db.json",
      "utf-8"
    );
    db = JSON.parse(db);
    const { data } = db;
    //Filter data by title
    let result = [];

    if (filterKeys.length) {
      filterKeys.forEach((condition) => {
        if (condition === "name") {
          result = result.length
            ? result.filter((pal) =>
                pal[condition]
                  .toLowerCase()
                  .includes(filterQuery[condition].toLowerCase())
              )
            : data.filter((pal) =>
                pal[condition]
                  .toLowerCase()
                  .includes(filterQuery[condition].toLowerCase())
              );
        } else if (condition === "types") {
          result = result.length
            ? result.filter((pal) =>
                pal[condition].some(
                  (type) =>
                    type.toLowerCase() === filterQuery[condition].toLowerCase()
                )
              )
            : data.filter((pal) =>
                pal[condition].some(
                  (type) =>
                    type.toLowerCase() === filterQuery[condition].toLowerCase()
                )
              );
        }
      });
    } else {
      result = data;
    }
    //then select number of result by offset
    result = result.slice(offset, offset + limit);
    //send response
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

/**
 * params: /:id
 * description: get single pals with adjacent pals
 * query:
 * method: get
 */

router.get("/:id", (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      throw new Error("Invalid ID");
    }

    let db = fs.readFileSync(
      "D:\\VSCODE\\coderdex-fs\\server\\db.json",
      "utf-8"
    );
    db = JSON.parse(db);
    const { data } = db;

    if (id < 1 || id > data.length) {
      throw new Error("ID out of range");
    }

    const prevId = id === 1 ? data.length : id - 1;
    const nextId = id === data.length ? 1 : id + 1;

    const pal = data.find((pal) => pal.id === id);
    const prevPal = data.find((pal) => pal.id === prevId);
    const nextPal = data.find((pal) => pal.id === nextId);

    res.status(200).send({ pal, prevPal, nextPal });
  } catch (error) {
    next(error);
  }
});

/**
 * params: /
 * description: post a pal
 * query:
 * method: post
 */

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

router.post("/", (req, res, next) => {
  try {
    const { id, name, types, url } = req.body;

    // Check for missing data
    if (!id || !name || !types || !url) {
      const exception = new Error("Missing required data.");
      exception.statusCode = 400;
      throw exception;
    }

    // Check for invalid number of types
    if (types.length < 1 || types.length > 2) {
      const exception = new Error("Pal can only have one or two types.");
      exception.statusCode = 400;
      throw exception;
    }

    // Check for invalid types
    if (!types.every((type) => pokemonTypes.includes(type))) {
      const exception = new Error("Pal's type is invalid.");
      exception.statusCode = 400;
      throw exception;
    }

    // Read data from db.json then parse to JS object
    let db = fs.readFileSync(
      "D:\\VSCODE\\coderdex-fs\\server\\db.json",
      "utf-8"
    );
    db = JSON.parse(db);
    const { data } = db;

    // Check if Pokémon already exists
    if (data.some((pal) => pal.id === id || pal.name === name)) {
      const exception = new Error("The Pal already exists.");
      exception.statusCode = 400;
      throw exception;
    }

    // Add new Pokémon to data array
    const newPal = { id, name, types, url };
    data.push(newPal);

    // Update db object and convert it back to a JSON string
    db.data = data;
    db = JSON.stringify(db);

    // Write the updated db object back to db.json
    fs.writeFileSync("D:\\VSCODE\\coderdex-fs\\server\\db.json", db);

    // Send the new Pokémon in the response
    res.status(201).send(newPal);
  } catch (error) {
    next(error);
  }
});

/**
 * params: /
 * description: update a book
 * query:
 * method: put
 */

router.put("/:bookId", (req, res, next) => {
  //put input validation
  try {
    const allowUpdate = [
      "author",
      "country",
      "imageLink",
      "language",
      "pages",
      "title",
      "year",
    ];

    const { bookId } = req.params;

    const updates = req.body;
    const updateKeys = Object.keys(updates);
    //find update request that not allow
    const notAllow = updateKeys.filter((el) => !allowUpdate.includes(el));

    if (notAllow.length) {
      const exception = new Error(`Update field not allow`);
      exception.statusCode = 401;
      throw exception;
    }
    //put processing
    //Read data from db.json then parse to JSobject
    let db = fs.readFileSync(
      "D:\\VSCODE\\coderdex-fs\\server\\db.json",
      "utf-8"
    );
    db = JSON.parse(db);
    const { books } = db;
    //find book by id
    const targetIndex = books.findIndex((book) => book.id === bookId);
    if (targetIndex < 0) {
      const exception = new Error(`Book not found`);
      exception.statusCode = 404;
      throw exception;
    }
    //Update new content to db book JS object
    const updatedBook = { ...db.books[targetIndex], ...updates };
    db.books[targetIndex] = updatedBook;

    //db JSobject to JSON string

    db = JSON.stringify(db);
    //write and save to db.json
    fs.writeFileSync("db.json", db);
    //put send response
    res.status(200).send(updatedBook);
  } catch (error) {
    next(error);
  }
});

/**
 * params: /
 * description: update a book
 * query:
 * method: delete
 */

router.delete("/:bookId", (req, res, next) => {
  //delete input validation
  try {
    const { bookId } = req.params;
    //delete processing
    //Read data from db.json then parse to JSobject
    let db = fs.readFileSync(
      "D:\\VSCODE\\coderdex-fs\\server\\db.json",
      "utf-8"
    );
    db = JSON.parse(db);
    const { books } = db;
    //find book by id
    const targetIndex = books.findIndex((book) => book.id === bookId);
    if (targetIndex < 0) {
      const exception = new Error(`Book not found`);
      exception.statusCode = 404;
      throw exception;
    }
    //filter db books object
    db.books = books.filter((book) => book.id !== bookId);
    //db JSobject to JSON string

    db = JSON.stringify(db);
    //write and save to db.json

    fs.writeFileSync("db.json", db);
    //delete send response
    res.status(200).send({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
