window.addEventListener("keydown", (event) => {
  if (player.preventInput) return;
  switch (event.key) {
    // Player jump
    case "s":
      if (!player.hitbox) return;

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

    case "h":
      if (!player.hitbox || player.isAttacking || player.attackCooldown) return;

      player.isAttacking = true;
      player.attackCooldown = true;

      //Resets the cooldown in 1.5 secs
      setTimeout(() => {
        player.attackCooldown = false;
      }, 1500);

      if (player.lastDirection === "left") {
        player.switchSprite("attackLeft");
        player.velocity.x = -15; //Dashes to the left
      } else {
        player.switchSprite("attackRight");
        player.velocity.x = 15; //Dashes to the right
      }
      break;

    case "w":
      if (player.isJumping || player.velocity.y !== 0) break;

      player.velocity.y = -25;
      player.isJumping = true;
      //player.switchSprite("jump");
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
