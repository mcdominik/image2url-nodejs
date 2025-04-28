const colors = [
  "red",
  "blue",
  "green",
  "yellow",
  "purple",
  "orange",
  "pink",
  "brown",
  "black",
  "white",
  "gold",
  "ruby",
  "chrome",
  "amber",
];

const foods = [
  "apple",
  "banana",
  "carrot",
  "grape",
  "lemon",
  "mango",
  "peach",
  "tomato",
  "cucumber",
  "berry",
  "cherry",
  "coconut",
  "kiwi",
  "onion",
  "pumpkin",
];

export const getCoolRandomName = () => {
  const color = colors[Math.floor(Math.random() * colors.length)];

  const food = foods[Math.floor(Math.random() * foods.length)];

  return `${color}-${food}`;
};
