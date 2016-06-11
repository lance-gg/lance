var ClientEngine = require("./ClientEngine");

var socket = io();
var clientEngine = new ClientEngine(socket);

var game = window.game = new Phaser.Game(800, 600, Phaser.AUTO, 'spaaace', { preload: preload, create: create, update: update, render: render });

function preload() {
    game.load.image('ship', 'assets/ship1.png');
}

var cursors;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);

    game.stage.backgroundColor = 'black';


    //  Game input
    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

    clientEngine.start();
}

function update() {

    if (cursors.up.isDown)
    {
        clientEngine.sendInput('up');
        //                game.physics.arcade.accelerationFromRotation(sprite.rotation, 200, sprite.body.acceleration);
    }

    if (cursors.left.isDown)
    {
        clientEngine.sendInput('left');
    }
    else if (cursors.right.isDown)
    {
        clientEngine.sendInput('right');
    }

    //            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    //            {
    //                fireBullet();
    //            }
    //
    //

}

function render() {

    //            game.debug.spriteInfo(sprite, 32, 32);

}