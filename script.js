"use strict";
// create the canvas
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

// initalize the keys and items to arrays
const keys = [];
const items = [];

// initilaize game variables
let score = 0;
let gameDuration = 60000; // this is in milliseconds 
let gameStarted = false;
let timeDisplayed = gameDuration / 6000;

// set up the player variables
const player = {
    // x axis start position
    x: 200,
    // y axis start position
    y: 300,
    // player sprite width and height
    width: 40,
    height: 72,
    // frame height and width
    frameX: 0,
    frameY: 0,
    // how fast the player moves, may have to change during presentation
    speed: 2.5,
    moving: false
};

// create canvas images
const playerSprite = new Image();
playerSprite.src = "Dog1sprite.png";

const steakImage = new Image();
steakImage.src = "foodSteak.png";

const baconImage = new Image();
baconImage.src = "foodBacon.png";

const chocolateImage = new Image();
chocolateImage.src = "chocolate.png";

const background = new Image();
background.src = "background.png";

// draw the sprite on the canvas, this will be used to move the player 
function drawSprite(img, sX, sY, sW, sH, dX, dY, dW, dH) {
    ctx.drawImage(img, sX, sY, sW, sH, dX, dY, dW, dH);
}

// randomly spawn a steak, cookie, or bacon
function spawnItem() {
    const spaceAtTop = 250;

    // decalare item and math for randomly selecting an item
    let item;
    const randomItemType = Math.random();
    if (randomItemType < 0.33) {
        item = {
            x: Math.random() * (canvas.width - 30),
            y: spaceAtTop + Math.random() * (canvas.height - spaceAtTop - 30),
            width: 30,
            height: 30,
            image: steakImage,
            type: "steak"
        };
    } else if (randomItemType < 0.66) {
        item = {
            x: Math.random() * (canvas.width - 30),
            y: spaceAtTop + Math.random() * (canvas.height - spaceAtTop - 30),
            width: 30,
            height: 30,
            image: baconImage,
            type: "bacon"
        };
    } else {
        item = {
            x: Math.random() * (canvas.width - 30),
            y: spaceAtTop + Math.random() * (canvas.height - spaceAtTop - 30),
            width: 30,
            height: 30,
            image: chocolateImage,
            type: "chocolate"
        };
    }
    items.push(item);
}

// put the items on the canvas 
function drawItems() {
    for (const item of items) {
        ctx.drawImage(item.image, item.x, item.y, item.width, item.height);
    }
}

// check if player position and item position are the same
function checkCollision(player, item) {
    return (
        player.x < item.x + item.width &&
        player.x + player.width > item.x &&
        player.y < item.y + item.height &&
        player.y + player.height > item.y
    );
}

// Call spawnItem every 2 seconds
setInterval(spawnItem, 2000);

// starting the game
function startGame() {
    overlay.style.display = 'none';
    gameStarted = true;
    score = 0;
    items.length = 0;
    gameDuration = 6000; // Reset game duration
    spawnItem();
    animate();
}

// start button
const overlay = document.getElementById('overlay');
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);

// animate function that creates the game and allows the player sprite to move across the canvas
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    drawSprite(playerSprite, player.width * player.frameX, player.height * player.frameY, player.width, player.height, player.x, player.y, player.width, player.height);
    MovePlayer();

    // loop for collecting items and incrementing and decremeting score
    for (let i = items.length - 1; i >= 0; i--) {
        if (checkCollision(player, items[i])) {
            if (items[i].type === "steak") {
                score += 10; // score for steak + 10
            } else if (items[i].type === "bacon")  {
                score += 5; // score for bacon + 5
            }  else if (items[i].type === "chocolate")  {
                score -= 50; // score for cookie -50
            }
            items.splice(i, 1);
        }
    }

    // display scoreboard
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
    ctx.fillText("Time: " + Math.ceil(gameDuration / 60) + "s", 10, 60); // Display time in seconds

    drawItems();

    if (gameDuration <= 0) {
        gameStarted = false;
        endGame();
        return;
    }

    if (gameStarted) {
        requestAnimationFrame(animate);
        gameDuration--;
    }
}

// display final score and ask play Again
function endGame() {
    overlay.style.display = 'block';
    overlay.innerHTML = `<div id="rules">
                            <h1>Game Over!</h1>
                            <p>Your final score: ${score}</p>
                            <button id="startButton">Play Again</button>
                        </div>`;
    const startButton = overlay.querySelector('#startButton');

    startButton.addEventListener('click', startGame);
}

// originally use KeyCode but is deprecated
window.addEventListener("keydown", function(e) {
    keys[e.key] = true;
    player.moving = true;
});

window.addEventListener("keyup", function(e) {
    delete keys[e.key];
    player.moving = false;
});

// move the player across the canvas
function MovePlayer() {
    // boundry for the top of the canvas
    if (keys["ArrowUp"] && player.y > 250){
        player.y -= player.speed
        player.frameY = 3;
        // boundry for the left of the canvas
    } else if (keys["ArrowLeft"] && player.x > 0){
        player.x -= player.speed
        player.frameY = 1;
        // boundry for the bottom of the canvas
    } else if (keys["ArrowDown"] && player.y < canvas.height - player.height){
        player.y += player.speed
        player.frameY = 0;
        // boundry for the right of the canvas
    } else if (keys["ArrowRight"] && player.x < canvas.width - player.width){
        player.x += player.speed
        player.frameY = 2;
    }
}

// display of overlay
overlay.style.display = 'block';