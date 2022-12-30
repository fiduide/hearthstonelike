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
        invokedAbility: (currentPlayer) => {
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
        invokedAbility: (currentPlayer, card) => {
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
        invokedAbility: (currentPlayer) => {
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
            name: "Diablotin",
            attack: 1,
            type: "Demon",
            hp: 2,
            description: "Imp of the deep",
            cost: 0,
            abilities: [],
          },
          {
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
            name: "Undead",
            attack: 1,
            type: "Undead",
            hp: 2,
            description: "Resurrected by Sylvanas",
            cost: 0,
            abilities: [],
          },
          {
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
            name: "Flame of Azzinoth",
            attack: 2,
            type: "Weapon",
            hp: 1,
            description: "Glaives of Illidan",
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
        invokedAbility: (currentPlayer, card, cardsInPlay) => {
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
  {
    name: "Lich Kings",
    attack: 8,
    type: "Undead",
    hp: 8,
    cost: 8,
    description:
      "Provocation: At the end of your turn, add a random Death Knight card to your hand",
    abilities: [
      {
        description:
          "At the end of your turn, add a random Death Knight card to your hand",
        invokeEndMinion: [
          {
            name: "Death knight",
            attack: 2,
            type: "Undead",
            hp: 1,
            description: "Called by Lich Kings",
            cost: 0,
            abilities: [],
          },
        ],
      },
    ],
  },
  {
    name: "Gamon",
    attack: 6,
    type: "Humanoid",
    hp: 6,
    cost: 10,
    description: "I Gamon i will save us.",
    abilities: [],
  },
  {
    name: "Deathwing",
    attack: 12,
    type: "Dragon",
    hp: 12,
    cost: 10,
    description:
      "Battle Cry: Destroys all other servants and discards your hand.",
    abilities: [
      {
        description: "Destroys all other servants and discards your hand.",
        invokedAbility: (currentPlayer, card, cardsInPlay, setCardsInPlay) => {
          if (currentPlayer) {
            currentPlayer.hand = [];
            setCardsInPlay([]);
          }
        },
      },
    ],
  },
];

export const getCards = () => {
  return cards;
};
