import { put, takeEvery, select } from "redux-saga/effects";
import { playTreasure } from "../../../actions";
import { gamePlayerIdsSelector, gamePlayerSelector } from "../../../selectors";

export function* asyncPlayGold() {
  const player = yield select(gamePlayerSelector);
  const playerIds = yield select(gamePlayerIdsSelector);

  yield put(
    playTreasure({
      cardName: "Gold",
      id: player.id,
      logIds: playerIds,
      username: player.username
    })
  );
}

const goldSagas = [takeEvery("ASYNC_PLAY_GOLD", asyncPlayGold)];

export default goldSagas;
