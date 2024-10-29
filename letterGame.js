const fs = require("fs");

const WORD_LIST = "12dicts_words.txt";
const WORD_LEN = 3;

let allWords = [];
let adjList = {};

function loadDictionary() {
  const data = fs.readFileSync(WORD_LIST, "utf-8").split("\n");
  allWords = data
    .map((word) => word.trim().toUpperCase())
    .filter((word) => word.length === WORD_LEN);
  console.log(`Loaded ${allWords.length} words.`);
}

function createAdjacencyList() {
  for (const word of allWords) {
    adjList[word] = [];
  }

  for (let i = 0; i < allWords.length; i++) {
    for (let j = i + 1; j < allWords.length; j++) {
      if (arePair(allWords[i], allWords[j])) {
        adjList[allWords[i]].push(allWords[j]);
        adjList[allWords[j]].push(allWords[i]);
      }
    }
  }
  console.log("Adjacency list created.");
}

loadDictionary();
createAdjacencyList();
