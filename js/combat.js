function handlePlayerCombat(player, enemies) {
  if (!player.isAttacking) return;

  enemies.forEach((enemy) => {
    if (enemy.isDead) return;

    if (
      player.attackBox.position.x <=
        enemy.hitbox.position.x + enemy.hitbox.width &&
      player.attackBox.position.x + player.attackBox.width >=
        enemy.hitbox.position.x &&
      player.attackBox.position.y <=
        enemy.hitbox.position.y + enemy.hitbox.height &&
      player.attackBox.position.y + player.attackBox.height >=
        enemy.hitbox.position.y
    ) {
      enemy.isDead = true;
      enemy.switchSprite("hit");

      //Knockback effect when hit
      enemy.velocity.x = player.lastDirection === "left" ? -8 : 8;
      enemy.velocity.y = -6;

      enemy.currentAnimation.onComplete = () => {
        enemy.switchSprite("dead");

        enemy.currentAnimation.onComplete = () => {
          setTimeout(() => {
            enemy.markedForDeletion = true;
          }, 1000);
        };
      };
    }
  });
}

function setupEnemyCombat(player, enemies) {
  enemies.forEach((enemy) => {
    if (player.hitbox.position.x + 10 >= enemy.hitbox.position.x) {
      enemy.velocity.x = 0;
      enemy.isPlayerNear = true;
      enemy.isAttacking = true;
      enemy.switchSprite("attack");
    } else {
      enemy.switchSprite("run");
      enemy.velocity.x = -1;
      //console.log("Player position: " + player.hitbox.position.x);
      //console.log("Enemy position: " + enemy.hitbox.position.x);
    }
  });
}

function handleEnemyCombat(player, enemies) {
  enemies.forEach((enemy) => {
    if (!enemy.isAttacking) return;

    if (enemy.isPlayerNear) {
      console.log(
        "First condition: " +
          enemy.attackBox.position.x +
          enemy.attackBox.width,
      );
      console.log("enemy hitbox position x: " + enemy.hitbox.position.x);
      console.log(
        "Second condition (attackbox y): " + enemy.attackBox.position.y,
      );
      console.log(
        "Player hitbox y + height: " +
          player.hitbox.position.y +
          player.hitbox.height,
      );

      if (
        enemy.attackBox.position.x + enemy.attackBox.width >=
          enemy.hitbox.position.x &&
        enemy.attackBox.position.y <=
          player.hitbox.position.y + player.hitbox.height
      ) {
        player.switchSprite("hit");

        //player.velocity.x = -10;
        //player.velocity.y = -7;
        console.log("Player is hit");
      }
    }
  });
}
