const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: './assets/LeftFighter/Idle.png',
  framesMax: 8,
  scale: 2,
  offset: {
    x: 100,
    y: 100,
  },
  sprites: {
    idle: {
      imageSrc: './assets/LeftFighter/Idle.png',
      framesMax: 8,
    },
    run: {
      imageSrc: './assets/LeftFighter/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './assets/LeftFighter/Jump.png',
      framesMax: 2,
    },
    attack: {
      imageSrc: './assets/LeftFighter/Attack1.png',
      framesMax: 6,
    },
    fall: {
      imageSrc: './assets/LeftFighter/Fall.png',
      framesMax: 2,
    },
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 100,
    y: 100,
  },
  imageSrc: './assets/RightFighter/Idle.png',
  framesMax: 4,
  scale: 2,
  offset: {
    x: 100,
    y: 100,
  },
  sprites: {
    idle: {
      imageSrc: './assets/RightFighter/Idle.png',
      framesMax: 4,
    },
    run: {
      imageSrc: './assets/RightFighter/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './assets/RightFighter/Jump.png',
      framesMax: 2,
    },
    attack: {
      imageSrc: './assets/RightFighter/Attack1.png',
      framesMax: 4,
    },
    fall: {
      imageSrc: './assets/RightFighter/Fall.png',
      framesMax: 2,
    },
  },
});
const background = new Sprite({
  position: {
    x: -200,
    y: -470,
  },
  imageSrc: './assets/pixel.png',
});
const shop = new Sprite({
  position: {
    x: 750,
    y: 250,
  },
  imageSrc: './assets/shop_anim.png',
  scale: 2,
  framesMax: 6,
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

decreaseTimer();

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  player.update();
  enemy.update();
  player.velocity.x = 0;
  enemy.velocity.x = 0;

  // player movement

  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5;
    player.switchSprite('run');
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5;
    player.switchSprite('run');
  } else {
    player.switchSprite('idle');
  }

  // jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump');
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall');
  }

  // enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5;
    enemy.switchSprite('run');
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5;
    enemy.switchSprite('run');
  } else {
    enemy.switchSprite('idle');
  }
  // jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump');
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall');
  }

  // detect for collision
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.velocity.x += 20;
    enemy.velocity.y += -10;
    enemy.health -= 20;
    document.querySelector('#enemyHealth').style.width = enemy.health + '%';
  }
  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.velocity.x = -10;
    player.velocity.y = -10;
    player.health -= 20;
    document.querySelector('#playerHealth').style.width = player.health + '%';
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}
animate();

window.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = true;
      player.lastKey = 'd';
      break;
    case 'a':
      keys.a.pressed = true;
      player.lastKey = 'a';
      break;
    case 'w':
      player.velocity.y = -20;

      break;
    case ' ':
      player.attack();
      break;

    // enemy keys:

    case 'ArrowRight':
      keys.ArrowRight.pressed = true;
      enemy.lastKey = 'ArrowRight';
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = 'ArrowLeft';
      break;
    case 'ArrowUp':
      enemy.velocity.y = -20;
      break;
    case 'ArrowDown':
      enemy.attack();
      break;
  }
});
window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;

    // enemy keys
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }
});
