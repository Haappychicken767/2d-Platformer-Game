const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

let parsedCollisions;
let collisionBlocks;
let background;
let doors;
let enemies = [];

function createPig(xPos, yPos, collisionBlocks) {
  const enemy = new Enemy({
    collisionBlocks: collisionBlocks,
    imageSrc: "./img/03-Pig/Idle (34x28).png",
    frameRate: 11,
    scale: 2,
    position: {
      x: xPos,
      y: yPos,
    },

    animations: {
      idleLeft: {
        frameRate: 11,
        frameBuffer: 2,
        loop: true,
        imageSrc: "./img/03-Pig/Idle (34x28).png",
      },
      idleRight: {
        frameRate: 11,
        frameBuffer: 2,
        loop: true,
        imageSrc: "./img/03-Pig/idleRight.png",
      },
      hit: {
        frameRate: 2,
        frameBuffer: 16,
        loop: false,
        imageSrc: "./img/03-Pig/Hit (34x28).png",
      },
      hitRight: {
        frameRate: 2,
        frameBuffer: 16,
        loop: false,
        imageSrc: "./img/03-Pig/hitRight.png",
      },
      dead: {
        frameRate: 4,
        frameBuffer: 8,
        loop: false,
        imageSrc: "./img/03-Pig/Dead (34x28).png",
      },
      deadRight: {
        frameRate: 4,
        frameBuffer: 8,
        loop: false,
        imageSrc: "./img/03-Pig/deadRight.png",
      },
      run: {
        frameRate: 6,
        frameBuffer: 4,
        loop: true,
        imageSrc: "./img/03-Pig/Run (34x28).png",
      },
      runRight: {
        frameRate: 6,
        frameBuffer: 4,
        loop: true,
        imageSrc: "./img/03-Pig/runRight.png",
      },
      attack: {
        frameRate: 5,
        frameBuffer: 6,
        loop: false,
        imageSrc: "./img/03-Pig/Attack (34x28).png",
      },
      attackRight: {
        frameRate: 5,
        frameBuffer: 6,
        loop: false,
        imageSrc: "./img/03-Pig/attackRight.png",
      },
    },
  });

  enemy.animations.attackRight.onComplete = () => {
    enemy.isAttacking = false;
    enemy.switchSprite("idleRight");
  };

  enemy.animations.attack.onComplete = () => {
    enemy.isAttacking = false;
    enemy.switchSprite("idleLeft");
  };

  return enemy;
}

function createBomberPig(xPos, yPos, collisionBlocks) {}

const player = new Player({
  imageSrc: "./img/king/idle.png",
  frameRate: 11,
  animations: {
    idleRight: {
      frameRate: 11,
      frameBuffer: 2,
      loop: true,
      imageSrc: "./img/king/idle.png",
    },
    idleLeft: {
      frameRate: 11,
      frameBuffer: 2,
      loop: true,
      imageSrc: "./img/king/idleLeft.png",
    },

    runRight: {
      frameRate: 8,
      frameBuffer: 4,
      loop: true,
      imageSrc: "./img/king/runRight.png",
    },

    runLeft: {
      frameRate: 8,
      frameBuffer: 4,
      loop: true,
      imageSrc: "./img/king/runLeft.png",
    },

    attackRight: {
      frameRate: 3,
      frameBuffer: 8,
      loop: false,
      imageSrc: "./img/king/Attack (78x58).png",
      scale: 2,
      offset: { x: -5, y: 10 },
      onComplete: () => {
        player.isAttacking = false;
      },
    },

    attackLeft: {
      frameRate: 3,
      frameBuffer: 8,
      loop: false,
      imageSrc: "./img/king/attackLeft.png",
      scale: 2,
      offset: { x: 30, y: 10 },
      onComplete: () => {
        player.isAttacking = false;
      },
    },

    hit: {
      frameRate: 2,
      frameBuffer: 8,
      loop: false,
      imageSrc: "./img/king/Hit (78x58).png",
      scale: 2,
      onComplete: () => {
        player.isHit = false;
        player.switchSprite(
          player.lastDirection === "left" ? "idleLeft" : "idleRight",
        );
      },
    },

    /*jump: {
      frameRate: 1,
      frameBuffer: 2,
      loop: false,
      imageSrc: "./img/king/Jump.png",
      //scale: 2.1,
    },*/

    enterDoor: {
      frameRate: 8,
      frameBuffer: 4,
      loop: false,
      imageSrc: "./img/king/enterDoor.png",
      onComplete: () => {
        gsap.to(overlay, {
          opacity: 1,
          onComplete: () => {
            level++;

            if (level === 4) {
              level = 1;
            }
            levels[level].init();
            player.switchSprite("idleRight");
            player.preventInput = false;
            gsap.to(overlay, {
              opacity: 0,
            });
          },
        });
      },
    },
  },
});

canvas.width = 1024;
canvas.height = 576;

let level = 0;
let levels = {
  0: {
    init: () => {},
  },
  1: {
    init: () => {
      parsedCollisions = collisionsLevel1.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      player.collisionBlocks = collisionBlocks;

      if (player.currentAnimation) {
        player.currentAnimation.isActive = false;
      }

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: "./img/backgroundLevel1.png",
      });

      doors = [
        new Sprite({
          position: {
            x: 752,
            y: 270,
          },
          imageSrc: "./img/doorOpen.png",
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ];

      enemies = [createPig(600, 200, collisionBlocks)];
    },
  },
  2: {
    init: () => {
      parsedCollisions = collisionsLevel2.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      player.collisionBlocks = collisionBlocks;
      player.position.x = 76;
      player.position.y = 140;

      enemies = [
        createPig(500, 400, collisionBlocks),
        createPig(276, 140, collisionBlocks),
      ];

      if (player.currentAnimation) {
        player.currentAnimation.isActive = false;
      }

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: "./img/backgroundLevel2.png",
      });

      doors = [
        new Sprite({
          position: {
            x: 772,
            y: 336,
          },
          imageSrc: "./img/doorOpen.png",
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ];
    },
  },

  3: {
    init: () => {
      parsedCollisions = collisionsLevel3.parse2D();
      collisionBlocks = parsedCollisions.createObjectsFrom2D();
      player.collisionBlocks = collisionBlocks;
      player.position.x = 750;
      player.position.y = 100;

      enemies = [];

      if (player.currentAnimation) {
        player.currentAnimation.isActive = false;
      }

      background = new Sprite({
        position: {
          x: 0,
          y: 0,
        },
        imageSrc: "./img/backgroundLevel3.png",
      });

      doors = [
        new Sprite({
          position: {
            x: 176,
            y: 335,
          },
          imageSrc: "./img/doorOpen.png",
          frameRate: 5,
          frameBuffer: 5,
          loop: false,
          autoplay: false,
        }),
      ];
    },
  },
};

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

const overlay = {
  opacity: 0,
};
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  background.draw();
  //collisionBlocks.forEach((collisionBlock) => {
  //  collisionBlock.draw();
  //});

  doors.forEach((door) => {
    door.draw();
  });

  //Drawing the enemies
  if (enemies && enemies.length > 0) {
    enemies.forEach((enemy) => {
      enemy.update();
      enemy.draw();
    });
  }

  player.handleInput(keys);
  player.draw();
  player.update();

  //Calling combat logic
  setupEnemyCombat(player, enemies);
  handlePlayerCombat(player, enemies);
  handleEnemyCombat(player, enemies);

  //Safely delete the enemies that are marked for deletion
  enemies = enemies.filter((enemy) => !enemy.markedForDeletion);

  c.save();
  c.globalAlpha = overlay.opacity;
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.restore();
}

//levels[level].init();
//animate();

const startBtn = document.querySelector("#start-btn");
const gameTitle = document.querySelector("#game-title");

startBtn.addEventListener("click", () => {
  gsap.to(gameTitle, {
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      gameTitle.style.display = "none";

      level = 1;
      levels[level].init();
      animate();
    },
  });
});
