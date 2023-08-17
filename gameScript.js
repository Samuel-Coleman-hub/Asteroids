const FPS = 30;
const SHIP_SIZE = 30 //height in pixles

/** @type {HTMLCanvasElement} */
var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ship = {
    x: canvas.width / 2,
    y: canvas.height /2,
    r: SHIP_SIZE / 2,
    a: 90 / 180 * Math.PI
}

//Game Loop
setInterval(update, 1000 / FPS);


function update() {
    //draw background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //draw space ship
    ctx.strokeStyle = "white";
    ctx.lineWidth = SHIP_SIZE / 10;
    ctx.beginPath();

    ctx.moveTo( //Draws nose of the space ship
        ship.x + 4 / 3 * ship.r * Math.cos(ship.a),
        ship.y - 4 / 3 * ship.r * Math.sin(ship.a)
    );

    ctx.lineTo( //Draws the left rear of the space ship
        ship.x - ship.r * (2 / 3 *Math.cos(ship.a) + Math.sin(ship.a)),
        ship.y + ship.r * (2 / 3 *Math.sin(ship.a) - Math.cos(ship.a))
    );

    ctx.lineTo( //Draws the right rear of the space ship
        ship.x - ship.r * (2 / 3 *Math.cos(ship.a) - Math.sin(ship.a)),
        ship.y + ship.r * (2 / 3 *Math.sin(ship.a) + Math.cos(ship.a))
    );
    ctx.closePath();
    ctx.stroke();

    //rotate player ship

    //move player ship

    //center dot
    ctx.fillStyle = "red";
    ctx.fillRect(ship.x - 1, ship.y - 1, 2, 2);
}
