const FPS = 30;
const FRICTION = 0.7; //friction coefficient of space where 0 = no friction, 1 = lots
const SHIP_SIZE = 50 //height in pixles
const SHIP_ACCEL = 5; //player acceleration in pixels per second
const ROT_SPEED = 360; //turn speed in degrees per second

const ROIDS_NUM = 10; //Starting number of asteroids
const ROIDS_SIZE = 100; //Starting size
const ROIDS_JAG = 0.4; //Jaggedness of the ateroids 0 = none, 1 = lots
const ROIDS_SPD = 50; //Max Starting speed of aestroids in pixels per second
const ROIDS_VERT = 10; //Average number of vertices for aestroids

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

//set up asteroids
var roids = [];
createAsteroids();

//Set up event handlers for player movement
document.addEventListener("keydown", keyDown);
document.addEventListener("keyup", keyUp);

//Game Loop
setInterval(update, 1000 / FPS);

function createAsteroids() {
    roids = [];
    var x, y;
    for (var i = 0; i < ROIDS_NUM; i++) {
        // random asteroid location (not touching spaceship)
        do {
            x = Math.floor(Math.random() * canvas.width);
            y = Math.floor(Math.random() * canvas.height);
        } while (distBetweenPoints(ship.x, ship.y, x, y) < ROIDS_SIZE * 2 + ship.r);
        roids.push(newAsteroid(x, y));
    }
}

function distBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}


function newAsteroid(x, y){
    var roid = {
        x: x,
        y: y,
        xv: Math.random() * ROIDS_SPD / FPS * (Math.random() < 0.5 ? 1 : -1),
        yv: Math.random() * ROIDS_SPD / FPS * (Math.random() < 0.5 ? 1 : -1),
        r: ROIDS_SIZE / 2,
        a: Math.random() * Math.PI * 2, // in radians
        vert: Math.floor(Math.random() * (ROIDS_VERT + 1) + ROIDS_VERT / 2),
        offs: []
    };

    //create the vertex offsets array

    for(var i = 0; i < roid.vert; i++){
        roid.offs.push(Math.random() * ROIDS_JAG * 2 + 1 - ROIDS_JAG);
    }
    return roid;
}

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

    //draw aestroids
    ctx.strokeStyle = "slategrey";
    ctx.lineWidth = SHIP_SIZE / 10;
    var x, y, r, a, vert, offs;
    for(var i = 0; i < roids.length; i++){

        //Get aestroid properties
        x = roids[i].x;
        y = roids[i].y;
        r = roids[i].r;
        a = roids[i].a;
        vert = roids[i].vert;
        offs = roids[i].offs;

        //draw a path
        ctx.beginPath();
        ctx.moveTo(
            x + r * offs[0] * Math.cos(a),
            y + r * offs[0] * Math.sin(a)
        );

        //draw the polygon
        for(var j = 1; j < vert; j++){
            ctx.lineTo(
                x + r * offs[j] * Math.cos(a + j * Math.PI * 2 / vert),
                y + r * offs[j] * Math.sin(a + j * Math.PI * 2 / vert),
            );
        }
        ctx.closePath();
        ctx.stroke();

        //move the asteroid
        roids[i].x += roids[i].xv;
        roids[i].y += roids[i].yv;


        //handle edge of screen
        if(roids[i].x < 0 - roids[i].r){
            roids[i].x = canvas.width + roids[i].r;
        } else if(roids[i].x > canvas.width + roids[i].r){
            roids[i].x = 0 - roids[i].r;
        }

        if(roids[i].y < 0 - roids[i].r){
            roids[i].y = canvas.height + roids[i].r;
        } else if(roids[i].y > canvas.height + roids[i].r){
            roids[i].y = 0 - roids[i].r;
        }
    }

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
