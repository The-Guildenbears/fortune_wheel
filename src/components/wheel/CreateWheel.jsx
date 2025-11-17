import { WHEEL_CONFIG } from "./WheelConfig";

export function CreateWheel(round) {
  const { SPACES, CASH_VALUES, HEXS } = WHEEL_CONFIG;

  const wheelAr = [];
  for (let i = 0; i < SPACES; i++) {
    let randIdx = Math.floor(Math.random() * CASH_VALUES.length);
    wheelAr.push({
      val: CASH_VALUES[randIdx],
      col: HEXS[i % HEXS.length],
    });
  }
  const special = _getSpecFields(round);
  const taken = _getRandomIndexes(special.length, SPACES);
  for (let i = 0; i < taken.length; i++) {
    let ind = taken[i];
    wheelAr[ind] = special[i];
  }
  return wheelAr;
}
export function MysteryWedge(array, round) {
  if (round > 1) {
    const { MY_VAL, MY_HEX } = WHEEL_CONFIG;
    const numericIndices = [];
    for (let i = 0; i < array.length; i++) {
      if (typeof array[i]?.val === "number") {
        numericIndices.push(i);
      }
    }
    const picked =
      numericIndices[Math.floor(Math.random() * numericIndices.length)];
    return array.map((item, idx) =>
      idx === picked ? { val: MY_VAL, col: MY_HEX } : { ...item }
    );
  } else {
    return array;
  }
}

function _getSpecFields(round) {
  const { BR, BR_HEX, BR_VAL, LT, LT_HEX, LT_VAL, TOP_CASH, TOP_HEX } =
    WHEEL_CONFIG;
  let ar = [];
  // add bankrupt fields
  for (let i = 0; i < BR; i++) {
    ar.push({
      val: BR_VAL,
      col: BR_HEX,
    });
  }
  // add lose turn fields
  for (let i = 0; i < LT; i++) {
    ar.push({
      val: LT_VAL,
      col: LT_HEX,
    });
  }
  // add top_cash fields
  let top_cash = 0;
  switch (round) {
    case 1:
      top_cash = TOP_CASH.R1;
      break;
    case 2:
      top_cash = TOP_CASH.R2;
      break;
    case 3:
      top_cash = TOP_CASH.R3;
      break;
    default:
      top_cash = TOP_CASH.R;
      break;
  }
  ar.push({
    val: top_cash,
    col: TOP_HEX,
  });
  return ar;
}

function _getRandomIndexes(count, maxIndex) {
  const results = [];

  while (results.length < count) {
    const rand = Math.floor(Math.random() * maxIndex);

    // check if indexes are at least 2 spots apart
    const tooClose = results.some((idx) => Math.abs(idx - rand) < 3);

    if (!tooClose) {
      results.push(rand);
    }
  }

  while (results.length < count) {
    const rand = Math.floor(Math.random() * maxIndex);
    if (!results.includes(rand)) {
      results.push(rand);
    }
  }

  return results;
}
