const cardActions = {
  Cellar: [{ type: "GAIN_ACTIONS", data: { actionAmount: 2 } }],
  Chapel: [],
  Moat: [{ type: "DRAW_CARDS", data: { drawAmount: 2 } }],
  Harbinger: [
    { type: "DRAW_CARDS", data: { drawAmount: 1 } },
    { type: "GAIN_ACTIONS", data: { actionAmount: 1 } }
  ],
  Merchant: [
    { type: "DRAW_CARDS", data: { drawAmount: 1 } },
    { type: "GAIN_ACTIONS", data: { actionAmount: 1 } }
  ],
  Vassal: [{ type: "GAIN_FLOATING_GOLD", data: { floatingGoldAmount: 2 } }],
  Village: [
    { type: "DRAW_CARDS", data: { drawAmount: 1 } },
    { type: "GAIN_ACTIONS", data: { actionAmount: 2 } }
  ],
  Workshop: [],
  Bureaucrat: [],
  Gardens: [],
  Militia: [{ type: "GAIN_FLOATING_GOLD", data: { floatingGoldAmount: 2 } }],
  Moneylender: [],
  Poacher: [
    { type: "DRAW_CARDS", data: { drawAmount: 1 } },
    { type: "GAIN_ACTIONS", data: { actionAmount: 1 } },
    { type: "GAIN_FLOATING_GOLD", data: { floatingGoldAmount: 1 } }
  ],
  Remodel: [],
  Smithy: [{ type: "DRAW_CARDS", data: { drawAmount: 3 } }],
  "Throne Room": [],
  Bandit: [],
  "Council Room": [
    { type: "DRAW_CARDS", data: { drawAmount: 4 } },
    { type: "GAIN_BUYS", data: { buyAmount: 1 } },
    { type: "ASYNC_OTHER_PLAYERS_DRAW_CARDS", data: { drawAmount: 1 } }
  ],
  Festival: [
    { type: "GAIN_ACTIONS", data: { actionAmount: 2 } },
    { type: "GAIN_BUYS", data: { buyAmount: 1 } },
    { type: "GAIN_FLOATING_GOLD", data: { floatingGoldAmount: 2 } }
  ],
  Laboratory: [
    { type: "DRAW_CARDS", data: { drawAmount: 2 } },
    { type: "GAIN_ACTIONS", data: { actionAmount: 1 } }
  ],
  Library: [],
  Market: [
    { type: "DRAW_CARDS", data: { drawAmount: 1 } },
    { type: "GAIN_ACTIONS", data: { actionAmount: 1 } },
    { type: "GAIN_BUYS", data: { buyAmount: 1 } },
    { type: "GAIN_FLOATING_GOLD", data: { floatingGoldAmount: 1 } }
  ],
  Mine: [],
  Sentry: [
    { type: "DRAW_CARDS", data: { drawAmount: 1 } },
    { type: "GAIN_ACTIONS", data: { actionAmount: 1 } }
  ],
  Witch: [
    { type: "DRAW_CARDS", data: { drawAmount: 2 } },
    {
      type: "ASYNC_OTHER_PLAYERS_GAIN_CARDS",
      data: { cardName: "Curse", gainAmount: 1 }
    }
  ],
  Artisan: []
};

export default cardActions;
