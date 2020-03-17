import snakeCase from "lodash/snakeCase";
import { put, takeEvery, select } from "redux-saga/effects";
import {
  connectionsSelector,
  currentPlayerIdSelector,
  currentPlayerSelector,
  gameIsOverSelector,
  gameSupplyCardCountSelector,
  gameNextPlayerSelector,
  gamePlayerIdsSelector,
  gamePlayerRequestSelector,
  gamePlayerSelector,
  gamePlayersSelector
} from "../selectors";
import {
  buyCard,
  completeChoiceGainCards,
  completeSelectCardsInHand,
  discardCards,
  endTurn,
  gainCards,
  sendMessage,
  startGame,
  updateScore
} from "../actions";
import cardPrices from "../utils/cardPrices";
import gameRandomizer from "../utils/randomizer";

export function* asyncStartGame() {
  const connections = yield select(connectionsSelector);
  yield put(startGame(gameRandomizer({ connections })));
}

export function* asyncBuyCard({ id, name: cardName }) {
  let currentPlayer = yield select(currentPlayerSelector);
  const cardCount = yield select(gameSupplyCardCountSelector, cardName);
  const playerRequest = yield select(gamePlayerRequestSelector);
  if (
    currentPlayer.id !== id ||
    currentPlayer.buys <= 0 ||
    cardCount <= 0 ||
    currentPlayer.gold < cardPrices[cardName] ||
    playerRequest
  ) {
    return;
  }

  const player = yield select(gamePlayerSelector);
  const playerIds = yield select(gamePlayerIdsSelector);
  yield put(
    buyCard({
      cardName,
      id,
      location: "DISCARD",
      logIds: playerIds,
      username: player.username
    })
  );

  currentPlayer = yield select(currentPlayerSelector);
  if (currentPlayer.buys === 0) {
    yield asyncEndTurn({ id });
  }
}

export function* asyncEndTurn({ id }) {
  const currentPlayerId = yield select(currentPlayerIdSelector);
  if (currentPlayerId !== id) {
    return;
  }

  if (yield select(gameIsOverSelector)) {
    yield put(updateScore({ players: yield select(gamePlayersSelector) }));
    return;
  }

  const nextPlayer = yield select(gameNextPlayerSelector);
  const playerIds = yield select(gamePlayerIdsSelector);
  yield put(
    endTurn({
      id,
      logIds: playerIds,
      nextId: nextPlayer.id,
      nextUsername: nextPlayer.username
    })
  );
}

export function* asyncPlayCard({ id, name: cardName }) {
  const currentPlayer = yield select(currentPlayerSelector);
  const player = yield select(gamePlayerSelector);
  const playerRequest = yield select(gamePlayerRequestSelector);
  const playerIds = yield select(gamePlayerIdsSelector);
  if (player.id !== id || playerRequest) {
    return;
  }

  if (["Estate", "Duchy", "Province", "Gardens", "Curse"].includes(cardName)) {
    return;
  }

  yield put({ type: `ASYNC_PLAY_${snakeCase(cardName).toUpperCase()}` });
  // if (
  //   ["Copper", "Silver", "Gold"].some(c => player.cards.inplay.includes(c)) ||
  //   currentPlayer.actions <= 0
  // ) {
  //   return;
  // }
}

export function* asyncPlayAllTreasures({ id }) {
  const currentPlayerId = yield select(currentPlayerIdSelector);
  const playerRequest = yield select(gamePlayerRequestSelector);
  const player = yield select(gamePlayerSelector);
  if (currentPlayerId !== id || playerRequest) {
    return;
  }

  const goldCount = player.cards.hand.filter(card => card === "Gold").length;
  const silverCount = player.cards.hand.filter(card => card === "Silver")
    .length;
  const copperCount = player.cards.hand.filter(card => card === "Copper")
    .length;
  for (let i = 0; i < goldCount; i++) {
    yield put({ type: "ASYNC_PLAY_GOLD" });
  }
  for (let i = 0; i < silverCount; i++) {
    yield put({ type: "ASYNC_PLAY_SILVER" });
  }
  for (let i = 0; i < copperCount; i++) {
    yield put({ type: "ASYNC_PLAY_COPPER" });
  }
}

export function* asyncGainCards({ cardName, gainAmount, id, location }) {
  const cardCount = yield select(gameSupplyCardCountSelector, cardName);
  yield put(
    gainCards({
      cardName,
      gainAmount: Math.min(gainAmount, cardCount),
      id,
      location
    })
  );
}

export function* asyncCompleteChoiceGainCards({ id, name: cardName }) {
  const cardCount = yield select(gameSupplyCardCountSelector, cardName);
  const playerRequest = yield select(gamePlayerRequestSelector);
  const player = yield select(gamePlayerSelector);
  const playerIds = yield select(gamePlayerIdsSelector);
  if (
    cardCount <= 0 ||
    playerRequest == null ||
    playerRequest.id !== id ||
    playerRequest.type !== "CHOICE_GAIN_CARDS" ||
    playerRequest.gainAmount <= 0 ||
    playerRequest.maxCost < cardPrices[cardName] ||
    (playerRequest.cardType === "TREASURE" &&
      !["Copper", "Silver", "Gold"].includes(cardName))
  ) {
    return;
  }

  yield put(
    completeChoiceGainCards({
      cardName,
      id,
      location: playerRequest.location,
      logIds: playerIds,
      username: player.username
    })
  );

  if (playerRequest.onChoice) {
    const { type, data } = playerRequest.onChoice;
    yield put({ type, id, ...data });
  }
}

export function* asyncSendMessage({ entry }) {
  const playerIds = yield select(gamePlayerIdsSelector);
  yield put(sendMessage({ entry, logIds: playerIds }));
}

export function* asyncCompleteSelectCardsInHand({ id, cardIndexes }) {
  const player = yield select(gamePlayerSelector);
  const playerIds = yield select(gamePlayerIdsSelector);
  const playerRequest = yield select(gamePlayerRequestSelector);
  const cards = player.cards.hand.filter((cardName, index) =>
    cardIndexes.includes(index)
  );
  if (
    playerRequest == null ||
    playerRequest.id !== id ||
    playerRequest.type !== "SELECT_CARDS_IN_HAND" ||
    cardIndexes.length < playerRequest.minSelectAmount ||
    (playerRequest.maxSelectAmount != null &&
      cardIndexes.length > playerRequest.maxSelectAmount) ||
    (playerRequest.cardType === "TREASURE" &&
      !["Copper", "Silver", "Gold"].includes(cards[0]))
  ) {
    return;
  }

  yield put(completeSelectCardsInHand());
  if (playerRequest.onSelect) {
    for (let onSelectAction of playerRequest.onSelect) {
      let { type, data } = onSelectAction;
      yield put({
        type,
        cardIndexes,
        cards,
        id,
        logIds: playerIds,
        maxCost: cardPrices[cards[0]] + playerRequest.choiceGainAdditionalCost,
        username: player.username,
        ...data
      });
    }
  }
}

export function* asyncDiscardSelectedCards({ cardIndexes, id, onDiscard }) {
  const player = yield select(gamePlayerSelector);
  const playerIds = yield select(gamePlayerIdsSelector);
  const cards = player.cards.hand.filter((cardName, index) =>
    cardIndexes.includes(index)
  );

  yield put(
    discardCards({
      cards,
      cardIndexes,
      id,
      logIds: playerIds,
      username: player.username
    })
  );

  if (onDiscard) {
    const { type, data } = onDiscard;
    yield put({ type, drawAmount: cardIndexes.length, id, ...data });
  }
}

const gameSagas = [
  takeEvery("ASYNC_START_GAME", asyncStartGame),
  takeEvery("ASYNC_BUY_CARD", asyncBuyCard),
  takeEvery("ASYNC_GAIN_CARDS", asyncGainCards),
  takeEvery("ASYNC_END_TURN", asyncEndTurn),
  takeEvery("ASYNC_PLAY_CARD", asyncPlayCard),
  takeEvery("ASYNC_PLAY_ALL_TREASURES", asyncPlayAllTreasures),
  takeEvery("ASYNC_COMPLETE_CHOICE_GAIN_CARDS", asyncCompleteChoiceGainCards),
  takeEvery("ASYNC_SEND_MESSAGE", asyncSendMessage),
  takeEvery(
    "ASYNC_COMPLETE_SELECT_CARDS_IN_HAND",
    asyncCompleteSelectCardsInHand
  ),
  takeEvery("ASYNC_DISCARD_SELECTED_CARDS", asyncDiscardSelectedCards)
];

export default gameSagas;
