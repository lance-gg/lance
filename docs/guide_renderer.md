The Renderer is a fully user-implemented component.  In the architecture of an Lance multiplayer game, the renderer must render frames at the rate of the render-loop, as defined by the browser.  Lance provides a full description of the game state in a list of game objects.  The renderer must then scan the game objects and render them, based on position attributes, and any other object attributes which are prescribed by the game.

See the {@link Renderer} implementation in the API Reference.

Next: {@tutorial guide_gameworld}
