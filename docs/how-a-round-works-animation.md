# "How a round works" — animation intent (shelved)

The interactive `RoundDemo` (Predict → Play → Score) was reverted to **static** because the
choreography got too fiddly. This note records what each animation was meant to do, so it can be
rebuilt later if desired.

## Overall intent
An interactive explainer of one round: you **predict** an exact trick count, cards are **played**,
and you **score only on an exact call**. Teach the loop and the scoring rule by showing it happen.

## Per-animation purpose

1. **Sequential scroll-in (Predict → pause → Play → pause → Score)**
   - Draw the eye through the three steps in order so the round flow reads as a sequence, not three
     separate facts. Delays (~1.1s, ~2.7s) let each step land before the next.

2. **Step focus (active card highlighted, others dimmed)**
   - Keep attention on the step currently animating. Only ran on the first scroll-in, not on hover.

3. **Predict card — call swap on hover ("I'll say 1" → "Actually, I'll say 0")**
   - Show the prediction is a *choice*. The first bubble shrinks away, then a new full-size bubble
     drops in below (chat style). Changing it should ripple into Play + Score.

4. **Play card — cards dealt onto the table**
   - Opponents' cards drop in first (staggered), the predictor's card lands **last**. Mimics tossing
     cards into a trick. Winner card highlighted (glow ring) + a "Luca wins the trick" pill +
     the player's avatar badge → shows *which* card took the trick and *whose* it was.

5. **Play card — hover branch (an opponent plays an Ace)**
   - Demonstrate you can *lose* a trick: Dario's Ace beats Luca's 7 → result flips to "Luca loses",
     and the Score updates to predicted 1 / won 0 → 0 points.

6. **Score card — delayed update + flash**
   - Scoring happens *after* play, so the score updated ~0.75s after a change, with a brief flash on
     the score illustration to point the eye at the new result.

7. **Score card — hover zoom-out to the full table**
   - Default: one scaled-up row (Luca's outcome). On hover, zoom out to all players, illustrating the
     rule **10 for an exact call + 10 per trick won** with worked examples:
     - predicted 1, won 1 → +20
     - predicted 0, won 0 → +10
     - predicted 1, won 0 → 0 (miss)
   - Round 1 has one trick, so exactly one player wins it (sum of "won" = 1).

## If rebuilt
Keep it driven by a small phase state machine + framer-motion `AnimatePresence`. The tricky parts
were: keeping the perspective/positions stable across re-renders, sequencing without re-running the
focus highlight on every hover, and fitting the expanded scoreboard without clipping or stretching
the card. Consider doing the whole thing as one self-contained timeline component.
