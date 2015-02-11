"Use strict;"
var app = app || {};

app.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

app.game.state.add('Boot', app.Boot);
app.game.state.add('Preload', app.Preload);
app.game.state.add('MainMenu', app.MainMenu);
app.game.state.add('Game', app.Game);

app.game.state.start('Boot');