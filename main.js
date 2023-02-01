const vypis = document.querySelector(".vypis");
//localStorage.clear();

class Galerie {
    constructor(jmenoGalerie, list) {
        this.jmenoGalerie = jmenoGalerie;
        this.list = list; 
    }

    addObraz(o) {
        list.push(o);
    }

    celkovaCena() {
        let price = 0;
        this.list.forEach(Obraz => {
            price += Number(Obraz.cena);
        });
        return price;
    }

    triNejdrazsiObrazy() {
        return this.list.sort(function(a, b){return b.cena - a.cena}).slice(0, 3);
    }

    obrazyAutora(autor) {
        return this.list.filter( obraz => obraz.Autor.jmeno === autor.jmeno && obraz.Autor.prijmeni === autor.prijmeni).sort((a, b) => b.cena - a.cena);
    }

    groupObrazyPodleAutora() {
        let autori = [];
        this.list.forEach(obraz => {
            if (!autori.includes(obraz.Autor)) {
                autori.push(obraz.Autor);
            }
        });
        let result = {};
        autori.forEach(autor => {
            let filtredObrazy = this.list.filter(obraz => obraz.Autor == autor).sort((a, b) => b.cena - a.cena);
            let obrazky = [];
            filtredObrazy.forEach(obraz => {
                obrazky.push(obraz.nazev);
            });
            result[autor] = obrazky;
        });
        return result;
    }
}

class Autor {
    constructor(jmeno, prijmeni, datum) {
        this.jmeno = jmeno;
        this.prijmeni = prijmeni;
        this.datum = datum;
    }

    vypis() {
        return this.jmeno+ " " +this.prijmeni+ " " +this.datum; 
    }
}

class Obraz {
    constructor(Autor, nazev, cena, rokVzniku) {
      this.Autor = Autor;
      this.nazev = nazev;
      this.cena = cena;
      this.rokVzniku = rokVzniku;
    }
}

/*
let a1 = new Autor("Jiri", "Wolker", "14. 5. 1845");
let a2 = new Autor("Alan", "Walker", "23. 9. 1963");
let o1 = new Obraz(a1, "Vykrik", "10000", "12. 6. 1820");
let o2 = new Obraz(a1, "Mona Lisa", "16000", "6. 10. 1920");
let o3 = new Obraz(a2, "Vyhled", "13000", "1. 12. 2020");
let o4 = new Obraz(a2, "Les", "24000", "7. 4. 1889");
*/
const autori = [];
const list = [];
let galerie = new Galerie("Louwre", list);

const selectAutor = document.getElementById("autor");
const selectAutorM = document.getElementById("autorM");
const selectObraz = document.getElementById("obrazD");

let keyAutoru = "listAutoru";
loadlocalStorageAutoru(keyAutoru);
let keyObrazu = "listObrazu";
loadlocalStorageObrazu(keyObrazu);


/**Tlacitka metody */
const ot1 = document.getElementById("one");
const ot2 = document.getElementById("two");
const ot3 = document.getElementById("three");
const ot4 = document.getElementById("four");
const ot5 = document.getElementById("five");
const ot6 = document.getElementById("six");
const ot8 = document.getElementById("deleteLocalStorage");
const ot9 = document.getElementById("deleteO");

ot1.addEventListener("click", () => {
    vypis.textContent = "Celkova cena vsech obrazu: " +galerie.celkovaCena()+ " Kc  ";
});
ot2.addEventListener("click", () => {
    vypis.textContent = "Tri nejdrazsi obrazy: ";
    galerie.triNejdrazsiObrazy().forEach( item => {
        vypis.textContent += "Obraz: " +item.nazev+ ", cena: " +item.cena+ "Kc - autor: " +item.Autor.jmeno+ " " +item.Autor.prijmeni+ " | ";
    })
});
ot3.addEventListener("click", () => {
    let autorObrazu = null;
    autori.forEach( item => {
        const celeJmeno = item.jmeno+ " " +item.prijmeni;
        if(celeJmeno === document.getElementById("autorM").value){
            autorObrazu = item;
        }
    })
    if(autorObrazu != null) {
        vypis.textContent = "Obrazy autora - " +autorObrazu.jmeno+ " " +autorObrazu.prijmeni+ ": ";
        galerie.obrazyAutora(autorObrazu).forEach( item => {
            vypis.textContent += item.nazev+ ", cena: " +item.cena+ "Kc | ";
        })
    }
});
ot4.addEventListener("click", () => {
    vypis.textContent = "Obrazy podle autora: ";
    vypis.textContent += galerie.groupObrazyPodleAutora()[1].obrazky[1];
});
ot5.addEventListener("click", () => {
    vypis.textContent = "Vsechny obrazy v galerii: ";
    galerie.list.forEach(obraz => {
        vypis.textContent += obraz.nazev+ ", cena: " +obraz.cena+ "Kc, rok vzniku: " +obraz.rokVzniku+ ", autor: " +obraz.Autor.jmeno+ " " +obraz.Autor.prijmeni+ " | ";
    })
});
ot6.addEventListener("click", () => {
    vypis.textContent = "Vsichni autori: ";
    autori.forEach(autor => {
        vypis.textContent += autor.jmeno+ " " +autor.prijmeni+ ", datum narozeni: " +autor.datum+ " | ";
    })
});
ot8.addEventListener("click", () => {
    localStorage.clear();
    for(let i = autori.length+1; i >= 0; i--){
        selectAutor.remove(i);
        selectAutorM.remove(i);
    }
    for(let i = galerie.list.length+1; i >= 0; i--){
        selectObraz.remove(i);
    }
    autori.length = 0;
    galerie.list.length = 0;
    vypis.textContent = "";
});
ot9.addEventListener("click", () => {
    if(document.getElementById("obrazD").value != null) {
        var i = 0;
        while (i < galerie.list.length) {
            if (galerie.list[i].nazev    === document.getElementById("obrazD").value) {
                galerie.list.splice(i, 1);
            } else {
                ++i;
            }
        }
        localStorage.setItem(keyObrazu, JSON.stringify(galerie.list));
        selectObraz.length = 0;
        reloadSelectObrazu();
    }
})

/**Pridavani autora */
const addAutor = (ev) => {
    if(document.getElementById("finame").value !== "" && 
       document.getElementById("lname").value !== "" && 
       String(document.getElementById("dateBirth").value) !== ""
    ){
        ev.preventDefault();
        let a = new Autor(document.getElementById("finame").value, 
                          document.getElementById("lname").value, 
                          String(document.getElementById("dateBirth").value));
        autori.push(a);
        console.log("pridan autor");

        localStorage.setItem(keyAutoru, JSON.stringify(autori));

        document.querySelector(".AutorForm").reset();
        let newOption = new Option(a.jmeno+ " " +a.prijmeni, a.jmeno+ " " +a.prijmeni);
        selectAutor.add(newOption, undefined);
        let newOptionM = new Option(a.jmeno+ " " +a.prijmeni, a.jmeno+ " " +a.prijmeni);
        selectAutorM.add(newOptionM, undefined);
    }
}
const buttonSubmitAutor = document.getElementById("submitAutor");
buttonSubmitAutor.addEventListener("click", addAutor);

/**Pridavani obrazu */
const addObraz = (ev) => {
    let autorObrazu = null;
    autori.forEach( item => {
        const celeJmeno = item.jmeno+ " " +item.prijmeni;
        if(celeJmeno === document.getElementById("autor").value){
            autorObrazu = item;
        }
    })
    if(autorObrazu !== null && 
       document.getElementById("nazev").value !== "" &&
       document.getElementById("cena").value !== "" &&
       String(document.getElementById("datumVzniku").value) !== ""
    ){
        ev.preventDefault();
        let o = new Obraz(autorObrazu, 
                          document.getElementById("nazev").value, 
                          document.getElementById("cena").value, 
                          String(document.getElementById("datumVzniku").value));
        galerie.addObraz(o);
        console.log("pridan obraz");

        localStorage.setItem(keyObrazu, JSON.stringify(galerie.list));

        document.querySelector(".ObrazForm").reset();
        let newOption = new Option(o.nazev, o.nazev);
        selectObraz.add(newOption, undefined);
    }
    if(autorObrazu === null){
        ev.preventDefault();
        alert("Nebyl vybran z nabidky zadny autor. Pokud je nabidka prazdna je nejdrive potreba pridat autora.");
    }

}
const buttonSubmitObraz = document.getElementById("submitObraz");
buttonSubmitObraz.addEventListener("click", addObraz);

/**Local storage autoru */
function loadlocalStorageAutoru(keyAutoru){
    if(localStorage.getItem(keyAutoru) !== null){
        let tmp = JSON.parse(localStorage.getItem(keyAutoru));
        for(let i = 0; i < tmp.length; i++){
            autori.push(tmp[i]);
        }
        reloadSelectAutoru();
    }
}

function reloadSelectAutoru(){
    autori.forEach( autor => {
        let newOption = new Option(autor.jmeno+ " " +autor.prijmeni, autor.jmeno+ " " +autor.prijmeni);
        selectAutor.add(newOption, undefined);
        let newOptionM = new Option(autor.jmeno+ " " +autor.prijmeni, autor.jmeno+ " " +autor.prijmeni);
        selectAutorM.add(newOptionM, undefined);
    })
}

/**Local storage obrazu */
function loadlocalStorageObrazu(keyObrazu){
    if(localStorage.getItem(keyObrazu) !== null){
        let tmp = JSON.parse(localStorage.getItem(keyObrazu));
        for(let i = 0; i < tmp.length; i++){
            galerie.addObraz(tmp[i]);
        }
        reloadSelectObrazu();
    }
}

function reloadSelectObrazu() {
    galerie.list.forEach( obraz => {
        let newOption = new Option(obraz.nazev, obraz.nazev);
        selectObraz.add(newOption, undefined);
    })
}
