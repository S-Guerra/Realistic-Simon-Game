// key elements
const sounds = [
	"https://cdn.freecodecamp.org/curriculum/take-home-projects/simonSound1.mp3",
	"https://cdn.freecodecamp.org/curriculum/take-home-projects/simonSound2.mp3",
	"https://cdn.freecodecamp.org/curriculum/take-home-projects/simonSound3.mp3",
	"https://cdn.freecodecamp.org/curriculum/take-home-projects/simonSound4.mp3"
];
const flashingDuration = 1700;
const display = document.querySelector("output");
const displayText = document.querySelector("output span");
const strictIndicator = document.querySelector(".strict.indicator");
const tiles = document.querySelectorAll(".tile");

// global game variables
let isOn = false;
let isStrict = false;
let tileList = [];
let count = 0;
let playing = false;
let waitingForInput = false;
let playerInput = [];

// audio setup
sounds.forEach((url, index) => (sounds[index] = new Audio(url)));

// Simon® settings
const toggleOnOff = () => {
	isOn = !isOn;

	if (isOn) {
		display.classList.add("active");
	} else {
		display.classList.remove("active");
		reset();
		isStrict = false;
		strictIndicator.classList.remove("active");
	}
};

const toggleStrict = () => {
	if (!playing && isOn) {
		isStrict = !isStrict;
		strictIndicator.classList.toggle("active");
	}
};

// game mechanics
const game = () => {
	if (!isOn) return;

	flash("--");

	if (!playing) {
		playing = true;
	} else {
		setTimeout(() => reset(), flashingDuration);
	}
	setTimeout(() => newTurn(), flashingDuration);
};

const newTurn = (wasLastValid) => {
	setTimeout(() => {
		if (count === 20) win();

		displayText.innerText = count < 10 ? `0${count}` : count;
		// random new tile
		if (wasLastValid || count === 0) {
			count++;
			displayText.innerText = count < 10 ? `0${count}` : count;
			let newTileID = `${Math.floor(Math.random() * 4)}`;
			tileList.push(newTileID);
		}

		// display tile order
		tileList.forEach((id, index) => {
			setTimeout(() => {
				playTiles(id);
			}, index * 1000);
		});

		// player input
		waitingForInput = true;
		playerInput = [];
	}, 1000);
};

const playTiles = (tileID) => {
	const tile = document.getElementById(tileID);

	tile.classList.add("active");
	sounds[tileID].currentTime = 0;
	sounds[tileID].play();
	setTimeout(() => {
		tile.classList.remove("active");
		sounds[tileID].pause();
		sounds[tileID].currentTime = 0;
	}, 600);
};

const validInput = () =>
	playerInput.every((value, index) => value === tileList[index]);

const input = (id) => {
	if (!isOn || !playing || !waitingForInput) return;

	const tile = document.getElementById(id);
	tile.addEventListener("mouseup", () => tile.classList.remove("active"));

	if (waitingForInput && playerInput < tileList) {
		tile.classList.add("active");
		sounds[id].pause();
		sounds[id].currentTime = 0;
		sounds[id].play();
		playerInput.push(id);
	}

	if (!validInput()) {
		invalidateTurn();
	} else if (playerInput.length === tileList.length && validInput()) {
		waitingForInput = false;
		newTurn((wasLastValid = true));
	}
};

const invalidateTurn = () => {
	waitingForInput = false;
	flash("!!");
	setTimeout(() => {
		if (isStrict) {
			reset();
		} else {
			newTurn((wasLastValid = false));
		}
	}, flashingDuration);
};

const reset = () => {
	for (let tile of tiles) {
		tile.classList.remove("active");
	}
	tileList = [];
	count = 0;
	playing = false;
	waitingForInput = false;
	playerInput = [];
	displayText.innerText = "--";
};

const win = () => {
	flash("**");
	setTimeout(() => reset(), flashingDuration);
};

const flash = (charToFlash) => {
	displayText.innerText = charToFlash;
	displayText.classList.add("flashing");
	setTimeout(() => displayText.classList.remove("flashing"), flashingDuration);
};
