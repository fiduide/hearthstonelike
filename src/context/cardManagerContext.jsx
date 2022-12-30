import React, { createContext, useContext, useEffect, useState } from "react";
import { PlayerManagerContext } from "./playerManagerContext";
import { writeBoardAction } from "services/helpers";
import { v4 as uuidv4 } from "uuid";
import { getCardWithName } from "services/cards";

export const CardManagerContext = createContext(false);

export const CardManagerProvider = ({ children }) => {
  const {
    computer,
    player,
    currentPlayer,
    setCurrentPlayer,
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

    if (card.abilities && card.abilities.length !== 0) {
      card.abilities.forEach(async (ability) => {
        await abilityCard(card, ability);
      });
    }

    let updatedCardsInPlay = [...cardsInPlay, card];
    setCardsInPlay(updatedCardsInPlay);
  };

  const abilityCard = async (card, ability) => {
    switch (ability.id) {
      case "resetBoard":
        const newTab = [];
        setCardsInPlay([...newTab, card]);
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
      case "summonInvoke":
        let updatedBoard = await invokeMinion(
          cardsInPlay,
          ability.invokeMinion,
          true
        );
        setCardsInPlay([card, ...updatedBoard]);
        break;
      case "charge":
        card.hasAttacked = false;
        break;
      case "giveAttackCardInHand":
        for (let i = 0; i < ability.length; i++) {
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

  // const StartTurnAbility = () => {
  //   const currentPlayerCardsInPlay = cardsInPlay.filter(
  //     (card) => card.owner === currentPlayer.id
  //   );
  // };

  const EndTurnAbility = async (callback) => {
    if (cardsInPlay.length !== 0) {
      const currentPlayerCardsInPlay = cardsInPlay.filter(
        (card) => card.owner === currentPlayer.id
      );

      if (currentPlayerCardsInPlay.length !== 0) {
        currentPlayerCardsInPlay.map(async (card) => {
          card.hasAttacked = false;
          if (card.abilities.length !== 0) {
            card.abilities.map(async (ability) => {
              if (ability.invokeEndMinion) {
                const updatedCardsInPlay = await invokeMinion(
                  cardsInPlay,
                  ability.invokeEndMinion,
                  false
                );
                setCardsInPlay(updatedCardsInPlay);
              }
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

      if (card.abilities) {
        card.abilities.forEach((ability) => {
          if (ability.invokedAbility) {
            ability.invokedAbility(currentPlayer, card);
          }
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
        await new Promise((resolve) => setTimeout(resolve, 1000));
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

        await new Promise((resolve) => setTimeout(resolve, 1000));
        writeBoardAction(
          `J'attaque la carte (${defendingCard.name}) d'en face avec (${attackingCard.name})`,
          currentPlayer.id
        );
        attackCardPlayer(attackingCard, defendingCard);
      } else if (attackableCards.length > 0) {
        // Si le joueur n'a pas de cartes sur le board, attaquer le joueur directement
        const attackingCard =
          attackableCards[Math.floor(Math.random() * attackableCards.length)];

        await new Promise((resolve) => setTimeout(resolve, 1000));
        writeBoardAction(
          `J'attaque le joueur d'en face avec la carte (${attackingCard.name})`,
          currentPlayer.id
        );
        attackPlayer(attackingCard, "player");
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
    EndTurnAbility(() => {
      endTurn();
      drawCard(player);
    });
  };

  useEffect(() => {
    if (currentPlayer.id === "computer") {
      handleComputerTurn();
    }
  }, [currentPlayer]);

  const handleClickGiveButton = () => {
    const card = getCardWithName("Leeroy");
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
        isAttacking,
        playerDeath,
        handleClickGiveButton,
      }}
    >
      {children}
    </CardManagerContext.Provider>
  );
};
