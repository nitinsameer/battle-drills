# Drill War arcade rebuild

## Goal
Create a polished, fully playable Drill War web game at `/`, closely inspired by the supplied storyboard while improving clarity, responsiveness, and finish.

## Experience
- Build a vibrant underground arcade identity with bold comic typography, chunky controls, warm rock tones, electric crystal blues, hazard reds, and metallic drill details.
- Deliver the complete flow: main menu, how-to-play, settings, character selection, drill selection, countdown, live mining match, pause state, cave-collapse finale, and results leaderboard.
- Keep the supplied game rules and controls: keyboard and touch movement, collectible stars and gems, hazards, power-ups, depth progression, opponents, timer, score, and replay.
- Replace screenshot-based interaction layers with real responsive interface elements, while using the reference imagery only as visual guidance.

## Build approach
- Adapt the uploaded game engine into the existing React app with focused modules for game data, world generation, entities, canvas rendering, audio, and screen flow.
- Use a responsive canvas that fills the playable area and scales cleanly across desktop and mobile.
- Create all menus and heads-up displays as accessible React controls with strong feedback, readable states, and touch-friendly sizing.
- Define the full visual system in the shared styles using semantic color and typography tokens.
- Add original, cohesive arcade artwork where needed rather than shipping placeholders or using the reference sheet as the interface.

## Quality checks
- Verify the full path from Start Game through character/drill selection, countdown, gameplay, pause/resume, and results.
- Test desktop keyboard and mobile touch layouts, check text/controls for overlap, and confirm the canvas stays correctly framed.
- Confirm page metadata, build status, browser console, and runtime behavior before completion.
