function handleCombat(player, enemies) {
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
