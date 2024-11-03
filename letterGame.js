const fs = require("fs");
const { Graph } = require("graphology");
const { write: writeGEXF } = require("graphology-gexf");

const WORD_LIST = "12dicts_words.txt";
const WORD_LEN = 3;

let allWords = [];
let adjList = {};

function arePair(w1, w2) {
  let numDiffs = 0;
  for (let i = 0; i < w1.length; i++) {
    if (w1[i] !== w2[i]) {
      numDiffs++;
      if (numDiffs >= 2) return false;
    }
  }
  return numDiffs === 1;
}

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

function bfs(fromWord, toWord) {
  if (!(fromWord in adjList) || !(toWord in adjList)) {
    console.log("One or both words not in dictionary.");
    return;
  }

  const queue = [fromWord];
  const visited = new Set([fromWord]);
  const parent = { [fromWord]: null };

  while (queue.length > 0) {
    const u = queue.shift();

    for (const v of adjList[u]) {
      if (!visited.has(v)) {
        visited.add(v);
        parent[v] = u;
        queue.push(v);

        if (v === toWord) {
          let path = [];
          let current = toWord;
          while (current) {
            path.push(current);
            current = parent[current];
          }
          path.reverse();
          console.log("Path: " + path.join(" -> "));
          return;
        }
      }
    }
  }
  console.log("Cannot connect!");
}

function generateGraph() {
  const graph = new Graph();

  allWords.forEach((word) => {
    graph.addNode(word, { label: word });
  });

  for (const word in adjList) {
    adjList[word].forEach((neighbor) => {
      if (!graph.hasEdge(word, neighbor)) {
        graph.addEdge(word, neighbor);
      }
    });
  }

  return graph;
}

function exportToGEXF(graph, filename) {
  const gexfData = writeGEXF(graph);
  fs.writeFileSync(filename, gexfData);
  console.log(`Graph saved to ${filename}`);
}

loadDictionary();
createAdjacencyList();
bfs("CAT", "DOG");
const graph = generateGraph();
exportToGEXF(graph, "graph.gexf");