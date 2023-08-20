const FPS = 30;
const FRICTION = 0.7; //friction coefficient of space where 0 = no friction, 1 = lots
const SHIP_SIZE = 50 //height in pixles
const SHIP_ACCEL = 5; //player acceleration in pixels per second
const ROT_SPEED = 360; //turn speed in degrees per second

const DARK_BLUE = '#3C486B';
const WHITE = '#F0F0F0';
const YELLOW = '#F9D949';
const RED = '#F45050';

/** @type {HTMLCanvasElement} */
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = canvas.height *
    (canvas.clientWidth / canvas.clientHeight);

var ship = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    r: SHIP_SIZE / 2,
    a: 90 / 180 * Math.PI,
    rot: 0,
    accelerating: false,
    thrust: {
        x: 0,
        y: 0
    }
}

//Set up event handlers for player movement
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

//Game Loop
setInterval(update, 1000 / FPS);

//Calculate ship rotation while player input pressed
function keyDown(/** @type  {KeyboardEvent}*/ ev) {
    switch (ev.key) {
        case "ArrowLeft":
            ship.rot = ROT_SPEED / 180 * Math.PI / FPS;
            break;
        case "ArrowUp":
            ship.accelerating = true;
            break;
        case "ArrowRight":
            ship.rot = -ROT_SPEED / 180 * Math.PI / FPS;
            break;
    }
}

//Stops ship rotation when player input stopped
function keyUp(/** @type {KeyboardEvent} */ ev) {
    switch (ev.key) {
        case "ArrowLeft":
            ship.rot = 0;
            break;
        case "ArrowUp":
            ship.accelerating = false;
            break;
        case "ArrowRight":
            ship.rot = 0;
            break;
    }
}


function update() {
    //draw background
    ctx.fillStyle = DARK_BLUE;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Accelerating ship
    if (ship.accelerating) {
        ship.thrust.x += SHIP_ACCEL * Math.cos(ship.a) / FPS;
        ship.thrust.y -= SHIP_ACCEL * Math.sin(ship.a) / FPS;

        //draw the thruster
        ctx.fillStyle = RED;
        ctx.strokeStyle = YELLOW;
        ctx.lineWidth = SHIP_SIZE / 20;
        ctx.beginPath();

        ctx.moveTo( //rear left
            ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + 0.5 * Math.sin(ship.a)),
            ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - 0.5 * Math.cos(ship.a))
        );

        ctx.lineTo( //rear center behind space ship
            ship.x - ship.r * 4 / 3 * Math.cos(ship.a),
            ship.y + ship.r * 4 / 3 * Math.sin(ship.a),
        );

        ctx.lineTo( //Draws the right rear of the space ship
            ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - 0.5 * Math.sin(ship.a)),
            ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + 0.5 * Math.cos(ship.a))
        );
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

    } else {
        ship.thrust.x -= FRICTION * ship.thrust.x / FPS;
        ship.thrust.y -= FRICTION * ship.thrust.y / FPS;
    }

    //draw space ship
    ctx.strokeStyle = WHITE;
    ctx.lineWidth = SHIP_SIZE / 10;
    ctx.beginPath();

    ctx.moveTo( //Draws nose of the space ship
        ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
        ship.y - 4 / 3 * ship.r * Math.sin(ship.a)
    );

    ctx.lineTo( //Draws the left rear of the space ship
        ship.x - ship.r * (2 / 3 * Math.cos(ship.a) + Math.sin(ship.a)),
        ship.y + ship.r * (2 / 3 * Math.sin(ship.a) - Math.cos(ship.a))
    );

    ctx.lineTo( //Draws the right rear of the space ship
        ship.x - ship.r * (2 / 3 * Math.cos(ship.a) - Math.sin(ship.a)),
        ship.y + ship.r * (2 / 3 * Math.sin(ship.a) + Math.cos(ship.a))
    );
    ctx.closePath();
    ctx.stroke();

    //rotate player ship
    ship.a += ship.rot;

    //move player ship
    ship.x += ship.thrust.x;
    ship.y += ship.thrust.y;

    //handle edge of screen 
    if (ship.x < 0 - ship.r) {
        ship.x = canvas.width + ship.r;
    } else if (ship.x > canvas.width + ship.r) {
        ship.x = 0 - ship.r;
    }

    if (ship.y < 0 - ship.r) {
        ship.y = canvas.height + ship.r;
    } else if (ship.y > canvas.height + ship.r) {
        ship.y = 0 - ship.r;
    }

    //center dot
    ctx.fillStyle = "red";
    ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2);
}
