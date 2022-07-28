//------------------------------------------------------------------ Actions ---
// Actions appelées dans le code HTML quand des événements surviennent
//
actions = {

  //------------------------------- Initialisation et chargement des données ---

  async initAndGo(initialConfig) {
    console.log('initAndGo: ', initialConfig);

    if (initialConfig.config.dataMode == 'online') {
      const params = {
        target: initialConfig.config.targets.wished,
        debug: initialConfig.config.debug,
      };
      let coinlayerData = await coinlayerRequest(params);
      if (coinlayerData.success) {
        initialConfig.data.online = coinlayerData;
      } else {
        console.log('initAndGo: Données en ligne indisponibles');
        console.log('initAndGo: BASCULEMENT EN MODE HORS-LIGNE');
        initialConfig.config.dataMode = 'offline';
      }
    }
    model.samPresent({
      do: 'init',
      config: initialConfig
    });
  },

  reinit(data) {
    const initialConfigName = data.e.target.value;
    configsSelected = initialConfigName;
    actions.initAndGo(configs[initialConfigName]);
  },

  async updateOnlineCurrenciesData(data) {
    const params = {
      debug: data.debug,
      target: data.target,
    };
    let coinlayerData = await coinlayerRequest(params);
    console.log("OIUEDHFIUEHFG : ", coinlayerData);
    if (coinlayerData.live.success) {
      model.samPresent({
        do: 'updateCurrenciesData',
        currenciesData: coinlayerData
      });
    } else {
      console.log('updateOnlineCurrenciesData: Données en ligne indisponibles');
      console.log('updateOnlineCurrenciesData: BASCULEMENT EN MODE HORS-LIGNE');
      model.samPresent({
        do: 'changeDataMode',
        dataMode: 'offline'
      });
    }
  },

  listCoin(data) {
    const elementId = data.id;
    const elementClass = data.className;
    const elementIdObj = {
      quantity: 0,
      quantityNew: ''
    };

    model.samPresent({
      do: 'listCoin',
      listCoin: {
        elementId: elementId,
        elementClass: elementClass,
        elementIdObj: elementIdObj,
      },
      ...data
    })
  },

  listFiat(data) {
    const elementId = data.id;
    const elementClass = data.className;

    model.samPresent({
      do: 'listFiat',
      listFiat: {
        elementId: elementId,
        elementClass: elementClass,
      },
      ...data
    })
  },

  //----------------------------------------------------------- CurrenciesUI ---

  filterFiatUpdate(data) {
    let filterValue = data.e.target.value;
    delete data.e;
    model.samPresent({
      do: 'filterFiatUpdate',
      filterFiatUpdate: filterValue
    });
  },

  filterCryptoUpdate(data) {
    let filterValue = data.e.target.value;
    delete data.e;
    model.samPresent({
      do: 'filterCryptoUpdate',
      filterCryptoUpdate: filterValue
    });
  },

  filterPriceUpdate(data) {
    let priceValue = data.e.target.value;
    delete data.e;
    model.samPresent({
      do: 'filterPriceUpdate',
      filterPriceUpdate: priceValue
    });
  },

  //----------------------------------------------- CurrenciesUI et WalletUI ---
  changeTab(data) {
    model.samPresent({
      do: 'changeTab',
      ...data
    });
  },

  changeRowsPerPage(data) {
    value = data.e.target.value;
    delete data.e;
    currency = data.currency;
    model.samPresent({
      do: 'changeRowsPerPage',
      changeRowsPerPage: {
        currency: currency,
        value: value,
      },
      ...data
    });
  },

  changePage(data) {
    index = data.index;
    currency = data.currency;
    model.samPresent({
      do: 'changePage',
      changePage: {
        index: index,
        currency: currency,
      },
      ...data
    });
  },

  //----------------------------------------------------------- CurrenciesUI ---

  triCryptos(data) {
    const idColumn = data.id;
    model.samPresent({
      do: 'triCryptos',
      triCryptos: idColumn
    });
  },

  triFiats(data) {
    const idColumn = data.id;
    model.samPresent({
      do: 'triFiats',
      triFiats: idColumn
    });
  },

  //---------------------------------------------------------- PreferencesUI ---

  changeTarget(data) {
    data.target = data.e.target.value;
    delete data.e;
    this.updateOnlineCurrenciesData(data)
  },

  changeDataMode(data) {
    data.dataMode = data.e.target.value;
    delete data.e;
    if (data.dataMode == 'online') {
      this.updateOnlineCurrenciesData(data)
    }
    model.samPresent({
      do: 'changeDataMode',
      ...data
    });
  },

  //--------------------------------------------------------------- WalletUI ---

  addNewValueAjouter(data) {
    let elementValue = data.value;
    const elementId = data.id;

    if (elementValue == "0") {
      elementValue = '';
    }

    model.samPresent({
      do: 'addNewValueAjouter',
      addNewValueAjouter: {
        elementId: elementId,
        elementValue: elementValue,
      },
      ...data
    });
  },

  addNewValuePortfolio(data) {
    let elementValue = data.value;
    const elementId = data.id;

    model.samPresent({
      do: 'addNewValuePortfolio',
      addNewValuePortfolio: {
        elementId: elementId,
        elementValue: elementValue,
      },
      ...data
    });
  },

  btnAnnulerAjouter() {
    model.samPresent({
      do: 'btnAnnulerAjouter'
    });
  },

  btnConfirmerAjouter() {
    model.samPresent({
      do: 'btnConfirmerAjouter'
    });
  },

  btnAnnulerPortfolio() {
    model.samPresent({
      do: 'btnAnnulerPortfolio'
    });
  },

  btnConfirmerPortfolio() {
    model.samPresent({
      do: 'btnConfirmerPortfolio'
    });
  },

};