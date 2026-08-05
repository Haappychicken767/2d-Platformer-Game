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
      enemy.switchSprite(enemy.lastDirection === "right" ? "hitRight" : "hit");

      //Knockback effect when hit
      enemy.velocity.x = player.lastDirection === "left" ? -8 : 8;
      enemy.velocity.y = -6;

      enemy.currentAnimation.onComplete = () => {
        enemy.switchSprite(
          enemy.lastDirection === "right" ? "deadRight" : "dead",
        );

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
    if (enemy.isDead) return;

    // absolute distance
    const dx = player.hitbox.position.x - enemy.hitbox.position.x;
    const dy = player.hitbox.position.y - enemy.hitbox.position.y;
    const distanceX = Math.abs(dx);
    const distanceY = Math.abs(dy);

    enemy.lastDirection = dx > 0 ? "right" : "left";

    // interact if player is on the same vertical level
    if (distanceY < 70) {
      if (distanceX < 60) {
        enemy.velocity.x = 0;
        if (!enemy.isAttacking) {
          enemy.isAttacking = true;
          enemy.switchSprite(
            enemy.lastDirection === "right" ? "attackRight" : "attack",
          );
        }
      } else if (distanceX < 400) {
        // player in visual range
        if (!enemy.isAttacking) {
          enemy.switchSprite(
            enemy.lastDirection === "right" ? "runRight" : "run",
          );
          enemy.velocity.x = dx > 0 ? 2 : -2; // moving towards the player
        }
      } else {
        // if player is too far away, enemy should idle
        if (!enemy.isAttacking) {
          enemy.velocity.x = 0;
          enemy.switchSprite(
            enemy.lastDirection === "right" ? "idleRight" : "idleLeft",
          );
        }
      }
    } else {
      // player is not on the same vertical level, enemy does nothing
      if (!enemy.isAttacking) {
        enemy.velocity.x = 0;
        enemy.switchSprite(
          enemy.lastDirection === "right" ? "idleRight" : "idleLeft",
        );
      }
    }

    /*if (player.hitbox.position.x + 10 >= enemy.hitbox.position.x) {
      enemy.velocity.x = 0;
      enemy.isPlayerNear = true;
      enemy.isAttacking = true;
      enemy.switchSprite("attack");
    } else {
      enemy.switchSprite("run");
      enemy.velocity.x = -1;
      //console.log("Player position: " + player.hitbox.position.x);
      //console.log("Enemy position: " + enemy.hitbox.position.x);
    }*/
  });
}

function handleEnemyCombat(player, enemies) {
  if (player.isHit) return;

  enemies.forEach((enemy) => {
    if (!enemy.isAttacking || enemy.isDead) return;

    // 4-sided collision detection
    if (
      enemy.attackBox.position.x <=
        player.hitbox.position.x + player.hitbox.width &&
      enemy.attackBox.position.x + enemy.attackBox.width >=
        player.hitbox.position.x &&
      enemy.attackBox.position.y <=
        player.hitbox.position.y + player.hitbox.height &&
      enemy.attackBox.position.y + enemy.attackBox.height >=
        player.hitbox.position.y
    ) {
      player.isHit = true;
      player.isAttacking = false;
      player.switchSprite("hit");

      // player knockback effect
      const dx = player.hitbox.position.x - enemy.hitbox.position.x;
      player.velocity.x = dx > 0 ? 12 : -12; // vertical push away from pig
      player.velocity.y = -6; // small jump
    }
  });
}
