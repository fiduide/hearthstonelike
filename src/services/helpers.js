import { v4 as uuidv4 } from "uuid";

export const generateRandomCard = () => {
  const types = ["Creature", "Weapon", "Spell"];
  const type = types[Math.floor(Math.random() * types.length)];
  const names = ["Fireball", "Frostbolt", "Gorehowl", "Ashbringer"];
  const name = names[Math.floor(Math.random() * names.length)];
  const attack = Math.floor(Math.random() * 10);
  const hp = Math.floor(Math.random() * 10);
  const cost = Math.floor(Math.random() * 10);
  const id = uuidv4();
  const hasAttacked = false;
  const description = generateCardDescription({
    type,
    attack,
    hp,
    cost,
  });

  return { id, type, name, description, attack, hp, cost, hasAttacked };
};

export const generateCardDescription = (card) => {
  let description = "";
  if (card.type === "Creature") {
    description += `A ${card.attack}creature with ${card.hp} hit points.`;
  } else if (card.type === "Weapon") {
    description += `A weapon with ${card.attack} attack.`;
  } else if (card.type === "Spell") {
    description += `A spell with a cost of ${card.cost} mana that does X damage.`;
  }
  return description;
};

export const generateRandomHand = () => {
  const hand = [];
  for (let i = 0; i < 5; i++) {
    hand.push(generateRandomCard());
  }
  return hand;
};

// const generateRandomDiscard = () => {
//   const discard = [];
//   for (let i = 0; i < 5; i++) {
//     discard.push(generateRandomCard());
//   }
//   return discard;
// };

export const generateRandomDeck = () => {
  const deck = [];
  for (let i = 0; i < 30; i++) {
    deck.push(generateRandomCard());
  }
  return deck;
};

export const writeBoardAction = (action, player) => {
  let p = document.createElement("p");
  p.innerHTML = action;

  if (player === "player") {
    p.style.backgroundColor = "blue";
  }
  document.getElementById("log").appendChild(p);
};
