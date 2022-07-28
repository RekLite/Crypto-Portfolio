//--------------------------------------------------------------------- View ---
// Génération de portions en HTML et affichage
//
view = {

  // Injecte le HTML dans une balise de la page Web.
  samDisplay(sectionId, representation) {
    const section = document.getElementById(sectionId);
    section.innerHTML = representation;
  },

  // Renvoit le HTML de l'interface complète de l'application
  appUI(model, state) {
    const configsChooserHTML = this.configsChooserUI();
    return `
    <div class="container">
      ${configsChooserHTML}
      <h1 class="text-center">Portfolio Cryptos</h1>
      <br />
      <div class="row">
        <div class="col-lg-6">
          ${state.representations.currencies}
          <br />
        </div>

        <div class="col-lg-6">
          ${state.representations.preferences}
          <br />
          ${state.representations.wallet}
          <br />
        </div>
      </div>
    </div>
    `;
  },

  configsChooserUI() {
    const options = Object.keys(configs).map(v => {
      const selected = configsSelected == v ? 'selected="selected"' : '';
      return `
      <option ${selected}>${v}</option>
      `;
    }).join('\n');
    return `
    <div class="row">
      <div class="col-md-7"></div>
      <div class="col-md-5">
      <br />
        <div class="d-flex justify-content-end">
          <div class="input-group">
            <div class="input-group-prepend ">
              <label class="input-group-text">Config initiale :</label>
            </div>
            <select class="custom-select" onchange="actions.reinit({e:event})">
              ${options}
            </select>
          </div>
        </div>
      </div>
    </div>
    <br />
    `;
  },

  currenciesUI(model, state) {
    const tabName = model.ui.currenciesCard.selectedTab;
    switch (tabName) {
      case 'cryptos':
        return this.currenciesCrytopsUI(model, state);
        break;
      case 'fiats':
        return this.currenciesFiatsUI(model, state);
        break;
      default:
        console.error('view.currenciesUI() : unknown tab name: ', tabName);
        return '<p>Error in view.currenciesUI()</p>';
    }
  },

  currenciesCrytopsUI(model, state) {
    const value_list = Object.values(state.data.cryptos.filtered);
    const paginationHTML = this.paginationUI(model, state, 'cryptos');
    const num_list = Object.keys(value_list).length;

    const filteredNumFiat = state.data.fiats.filteredNum;
    const filteredNumCrypto = state.data.cryptos.filteredNum;

    const filterValue = model.ui.currenciesCard.tabs.cryptos.filters.text;
    const priceValue = model.ui.currenciesCard.tabs.cryptos.filters.price;

    const tableauFavorisOrange = state.data.coins.nullValueCodes;
    const tableauFavorisVert = state.data.coins.posValueCodes;

    const varPagination = model.ui.currenciesCard.tabs.cryptos.pagination;
    const rppIndex = varPagination.rowsPerPage[varPagination.rowsPerPageIndex];
    let currentPage = varPagination.currentPage - 1;

    let index1 = currentPage * rppIndex;
    let index2 = index1 + rppIndex;

    if (index2 > filteredNumCrypto) {
      index2 = filteredNumCrypto;
    }

    let classColor = '';
    let items = '';
    let tr = '';
    for (let i = index1; i < index2; i++) {
      if (tableauFavorisVert.includes(value_list[i].code)) {
        classColor = "bg-success text-light";
      } else if (tableauFavorisOrange.includes(value_list[i].code)) {
        classColor = "bg-warning";
      } else {
        classColor = "";
      }
      items += `<tr class="${classColor}" id="${value_list[i].code}" onclick="actions.listCoin(this)">
                  <td class="text-center">
                    <span class="badge badge-pill badge-light">
                    <img src="${value_list[i].icon_url}" /> ${value_list[i].code}
                    </span></td>
                  <td><b>${value_list[i].name}</b></td>
                  <td class="text-right"><b>${value_list[i].price.toFixed(2)}</b></td>
                  <td class="text-right">${value_list[i].change.toFixed(3)} ${value_list[i].change == 0 ? `~` : value_list[i].change > 0 ? `↗` : `↘`}</td>
                </tr>`
    }

    const allCodes = state.data.coins.allCodes;
    const posValueCodes = state.data.coins.posValueCodes;

    let cryptosFavoris = '';
    for (let j = 0; j < allCodes.length; j++) {
      cryptosFavoris += `<span class="badge ${posValueCodes.includes(allCodes[j]) ? "badge-success" : "badge-warning"}">${allCodes[j]}</span>
      `
    }

    return `
    <div class="card border-secondary" id="currencies">
      <div class="card-header">
        <ul class="nav nav-pills card-header-tabs">
          <li class="nav-item">
            <a class="nav-link active" href="#currencies"> Cryptos <span
                class="badge badge-light">${filteredNumCrypto} / 386</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-secondary" href="#currencies"
              onclick="actions.changeTab({tab:'currenciesFiats'})"> Monnaies cibles
              <span class="badge badge-secondary">${filteredNumFiat} / 167</span></a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <div class="input-group">
          <div class="input-group-append">
            <span class="input-group-text">Filtres : </span>
          </div>
          <input value="${filterValue}" id="filterText" type="text" class="form-control"
            placeholder="code ou nom..." onchange="actions.filterCryptoUpdate({e: event})"/>
          <div class="input-group-append">
            <span class="input-group-text">Prix &gt; </span>
          </div>
          <input id="filterSup" type="number" class="form-control" value="${priceValue}" min="0" onchange="actions.filterPriceUpdate({e: event})"/>
        </div> <br />
        <div class="table-responsive">
          <table class="col-12 table table-sm table-bordered">
            <thead>
              <th class="align-middle text-center col-2">
                <a id="0" href="#currencies" onclick="actions.triCryptos(this)">Code</a>
              </th>
              <th class="align-middle text-center col-5">
                <a id="1" href="#currencies" onclick="actions.triCryptos(this)">Nom</a>
              </th>
              <th class="align-middle text-center col-2">
                <a id="2" href="#currencies" onclick="actions.triCryptos(this)">Prix</a>
              </th>
              <th class="align-middle text-center col-3">
                <a id="3" href="#currencies" onclick="actions.triCryptos(this)">Variation</a>
              </th>
            </thead>
            ${items}
          </table>
        </div>
        ${paginationHTML}
      </div>
      <div class="card-footer text-muted"> Cryptos préférées :
        ${cryptosFavoris}
      </div>
    </div>
    `;
  },

  paginationUI(model, state, currency) {
    const activeCurrency = currency;

    const varPagination = model.ui.currenciesCard.tabs[activeCurrency].pagination;
    const rppIndex = varPagination.rowsPerPageIndex;
    const lengthRowsPerPage = varPagination.rowsPerPage.length;

    const currentPage = varPagination.currentPage;
    const nbPages = state.ui.currenciesCard.tabs[activeCurrency].pagination.nbPages;
    const maxPages = varPagination.maxPages;
    const varRowsPerPage = varPagination.rowsPerPage;

    let selectNbLignes = '';

    for (let i = 0; i < lengthRowsPerPage; i++) {
      let page = varPagination.currentPage;
      if (rppIndex == i) {
        page = 'selected="selected"';
      } else {
        page = '';
      }
      selectNbLignes += `<option ${page} value="${i}">${varRowsPerPage[i]}</option>`;
    }

    let max = Math.max(currentPage - Math.floor(maxPages / 2) + 1, 1);
    let min = Math.min(max + maxPages - 1, nbPages);
    max = Math.max(1, min - maxPages + 1);
    let res = '';
    let isActive = '';

    for (let i = max; i <= min; i++) {
      if (currentPage == i) {
        isActive = 'active';
      } else {
        isActive = '';
      }
      res += `<li class="page-item ${isActive}"><a class="page-link" href="#currencies" onclick="actions.changePage({index:${i},currency:'${activeCurrency}'})">${i}</a></li>`
    }

    const indexMin = Math.max(1, currentPage - 1);
    const indexMax = Math.min(currentPage + 1, nbPages);

    const testBtn = currentPage;
    let btnGauche = '';
    let btnDroit = '';

    if (testBtn == 1) {
      btnGauche = 'disabled';
    } else {
      btnGauche = '';
    }
    if (testBtn == nbPages) {
      btnDroit = 'disabled';
    } else {
      btnDroit = '';
    }

    return `
    <section id="pagination">
      <div class="row justify-content-center">
        <nav class="col-auto">
          <ul class="pagination">
            <li class="page-item ${btnGauche}">
              <a onclick="actions.changePage({index:${indexMin}, currency:'${activeCurrency}'})" class="page-link" href="#currencies">&lt;</a>
            </li>
            ${res}
            <li class="page-item ${btnDroit}">
              <a onclick="actions.changePage({index:${indexMax}, currency:'${activeCurrency}'})" class="page-link" href="#currencies">&gt;</a>
            </li>
          </ul>
        </nav>
        <div class="col-auto">
          <div class="input-group mb-3">
            <select onchange="actions.changeRowsPerPage({e:event, currency:'${activeCurrency}'})" class="custom-select" id="selectTo">
              ${selectNbLignes}
            </select>
            <div class="input-group-append">
              <span class="input-group-text">par page</span>
            </div>
          </div>
        </div>
      </div>
    </section>
    `;
  },

  currenciesFiatsUI(model, state) {
    const value_list = Object.values(state.data.fiats.filtered);
    const paginationHTML = this.paginationUI(model, state, 'fiats');
    const num_list = Object.keys(value_list).length;

    const filteredNumFiat = state.data.fiats.filteredNum;
    const filteredNumCrypto = state.data.cryptos.filteredNum;

    const filterValue = model.ui.currenciesCard.tabs.fiats.filters.text;

    const favorisVert = model.config.targets.active;
    const tableauFavorisOrange = model.config.targets.list;

    const varPagination = model.ui.currenciesCard.tabs.fiats.pagination;
    let currentPage = varPagination.currentPage - 1;
    const rppIndex = varPagination.rowsPerPage[varPagination.rowsPerPageIndex];

    let index1 = currentPage * rppIndex;
    let index2 = index1 + rppIndex;

    if (index2 > filteredNumFiat) {
      index2 = filteredNumFiat;
    }

    let couleur = '';
    let items = '';
    for (let i = index1; i < index2; i++) {
      if (favorisVert == value_list[i].code) {
        couleur = "bg-success text-light";
      } else if (tableauFavorisOrange.includes(value_list[i].code)) {
        couleur = "bg-warning";
      } else {
        couleur = "";
      }
      items += `<tr class="${couleur}" id="${value_list[i].code}" onclick="actions.listFiat(this)">
                    <td class="text-center">${value_list[i].code}</td> 
                    <td><b>${value_list[i].name}</b></td> 
                    <td class="text-center">${value_list[i].symbol}</td>
                  </tr>`
    }

    let fiatsFavoris = '';
    for (let j = 0; j < tableauFavorisOrange.length; j++) {
      fiatsFavoris += `<span class="badge ${tableauFavorisOrange[j].includes(favorisVert) ? "badge-success" : "badge-warning"}">${tableauFavorisOrange[j]}</span>
      `
    }

    return `
    <div class="card border-secondary"
      id="currencies">
      <div class="card-header">
        <ul class="nav nav-pills card-header-tabs">
          <li class="nav-item">
            <a class="nav-link text-secondary" href="#currencies"
              onclick="actions.changeTab({tab:'currenciesCryptos'})"> Cryptos <span
                class="badge badge-secondary">${filteredNumCrypto} / 386</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="#currencies">Monnaies cibles <span
                class="badge badge-light">${filteredNumFiat} / 167</span></a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <div class="input-group">
          <div class="input-group-append">
            <span class="input-group-text">Filtres : </span>
          </div>
          <input value="${filterValue}" id="filterText" type="text" class="form-control"
            placeholder="code ou nom..." onchange="actions.filterFiatUpdate({e: event})"/>
        </div> <br />
        <div class="table-responsive">
          <table class="col-12 table table-sm table-bordered">
            <thead>
              <th class="align-middle text-center col-2">
                <a id="0" href="#currencies" onclick="actions.triFiats(this)">Code</a>
              </th>
              <th class="align-middle text-center col-4">
                <a id="1" href="#currencies" onclick="actions.triFiats(this)">Nom</a>
              </th>
              <th class="align-middle text-center col-2">
                <a id="2" href="#currencies" onclick="actions.triFiats(this)">Symbole</a>
              </th>
            </thead>
              ${items}
          </table>
        </div><br />
        ${paginationHTML}
      </div>
      <div class="card-footer text-muted"> Monnaies préférées :
        ${fiatsFavoris}
      </div>
    </div>
    `;
  },

  preferencesUI(model, state) {

    const authors = model.config.authors;
    const debug = model.config.debug;
    const activeTarget = model.config.targets.active;
    const updateDisabled = model.config.dataMode == 'offline' ? 'disabled="disabled"' : '';
    const target = model.config.targets.active;
    const targetsList = mergeUnique(model.config.targets.list, [target]).sort();
    const fiatsList = state.data.fiats.list;

    const fiatOptionsHTML = targetsList.map((v) => {
      const code = fiatsList[v].code;
      const name = fiatsList[v].name;
      const isOffline = model.config.dataMode == 'offline';
      const selected = code == target ? 'selected="selected"' : '';
      const disabled = isOffline && code != target ? 'disabled="disabled"' : '';
      return `
      <option value="${code}" ${selected} ${disabled}>${code} - ${name}</option>
      `;
    }).join('\n');

    const dataModeOptionsHTML = [
      ['online', 'En ligne'],
      ['offline', 'Hors ligne']
    ].map(v => {
      const selected = v[0] == model.config.dataMode ? 'selected="selected"' : '';
      return `<option value="${v[0]}" ${selected}>${v[1]}</option>`;
    }).join('\n');

    return `
    <div class="card border-secondary">
      <div class="card-header d-flex justify-content-between">
        <h5 class=""> Préférences </h5>
        <h5 class="text-secondary"><abbr title="${authors}">Crédits</abbr></h5>
      </div>
      <div class="card-body">
        <div class="input-group">
          <div class="input-group-prepend">
            <label class="input-group-text" for="inputGroupSelect01">Monnaie
              cible</label>
          </div>
          <select class="custom-select" id="inputGroupSelect01"
          onchange="actions.changeTarget({e:event, debug:'${debug}'})">
            ${fiatOptionsHTML}
          </select>
        </div>
        <p></p>
        <div class="input-group">
          <div class="input-group-prepend">
            <label class="input-group-text">Données</label>
          </div>
          <select class="custom-select" onchange="actions.changeDataMode({e:event, target:'${activeTarget}', debug:'${debug}'})">
            ${dataModeOptionsHTML}
          </select>
          <div class="input-group-append">
            <button class="btn btn-primary" ${updateDisabled}
            onclick="actions.updateOnlineCurrenciesData({target: '${activeTarget}', debug:'${debug}'})">
            Actualiser</button>
          </div>
        </div>
      </div>
    </div>
    `;
  },

  walletUI(model, state) {
    const tabName = model.ui.walletCard.selectedTab;
    switch (tabName) {
      case 'portfolio':
        return this.walletPortfolioUI(model, state);
        break;
      case 'ajouter':
        return this.walletAjouterUI(model, state);
        break;
      default:
        console.error('view.currenciesUI() : unknown tab name: ', tabName);
        return '<p>Error in view.currenciesUI()</p>';
    }
  },

  walletPortfolioUI(model, state) {
    const cryptoOrange = state.data.coins.nullValueCodes;
    const cryptoOrangeLength = cryptoOrange.length;

    const cryptoVert = state.data.coins.posValueCodes;
    const cryptoVertLength = cryptoVert.length;

    const crypto = model.config.coins;
    const fiatActive = model.config.targets.active;

    const cryptosList = state.data.cryptos.list;

    let cryptoPortfolio = '';
    for (let j = 0; j < cryptoVertLength; j++) {

      let valeurCrypto = crypto[cryptoVert[j]].quantityNew;
      const nom = cryptosList[cryptoVert[j]].name;
      const prix = cryptosList[cryptoVert[j]].price;

      if (valeurCrypto == '') {
        valeurCrypto = crypto[cryptoVert[j]].quantity;
      }
      cryptoPortfolio += `<tr>
                          <td class="text-center">
                            <span class="badge badge-pill badge-light">
                              <img src="https://assets.coinlayer.com/icons/${cryptoVert[j]}.png" />${cryptoVert[j]}
                            </span></td>
                          <td><b>${nom}</b></td>
                          <td class="text-right">${prix.toFixed(2)}</td>
                          <td class="text-right">
                            <input id="${cryptoVert[j]}" type="text" class="form-control ${changerCouleurPortfolio(cryptoVert[j])}" value="${valeurCrypto}" onchange="actions.addNewValuePortfolio(this)"/>
                          </td>
                          <td class="text-right"><span class="${changerCouleurPortfolio(cryptoVert[j])}"><b>${calculTotalPortfolio(cryptoVert[j], prix)}</b></span></td>
                        </tr>
      `
    }

    return `
    <div class="card border-secondary text-center" id="wallet">
      <div class="card-header">
        <ul class="nav nav-pills card-header-tabs">
          <li class="nav-item">
            <a class="nav-link active" href="#wallet">Portfolio <span
                class="badge badge-light">${cryptoVertLength}</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link text-secondary" href="#wallet"
              onclick="actions.changeTab({tab:'walletAjouter'})"> Ajouter <span
                class="badge badge-secondary">${cryptoOrangeLength}</span></a>
          </li>
        </ul>
      </div>
      <div class="card-body text-center">
        <br />
        <div class="table-responsive">
          <table class="col-12 table table-sm table-bordered">
            <thead>
              <th class="align-middle text-center col-1"> Code </th>
              <th class="align-middle text-center col-4"> Nom </th>
              <th class="align-middle text-center col-2"> Prix </th>
              <th class="align-middle text-center col-3"> Qté </th>
              <th class="align-middle text-center col-2"> Total </th>
            </thead>
            ${cryptoPortfolio}
          </table>
        </div>
        <div class="input-group d-flex justify-content-end">
          <div class="input-group-prepend">
            <button onclick="actions.btnConfirmerPortfolio()" class="btn ${couleurBtnConfirmerPortfolio()}">Confirmer</button>
          </div>
          <div class="input-group-append">
            <button onclick="actions.btnAnnulerPortfolio()" class="btn ${couleurBtnAnnulerPortfolio()? 'btn-secondary' : 'disabled'}">Annuler</button>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <h3><span class="badge ${couleurBtnAnnulerPortfolio()? 'badge-primary' : 'badge-success'}">Total : ${calculTotalCryptosPortfolio()} ${model.config.targets.active}</span></h3>
      </div>
    </div>
    `;
  },

  walletAjouterUI(model, state) {
    const cryptoOrange = state.data.coins.nullValueCodes;
    const cryptoOrangeLength = cryptoOrange.length;

    const cryptoVert = state.data.coins.posValueCodes;
    const cryptoVertLength = cryptoVert.length;

    const crypto = model.config.coins;
    const fiatActive = model.config.targets.active;

    const cryptosList = state.data.cryptos.list;

    let cryptoAjouter = '';
    for (let j = 0; j < cryptoOrangeLength; j++) {

      let valeurCrypto = crypto[cryptoOrange[j]].quantityNew;
      const nom = cryptosList[cryptoOrange[j]].name;
      const prix = cryptosList[cryptoOrange[j]].price;

      if (valeurCrypto == '') {
        valeurCrypto = "0";
      }
      cryptoAjouter += `<tr>
                          <td class="text-center">
                            <span class="badge badge-pill badge-light">
                              <img src="https://assets.coinlayer.com/icons/${cryptoOrange[j]}.png" />${cryptoOrange[j]}
                            </span></td>
                          <td><b>${nom}</b></td>
                          <td class="text-right">${prix.toFixed(2)}</td>
                          <td class="text-right">
                            <input id="${cryptoOrange[j]}" type="text" class="form-control ${changerCouleurAjouter(cryptoOrange[j])}" value="${valeurCrypto}" onchange="actions.addNewValueAjouter(this)"/>
                          </td>
                          <td class="text-right"><span class="${changerCouleurAjouter(cryptoOrange[j])}"><b>${calculTotalAjouter(cryptoOrange[j], prix)}</b></span></td>
                        </tr>
      `
    }

    return `
    <div class="card border-secondary text-center" id="wallet">
      <div class="card-header">
        <ul class="nav nav-pills card-header-tabs">
          <li class="nav-item">
            <a class="nav-link text-secondary" href="#wallet"
              onclick="actions.changeTab({tab:'walletPortfolio'})"> Portfolio <span
                class="badge badge-secondary">${cryptoVertLength}</span></a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" href="#wallet">Ajouter <span
                class="badge badge-light">${cryptoOrangeLength}</span></a>
          </li>
        </ul>
      </div>
      <div class="card-body">
        <br />
        <div class="table-responsive">
          <table class="col-12 table table-sm table-bordered">
            <thead>
              <th class="align-middle text-center col-1"> Code </th>
              <th class="align-middle text-center col-4"> Nom </th>
              <th class="align-middle text-center col-2"> Prix </th>
              <th class="align-middle text-center col-3"> Qté </th>
              <th class="align-middle text-center col-2"> Total </th>
            </thead>
            ${cryptoAjouter}
          </table>
        </div>
        <div class="input-group d-flex justify-content-end">
          <div class="input-group-prepend">
            <button onclick="actions.btnConfirmerAjouter()" class="btn ${couleurBtnConfirmerAjouter()}">Confirmer</button>
          </div>
          <div class="input-group-append">
            <button onclick="actions.btnAnnulerAjouter()" class="btn ${couleurBtnAnnulerAjouter()? 'btn-secondary' : 'disabled'}">Annuler</button>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <h3><span class="badge ${(calculTotalCryptosAjouter() !== "0.00")? 'badge-primary' : 'badge-success'}">Total : ${calculTotalCryptosAjouter()} ${fiatActive}</span></h3>
      </div>
    </div>
    `;
  },


};