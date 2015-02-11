var app = app || {};

//title screen
app.MainMenu = function(){};

app.MainMenu.prototype = {
  init: function(score) {
    var score = score || 0;
    this.highestScore = this.highestScore || 0;
    this.highestScore = Math.max(score, this.highestScore);
   },
  create: function() {
  	//show the space tile, repeated
    this.background = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'space2');
    
    //give it speed in x
    //this.background.autoScroll(-20, 0);

    //start game text
    var text = "Space-Battle";
    var style = { font: "100px Arial", fill: "#fff" };
    var i = this.game.add.text(this.game.width/2, this.game.height/2 - 75, text, style);
    i.anchor.set(0.5);

    var text = "Click or Enter";
    var style = { font: "30px Arial", fill: "#fff" };
    var t = this.game.add.text(this.game.width/2, this.game.height/2, text, style);
    t.anchor.set(0.5);

    //highest score
    text = "Pièces Récupérées: "+this.highestScore;
    style = { font: "15px Arial", fill: "#fff", align: "center" };
    var h = this.game.add.text(this.game.width/2, this.game.height/2 + 50, text, style);
    h.anchor.set(0.5);
  },
  update: function() {
    if(this.game.input.activePointer.justPressed() || this.game.input.keyboard.isDown(Phaser.Keyboard.ENTER)) {
      this.game.state.start('Game');
    }
  }
};