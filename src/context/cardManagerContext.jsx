import React, { createContext, useContext, useEffect, useState } from "react";
import { PlayerManagerContext } from "./playerManagerContext";
import { writeBoardAction } from "services/helpers";
import { v4 as uuidv4 } from "uuid";
import { getCardByCost, getCardByType, getCardWithName } from "services/cards";

export const CardManagerContext = createContext(false);

export const CardManagerProvider = ({ children }) => {
  const [selectedCard, setSelectedCard] = useState([]);
  const [cardsInPlay, setCardsInPlay] = useState([]);
  const [isAttacking, setIsAttacking] = useState(false);

  const {
    computer,
    player,
    currentPlayer,
    endTurn,
    playerDeath,
    setPlayerDeath,
  } = useContext(PlayerManagerContext);

  useEffect(() => {
    if (currentPlayer.id === "computer") {
      handleComputerTurn();
    }
  }, [currentPlayer]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCardsInPlay(cardsInPlay);
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [cardsInPlay]);

  const handleCardClick = (card) => {
    if (card.hasAttacked && card.owner === currentPlayer.id) {
      writeBoardAction(
        `La carte ${card.name} a déjà attaqué ce tour-ci ou vient d'être invoqué`,
        currentPlayer.id
      );
      return;
    }
    // Récupère les informations du joueur courant
    const currentPlayerInfo = {
      hand: currentPlayer.hand,
      played: cardsInPlay.filter((card) => card.owner === currentPlayer.id),
    };

    // Trouve la carte dans la main du joueur
    const isCardOwnedByCurrentPlayerInHand = currentPlayerInfo.hand.find(
      (cardHand) => cardHand.id === card.id
    );

    const isCardOwnedByCurrentPlayerInBoard = currentPlayerInfo.played.find(
      (cardHand) => cardHand.id === card.id
    );

    // Récupère les informations du joueur adverse
    const opponentPlayerInfo =
      currentPlayer.id === "player"
        ? {
            hand: computer.hand,
            played: cardsInPlay.filter((card) => card.owner === computer.id),
          }
        : {
            hand: player.hand,
            played: cardsInPlay.filter((card) => card.owner === player.id),
          };

    const isCardOwnedByOpponentInBoard = opponentPlayerInfo.played.find(
      (cardHand) => cardHand.id === card.id
    );

    const isCardInPlay = cardsInPlay.find(
      (cardInPlay) => cardInPlay.id === card.id
    );

    if (isCardOwnedByCurrentPlayerInHand) {
      if (currentPlayer.currentMana >= card.cost) {
        invokeCard(card);
      } else {
        writeBoardAction(
          `${currentPlayer.name} n'a pas assez de mana pour jouer la carte (${card.name})`,
          currentPlayer.id
        );
      }
    }

    if (isCardInPlay) {
      if (isCardOwnedByOpponentInBoard) {
        if (selectedCard) {
          //attack
          attackCardPlayer(selectedCard, card);
          setSelectedCard(null);
        }
      } else if (isCardOwnedByCurrentPlayerInBoard) {
        setSelectedCard(card);
        writeBoardAction(
          `La carte ${card.name} a été sélectionné`,
          currentPlayer.id
        );
      }
    }
  };

  const attackCardPlayer = async (attackerCard, defenderCard) => {
    const provationCardExist = cardsInPlay.filter(
      (card) => card.provocation === true && card.owner !== currentPlayer.id
    );

    if (provationCardExist.length > 0 && defenderCard.provocation !== true) {
      writeBoardAction(
        `Les cartes provocation doivent être détruitent en premier`,
        currentPlayer.id
      );
      return;
    }

    // setIsAttacking(true);
    let cardsDie = [];

    let defenderCardComponent = document.getElementById(defenderCard.id);
    let attackCardComponent = document.getElementById(attackerCard.id);
    attackCardComponent.style.transition = "ease-in-out all 0.25s";

    let defenderCardPosition = defenderCardComponent.getBoundingClientRect();

    if (attackerCard.owner === "player") {
      attackCardComponent.style.transform = `translate3d(${0}px, ${
        -defenderCardPosition.top / 2
      }px, 0)`;
    } else {
      attackCardComponent.style.transform = `translate3d(${0}px, ${
        defenderCardPosition.top / 2
      }px, 0)`;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    attackCardComponent.style.transform = `translate3d(0, 0, 0)`;

    defenderCardComponent.style.background = "rgba(191, 0, 0, 0.57)";
    await new Promise((resolve) => setTimeout(resolve, 100));
    defenderCardComponent.style.background = "initial";

    attackerCard.hp -= defenderCard.attack;
    attackerCard.hasAttacked = true;
    defenderCard.hp -= attackerCard.attack;

    if (attackerCard.hp <= 0) {
      writeBoardAction(
        `La carte ${attackerCard.name} est détruite`,
        attackerCard.owner
      );
      cardsDie.push(attackerCard);
    }

    if (defenderCard.hp <= 0) {
      writeBoardAction(
        `La carte ${defenderCard.name} est détruite`,
        defenderCard.owner
      );
      cardsDie.push(defenderCard);
    }

    if (cardsDie.length > 0) {
      cardsDie.forEach((cardDeath) => {
        dieAbilitiesLaunch(cardDeath);
      });
    }
  };

  const dieAbilitiesLaunch = async (card) => {
    let elementId = document.getElementById(card.id);

    elementId.style.background = "rgba(191, 0, 0, 0.57)";

    elementId.style.transform = `translate3d(${-5}px, ${0}px, 0)`;
    await new Promise((resolve) => setTimeout(resolve, 100));
    elementId.style.transform = `translate3d(${5}px, ${0}px, 0)`;
    await new Promise((resolve) => setTimeout(resolve, 100));
    elementId.style.transform = `translate3d(${-5}px, ${0}px, 0)`;
    await new Promise((resolve) => setTimeout(resolve, 100));
    elementId.style.transform = `translate3d(${5}px, ${0}px, 0)`;
    await new Promise((resolve) => setTimeout(resolve, 100));
    elementId.style.transform = `translate3d(${-5}px, ${0}px, 0)`;
    await new Promise((resolve) => setTimeout(resolve, 100));
    elementId.style.transform = `translate3d(${5}px, ${0}px, 0)`;
    await new Promise((resolve) => setTimeout(resolve, 100));

    removeCard(card);
    if (
      card.abilities &&
      card.abilities.dieAbilities &&
      card.abilities.dieAbilities.length !== 0
    ) {
      card.abilities.dieAbilities.forEach(async (ability) => {
        await abilityCard(card, ability);
      });
    }
  };

  const invokeCard = async (card, hasAttacked) => {
    card = { ...card, hasAttacked: hasAttacked ? hasAttacked : true };

    currentPlayer.currentMana -= card.cost;
    currentPlayer.hand = currentPlayer.hand.filter(
      (cardHand) => cardHand.id !== card.id
    );

    writeBoardAction(`Invoque la carte ${card.name}`, currentPlayer.id);

    if (
      card.abilities &&
      card.abilities.invokeAbilities &&
      card.abilities.invokeAbilities.length !== 0
    ) {
      card.abilities.invokeAbilities.forEach(async (ability) => {
        await abilityCard(card, ability);
      });
    }

    if (card.type !== "Spell") {
      setCardsInPlay((cardsInPlay) => [...cardsInPlay, card]);
    } else {
      setCardsInPlay((cardsInPlay) => [...cardsInPlay]);
    }
  };

  useEffect(() => {
    setCardsInPlay(cardsInPlay);
  }, [cardsInPlay]);

  const abilityCard = async (card, ability) => {
    let cardsSelected = [];
    let cardsTyped;
    let cardNamed;
    const enemy = card.owner === "player" ? "computer" : "player";
    const enemyBoard = cardsInPlay.filter((card) => card.owner === enemy);

    switch (ability.id) {
      case "drawCard":
        for (let i = 0; i < ability.time; i++) {
          drawCard(currentPlayer);
        }
        break;
      case "resetBoard":
        explodeBoard(card);
        break;
      case "discardHand":
        currentPlayer.hand = [];
        break;
      case "burnRandom":
        for (let i = 0; i < ability.time; i++) {
          let c = enemyBoard[Math.floor(Math.random() * enemyBoard.length)];
          console.log(c);
          if (
            c.abilities.startTurnAbilities &&
            c.abilities.startTurnAbilities.length > 0
          ) {
            c.abilities.startTurnAbilities = [
              ...c.abilities.startTurnAbilities,
              {
                id: "burned",
                turn: ability.turn,
                damaged: ability.dmg,
              },
            ];
          } else if (c.abilities) {
            c.abilities.startTurnAbilities = [
              {
                id: "burned",
                turn: ability.turn,
                damaged: ability.dmg,
              },
            ];
          } else {
            c.abilities = {
              startTurnAbilities: [
                {
                  id: "burned",
                  turn: ability.turn,
                  damaged: ability.dmg,
                },
              ],
            };
          }
          document.getElementById(c.id).style.background =
            "rgba(255, 171, 4, 0.57)";
          writeBoardAction(
            `La carte ${c.name} brûle pendant ${ability.turn} tour(s)`,
            c.owner
          );
        }
        break;
      case "burned":
        if (ability.turn > 0) {
          card.hp -= ability.damaged;
          let c = document.getElementById(card.id);
          c.style.transition = "ease-in-out all 0.25s";
          c.style.background = "rgba(191, 0, 0, 0.57)";
          await new Promise((resolve) => setTimeout(resolve, 100));
          c.style.background = "initial";
          ability.turn--;
          if (ability.turn === 0) {
            document.getElementById(c.id).style.background = "initial";
          }
          writeBoardAction(
            `La carte ${card.name} brûle et perd ${ability.dmg} hp`,
            card.owner
          );

          if (card.hp <= 0) {
            writeBoardAction(
              `La carte ${card.name} a été détruite par le pouvoir de ${card.name}`,
              card.owner
            );
            removeCard(c);
          }
        }
        break;
      case "damageInEnemyBoard":
        for (let i = 0; i < ability.time; i++) {
          let c = enemyBoard[Math.floor(Math.random() * enemyBoard.length)];
          c.hp -= ability.dmg;
          if (c.hp <= 0) {
            writeBoardAction(
              `La carte ${c.name} a été détruite par le pouvoir de ${card.name}`,
              card.owner
            );
            removeCard(c);
          }
        }
        break;
      case "giveToCardWhenTypeInBoard":
        const whenTypeSearch = cardsInPlay.filter(
          (card) => card.type === ability.when
        );
        whenTypeSearch.forEach((element) => {
          card.hp += ability.hp;
          card.attack += ability.attack;
        });
        break;
      case "summonSameCostCard":
        const costCards = getCardByCost(card.cost);
        for (let i = 0; i < ability.time; i++) {
          cardsSelected.push(
            costCards[Math.floor(Math.random() * costCards.length)]
          );
        }
        cardsSelected.forEach(async (c) => {
          await invokeCard({ ...c, owner: card.owner, id: uuidv4() });
        });
        break;
      case "summonWithName":
        cardNamed = getCardWithName(ability.name);
        cardNamed = { ...cardNamed[0], owner: card.owner, id: uuidv4() };
        await invokeCard(cardNamed);
        break;
      case "summonTypedCard":
        const typeCard = getCardByType(ability.type);
        for (let i = 0; i < ability.time; i++) {
          cardsSelected.push(
            typeCard[Math.floor(Math.random() * typeCard.length)]
          );
        }
        cardsSelected.forEach(async (c) => {
          await invokeCard({ ...c, owner: card.owner, id: uuidv4() });
        });
        break;
      case "stealCardDeck":
        let opponent = currentPlayer.id === "player" ? computer : player;
        for (let i = 0; i < ability.time; i++) {
          let c =
            opponent.deck[Math.floor(Math.random() * opponent.deck.length)];
          opponent.deck = opponent.deck.filter(
            (cardFiltered) => cardFiltered.id !== c.id
          );
          addCardInHand(c);
        }
        break;
      case "summonInvoke":
        if (ability.end) {
          ability.invokeMinion.forEach(async (c) => {
            await invokeCard({ ...c, owner: card.owner, id: uuidv4() }, false);
          });
        } else {
          ability.invokeMinion.forEach(async (c) => {
            await invokeCard({ ...c, owner: card.owner, id: uuidv4() });
          });
        }
        break;
      case "charge":
        card.hasAttacked = false;
        break;
      case "openEggs":
        card.name = "Dragonfly";
        card.attack = 2;
        card.hp = 3;
        card.cost = 2;
        card.description = "Opened Egg";
        card.abilities = [];
        break;
      case "deathCard":
        await removeCard(card);
        break;
      case "giveTypedCardInHand":
        cardsTyped = getCardByType(ability.type);
        for (let i = 0; i < ability.time; i++) {
          let cardSelected =
            cardsTyped[Math.floor(Math.random() * cardsTyped.length)];
          addCardInHand(cardSelected);
        }
        break;
      case "giveCardHand":
        let cardToGive;
        if (ability.name === undefined) {
          cardToGive = ability.cardToGive;
          cardToGive.forEach((c) => {
            addCardInHand(c);
          });
        } else {
          cardToGive = getCardWithName(ability.name);
          addCardInHand(cardToGive[0]);
        }

        break;
      case "giveAttackCardInHand":
        for (let i = 0; i < ability.time; i++) {
          let cardSelected =
            currentPlayer.hand[
              Math.floor(Math.random() * currentPlayer.hand.length)
            ];
          cardSelected.attack += ability.attack;
        }
        break;
      case "healCurrentPlayer":
        currentPlayer.hp += ability.heal;
        if (currentPlayer.hp >= 30) {
          currentPlayer.maxHp = currentPlayer.hp;
        }
        break;

      default:
        break;
    }
    writeBoardAction(`${ability.description}`, currentPlayer.id);
  };

  const addCardInHand = async (card) => {
    currentPlayer.hand = [
      ...currentPlayer.hand,
      {
        ...card,
        owner: currentPlayer.id,
        hasAttacked: false,
        id: uuidv4(),
      },
    ];
  };

  const removeCard = async (card) => {
    setCardsInPlay((cardsInPlay) =>
      cardsInPlay.filter((c) => c.id !== card.id)
    );
  };

  const explodeBoard = async (card) => {
    setCardsInPlay((cardsInPlay) =>
      cardsInPlay.filter((c) => c.id === card.id)
    );
  };

  const startTurnAbility = (currentPlayer) => {
    if (cardsInPlay.length !== 0) {
      const currentPlayerCardsInPlay = cardsInPlay.filter(
        (card) => card.owner === currentPlayer.id
      );

      if (currentPlayerCardsInPlay.length !== 0) {
        currentPlayerCardsInPlay.map(async (card) => {
          if (
            card.abilities &&
            card.abilities.startTurnAbilities &&
            card.abilities.startTurnAbilities.length !== 0
          ) {
            card.abilities.startTurnAbilities.forEach(async (ability) => {
              await abilityCard(card, ability);
            });
          }
        });
      }
    }
  };

  const EndTurnAbility = async (callback) => {
    if (cardsInPlay.length !== 0) {
      const currentPlayerCardsInPlay = cardsInPlay.filter(
        (card) => card.owner === currentPlayer.id
      );

      if (currentPlayerCardsInPlay.length !== 0) {
        currentPlayerCardsInPlay.map(async (card) => {
          card.hasAttacked = false;
          if (
            card.abilities &&
            card.abilities.endTurnAbilities &&
            card.abilities.endTurnAbilities.length !== 0
          ) {
            card.abilities.endTurnAbilities.forEach(async (ability) => {
              await abilityCard(card, ability);
            });
          }
        });
      }
    }
    callback();
  };

  // const invokeMinion = async (
  //   updatedCardsInPlay,
  //   minions,
  //   hasAttacked,
  //   playerToOwner
  // ) => {
  //   const cardsInPlayUpdated = [...updatedCardsInPlay];
  //   minions.forEach((minion) => {
  //     let card = {
  //       ...minion,
  //       owner: playerToOwner ? playerToOwner : currentPlayer.id,
  //       hasAttacked: hasAttacked,
  //       id: uuidv4(),
  //     };
  //     cardsInPlayUpdated.push(card);

  //     if (
  //       card.abilities &&
  //       card.abilities.invokeAbilities &&
  //       card.abilities.invokeAbilities.length !== 0
  //     ) {
  //       card.abilities.invokeAbilities.forEach(async (ability) => {
  //         await abilityCard(card, ability);
  //       });
  //     }
  //   });

  //   return cardsInPlayUpdated;
  // };

  const handleEndTurnClick = () => {
    resetTurn();
  };

  const resetTurn = async () => {
    await EndTurnAbility(() => {
      setSelectedCard(null);
      endTurn();
      drawCard(currentPlayer.id === "player" ? computer : player);
      startTurnAbility(currentPlayer.id === "player" ? computer : player);
    });
  };

  const onPlayerClick = (e, idPlayer) => {
    if (selectedCard) {
      if (!cardsInPlay.some((card) => card.owner !== currentPlayer.id)) {
        attackPlayer(selectedCard, idPlayer, e);
        writeBoardAction(
          `${currentPlayer.name} attaque l'adversaire`,
          currentPlayer.id
        );
      } else {
        writeBoardAction(
          `Le joueur adversaire possède encore des cartes sur le board ${currentPlayer.name}`,
          currentPlayer.id
        );
      }
    }
  };

  const attackPlayer = async (attackCard, defenderId, e) => {
    let defenderCardComponent = document.getElementById(defenderId);
    let attackCardComponent = document.getElementById(attackCard.id);
    attackCardComponent.style.transition = "ease-in-out all 0.25s";

    let defenderCardPosition = defenderCardComponent.getBoundingClientRect();

    // Applique une transition à la carte "attackerCard" pour qu'elle se déplace jusqu'à la carte "defenderCard"
    attackCardComponent.style.transition = "ease-in-out all 0.25s";

    if (attackCard.owner === "computer") {
      attackCardComponent.style.transform = `translate3d(${
        defenderCardPosition.left
      }px, ${defenderCardPosition.top / 2}px, 0)`;
    } else {
      attackCardComponent.style.transform = `translate3d(${0}px, ${
        -defenderCardPosition.top + window.scrollY
      }rem, 0)`;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    attackCardComponent.style.transform = `translate3d(0, 0, 0)`;

    const defender = defenderId === "player" ? player : computer;
    defender.hp -= attackCard.attack;

    attackCard.hasAttacked = true;
    if (defender.hp <= 0) {
      //TODO DEATH PLAYER
      setPlayerDeath(true);
    }

    setSelectedCard(null);
  };

  const drawCard = (player) => {
    if (player.deck.length > 0) {
      const drawnCard =
        player.deck[Math.floor(Math.random() * player.deck.length)];
      // Enlevez la carte du paquet
      player.deck = player.deck.filter((card) => card !== drawnCard);
      player.hand = [...player.hand, drawnCard];
      writeBoardAction(`Je pioche une carte`, player.id);
    } else {
      player.hp -= 1;
    }
  };

  //COMPUTER SYSTEM

  const handleComputerTurn = async () => {
    writeBoardAction(`Lancement du système ordinateur`, currentPlayer.id);
    // Analyser l'état de la partie

    let computerHasAction = true;

    while (computerHasAction && !playerDeath) {
      const computerCardsInPlay = cardsInPlay.filter(
        (card) => card.owner === "computer"
      );
      const playerCardsInPlay = cardsInPlay.filter(
        (card) => card.owner === "player"
      );

      const attackableCards = computerCardsInPlay.filter(
        (card) => !card.hasAttacked
      );

      const provocationCards = playerCardsInPlay.filter(
        (card) => card.provocation === true
      );

      const playerHasCardsInPlay = playerCardsInPlay.length > 0;

      if (computer.currentMana === 0 || attackableCards.length === 0) {
        computerHasAction = false;
      } else {
        computerHasAction = true;
      }
      // Décider de l'action à jouer en fonction de l'analyse de la partie
      if (
        computer.currentMana >= computer.maxMana &&
        computerCardsInPlay.length < 6
      ) {
        // Si le joueur a assez de mana et moins de 6 cartes sur le board, jouer une carte
        const availableCards = computer.hand.filter(
          (card) => card.cost <= computer.currentMana
        );

        const cardToPlay =
          availableCards[Math.floor(Math.random() * availableCards.length)];

        if (availableCards.length > 0) {
          invokeCard(cardToPlay);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      if (playerHasCardsInPlay && attackableCards.length > 0) {
        // Si le joueur a des cartes sur le board, attaquer une de ses cartes avec une carte de l'ordinateur
        const attackingCard =
          attackableCards[Math.floor(Math.random() * attackableCards.length)];
        let defendingCard = {};
        if (provocationCards.length > 0) {
          defendingCard =
            provocationCards[
              Math.floor(Math.random() * provocationCards.length)
            ];
        } else {
          defendingCard =
            playerCardsInPlay[
              Math.floor(Math.random() * playerCardsInPlay.length)
            ];
        }

        writeBoardAction(
          `J'attaque la carte (${defendingCard.name}) d'en face avec (${attackingCard.name})`,
          currentPlayer.id
        );
        attackCardPlayer(attackingCard, defendingCard);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } else if (attackableCards.length > 0) {
        // Si le joueur n'a pas de cartes sur le board, attaquer le joueur directement
        const attackingCard =
          attackableCards[Math.floor(Math.random() * attackableCards.length)];

        writeBoardAction(
          `J'attaque le joueur d'en face avec la carte (${attackingCard.name})`,
          currentPlayer.id
        );
        attackPlayer(attackingCard, "player");
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    resetTurn();
  };

  const handleClickGiveButton = () => {
    const card = getCardWithName("Alexstrasza");
    let oneCard = card[0];
    console.log(oneCard);
    currentPlayer.hand = [
      ...currentPlayer.hand,
      {
        ...oneCard,
        owner: "player",
        hasAttacked: false,
        id: uuidv4(),
      },
    ];
  };

  return (
    <CardManagerContext.Provider
      value={{
        handleCardClick,
        onPlayerClick,
        handleEndTurnClick,
        selectedCard,
        cardsInPlay,
        setCardsInPlay,
        isAttacking,
        playerDeath,
        handleClickGiveButton,
      }}
    >
      {children}
    </CardManagerContext.Provider>
  );
};
