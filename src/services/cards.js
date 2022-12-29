import { v4 as uuidv4 } from "uuid";

const cards = [
  {
    name: "Clerc",
    attack: 5,
    type: "Humanoïde",
    hp: 10,
    description: "Give 5HP to owner",
    cost: 2,
    abilities: [
      {
        description: "Heals the owner for 5 health.",
        useAbility: (currentPlayer) => {
          if (currentPlayer) {
            currentPlayer.hp += 5;
            if (currentPlayer.hp > 30) {
              currentPlayer.maxHp = currentPlayer.hp;
            }
          }
        },
      },
    ],
  },

  {
    name: "Guerrier",
    attack: 1,
    type: "Orc",
    description: "Simple war",
    hp: 2,
    cost: 1,
    abilities: [],
  },
  {
    name: "Chasseur",
    attack: 1,
    type: "Orc",
    description: "Can attack direcly",
    hp: 2,
    cost: 1,
    abilities: [
      {
        description: "Can attack direcly when is invoke",
        useAbility: (currentPlayer, card) => {
          if (currentPlayer) {
            card.hasAttacked = false;
          }
        },
      },
    ],
  },
  {
    name: "Paladin",
    attack: 2,
    type: "Humanoïde",
    hp: 2,
    description: "Give +2 Attack in two random card in your hand",
    cost: 4,
    abilities: [
      {
        description: "Give +2 Attack in two random card",
        useAbility: (currentPlayer) => {
          if (currentPlayer) {
            for (let index = 0; index < 2; index++) {
              let cardSelected =
                currentPlayer.hand[
                  Math.floor(Math.random() * currentPlayer.hand.length)
                ];
              cardSelected.attack += 2;
            }
          }
        },
      },
    ],
  },
  {
    name: "Demoniste",
    attack: 2,
    type: "Humanoïde",
    hp: 4,
    description: "Invock two diablotin in your side",
    cost: 4,
    abilities: [
      {
        description: "Invock two diablotin in your side",
        invokeMinion: [
          {
            id: uuidv4(),
            name: "Diablotin",
            attack: 1,
            type: "Demon",
            hp: 2,
            description: "Imp of the deep",
            cost: 0,
            abilities: [],
          },
          {
            id: uuidv4(),
            name: "Diablotin",
            attack: 1,
            type: "Demon",
            hp: 2,
            description: "Imp of the deep",
            cost: 0,
            abilities: [],
          },
        ],
      },
    ],
  },
];

export const getCards = () => {
  return cards;
};
