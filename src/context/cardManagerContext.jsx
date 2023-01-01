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

  const attackCardPlayer = (attackerCard, defenderCard) => {
    setIsAttacking(true);

    const updatedCardsInPlay = cardsInPlay.map((card) => {
      if (card.id === attackerCard.id) {
        card.hp -= defenderCard.attack;
        card.hasAttacked = true;
      } else if (card.id === defenderCard.id) {
        card.hp -= attackerCard.attack;
      }

      if (card.hp <= 0) {
        writeBoardAction(`La carte ${card.name} est détruite`, card.owner);
        return null;
      }

      return card;
    });

    setIsAttacking(false);
    setCardsInPlay(updatedCardsInPlay.filter((card) => card));
  };

  const invokeCard = async (card) => {
    card = { ...card, hasAttacked: true };

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
    let updatedBoard;
    let cardsTyped;

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
        updatedBoard = await invokeMinion(cardsInPlay, cardsSelected, true);
        setCardsInPlay([...updatedBoard, card]);
        break;
      case "summonTypedCard":
        const typeCard = getCardByType(ability.type);
        for (let i = 0; i < ability.time; i++) {
          cardsSelected.push(
            typeCard[Math.floor(Math.random() * typeCard.length)]
          );
        }
        updatedBoard = await invokeMinion(cardsInPlay, cardsSelected, true);
        setCardsInPlay([...updatedBoard, card]);
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
          updatedBoard = await invokeMinion(
            cardsInPlay,
            ability.invokeMinion,
            false
          );
          setCardsInPlay([...updatedBoard]);
        } else {
          updatedBoard = await invokeMinion(
            cardsInPlay,
            ability.invokeMinion,
            true
          );
          setCardsInPlay([...updatedBoard, card]);
        }
        break;
      case "charge":
        card.hasAttacked = false;
        break;
      case "openEggs":
        card.name = "Dagonfly";
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
        let cardToGive = ability.cardToGive;
        cardToGive.forEach((c) => {
          addCardInHand(c);
        });

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
        if (currentPlayer.hp > 30) {
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

  const invokeMinion = async (updatedCardsInPlay, minions, hasAttacked) => {
    const cardsInPlayUpdated = [...updatedCardsInPlay];
    minions.forEach((minion) => {
      let card = {
        ...minion,
        owner: currentPlayer.id,
        hasAttacked: hasAttacked,
        id: uuidv4(),
      };
      cardsInPlayUpdated.push(card);

      if (
        card.abilities &&
        card.abilities.invokeAbilities &&
        card.abilities.invokeAbilities.length !== 0
      ) {
        card.abilities.invokeAbilities.forEach(async (ability) => {
          await abilityCard(card, ability);
        });
      }
    });

    return cardsInPlayUpdated;
  };

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

  const attackPlayer = (attackCard, defenderId, e) => {
    // setIsAttacking({ boolean: true, cursor: { x: e.clientX, y: e.clientY } });
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
        writeBoardAction(
          `J'invoque la carte (${cardToPlay.name})`,
          currentPlayer.id
        );
        invokeCard(cardToPlay);
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      if (playerHasCardsInPlay && attackableCards.length > 0) {
        // Si le joueur a des cartes sur le board, attaquer une de ses cartes avec une carte de l'ordinateur

        const attackingCard =
          attackableCards[Math.floor(Math.random() * attackableCards.length)];
        const defendingCard =
          playerCardsInPlay[
            Math.floor(Math.random() * playerCardsInPlay.length)
          ];

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
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    resetTurn();
  };

  const handleClickGiveButton = () => {
    const card = getCardWithName("Lich Kings");
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
