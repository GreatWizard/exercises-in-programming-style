import fs from "fs";

export function loadStopWords() {
  return fs
    .readFileSync("stop_words.txt", "UTF-8")
    .toString()
    .toLowerCase()
    .split(",");
}

export function isAlpha(c) {
  return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
}

export function isDigit(c) {
  return c >= "0" && c <= "9";
}

export function isAlNum(c) {
  return isAlpha(c) || isDigit(c);
}
