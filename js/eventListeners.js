window.addEventListener("keydown", (event) => {
  if (player.preventInput) return;
  switch (event.key) {
    // Player jump
    case "s":
      for (let i = 0; i < doors.length; i++) {
        const door = doors[i];

        if (
          player.hitbox.position.x + player.hitbox.width <=
            door.position.x + door.width &&
          player.hitbox.position.x >= door.position.x &&
          player.hitbox.position.y + player.hitbox.height >= door.position.y &&
          player.hitbox.position.y <= door.position.y + door.height
        ) {
          player.velocity.x = 0;
          player.velocity.y = 0;
          player.preventInput = true;
          player.switchSprite("enterDoor");
          door.play();
          return;
        }
      }
      break;

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
