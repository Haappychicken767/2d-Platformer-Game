class Player extends Sprite {
  constructor({ collisionBlocks = [], imageSrc, frameRate, animations, loop }) {
    super({ imageSrc, frameRate, animations, loop });
    this.position = {
      x: 200,
      y: 200,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.sides = {
      bottom: this.position.y + this.height,
    };
    this.gravity = 1;
    this.isJumping = false;

    this.isAttacking = false;
    this.attackCooldown = false;
    this.isHit = false;

    this.collisionBlocks = collisionBlocks;
  }

  update() {
    //the blue box around the player
    //c.fillStyle = "rgba(0, 0, 255, 0.5)";
    //c.fillRect(this.position.x, this.position.y, this.width, this.height);

    this.position.x += this.velocity.x;

    this.updateHitbox();

    this.checkForHorizontalCollisions();
    this.applyGravity();

    this.updateHitbox();

    // visible hitbox
    /* c.fillRect(
      this.hitbox.position.x,
      this.hitbox.position.y,
      this.hitbox.width,
      this.hitbox.height,
    ); */

    this.checkForVerticalCollisions();
  }

  handleInput(keys) {
    if (this.preventInput) return;

    //Smooth dash deceleration
    if (this.isHit) {
      this.velocity.x *= 0.85;
      return;
    }

    if (this.isAttacking) {
      this.velocity.x *= 0.85;
      return;
    }

    /*
    //Guard clause so that it doesn't override the attack animation
    if (
      //checks attackRight
      (this.image === this.animations.attackRight.image &&
        this.currentFrame < this.animations.attackRight.frameRate - 1) ||
      //checks attackLeft
      (this.image === this.animations.attackLeft.image &&
        this.currentFrame < this.animations.attackLeft.frameRate - 1)
    ) {
      return;
    }*/

    if (keys.d.pressed) {
      this.velocity.x = 5;
      this.lastDirection = "right";
    } else if (keys.a.pressed) {
      this.velocity.x = -5;
      this.lastDirection = "left";
    } else {
      this.velocity.x = 0;
    }

    if (keys.d.pressed) {
      this.switchSprite("runRight");
    } else if (keys.a.pressed) {
      this.switchSprite("runLeft");
    } else {
      if (this.lastDirection === "left") this.switchSprite("idleLeft");
      else this.switchSprite("idleRight");
    }
  }

  switchSprite(name) {
    if (this.image === this.animations[name].image) return;
    this.currentFrame = 0;
    this.image = this.animations[name].image;
    this.frameRate = this.animations[name].frameRate;
    this.frameBuffer = this.animations[name].frameBuffer;
    this.loop = this.animations[name].loop;
    //recalculate dimensions for crop box, for different spritesheets
    this.width = this.image.width / this.frameRate;
    this.height = this.image.height;
    //for uneven sized spritesheets
    this.scale = this.animations[name].scale || 1;
    this.offset = this.animations[name].offset || { x: 0, y: 0 };
    this.currentAnimation = this.animations[name];

    if (this.currentAnimation) {
      this.currentAnimation.isActive = false;
    }
  }

  updateHitbox() {
    this.hitbox = {
      position: {
        x: this.position.x + 58,
        y: this.position.y + 34,
      },
      width: 50,
      height: 53,
    };

    //Creating an attack hitbox that flips to left or right
    const attackBoxWidth = 60;
    this.attackBox = {
      position: {
        x:
          this.lastDirection === "right"
            ? this.hitbox.position.x + this.hitbox.width
            : this.hitbox.position.x - attackBoxWidth,
        y: this.hitbox.position.y,
      },
      width: attackBoxWidth,
      height: 53,
    };
  }

  checkForHorizontalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];

      // checks if a collision exists
      if (
        this.hitbox.position.x <=
          collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.position.x + this.hitbox.width >=
          collisionBlock.position.x &&
        this.hitbox.position.y + this.hitbox.height >=
          collisionBlock.position.y &&
        this.hitbox.position.y <=
          collisionBlock.position.y + collisionBlock.height
      ) {
        // collision on the x-axis
        if (this.velocity.x < 0) {
          const offset = this.hitbox.position.x - this.position.x;
          this.position.x =
            collisionBlock.position.x + collisionBlock.width - offset + 0.01;
          break;
        }

        if (this.velocity.x > 0) {
          const offset =
            this.hitbox.position.x - this.position.x + this.hitbox.width;
          this.position.x = collisionBlock.position.x - offset - 0.01;
          break;
        }
      }
    }
  }

  applyGravity() {
    this.velocity.y += this.gravity;
    this.position.y += this.velocity.y;
  }

  checkForVerticalCollisions() {
    for (let i = 0; i < this.collisionBlocks.length; i++) {
      const collisionBlock = this.collisionBlocks[i];
      // checks if a collision exists
      if (
        this.hitbox.position.x <=
          collisionBlock.position.x + collisionBlock.width &&
        this.hitbox.position.x + this.hitbox.width >=
          collisionBlock.position.x &&
        this.hitbox.position.y + this.hitbox.height >=
          collisionBlock.position.y &&
        this.hitbox.position.y <=
          collisionBlock.position.y + collisionBlock.height
      ) {
        // collision on the y-axis
        if (this.velocity.y < 0) {
          this.velocity.y = 0;
          const offset = this.hitbox.position.y - this.position.y;
          this.position.y =
            collisionBlock.position.y + collisionBlock.height - offset + 0.01;
          break;
        }

        if (this.velocity.y > 0) {
          this.velocity.y = 0;
          this.isJumping = false;
          const offset =
            this.hitbox.position.y - this.position.y + this.hitbox.height;
          this.position.y = collisionBlock.position.y - offset - 0.01;
          break;
        }
      }
    }
  }
}
