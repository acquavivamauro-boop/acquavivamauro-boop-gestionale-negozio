/* LOGIN */
const loginBox = document.getElementById("loginBox");
const app = document.getElementById("app");
const codiceAccesso = document.getElementById("codiceAccesso");
const passwordAccesso = document.getElementById("passwordAccesso");
const entra = document.getElementById("entra");

const CODICE_CORRETTO = "mauro";
const PASSWORD_CORRETTA = "1234";

entra.addEventListener("click", function () {
    if (
        codiceAccesso.value === CODICE_CORRETTO &&
        passwordAccesso.value === PASSWORD_CORRETTA
    ) {
        loginBox.style.display = "none";
        app.style.display = "block";
    } else {
        alert("Codice o password errati");
    }
});

/* CORRISPETTIVI */
const data = document.getElementById("data");
const contanti = document.getElementById("contanti");
const posLocorotondo = document.getElementById("posLocorotondo");
const posTaranto = document.getElementById("posTaranto");
const buoni = document.getElementById("buoni");
const bonifici = document.getElementById("bonifici");
const totale = document.getElementById("totale");
const note = document.getElementById("note");
const salva = document.getElementById("salva");
const storico = document.getElementById("storico");

let corrispettivi = JSON.parse(localStorage.getItem("corrispettivi")) || [];

function calcolaTotale() {
    const totaleGiorno =
        Number(contanti.value) +
        Number(posLocorotondo.value) +
        Number(posTaranto.value) +
        Number(buoni.value) +
        Number(bonifici.value);

    totale.value = totaleGiorno.toFixed(2);
}

function mostraStorico() {
    storico.innerHTML = "";

    corrispettivi.forEach((riga, index) => {
        storico.innerHTML += `
            <tr>
                <td>${riga.data}</td>
                <td>€ ${riga.contanti}</td>
                <td>€ ${riga.posLocorotondo}</td>
                <td>€ ${riga.posTaranto}</td>
                <td>€ ${riga.buoni}</td>
                <td>€ ${riga.bonifici}</td>
                <td><strong>€ ${riga.totale}</strong></td>
                <td>
                    <button onclick="eliminaCorrispettivo(${index})">🗑</button>
                </td>
            </tr>
        `;
    });
}

contanti.addEventListener("input", calcolaTotale);
posLocorotondo.addEventListener("input", calcolaTotale);
posTaranto.addEventListener("input", calcolaTotale);
buoni.addEventListener("input", calcolaTotale);
bonifici.addEventListener("input", calcolaTotale);

salva.addEventListener("click", function () {
    if (data.value === "") {
        alert("Inserisci la data");
        return;
    }

    calcolaTotale();

    const nuovaGiornata = {
        data: data.value,
        contanti: Number(contanti.value).toFixed(2),
        posLocorotondo: Number(posLocorotondo.value).toFixed(2),
        posTaranto: Number(posTaranto.value).toFixed(2),
        buoni: Number(buoni.value).toFixed(2),
        bonifici: Number(bonifici.value).toFixed(2),
        totale: totale.value,
        note: note.value
    };

    corrispettivi.push(nuovaGiornata);
    localStorage.setItem("corrispettivi", JSON.stringify(corrispettivi));

    mostraStorico();

    alert("Corrispettivo salvato!");

    contanti.value = 0;
    posLocorotondo.value = 0;
    posTaranto.value = 0;
    buoni.value = 0;
    bonifici.value = 0;
    note.value = "";
    totale.value = "";
});

function eliminaCorrispettivo(index) {
    if (confirm("Vuoi cancellare questo corrispettivo?")) {
        corrispettivi.splice(index, 1);
        localStorage.setItem("corrispettivi", JSON.stringify(corrispettivi));
        mostraStorico();
    }
}

calcolaTotale();
mostraStorico();

/* CASSA E BANCHE */
const dataMovimento = document.getElementById("dataMovimento");
const tipoMovimento = document.getElementById("tipoMovimento");
const bancaMovimento = document.getElementById("bancaMovimento");
const importoMovimento = document.getElementById("importoMovimento");
const descrizioneMovimento = document.getElementById("descrizioneMovimento");
const salvaMovimento = document.getElementById("salvaMovimento");
const situazioneBanche = document.getElementById("situazioneBanche");
const storicoMovimenti = document.getElementById("storicoMovimenti");

let movimenti = JSON.parse(localStorage.getItem("movimenti")) || [];

function mostraMovimenti() {
    storicoMovimenti.innerHTML = "";

    movimenti.forEach((movimento) => {
        storicoMovimenti.innerHTML += `
            <tr>
                <td>${movimento.data}</td>
                <td>${movimento.tipo}</td>
                <td>${movimento.banca}</td>
                <td>€ ${movimento.importo}</td>
                <td>${movimento.descrizione}</td>
            </tr>
        `;
    });

    aggiornaSituazioneBanche();
}

function aggiornaSituazioneBanche() {
    let saldi = {
        "Cassa Negozio": 0,
        "Fondo Cassa": 0,
        "BCC Locorotondo": 0,
        "BCC Taranto": 0,
        "POS Locorotondo da Incassare": 0,
        "POS Taranto da Incassare": 0
    };

    movimenti.forEach((movimento) => {
        let importo = Number(movimento.importo);

        if (movimento.tipo === "versamento" || movimento.tipo === "fondo") {
            saldi[movimento.banca] += importo;
        }

        if (movimento.tipo === "prelievo") {
            saldi[movimento.banca] -= importo;
        }
    });

    situazioneBanche.innerHTML = "";

    for (let voce in saldi) {
        situazioneBanche.innerHTML += `
            <tr>
                <td>${voce}</td>
                <td><strong>€ ${saldi[voce].toFixed(2)}</strong></td>
            </tr>
        `;
    }
}

salvaMovimento.addEventListener("click", function () {
    if (dataMovimento.value === "") {
        alert("Inserisci la data del movimento");
        return;
    }

    const nuovoMovimento = {
        data: dataMovimento.value,
        tipo: tipoMovimento.value,
        banca: bancaMovimento.value,
        importo: Number(importoMovimento.value).toFixed(2),
        descrizione: descrizioneMovimento.value
    };

    movimenti.push(nuovoMovimento);
    localStorage.setItem("movimenti", JSON.stringify(movimenti));

    mostraMovimenti();

    alert("Movimento salvato!");

    importoMovimento.value = 0;
    descrizioneMovimento.value = "";
});

mostraMovimenti();

/* MAGAZZINO */
const dataMagazzino = document.getElementById("dataMagazzino");
const tipoMagazzino = document.getElementById("tipoMagazzino");
const categoriaMagazzino = document.getElementById("categoriaMagazzino");
const quantitaMagazzino = document.getElementById("quantitaMagazzino");
const noteMagazzino = document.getElementById("noteMagazzino");
const salvaMagazzino = document.getElementById("salvaMagazzino");

const tabellaGiacenze = document.getElementById("tabellaGiacenze");
const storicoMagazzino = document.getElementById("storicoMagazzino");

const filtroDataInizio = document.getElementById("filtroDataInizio");
const filtroDataFine = document.getElementById("filtroDataFine");
const filtroCategoria = document.getElementById("filtroCategoria");
const filtroTipo = document.getElementById("filtroTipo");
const applicaFiltriMagazzino = document.getElementById("applicaFiltriMagazzino");
const azzeraFiltriMagazzino = document.getElementById("azzeraFiltriMagazzino");

let magazzino = JSON.parse(localStorage.getItem("magazzino")) || [];
let indiceModificaMagazzino = null;

const categorieMagazzino = [
    "Abiti uomo",
    "Giacche uomo",
    "Pantaloni uomo",
    "Jeans uomo",
    "Camicie uomo",
    "Maglioni uomo",
    "Gilet uomo",
    "Trench uomo",
    "Cappotti uomo",
    "T-shirt / Polo uomo",
    "Scarpe uomo",
    "Abiti donna",
    "Giacche donna",
    "Pantaloni donna",
    "Jeans donna",
    "Camicie donna",
    "Maglieria donna",
    "Cappotti donna",
    "Giacconi donna",
    "Piumini donna",
    "Tailleur donna",
    "Sciarpe"
];

function dataOraAttuale() {
    return new Date().toLocaleString("it-IT");
}

function calcolaGiacenze() {
    let giacenze = {};

    categorieMagazzino.forEach(categoria => {
        giacenze[categoria] = 0;
    });

    magazzino.forEach(movimento => {
        const quantita = Number(movimento.quantita);

        if (movimento.tipo === "carico") {
            giacenze[movimento.categoria] += quantita;
        } else {
            giacenze[movimento.categoria] -= quantita;
        }
    });

    return giacenze;
}

function mostraGiacenze() {
    const giacenze = calcolaGiacenze();
    tabellaGiacenze.innerHTML = "";

    let totaleCapi = 0;

    categorieMagazzino.forEach(categoria => {
        const valore = giacenze[categoria];
        totaleCapi += valore;

        tabellaGiacenze.innerHTML += `
            <tr>
                <td>${categoria}</td>
                <td><strong>${valore}</strong></td>
            </tr>
        `;
    });

    tabellaGiacenze.innerHTML += `
        <tr>
            <td><strong>Totale capi</strong></td>
            <td><strong>${totaleCapi}</strong></td>
        </tr>
    `;
}

function mostraStoricoMagazzino(lista = magazzino) {
    storicoMagazzino.innerHTML = "";

    lista.forEach((movimento) => {
        const index = magazzino.indexOf(movimento);

        storicoMagazzino.innerHTML += `
            <tr>
                <td>${movimento.data}</td>
                <td>${movimento.tipo}</td>
                <td>${movimento.categoria}</td>
                <td>${movimento.quantita}</td>
                <td>${movimento.dataModifica || "-"}</td>
                <td>${movimento.note || ""}</td>
                <td>
                    <button onclick="modificaMagazzino(${index})">✏️</button>
                    <button onclick="eliminaMagazzino(${index})">🗑</button>
                </td>
            </tr>
        `;
    });

    mostraGiacenze();
}

salvaMagazzino.addEventListener("click", function () {
    if (dataMagazzino.value === "") {
        alert("Inserisci la data del movimento");
        return;
    }

    if (Number(quantitaMagazzino.value) <= 0) {
        alert("Inserisci una quantità valida");
        return;
    }

    const movimento = {
        data: dataMagazzino.value,
        tipo: tipoMagazzino.value,
        categoria: categoriaMagazzino.value,
        quantita: Number(quantitaMagazzino.value),
        note: noteMagazzino.value,
        dataModifica: indiceModificaMagazzino !== null ? dataOraAttuale() : "-"
    };

    if (indiceModificaMagazzino !== null) {
        magazzino[indiceModificaMagazzino] = movimento;
        indiceModificaMagazzino = null;
        salvaMagazzino.textContent = "💾 Salva movimento magazzino";
        alert("Movimento modificato!");
    } else {
        magazzino.push(movimento);
        alert("Movimento salvato!");
    }

    localStorage.setItem("magazzino", JSON.stringify(magazzino));

    dataMagazzino.value = "";
    tipoMagazzino.value = "carico";
    categoriaMagazzino.value = "Abiti uomo";
    quantitaMagazzino.value = 0;
    noteMagazzino.value = "";

    mostraStoricoMagazzino();
});

function modificaMagazzino(index) {
    const movimento = magazzino[index];

    dataMagazzino.value = movimento.data;
    tipoMagazzino.value = movimento.tipo;
    categoriaMagazzino.value = movimento.categoria;
    quantitaMagazzino.value = movimento.quantita;
    noteMagazzino.value = movimento.note;

    indiceModificaMagazzino = index;
    salvaMagazzino.textContent = "✏️ Aggiorna movimento magazzino";

    window.scrollTo({
        top: dataMagazzino.offsetTop - 100,
        behavior: "smooth"
    });
}

function eliminaMagazzino(index) {
    if (confirm("Vuoi eliminare questo movimento di magazzino?")) {
        magazzino.splice(index, 1);
        localStorage.setItem("magazzino", JSON.stringify(magazzino));
        mostraStoricoMagazzino();
    }
}

applicaFiltriMagazzino.addEventListener("click", function () {
    const risultati = magazzino.filter(movimento => {
        let ok = true;

        if (filtroDataInizio.value && movimento.data < filtroDataInizio.value) ok = false;
        if (filtroDataFine.value && movimento.data > filtroDataFine.value) ok = false;
        if (filtroCategoria.value && movimento.categoria !== filtroCategoria.value) ok = false;
        if (filtroTipo.value && movimento.tipo !== filtroTipo.value) ok = false;

        return ok;
    });

    mostraStoricoMagazzino(risultati);
});

azzeraFiltriMagazzino.addEventListener("click", function () {
    filtroDataInizio.value = "";
    filtroDataFine.value = "";
    filtroCategoria.value = "";
    filtroTipo.value = "";

    mostraStoricoMagazzino();
});

mostraStoricoMagazzino();