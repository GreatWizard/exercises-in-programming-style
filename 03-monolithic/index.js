import fs from "fs";
import { loadStopWords, isAlNum } from "../utils/index.js";

const args = process.argv.slice(2);

if (!args[0]) {
  throw new Error("A text file is required as first argument.");
}

// the global list of [word, frequency] pairs
const wordFreqs = [];

// the list of stop words
const stopWords = loadStopWords();

const text = fs.readFileSync(args[0], "UTF-8");
let startChar = undefined;
let i = 0;
[...text].forEach((c) => {
  if (startChar === undefined) {
    if (isAlNum(c)) {
      // We found the start of a word
      startChar = i;
    }
  } else {
    if (!isAlNum(c)) {
      // We found the end of a word. Process it
      let word = text.substring(startChar, i).toLowerCase();
      // Ignore stop words
      if (!stopWords.includes(word)) {
        // Let's see if it already exists
        let foundAt = wordFreqs.findIndex((pair) => pair.word === word);
        if (foundAt !== -1) {
          wordFreqs[foundAt].freq++;
        } else {
          wordFreqs.push({ word, freq: 1 });
          foundAt = wordFreqs.length - 1;
        }
        if (wordFreqs.length > 1) {
          // We may need to reorder
          for (let n = foundAt; n > 0; n--) {
            if (
              wordFreqs[n].freq > wordFreqs[n - 1].freq ||
              (wordFreqs[n].freq === wordFreqs[n - 1].freq &&
                wordFreqs[n].word < wordFreqs[n - 1].word)
            ) {
              // swap
              [wordFreqs[n - 1], wordFreqs[n]] = [
                wordFreqs[n],
                wordFreqs[n - 1],
              ];
            }
          }
        }
      }
      // Let's reset
      startChar = undefined;
    }
  }
  i++;
});

wordFreqs
  .slice(0, 25)
  .forEach((pair) => console.log(`${pair.word} - ${pair.freq}`));
