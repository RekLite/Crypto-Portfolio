// Renvoie la fusion de deux tableaux, dépourvue de doublons
function mergeUnique(a1, a2) {
	return [...new Set([...a1, ...a2])];
}

function removeElement(array, elem) {
	var index = array.indexOf(elem);
	if (index > -1) {
		array.splice(index, 1);
	}
}

function changerCouleurAjouter(a) {
	if ((model.config.coins[a].quantityNew < 0) || (isNaN(model.config.coins[a].quantityNew))) {
		return "text-danger";
	} else if (model.config.coins[a].quantityNew > 0) {
		return "text-primary";
	} else {
		return "";
	}
}

function changerCouleurPortfolio(a) {
	if ((model.config.coins[a].quantityNew < 0) || (isNaN(model.config.coins[a].quantityNew))) {
		return "text-danger";
	} else if (model.config.coins[a].quantityNew > 0) {
		return "text-primary";
	} else if (model.config.coins[a].quantityNew == "0") {
		return "text-primary";
	} else {
		return "";
	}
}

function calculTotalAjouter(a, b) {
	if ((model.config.coins[a].quantityNew < 0) || (isNaN(model.config.coins[a].quantityNew))) {
		return "???";
	} else if (model.config.coins[a].quantityNew > 0) {
		const prix = b;
		const total = prix * (model.config.coins[a].quantityNew);
		return parseFloat(total).toFixed(2);
	} else {
		return "0.00";
	}
}

function calculTotalPortfolio(a, b) {
	if ((model.config.coins[a].quantityNew < 0) || (isNaN(model.config.coins[a].quantityNew))) {
		return "???";
	} else if (model.config.coins[a].quantityNew > 0) {
		const prix = b;
		const total = prix * (model.config.coins[a].quantityNew);
		return parseFloat(total).toFixed(2);
	} else if (model.config.coins[a].quantityNew === '') {
		const prix = b;
		const total = prix * (model.config.coins[a].quantity);
		return parseFloat(total).toFixed(2);
	} else {
		return "0.00";
	}
}

function calculTotalCryptosAjouter() {
	let res = 0;
	const length = state.data.coins.nullValueCodes.length;
	for (let i = 0; i < length; i++) {
		const cryptos = state.data.coins.nullValueCodes;
		const prix = state.data.cryptos.list[cryptos[i]].price;
		let aux = calculTotalAjouter(cryptos[i], prix);
		if (isNaN(aux)) {} else if (aux == "0.00") {} else {
			aux = parseFloat(aux);
			res += aux;
		}
	}
	return (res.toFixed(2));
}

function calculTotalCryptosPortfolio() {
	let res = 0;
	const length = state.data.coins.posValueCodes.length;
	for (let i = 0; i < length; i++) {
		const cryptos = state.data.coins.posValueCodes;
		const prix = state.data.cryptos.list[cryptos[i]].price;
		let aux = calculTotalPortfolio(cryptos[i], prix);
		if (isNaN(aux)) {} else if (aux == "0.00") {} else {
			aux = parseFloat(aux);
			res += aux;
		}
	}
	return (res.toFixed(2));
}

function couleurBtnAnnulerAjouter() {
	const crypto = state.data.coins.nullValueCodes;
	const coins = model.config.coins;

	for (let i = 0; i < crypto.length; i++) {
		if (coins[crypto[i]].quantityNew !== "") {
			return true;
		}
	}
	return false;
}

function couleurBtnConfirmerAjouter() {
	const crypto = state.data.coins.nullValueCodes;
	const coins = model.config.coins;

	let cpt = 0;
	let i;

	for (i = 0; i < crypto.length; i++) {
		if (isNaN(coins[crypto[i]].quantityNew)) {
			return 'disabled';
		}
		if (coins[crypto[i]].quantityNew < 0) {
			return 'disabled';
		}
		if (coins[crypto[i]].quantityNew == '') {
			cpt++;
		}
	}
	if (cpt == i) {
		return 'disabled';
	}
	return 'btn-primary';
}

function couleurBtnAnnulerPortfolio() {
	const crypto = state.data.coins.posValueCodes;
	const coins = model.config.coins;

	for (let i = 0; i < crypto.length; i++) {
		if (coins[crypto[i]].quantityNew !== "") {
			return true;
		}
	}
	return false;
}

function couleurBtnConfirmerPortfolio() {
	const crypto = state.data.coins.posValueCodes;
	const coins = model.config.coins;

	let cpt = 0;
	let i;

	for (i = 0; i < crypto.length; i++) {
		if (isNaN(coins[crypto[i]].quantityNew)) {
			return 'disabled';
		}
		if (coins[crypto[i]].quantityNew < 0) {
			return 'disabled';
		}
		if (coins[crypto[i]].quantityNew == '') {
			cpt++;
		}
	}
	if (cpt == i) {
		return 'disabled';
	}
	return 'btn-primary';
}