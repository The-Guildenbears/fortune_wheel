import { WHEEL_CONFIG } from "./WheelConfig";

const CreateWheel = (round) => {
  const { SPACES, CASH_VALUES, HEXS } = WHEEL_CONFIG;

  const wheelAr = [];
  for (let i = 0; i < SPACES; i++) {
    let randIdx = Math.floor(Math.random() * CASH_VALUES.length);
    wheelAr.push({
      val: CASH_VALUES[randIdx],
      col: HEXS[i % HEXS.length],
    });
  }//for

  const special = getSpecFields(round);
  const taken = getRandomIndexes(special.length, SPACES);
  for (let i = 0; i < taken.length; i++) {
    let ind = taken[i];
    wheelAr[ind] = special[i];
  }//for

  return wheelAr;
}//function

function getSpecFields(round) {
  const { BR, BR_HEX, BR_VAL, LT, LT_HEX, LT_VAL, TOP_CASH, TOP_HEX } = WHEEL_CONFIG;
  let arr = [];

  // add bankrupt fields
  for (let i = 0; i < BR; i++) {
    arr.push({
      val: BR_VAL,
      col: BR_HEX,
    });
  }//for

  // add lose turn fields
  for (let i = 0; i < LT; i++) {
    arr.push({
      val: LT_VAL,
      col: LT_HEX,
    });
  }//for

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
  }//switch

  arr.push({
    val: top_cash,
    col: TOP_HEX,
  });

  return arr;
}

const getRandomIndexes = (count, maxIndex) => {
  const results = [];

  while (results.length < count) {
    const rand = Math.floor(Math.random() * maxIndex);

    // check if indexes are at least 2 spots apart
    const tooClose = results.some((idx) => Math.abs(idx - rand) < 2);

    if (!tooClose) {
      results.push(rand);
    }//if
  }//while

  while (results.length < count) {
    const rand = Math.floor(Math.random() * maxIndex);
    if (!results.includes(rand)) {
      results.push(rand);
    }//if
  }//while

  return results;
}//func

export default CreateWheel;