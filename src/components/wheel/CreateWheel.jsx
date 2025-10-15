// import { useState } from "react";
import { WHEEL_CONFIG } from "./WheelConfig";

export default function CreateWheel({ round }) {
  const spaces = WHEEL_CONFIG.SPACES;
  const regular_prizes = WHEEL_CONFIG.CASH_VALUES;
  const hexes = WHEEL_CONFIG.HEXS;

  // const [orderSpecial, setOrderSpecial] = useState();
  // const [orderLose, setOrderLose] = useState();
  // const [orderBankrupt1, setOrderBankrupt1] = useState();
  // const [orderBankrupt2, setOrderBankrupt2] = useState();

  const wheelAr = [];
  for (let i = 0; i < spaces; i++) {
    let randIdx = Math.floor(Math.random() * regular_prizes.length);
    wheelAr.push({
      val: regular_prizes[randIdx],
      col: hexes[i % hexes.length],
    });
  }
  return wheelAr;
}
