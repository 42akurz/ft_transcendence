<template>
<div>
	<div class="wrapper">
		<div class="score">
			<div>{{score.left}}</div>
			<div>{{score.right}}</div>
		</div>
		<div class="login">
			<button v-if="!gameState.gameStarted" @click="startGame" class="normal-text">Start Game</button>
			<button v-if="!gameState.gameStarted && !gameState.gameSpecial" @click="gameSpecialOn" class="normal-text">Specials</button>
			<button v-if="!gameState.gameStarted && gameState.gameSpecial" @click="gameSpecialOFF" class="green-text">Specials</button>
		</div>
		<canvas width="750" height="585" id="game"></canvas>
		<div v-if="gameState.gamePaused || gameState.gameOver" class="pauseMenu">
			<h2 v-if="this.score.left >= this.score.limit">PLAYER 1</h2>
			<h2 v-else-if="this.score.right >= this.score.limit">PLAYER 2</h2>
			<h2 v-else>Game Paused</h2>
			<h2 v-if="gameState.gameOver">WON</h2>
			<button v-if="gameState.gamePaused" @click="pauseGame">{{pauseText}}</button>
			<button @click="restartGame">Restart</button>
			<button @click="exitGame">Exit</button>
		</div>
	</div>
</div>
</template>

<script>
export default {
	name: 'GameTesting',

	data() {
		return {
			canvas:  null,
			context: null,
			grid: 0,
			paddleHeight: 0,
			maxPaddleY: 0,

			paddleSpeed: 10,
			ballSpeed: 5,

			wallColor: 'black',
			backgroundColor: '#EFEFEF', //--grey

			requestFrameID: 0,
			actionIntervalID: 0,

			gameState: {
				gamePaused: false,
				gameOver: false,
				gameStarted: false,
				gameSpecial: false,
			},

			leftPaddle: {
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				velocity: 0,
				color: 'black',
			},

			rightPaddle: {
				x: 0,
				y: 0,
				width: 0,
				height: 0,
				velocity: 0,
				color: 'black',
			},

			ball: {
				x: 0,
				y: 0,
				width: 0,
				height: 0,

				resetting: false,
				velocityY: 0,
				velocityX: 0,
				color: '#185ADB', //--blue-light
			},

			score: {
				limit: 5,
				left: 0,
				right: 0,
			},
		}
	},

	methods: {
		/* START MOVEMENT AND INTERACTIVES */
		drawPaddle(x, y, width, height, color) {
			this.context.fillStyle = color;
			this.context.fillRect(x, y, width, height);
			this.context.fillRect(x, y, width, height);
		},

		drawBall(x, y, radius, color) {
			this.context.fillStyle = color;
			this.context.strokeStyle = color;
			this.context.arc(x + radius, y + radius, radius, 0, 2 * Math.PI);
			this.context.fill();
			this.context.beginPath();
			this.context.stroke();
		},

		drawBackground(width, height, color) {
			this.context.fillStyle = color;
			this.context.fillRect(0, 0, width, width);
		},

		drawWalls(width, height, color) {
			this.context.fillStyle = color;
			this.context.fillRect(0, 0, width, this.grid);
			this.context.fillRect(0, height - this.grid, width, height);
		},

		movePedals() {
			// move paddles by their velocity
			this.leftPaddle.y += this.leftPaddle.velocity;
			this.rightPaddle.y += this.rightPaddle.velocity;

			// prevent paddles from going through walls
			if (this.leftPaddle.y < this.grid) {
				this.leftPaddle.y = this.grid;
			}
			else if (this.leftPaddle.y > this.maxPaddleY) {
				this.leftPaddle.y = this.maxPaddleY;
			}

			if (this.rightPaddle.y < this.grid) {
				this.rightPaddle.y = this.grid;
			}
			else if (this.rightPaddle.y > this.maxPaddleY) {
				this.rightPaddle.y = this.maxPaddleY;
			}
		},

		moveBall() {
			// move ball by its velocity with an increasing speed
			this.ball.x += (this.ball.velocityX *= 1.0008);
			this.ball.y += (this.ball.velocityY *= 1.0008);

			// prevent ball from going through walls by changing its velocity
			if (this.ball.y < this.grid) {
				this.ball.y = this.grid;
				this.ball.velocityY *= -1;
			}
			else if (this.ball.y + this.grid > this.canvas.height - this.grid) {
				this.ball.y = this.canvas.height - this.grid * 2;
				this.ball.velocityY *= -1;
			}
		},

		changeBallSpeed(x = 5) {
			// changes the ball speed, x = 5 is the default speed
			if (this.ball.velocityX < 0)
				this.ball.velocityX = -x;
			else
				this.ball.velocityX = x;
			
			if (this.ball.velocityY < 0)
				this.ball.velocityY = -x;
			else
				this.ball.velocityY = x;
		},

		changePedalSize(pedalHeight, incDec) {
			switch (incDec) {
				case 'increase':
					// only change pedal size if its not biggest size already
					if (pedalHeight == 37.5 || pedalHeight == 75) {
						// change pedal height
						this.leftPaddle.height *= 2;
						this.rightPaddle.height *= 2;
						// change pedal position if it collides with wall
						if (pedalHeight == 75)
							this.maxPaddleY = this.canvas.height - this.grid - this.paddleHeight * 2;
						else
							this.maxPaddleY = this.canvas.height - this.grid - this.paddleHeight;
					}
					break;
				case 'decrease':
					// only change pedal size if its not smallest size already
					if (pedalHeight == 75 || pedalHeight == 150) {
						// change pedal height
						this.leftPaddle.height /= 2;
						this.rightPaddle.height /= 2;
						// change pedal position if it collides with wall
						if (pedalHeight == 75)
							this.maxPaddleY = this.canvas.height - this.grid - this.paddleHeight / 2;
						else
							this.maxPaddleY = this.canvas.height - this.grid - this.paddleHeight;
					}
					break;
			}
		},

		// check for collision between two objects using axis-aligned bounding box (AABB)
		// @see https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
		collides(obj1, obj2) {
			return obj1.x < obj2.x + obj2.width &&
					obj1.x + obj1.width > obj2.x &&
					obj1.y < obj2.y + obj2.height &&
					obj1.y + obj1.height > obj2.y;
		},

		ballCollision() {
			// check to see if ball collides with paddle. if they do change x velocity
			if (this.collides(this.ball, this.leftPaddle)) {
				this.ball.velocityX *= -1;

				// move ball next to the paddle otherwise the collision will happen again
				// in the next frame
				this.ball.x = this.leftPaddle.x + this.leftPaddle.width;
			}
			else if (this.collides(this.ball, this.rightPaddle)) {
				this.ball.velocityX *= -1;

				// move ball next to the paddle otherwise the collision will happen again
				// in the next frame
				this.ball.x = this.rightPaddle.x - this.ball.width;
			}
		},

		resetBall() {
			// reset ball if it goes past paddle (but only if we haven't already done so)
			if ((this.ball.x < 0 || this.ball.x > this.canvas.width) && !this.ball.resetting) {
				this.ball.resetting = true;

				// increase score counter after goal
				if (this.ball.x < 0)
					this.score.right++;
				if (this.ball.x > this.canvas.width)
					this.score.left++;

				// one player won the game
				if (this.score.left >= this.score.limit
					|| this.score.right >= this.score.limit) {
					this.gameState.gameOver = true;
					this.endGame();
				}

				// resets ball speed after each goal
				this.changeBallSpeed(5);

				// give some time for the player to recover before launching the ball again
				setTimeout(() => {
					this.ball.resetting = false;
					// reset ball to center of screen
					this.ball.x = this.canvas.width / 2;
					this.ball.y = this.canvas.height / 2;
					// make ball go to player that scored last goal
					this.ball.velocityY *= (-1);
					this.ball.velocityX *= (-1);
					// reset pedals to center of screen
					// this.initPedals(); 
				}, 500);
			}
		},
		/* END MOVEMENT AND INTERACTIVES */



		/* START UTILS */
		reloadWindow() {
			location.reload();
		},

		goPageBack() {
			window.history.go(-1);
		},

		randomNumberBetween(min, max) {
			return (Math.floor((Math.random() * (max - min) + min)));
		},
		/* END UTILS */



		/* START RANDOM ACTIONS */
		reversePedal() {
			if (this.paddleSpeed > 0)
				this.paddleSpeed *= -1;
			this.leftPaddle.color = 'red';
			this.rightPaddle.color = 'red';
		},

		resetPedalSpeed() {
			if (this.paddleSpeed == 14)
				this.paddleSpeed = 10;
			if (this.paddleSpeed < 0)
				this.paddleSpeed *= -1;
		},

		increasePedalSpeed() {
			this.paddleSpeed = 14;
			this.leftPaddle.color = 'black';
			this.rightPaddle.color = 'black';
		},

		backgroundGrey() {
			this.backgroundColor = '#EFEFEF'; //--grey
			this.ball.color = '#185ADB'; //--blue-light
			this.leftPaddle.color = 'black';
			this.rightPaddle.color = 'black';
		},
	
		backgroundBlue() {
			this.backgroundColor = '#185ADB'; //--blue-light
			this.ball.color = '#186ADB'; // very similar to *--blue-light*
			this.leftPaddle.color = '#186ADB';
			this.rightPaddle.color = '#186ADB';
		},

		backgroundOrange() {
			this.backgroundColor = '#FFC947'; //--orange
			this.ball.color = '#185ADB'; //--blue-light
			this.leftPaddle.color = 'black';
			this.rightPaddle.color = 'black';
		},

		randomActions() {
			switch(this.randomNumberBetween(1, 10)) {
				case 1:
					this.changePedalSize(this.leftPaddle.height, "increase");
					break ;
				case 2:
					this.changePedalSize(this.leftPaddle.height, "decrease");
					break ;
				case 3:
					this.changeBallSpeed(2.5);
					break ;
				case 4:
					this.changeBallSpeed(10);
					break ;
				case 5:
					this.reversePedal();
					break ;
				case 6:
					this.increasePedalSpeed();
					break ;
				case 7:
					this.resetPedalSpeed();
					this.backgroundGrey();
					break ;
				case 8:
					this.resetPedalSpeed();
					this.backgroundBlue();
					break ;
				case 9:
					this.resetPedalSpeed();
					this.backgroundOrange();
					break ;
			}
		},

		startActionInterval() {
			this.actionIntervalID = setInterval(() => {
				this.randomActions();
			}, 7000);
		},
		/* END RANDOM ACTIONS */



		/* START MAIN LOOP */
		gameLoop() {
			this.requestFrameID = requestAnimationFrame(this.gameLoop);
			if (!this.gameState.gamePaused && !this.gameState.gameOver) {

				this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

				//draw wall
				this.drawBackground(this.canvas.width, this.canvas.height, this.backgroundColor);

				// move pedals
				this.movePedals();

				// draw paddles
				this.drawPaddle(this.leftPaddle.x, this.leftPaddle.y, this.leftPaddle.width, this.leftPaddle.height, this.leftPaddle.color);
				this.drawPaddle(this.rightPaddle.x, this.rightPaddle.y, this.rightPaddle.width, this.rightPaddle.height, this.rightPaddle.color);

				// move ball
				this.moveBall();

				// reset ball, after goal
				this.resetBall();

				// check for ball collisions
				this.ballCollision();

				// draw ball
				this.drawBall(this.ball.x, this.ball.y, this.ball.width / 2, this.ball.color);

				//draw wall
				this.drawWalls(this.canvas.width, this.canvas.height, this.wallColor);
			}
		},
		/* END MAIN LOOP */



		/* START GAME STATES */
		startGame() {
			console.log('startGame');

			// reset data -> colors, scores, speeds, etc.
			this.resetBaseValues();

			// init positions and coordinates
			this.init();

			if (this.gameState.gameSpecial) {
				this.backgroundColor = '#FFC947';
				this.startActionInterval();
			}

			// run game loop
			this.runGameLoop();
		},

		gameSpecialOn() {
			this.gameState.gameSpecial = true;
		},

		gameSpecialOFF() {
			this.gameState.gameSpecial = false;
		},

		runGameLoop() {
			console.log('runGameLoop');
			this.gameState.gameStarted = true;

			// start game loop
			this.requestFrameID = requestAnimationFrame(this.gameLoop);
		},

		pauseGame() {
			console.log('pauseGame');

			// set paused state to opposite
			this.gameState.gamePaused = !this.gameState.gamePaused;

			// if game is paused, stop action interval to prevent it from running in background
			// else start a new action interval
			if (this.gameState.gameSpecial) {
				if (this.gameState.gamePaused)
					clearInterval(this.actionIntervalID);
				else
					this.startActionInterval();
			}
		},

		restartGame() {
			console.log('restartGame');

			// stop game loop and action interval from running
			this.endGame();
			this.startGame();
		},

		endGame() {
			console.log('endGame');

			// stop game loop from running
			window.cancelAnimationFrame(this.requestFrameID);

			// stop the random action interval
			clearInterval(this.actionIntervalID);
		},

		exitGame() {
			console.log('exitGame');

			// go page back -> unmounted gets called
			this.goPageBack();
		},
		/* END GAME STATES */



		/* START INITIALIZERS */
		resetBaseValues() {
			this.gameState.gameOver = false;
			this.gameState.gamePaused = false;
			this.gameState.gameStarted = false; //might cause issue
			this.paddleSpeed = 7;
			this.ballSpeed = 5;

			this.score.limit = 5;
			this.score.left = 0;
			this.score.right = 0;

			this.ball.color = '#185ADB';

			this.leftPaddle.color = 'black';
			this.rightPaddle.color = 'black';
			this.wallColor = 'black';
			this.backgroundColor = '#EFEFEF';
		},

		initCanvas() {
			this.canvas = document.getElementById('game');
			this.context = this.canvas.getContext('2d');
			this.grid = 15;
			this.paddleHeight = this.grid * 5;
			this.maxPaddleY = this.canvas.height - this.grid - this.paddleHeight;
		},

		initPedals() {
			// start in the middle of the game on the left side
			this.leftPaddle.x = this.grid * 2;
			this.leftPaddle.y = this.canvas.height / 2 - this.paddleHeight / 2;
			this.leftPaddle.width = this.grid;
			this.leftPaddle.height = this.paddleHeight;
			// paddle velocity
			this.leftPaddle.velocity = 0;


			// start in the middle of the game on the right side
			this.rightPaddle.x = this.canvas.width - this.grid * 3;
			this.rightPaddle.y = this.canvas.height / 2 - this.paddleHeight / 2;
			this.rightPaddle.width = this.grid;
			this.rightPaddle.height = this.paddleHeight;
			// paddle velocity
			this.rightPaddle.velocity = 0;
		},

		initBall() {
			// start in the middle of the game
			this.ball.x = this.canvas.width / 2;
			this.ball.y = this.canvas.height / 2;
			this.ball.width = this.grid;
			this.ball.height = this.grid;

			// keep track of when need to reset the ball position
			this.ball.resetting = false;

			// ball velocity (start going to the top-right corner)
			this.ball.velocityX = this.ballSpeed;
			this.ball.velocityY = -this.ballSpeed;
		},

		init() {
			this.initCanvas();
			this.initPedals();
			this.initBall();
		},
		/* END INITIALIZERS */
	},

	computed: {
		pauseText() {
			if (this.gameState.gamePaused)
				return 'Continue';
			return 'Pause';
		}
	},

	// user leaves page
	unmounted() {
		console.log('unmounted');

		// end game loop and interval loop
		this.endGame();
	},

	created() {
		console.log('created');
		// listen to keyboard events to move the paddles, pause the game and to use cheats
		document.addEventListener('keydown', (e) => {
			switch (e.key) {
				case 'ArrowUp':
					this.rightPaddle.velocity = -this.paddleSpeed;
					break;
				case 'ArrowDown':
					this.rightPaddle.velocity = this.paddleSpeed;
					break;
				case 'w':
					this.leftPaddle.velocity = -this.paddleSpeed;
					break;
				case 's':
					this.leftPaddle.velocity = this.paddleSpeed;
					break;
				case 'p':
					if (this.gameState.gameStarted === true && this.gameState.gameOver === false)
						this.pauseGame();
					break;
				case 'c':
					if (this.gameState.gamePaused === true && this.gameState.gameStarted === true && this.gameState.gameOver === false)
						this.pauseGame();
					break;
				case 'Escape':
					if (this.gameState.gameStarted === true && this.gameState.gameOver === false)
						this.pauseGame();
					break;
				case '1':
					this.changePedalSize(this.leftPaddle.height, "increase");
					break;
				case '2':
					this.changePedalSize(this.leftPaddle.height, "decrease");
					break;
				case 'z':
					this.score.left++;
					break;
				case '.':
					this.score.right++;
					break;
			}
		});

		// listen to keyboard events to stop the paddle if key is released
		document.addEventListener('keyup', (e) => {
			switch (e.key) {
				case 'ArrowUp':
					this.rightPaddle.velocity = 0;
					break;
				case 'ArrowDown':
					this.rightPaddle.velocity = 0;
					break;
				case 'w':
					this.leftPaddle.velocity = 0;
					break;
				case 's':
					this.leftPaddle.velocity = 0;
					break;
			}
		});
	},
}
</script>

<style scoped>
	/* * {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	} */

	.wrapper {
		margin: 0;
	}

	.wrapper .buttons {
		display: flex;
		flex-direction: column;
		margin: 0 auto;
		gap: 20px;
		width: 100px;
	}

	h2 {
		color: var(--black);
		letter-spacing: 2px;
	}

	.score {
		display: flex;
		justify-content: center;
		font-weight: bold;
		font-size: 7vh;
	}

	/* syntax to select all childs of score  */
	.score > * {
		/* each flexbox element gets half of screen  */
		flex-grow: 1;
		flex-basis: 0;

		padding: 0 2vh;
		margin: 1vh 0;
	}

	.score > :first-child {
		text-align: right;
	}

	.score > :nth-child(2) {
		text-align: left;
	}

	.pauseMenu {
		/* center pause menu in scrren */
		position: absolute;
		top: 37%;
		left: 50%;
		transform: translate(-50%, -50%);

		width: 250px;
		height: 250px;

		background-color: var(--blue-light);
		border: 5px solid var(--black);
		border-radius: 60px;

		/* center elements inside pause menu */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.pauseMenu button {
		width: 100px;
		height: 30px;
		cursor: pointer;
		margin: 10px;
		border: 2px solid var(--blue-dark);
		background-color: var(--orange);
		color: var(--blue-dark);
		border-radius: 25px;
	}

	.green-text {
		color: green;
	}

	.normal-text {
		color: var(--blue-dark);
	}
</style>
