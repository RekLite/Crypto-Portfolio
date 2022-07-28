//-------------------------------------------------------------------- Model ---
// Unique source de vérité de l'application
//
model = {

  config: {},
  data: {},
  ui: {},

  // Demande au modèle de se mettre à jour en fonction des données qu'on
  // lui présente.
  // l'argument data est un objet confectionné dans les actions.
  // Les propriétés de data apportent les modifications à faire sur le modèle.
  samPresent(data) {

    switch (data.do) {

      case 'init': {
        Object.assign(this, data.config);
        const conf = this.config;
        conf.targets.list = mergeUnique([conf.targets.wished], conf.targets.list).sort();
        const isOnline = conf.dataMode == 'online';
        conf.targets.active = isOnline ? conf.targets.wished : this.data.offline.live.target;
        this.hasChanged.currencies = true;
        if (conf.debug) console.log('model.samPresent - init - targets.list  : ', conf.targets.list);
        if (conf.debug) console.log('model.samPresent - init - targets.active: ', conf.targets.active);
      }
      break;

    case 'updateCurrenciesData': {
      this.data.online = data.currenciesData;
      this.config.targets.active = data.currenciesData.live.target;
      this.hasChanged.currencies = true;
    }
    break;

    case 'changeDataMode': {
      this.config.dataMode = data.dataMode;
      if (data.dataMode == 'offline') {
        this.config.targets.active = this.data.offline.live.target;
        this.hasChanged.currencies = true;
      }
    }
    break;

    case 'changeTab': {
      switch (data.tab) {
        case 'currenciesCryptos':
          this.ui.currenciesCard.selectedTab = 'cryptos';
          break;
        case 'currenciesFiats':
          this.ui.currenciesCard.selectedTab = 'fiats';
          break;
        case 'walletPortfolio':
          this.ui.walletCard.selectedTab = 'portfolio';
          break;
        case 'walletAjouter':
          this.ui.walletCard.selectedTab = 'ajouter';
          break;
        default:
      }
    }
    break;

    case 'filterFiatUpdate': {
      this.hasChanged.fiats.filter = true;
      this.ui.currenciesCard.tabs.fiats.filters.text = data.filterFiatUpdate;
      this.ui.currenciesCard.tabs.fiats.pagination.currentPage = 1;
    }
    break;

    case 'filterCryptoUpdate': {
      this.hasChanged.cryptos.filter = true;
      this.ui.currenciesCard.tabs.cryptos.filters.text = data.filterCryptoUpdate;
      this.ui.currenciesCard.tabs.cryptos.pagination.currentPage = 1;;
    }
    break;

    case 'filterPriceUpdate': {
      this.hasChanged.cryptos.filter = true;
      this.ui.currenciesCard.tabs.cryptos.filters.price = data.filterPriceUpdate;
      this.ui.currenciesCard.tabs.cryptos.pagination.currentPage = 1;;
    }
    break;

    case 'triCryptos': {
      const idColumn = data.triCryptos;
      this.ui.currenciesCard.tabs.cryptos.sort.column = idColumn;
      this.hasChanged.cryptos.sort = true;
      this.hasChanged.cryptos.pagination = true;
    }
    break;

    case 'triFiats': {
      const idColumn = data.triFiats;
      this.ui.currenciesCard.tabs.fiats.sort.column = idColumn;
      this.hasChanged.fiats.sort = true;
      this.hasChanged.fiats.pagination = true;
    }
    break;

    case 'listCoin': {
      const elementId = data.listCoin.elementId;
      const elementClass = data.listCoin.elementClass;
      const elementIdObj = data.listCoin.elementIdObj;

      const favorisObj = this.config.coins;
      const favorisTab = Object.keys(this.config.coins);

      if (elementClass == "bg-succes text-light") {
        return 0;
      } else if (favorisTab.includes(elementId) && favorisObj[elementId].quantityNew !== "") {
        return 0;
      } else {
        if (favorisTab.includes(elementId)) {
          delete favorisObj[elementId];
        } else {
          favorisObj[elementId] = elementIdObj;
        }
      }

      //this.config.coins = favorisObj;
      this.hasChanged.coins = true;
    }
    break;

    case 'listFiat': {
      const elementId = data.listFiat.elementId;
      const elementClass = data.listFiat.elementClass;

      const tableauFavorisVert = this.config.targets.active;
      const tableauFavorisOrange = this.config.targets.list;

      if (elementClass == "bg-succes text-light") {
        return 0;
      } else {
        if (tableauFavorisOrange.includes(elementId)) {
          removeElement(tableauFavorisOrange, elementId);
        } else {
          tableauFavorisOrange.push(elementId);
        }
      }

      this.config.targets.list = tableauFavorisOrange;
    }
    break;

    case 'addNewValueAjouter': {
      const elementId = data.addNewValueAjouter.elementId;
      const elementValue = data.addNewValueAjouter.elementValue;
      this.config.coins[elementId].quantityNew = elementValue;
    }
    break;

    case 'addNewValuePortfolio': {
      const elementId = data.addNewValuePortfolio.elementId;
      const elementValue = data.addNewValuePortfolio.elementValue;
      this.config.coins[elementId].quantityNew = elementValue;
    }
    break;

    case 'btnAnnulerAjouter': {
      const cryptosOrange = state.data.coins.nullValueCodes;
      for (let i = 0; i < cryptosOrange.length; i++) {
        this.config.coins[cryptosOrange[i]].quantityNew = '';
      }
    }
    break;

    case 'btnConfirmerAjouter': {
      const cryptosOrange = state.data.coins.nullValueCodes;
      const cryptosFavoris = state.data.coins.posValueCodes;
      const coins = this.config.coins;
      for (let i = 0; i < cryptosOrange.length; i++) {
        if (coins[cryptosOrange[i]].quantityNew >= 0) {
          this.config.coins[cryptosOrange[i]].quantity = coins[cryptosOrange[i]].quantityNew;
        }
      }
      this.hasChanged.coins = true;
    }
    break;

    case 'btnAnnulerPortfolio': {
      const cryptosVert = state.data.coins.posValueCodes;
      for (let i = 0; i < cryptosVert.length; i++) {
        this.config.coins[cryptosVert[i]].quantityNew = '';
      }
    }
    break;

    case 'btnConfirmerPortfolio': {
      const cryptosOrange = state.data.coins.nullValueCodes;
      const cryptosFavoris = state.data.coins.posValueCodes;
      const coins = this.config.coins;
      for (let i = 0; i < cryptosFavoris.length; i++) {
        if (coins[cryptosFavoris[i]].quantityNew !== '') {
          coins[cryptosFavoris[i]].quantity = coins[cryptosFavoris[i]].quantityNew;
          coins[cryptosFavoris[i]].quantityNew = '';
        }
      }
      this.hasChanged.coins = true;
    }
    break;

    case 'changeRowsPerPage': {
      value = data.changeRowsPerPage.value;
      currency = data.changeRowsPerPage.currency;
      const nbPages = this.ui.currenciesCard.tabs[currency].pagination;
      nbPages.rowsPerPageIndex = value;
      this.hasChanged[currency].pagination = true;
    }
    break;

    case 'changePage': {
      index = data.changePage.index;
      currency = data.changePage.currency;
      const page = this.ui.currenciesCard.tabs[currency].pagination;
      page.currentPage = data.index;
      this.hasChanged[currency].pagination = true;
    }
    break;

    default:
      console.error(`model.samPresent(), unknown do: '${data.do}' `);
    }
    // Demande à l'état de l'application de prendre en compte la modification
    // du modèle
    state.samUpdate(this);
  }
};