var app = app || {};
var bullets;
var cursors;
var starfield;
var bulletTime = 0;

//title screen
app.Game = function(){};

app.Game.prototype = {
  create: function() {
 

    //set world dimensions
    this.game.world.setBounds(0, 0, 10000, 10000);

    //background
    this.background = this.game.add.tileSprite(0, 0, this.game.world.width, this.game.world.height, 'space');
    this.background.autoScroll(-20, 10);

    //create player
    this.player = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'playership');
    this.player.scale.setTo(0.3);
    /*this.player.animations.add('fly', [0, 1, 2, 3], 5, true);
    this.player.animations.play('fly');*/

    //player initial score of zero
    this.playerScore = 0;

    //enable player physics
    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;

    //the camera will follow the player in the world
    this.game.camera.follow(this.player);

    //generate game elements
    this.generateCollectables();
    this.generateAsteriods();

    //show score
    this.showLabels();

    //sounds
    this.explosionSound = this.game.add.audio('explosion');
    this.collectSound = this.game.add.audio('collect');


    this.player.anchor.setTo(0.5, 0.5);

    //  Our bullet group
    bullets = this.game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'bullet');
    bullets.setAll('anchor.x', 0.5);
    bullets.setAll('anchor.y', 1);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);

    /*explosions = this.game.add.group();
    //explosions.createMultiple(30, 'kaboom');
    explosions.forEach(setupInvader, this);*/

    fireButton = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

  },

  
  update: function() {
/*    if(this.game.input.activePointer.justPressed()) {
      
      //move on the direction of the input
      this.game.physics.arcade.moveToPointer(this.player, this.playerSpeed);
    }*/
    //this.game.physics.arcade.moveToPointer(this.player, 60, this.game.input.activePointer, 50);
    //collision between player and asteroids
    this.game.physics.arcade.collide(this.player, this.asteroids, this.hitAsteroid, null, this);

    //overlapping between player and collectables
    this.game.physics.arcade.overlap(this.player, this.collectables, this.collect, null, this);

    //this.player.rotation = this.game.physics.arcade.moveToPointer(this.player, 60, this.game.input.activePointer, 10000);

    if (this.game.input.mousePointer.isDown)
    {
        this.player.rotation = this.game.physics.arcade.moveToPointer(this.player, 700);

        if (Phaser.Rectangle.contains(this.player.body, this.game.input.x, this.game.input.y))
        {
            this.player.body.velocity.setTo(0, 0);
        }
    }
    else
    {
        this.player.body.velocity.setTo(0, 0);
    }

    //Déplacement flèches

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
    {
        this.player.body.rotation -= 8;
    }
    else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
    {
        this.player.body.rotation += 8;
    }

    if (this.game.input.keyboard.isDown(Phaser.Keyboard.UP))
    {
        this.game.physics.arcade.velocityFromAngle(this.player.angle, 500, this.player.body.velocity);
    }

        //  Firing?
    if (fireButton.isDown)
        {
            this.fireBullet();
        }

  },

  /*render: function(){
    this.game.debug.body(this.player);
  },*/

  fireBullet: function() {

      //  To avoid them being allowed to fire too fast we set a time limit
      if (this.game.time.now > bulletTime)
      {
          //  Grab the first bullet we can from the pool
          bullet = bullets.getFirstExists(false);

          if (bullet)
          {
              //  And fire it
              bullet.reset(this.player.x + -100, this.player.y + 0);
              bullet.body.velocity.y = -400;
              bulletTime = this.game.time.now + 200;
          }
      }

  },

/*setupInvader: function(invader) {

    invader.anchor.x = 0.5;
    invader.anchor.y = 0.5;
    // invader.animations.add('kaboom');

},*/

  generateCollectables: function() {
    this.collectables = this.game.add.group();

    //enable physics in them
    this.collectables.enableBody = true;
    this.collectables.physicsBodyType = Phaser.Physics.ARCADE;

    //phaser's random number generator
    var numCollectables = this.game.rnd.integerInRange(250, 350)
    var collectable;

    for (var i = 0; i < numCollectables; i++) {
      //add sprite
      collectable = this.collectables.create(this.game.world.randomX, this.game.world.randomY, 'power');
      collectable.animations.add('fly', [0, 1, 2, 3], 5, true);
      collectable.animations.play('fly');
    }

  },
  generateAsteriods: function() {
    this.asteroids = this.game.add.group();
    
    //enable physics in them
    this.asteroids.enableBody = true;
    this.asteroids.physicsBodyType = Phaser.Physics.ARCADE;

    //phaser's random number generator
    var numAsteroids = this.game.rnd.integerInRange(150, 200)
    var asteriod;

    for (var i = 0; i < numAsteroids; i++) {
      //add sprite
      asteriod = this.asteroids.create(this.game.world.randomX, this.game.world.randomY, 'rock');
      asteriod.scale.setTo(this.game.rnd.integerInRange(2, 5)/5);

      //physics properties
      asteriod.body.velocity.x = this.game.rnd.integerInRange(-20, 20);
      asteriod.body.velocity.y = this.game.rnd.integerInRange(-20, 20);
      asteriod.body.immovable = true;
      asteriod.body.collideWorldBounds = true;
    }
  },

  hitAsteroid: function(player, asteroid) {
    //play explosion sound
    this.explosionSound.play();

    //make the player explode
    var emitter = this.game.add.emitter(this.player.x, this.player.y, 100);
    emitter.makeParticles('playerParticle');
    emitter.minParticleSpeed.setTo(-200, -200);
    emitter.maxParticleSpeed.setTo(200, 200);
    emitter.gravity = 0;
    emitter.start(true, 1000, null, 100);
    this.player.destroy();

    this.game.time.events.add(800, this.gameOver, this);
  },
  gameOver: function() {    
    //pass it the score as a parameter 
    this.game.state.start('MainMenu', true, false, this.playerScore);

    alert("Les astéroïdes ont eu raisons de ton vaisseau !");
  },
  collect: function(player, collectable) {
    //play collect sound
    this.collectSound.play();

    //update score
    this.playerScore++;
    this.scoreLabel.text = this.playerScore;

    //remove sprite
    collectable.destroy();
  },
  showLabels: function() {
    //score text
    var text = "0";
    var style = { font: "20px Arial", fill: "#fff", align: "center" };
    this.scoreLabel = this.game.add.text(this.game.width-50, this.game.height - 50, text, style);
    this.scoreLabel.fixedToCamera = true;
  }
};

/*
TODO

-audio
-asteriod bounch
*/