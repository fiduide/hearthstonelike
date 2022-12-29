import { v4 as uuidv4 } from "uuid";
import { getCards } from "services/cards";

const cards = getCards();

// export const generateRandomCard = (ownerId) => {
//   const types = ["Creature", "Weapon", "Spell"];
//   const type = types[Math.floor(Math.random() * types.length)];
//   const names = ["Fireball", "Frostbolt", "Gorehowl", "Ashbringer"];
//   const name = names[Math.floor(Math.random() * names.length)];
//   const attack = Math.floor(Math.random() * 10);
//   const hp = Math.floor(Math.random() * 10);
//   const cost = Math.floor(Math.random() * 10);
//   const id = uuidv4();
//   const owner = ownerId;
//   const hasAttacked = false;
//   const description = generateCardDescription({
//     type,
//     attack,
//     hp,
//     cost,
//   });

//   return { id, type, name, description, attack, hp, cost, hasAttacked, owner };
// };

export const generateRandomCard = (ownerId) => {
  let card = cards[Math.floor(Math.random() * cards.length)];

  return {
    ...card,
    id: uuidv4(),
    hasAttacked: false,
    owner: ownerId,
  };
};

export const generateRandomHand = (owner) => {
  const hand = [];
  for (let i = 0; i < 5; i++) {
    hand.push(generateRandomCard(owner));
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

export const generateRandomDeck = (owner) => {
  const deck = [];
  for (let i = 0; i < 30; i++) {
    deck.push(generateRandomCard(owner));
  }
  return deck;
};

export const writeBoardAction = (action, player) => {
  let p = document.createElement("p");
  p.innerHTML = `[${player}] : ${action}`;

  if (player === "player") {
    p.style.backgroundColor = "blue";
  }
  document.getElementById("log").appendChild(p);
};
