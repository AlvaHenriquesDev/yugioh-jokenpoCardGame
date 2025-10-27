const state = {
	score: {
		playerScore: 0,
		computerScore: 0,
		scoreBox: document.getElementById('score_points')
	},
	cardSprites: {
		avatar: document.getElementById('card-image'),
		name: document.getElementById('card-name'),
		type: document.getElementById('card-type'),
	},
	fieldCards: {
		player: document.getElementById('player-field-card'),
		computer: document.getElementById('computer-field-card')
	},
	playerSides: {
		player: "player-cards",
		playerBox: document.querySelector("#player-cards"),
		computer: "computer-cards",
		computerBox: document.querySelector("#computer-cards"),
},
	button: document.getElementById('next-duel')
}

const pathImages = "./src/assets/icons/"

const cardData = [
	{
		id: 0,
		name: "D. Branco de Olhos Azuis",
		type: "Papél",
		img: `${pathImages}dragon.png`,
		WinOf: [1],
		LoseOf: [2]
	},
	{
		id: 1,
		name: "Mago Negro>",
		type: "Pedra",
		img: `${pathImages}magician.png`,
		WinOf: [2],
		LoseOf: [0]
	},
	{
		id: 2,
		name: "Exódia",
		type: "Tesoura",
		img: `${pathImages}exodia.png`,
		WinOf: [0],
		LoseOf: [1]
	},
]

async function getRandomCardId(){
	const randomIndex = Math.floor(Math.random() * cardData.length)
	return cardData[randomIndex].id
}
async function createCardImage(IdCard, fieldSide){
	const cardImage = document.createElement("img")
	cardImage.setAttribute('height', "100px")
	cardImage.setAttribute('src', "./src/assets/icons/card-back.png")
	cardImage.setAttribute("data-id", IdCard)
	cardImage.classList.add("card")

	if(fieldSide === state.playerSides.player){
		cardImage.addEventListener("mouseover", () => {
		drawSelectedCard(IdCard)
		})

		cardImage.addEventListener('click', () => {
			setCardsField(cardImage.getAttribute("data-id"))
		})
	}

	return cardImage
}
async function checkduelResults(playerCardId, computerCardId) {
  let duelResults = "Empate";
  let playerCard = cardData[playerCardId];

  if (playerCard.WinOf.includes(computerCardId)) {
    duelResults = "Ganhou";
	await playAudio(duelResults)
    state.score.playerScore++;
  } else if (playerCard.LoseOf.includes(computerCardId)) {
    duelResults = "Perdeu";
	await playAudio(duelResults)
    state.score.computerScore++;
  }
  return duelResults;
}
async function hiddenCardDetails(){
	state.cardSprites.avatar.src = ""
	state.cardSprites.name.innerText = "Escolha"
	state.cardSprites.type.innerText = "Novamente"
}
async function setCardsField(cardId) {
	await removeAllCardsImages()

	let computerCardId = await getRandomCardId()

	await hiddenCardDetails()
	await showHideCardFieldsImages("true")
	await drawCardInField(cardId, computerCardId)

	let duelResults = await checkduelResults(cardId, computerCardId)

	await updateScore()
	await drawButton(duelResults)
}
async function drawCardInField(cardId, computerCardId) {
	state.fieldCards.player.src = cardData[cardId].img
	state.fieldCards.computer.src = cardData[computerCardId].img
}
async function showHideCardFieldsImages(value) {
	if(value === "true"){
		state.fieldCards.player.style.display = "block"
		state.fieldCards.computer.style.display = "block"
	}

	if(value === "false"){
		state.fieldCards.player.style.display = "none"
		state.fieldCards.computer.style.display = "none"
	}
}
async function updateScore() {
	state.score.scoreBox.innerText = `Vitórias: ${state.score.playerScore}
	Derrotas: ${state.score.computerScore}`
}
async function drawButton(text) {
	state.button.innerText = text
	state.button.style.display = "block"
}
async function resetDuel() {
	state.cardSprites.avatar.src = ""
	state.button.style.display = "none"
	init()
}
async function playAudio(status) {
	const audio = new Audio(`./src/assets/audios/${status}.wav`);
	audio.play()
}
async function removeAllCardsImages() {
	let { computerBox, playerBox} = state.playerSides;
	let imgelements = computerBox.querySelectorAll("img");
	imgelements.forEach((img) => img.remove());

	imgelements = playerBox.querySelectorAll("img");
	imgelements.forEach((img) => img.remove())
}
async function drawSelectedCard(index) {
	state.cardSprites.avatar.src = cardData[index].img
	state.cardSprites.name.innerText = cardData[index].name
	state.cardSprites.type.innerText = "Atributo: "+ cardData[index].type
}
async function drawCards(cardNumbers, fieldSide) {
	for (i = 0; i <= cardNumbers; i++) {
		const randomIdCard = await getRandomCardId()
		const cardImage = await createCardImage(randomIdCard, fieldSide)

		document.getElementById(fieldSide).appendChild(cardImage)

	}
}
function init() {

	showHideCardFieldsImages("false")

	drawCards(8, state.playerSides.player);
	drawCards(9, state.playerSides.computer);

	const bgm = document.getElementById('bgm');
	bgm.volume = 0.2;
	bgm.play();
}

init()