import { v4 as uuidv4 } from "uuid";

const cards = [
  {
    name: "Clerc",
    attack: 5,
    type: "Humanoid",
    hp: 10,
    description: "Give 5HP to owner",
    cost: 8,
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
    name: "War",
    attack: 1,
    type: "Orc",
    description: "Simple war",
    hp: 2,
    cost: 1,
    abilities: [],
  },
  {
    name: "Hunter",
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
    type: "Humanoid",
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
    type: "Humanoid",
    hp: 4,
    description: "Summon two diablotin in your side",
    cost: 4,
    abilities: [
      {
        description: "Summon two diablotin in your side",
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
  {
    name: "Murloc",
    attack: 3,
    type: "Murloc",
    hp: 2,
    cost: 4,
    description: "",
    abilities: [],
  },
  {
    name: "Sylvanas",
    attack: 4,
    type: "Undead",
    hp: 4,
    cost: 6,
    description: "Summon 2 undead 2/1",
    abilities: [
      {
        description: "Summon two undead in your side",
        invokeMinion: [
          {
            id: uuidv4(),
            name: "Undead",
            attack: 1,
            type: "Undead",
            hp: 2,
            description: "Resurrected by Sylvanas",
            cost: 0,
            abilities: [],
          },
          {
            id: uuidv4(),
            name: "Undead",
            attack: 1,
            type: "Undead",
            hp: 2,
            description: "Resurrected by Sylvanas",
            cost: 0,
            abilities: [],
          },
        ],
      },
    ],
  },
  {
    name: "Illidan",
    attack: 7,
    type: "Demon",
    hp: 5,
    cost: 6,
    description: "Summon one Flame of Azzinoth 2/1",
    abilities: [
      {
        description: "Summon the Sword of Illidan",
        invokeMinion: [
          {
            id: uuidv4(),
            name: "Flame of Azzinoth",
            attack: 2,
            type: "Weapon",
            hp: 1,
            description: "Resurrected by Sylvanas",
            cost: 0,
            abilities: [],
          },
        ],
      },
    ],
  },
  {
    name: "Raz the madman",
    attack: 5,
    type: "Humanoid",
    hp: 3,
    cost: 4,
    description: "Raz crushes",
    abilities: [],
  },
  {
    name: "Millificent Mountain Storm",
    attack: 3,
    type: "Meca",
    hp: 5,
    cost: 4,
    description: "",
    abilities: [],
  },
  {
    name: "Milhouse mana storm",
    attack: 1,
    type: "Humanoid",
    hp: 1,
    cost: 5,
    description: "Gains +1/+1 for each Humanoid on the board",
    abilities: [
      {
        description: "Gains +1/+1 for each Humanoid on the board",
        useAbility: (currentPlayer, card, cardsInPlay) => {
          if (currentPlayer) {
            const HumanoidCards = cardsInPlay.filter(
              (card) => card.type === "Humanoid"
            );

            HumanoidCards.forEach((element) => {
              card.hp += 1;
              card.attack += 1;
            });
          }
        },
      },
    ],
  },
];

export const getCards = () => {
  return cards;
};
