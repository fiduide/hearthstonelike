const cards = [
  {
    name: "Clerc",
    attack: 5,
    type: "Humanoid",
    hp: 10,
    description: "Give 5HP to owner",
    cost: 8,
    abilities: {
      invokeAbilities: [
        {
          id: "healCurrentPlayer",
          description: "Heals the owner for 5 health.",
          heal: 5,
        },
      ],
    },
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
    abilities: {
      invokeAbilities: [
        {
          id: "charge",
          description: "Can attack direcly when is invoke",
        },
      ],
    },
  },
  {
    name: "Paladin",
    attack: 2,
    type: "Humanoid",
    hp: 2,
    description: "Give +2 Attack in two random card in your hand",
    cost: 4,
    abilities: {
      invokeAbilities: [
        {
          id: "giveAttackCardInHand",
          description: "Give +2 Attack in two random card",
          attack: 2,
          time: 2,
        },
      ],
    },
  },
  {
    name: "Gull’dan",
    attack: 3,
    type: "Orc",
    hp: 5,
    description: "Summon two diablotin in your side 1/2",
    cost: 6,
    abilities: {
      invokeAbilities: [
        {
          id: "summonInvoke",
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
  },
  {
    name: "Diablotin of Fire",
    attack: 3,
    type: "Demon",
    hp: 3,
    cost: 3,
    description: "Imp of the hell",
  },
  {
    name: "Skoll",
    attack: 3,
    type: "Creature",
    hp: 2,
    cost: 2,
    description: "",
  },
  {
    name: "Gara",
    attack: 2,
    type: "Creature",
    hp: 4,
    cost: 3,
    description: "",
  },
  {
    name: "Thok the bloodthirsty",
    attack: 6,
    type: "Creature",
    hp: 3,
    cost: 3,
    description: "",
  },

  {
    name: "Diablotin",
    attack: 2,
    type: "Demon",
    hp: 3,
    cost: 2,
    description: "Imp of the deep",
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
    abilities: {
      invokeAbilities: [
        {
          id: "summonInvoke",
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
  },
  {
    name: "Illidan",
    attack: 7,
    type: "Demon",
    hp: 5,
    cost: 6,
    description: "Summon one Flame of Azzinoth 2/1",
    abilities: {
      invokeAbilities: [
        {
          id: "summonInvoke",
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
    abilities: {
      invokeAbilities: [
        {
          id: "giveToCardWhenTypeInBoard",
          description: "Gains +1/+1 for each Humanoid on the board",
          attack: 1,
          hp: 1,
          when: "Humanoid",
        },
      ],
    },
  },
  {
    name: "Lich Kings",
    attack: 8,
    type: "Undead",
    hp: 8,
    cost: 8,
    description:
      "Provocation: At the end of your turn, add a random Death Knight card to your hand",
    abilities: {
      endTurnAbilities: [
        {
          id: "summonInvoke",
          end: true,
          description:
            "At the end of your turn, add a random Death Knight card to your hand",
          invokeMinion: [
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
    abilities: {
      invokeAbilities: [
        {
          id: "resetBoard",
          description: "Destroys all other servants and .",
        },
        {
          id: "discardHand",
          description: "discards your hand",
        },
      ],
    },
  },
  {
    name: "The butcher",
    attack: 6,
    type: "Orc",
    hp: 7,
    cost: 8,
    description: "Can attack direcly",
    abilities: {
      invokeAbilities: [
        {
          id: "charge",
          description: "Can attack direcly",
        },
      ],
    },
  },
  {
    name: "Leeroy",
    attack: 5,
    type: "Humanoid",
    hp: 1,
    cost: 4,
    description: "Summon 3 dragonet eggs, the card dies on the next turn.",
    abilities: {
      invokeAbilities: [
        {
          id: "summonInvoke",
          invokeMinion: [
            {
              name: "Dragonfly egg",
              attack: 0,
              type: "Dragon",
              hp: 1,
              cost: 1,
              description: "Splinter in the next round",
              abilities: {
                startTurnAbilities: [
                  {
                    id: "openEggs",
                  },
                ],
              },
            },
            {
              name: "Dragonfly egg",
              attack: 0,
              type: "Dragon",
              hp: 1,
              cost: 1,
              description: "Splinter in the next round",
              abilities: {
                startTurnAbilities: [
                  {
                    id: "openEggs",
                  },
                ],
              },
            },
            {
              name: "Dragonfly egg",
              attack: 0,
              type: "Dragon",
              hp: 1,
              cost: 1,
              description: "Splinter in the next round",
              abilities: {
                startTurnAbilities: [
                  {
                    id: "openEggs",
                  },
                ],
              },
            },
          ],
        },
      ],
      startTurnAbilities: [
        {
          id: "deathCard",
        },
      ],
    },
  },

  {
    name: "Dragonfly egg",
    attack: 0,
    type: "Dragon",
    hp: 1,
    cost: 1,
    description: "Splinter in the next round",
  },

  {
    name: "Dragonfly",
    attack: 2,
    type: "Dragon",
    hp: 3,
    cost: 2,
    description: "",
  },
  {
    name: "Ysera",
    attack: 4,
    type: "Dragon",
    hp: 12,
    cost: 9,
    description: "At the end of your turn, add a dragon card to your hand",
    abilities: {
      endTurnAbilities: [
        {
          id: "giveTypedCardInHand",
          type: "Dragon",
          time: 1,
        },
      ],
    },
  },
  {
    name: "Mana Wave Totem",
    attack: 0,
    type: "Totem",
    hp: 3,
    cost: 3,
    description: "You draw a card at the end of your turn.",
    abilities: {
      endTurnAbilities: [
        {
          id: "drawCard",
          time: 1,
        },
      ],
    },
  },

  {
    name: "Totem of vitality",
    attack: 0,
    type: "Totem",
    hp: 3,
    cost: 2,
    description: "At the end of the round return 4hp to the hero",
    abilities: {
      endTurnAbilities: [
        {
          id: "healCurrentPlayer",
          description: "HP Player +4",
          heal: 4,
        },
      ],
    },
  },
  {
    name: "Totem of fire tongue",
    attack: 0,
    type: "Totem",
    hp: 2,
    cost: 2,
    description: "Adjacent servants have +2ATQ.",
  },
  {
    name: "Thrall",
    attack: 4,
    type: "Orc",
    hp: 7,
    cost: 8,
    description: "Summon a random totem.",
    abilities: {
      invokeAbilities: [
        {
          id: "summonTypedCard",
          time: 1,
          type: "Totem",
        },
      ],
    },
  },
  {
    name: "Medhiv",
    attack: 7,
    type: "Humanoid",
    hp: 7,
    cost: 8,
    description: "War cry: you team of Atiesh, great stick of the Guardian.",
    abilities: {
      invokeAbilities: [
        {
          id: "summonInvoke",
          invokeMinion: [
            {
              name: "Atiesh",
              attack: 1,
              type: "Weapon",
              hp: 2,
              cost: 3,
              description:
                "Next turn summons a random servant of the same cost and dies next turn.",
              abilities: {
                startTurnAbilities: [
                  {
                    id: "summonSameCostCard",
                    time: 1,
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  },
];

export const getCards = () => {
  return cards;
};

export const getCardWithName = (name) => {
  return cards.filter((card) => card.name === name);
};

export const getCardByCost = (cost) => {
  return cards.filter((card) => card.cost === cost);
};

export const getCardByType = (type) => {
  return cards.filter((card) => card.type === type);
};
