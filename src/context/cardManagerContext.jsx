import React, { createContext, useContext, useEffect, useState } from "react";
import { PlayerManagerContext } from "./playerManagerContext";
import { writeBoardAction } from "services/helpers";

export const CardManagerContext = createContext(false);

export const CardManagerProvider = ({ children }) => {
  const {
    computer,
    player,
    currentPlayer,
    endTurn,
    playerDeath,
    setPlayerDeath,
  } = useContext(PlayerManagerContext);

  const [selectedCard, setSelectedCard] = useState([]);
  const [cardsInPlay, setCardsInPlay] = useState([]);
  const [isAttacking, setIsAttacking] = useState(false);

  const handleCardClick = (card) => {
    if (card.hasAttacked && card.owner === currentPlayer.id) {
      writeBoardAction(
        `La carte ${card.name} a déjà attaqué ce tour-ci`,
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
          console.log("Attaque en cours");
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

    const damage = attackerCard.attack;

    attackerCard.hp -= defenderCard.attack;
    defenderCard.hp -= damage;

    writeBoardAction(
      `${currentPlayer.id} attaque la carte de l'adversaire`,
      currentPlayer.id
    );

    attackerCard.hasAttacked = true;

    const updatedCardsInPlay = cardsInPlay.map((card) => {
      if (card.id === defenderCard.id && defenderCard.hp <= 0) {
        writeBoardAction(
          `La carte ${defenderCard.name} est détruite`,
          defenderCard.owner
        );
        return null;
      } else if (card.id === attackerCard.id && attackerCard.hp <= 0) {
        writeBoardAction(
          `La carte ${attackerCard.name} est détruite`,
          attackerCard.owner
        );
        return null;
      }
      return card;
    });
    setIsAttacking(false);
    setCardsInPlay(updatedCardsInPlay.filter((card) => card));
  };

  const invokeCard = (card) => {
    currentPlayer.currentMana -= card.cost;
    currentPlayer.hand = currentPlayer.hand.filter(
      (cardHand) => cardHand.id !== card.id
    );

    const updatedCardsInPlay = [...cardsInPlay, { ...card, hasAttacked: true }];
    setCardsInPlay(updatedCardsInPlay);

    writeBoardAction(
      `${currentPlayer.id} joue la carte ${card.name}`,
      currentPlayer.id
    );

    card.abilities.forEach((ability) => {
      if (ability.useAbility) {
        ability.useAbility(currentPlayer, card);
      }
      writeBoardAction(`${ability.description}`, currentPlayer.id);
    });
  };

  const handleEndTurnClick = () => {
    resetTurn();
  };

  const resetTurn = () => {
    const updatedCardsInPlay = cardsInPlay.map((card) => ({
      ...card,
      hasAttacked: false,
    }));
    setCardsInPlay(updatedCardsInPlay);
    setSelectedCard(null);
    endTurn();
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

  const handleComputerTurn = () => {
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

      console.table(attackableCards);

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
      } else if (attackableCards.length > 0) {
        // Si le joueur n'a pas de cartes sur le board, attaquer le joueur directement
        const attackingCard =
          attackableCards[Math.floor(Math.random() * attackableCards.length)];

        writeBoardAction(
          `J'attaque le joueur d'en face avec la carte (${attackingCard.name})`,
          currentPlayer.id
        );
        attackPlayer(attackingCard, "player");
      } else {
        writeBoardAction(`Je ne fais rien`, currentPlayer.id);
      }
    }

    endTurn();
  };

  useEffect(() => {
    if (currentPlayer.id === "computer") {
      handleComputerTurn();
    }
  }, [currentPlayer]);

  return (
    <CardManagerContext.Provider
      value={{
        handleCardClick,
        onPlayerClick,
        handleEndTurnClick,
        selectedCard,
        cardsInPlay,
        isAttacking,
        playerDeath,
      }}
    >
      {children}
    </CardManagerContext.Provider>
  );
};
