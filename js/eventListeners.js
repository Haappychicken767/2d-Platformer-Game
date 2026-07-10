window.addEventListener("keydown", (event) => {
  switch (event.key) {
    // Player jump
    case "w":
      if (player.velocity.y === 0) {
        player.velocity.y = -25;
      }
      break;

    // Move player to left
    case "a":
      keys.a.pressed = true;
      break;

    // Move player to right
    case "d":
      keys.d.pressed = true;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    // Move player to left
    case "a":
      keys.a.pressed = false;
      break;

    // Move player to right
    case "d":
      keys.d.pressed = false;
      break;
  }
});
