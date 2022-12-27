import React, { createContext, useContext, useEffect, useState } from "react";
import { PlayerManagerContext } from "./playerManagerContext";
import { writeBoardAction } from "services/helpers";

export const CardManagerContext = createContext(false);

export const CardManagerProvider = ({ children }) => {
  const { computer, player, currentPlayer, endTurn } =
    useContext(PlayerManagerContext);

  const [selectedCard, setSelectedCard] = useState([]);
  const [cardsInPlay, setCardsInPlay] = useState([]);
  const [isAttacking, setIsAttacking] = useState(false);

  const handleCardClick = (card) => {
    if (card.hasAttacked) {
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

    const updatedCardsInPlay = [...cardsInPlay, { ...card }];
    setCardsInPlay(updatedCardsInPlay);

    writeBoardAction(
      `${currentPlayer.id} joue la carte ${card.name}`,
      currentPlayer.id
    );
  };

  const handleEndTurnClick = () => {
    if (currentPlayer.maxMana < 10) {
      currentPlayer.maxMana += 1;
    }
    currentPlayer.currentMana = currentPlayer.maxMana;

    writeBoardAction(
      `${currentPlayer.id} met fin à son tour`,
      currentPlayer.id
    );

    resetTurn();
    endTurn();
  };

  const resetTurn = () => {
    const updatedCardsInPlay = cardsInPlay.map((card) => ({
      ...card,
      hasAttacked: false,
    }));
    setCardsInPlay(updatedCardsInPlay);
    setSelectedCard(null);
  };
  const onPlayerClick = (e, idPlayer) => {
    if (selectedCard) {
      if (!cardsInPlay.some((card) => card.owner !== currentPlayer.id)) {
        attackPlayer(selectedCard, idPlayer, e);
        writeBoardAction(
          `${currentPlayer.id} attaque l'adversaire`,
          currentPlayer.id
        );
      } else {
        writeBoardAction(
          `Le joueur adversaire possède encore des cartes sur le board ${currentPlayer.id}`,
          currentPlayer.id
        );
      }
    }
  };

  const attackPlayer = (attackCard, defenderId, e) => {
    setIsAttacking({ boolean: true, cursor: { x: e.clientX, y: e.clientY } });
    const defender = defenderId === "player" ? player : computer;
    defender.hp -= attackCard.attack;

    attackCard.hasAttacked = true;
    if (defender.hp <= 0) {
      //TODO DEATH PLAYER
      console.log("adversaire mort");
    }

    setTimeout(() => {
      setSelectedCard(null);
    }, 1000);
  };

  useEffect(() => {
    if (isAttacking) {
      const timeout = setTimeout(() => {
        setIsAttacking({ boolean: false, cursor: { x: 0, y: 0 } });
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isAttacking]);
  return (
    <CardManagerContext.Provider
      value={{
        handleCardClick,
        onPlayerClick,
        handleEndTurnClick,
        selectedCard,
        cardsInPlay,
        isAttacking,
      }}
    >
      {children}
    </CardManagerContext.Provider>
  );
};
