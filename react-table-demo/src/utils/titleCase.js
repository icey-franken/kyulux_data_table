export default function titleCase(str) {
  let upper = true;
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i] === "_") {
      upper = true;
      newStr += " ";
    } else {
      newStr += upper ? str[i].toUpperCase() : str[i].toLowerCase();
      upper = false;
    }
  }
  return newStr;
}
