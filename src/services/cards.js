const cards = [
  {
    name: "Clerc",
    attack: 5,
    type: "Humanoïde",
    hp: 10,
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
    hp: 2,
    cost: 1,
    abilities: [],
  },
  {
    name: "Paladin",
    attack: 2,
    type: "Humanoïde",
    hp: 2,
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
];

export const getCards = () => {
  return cards;
};
