$(document).ready(function () {
    // Variables
    let partie = {}
    let tentativesEl = $("#tentatives")
    let messageNouvPartie = "Quel est le nombre mystère ? <br> Il est compris entre 1 et 100"
    let chrono = null;
    let sonChiffre = new Howl({
        src: ['assets/son/clic.wav']
    });

    // Traitement principal
    nouvellePartie()

    // Evenements
    $(".chiffre").click(function (e) {
        if (partie.fini) return

        const chiffre = $(this).data("chiffre")
        const saisie = parseInt(chiffre)

        // Il y a deux chiffres saisis
        if (partie.proposition > 9) partie.proposition = 0

        if (partie.proposition === 0) { // Il n'y a pas de proposition
            partie.proposition = saisie
            sonChiffre.play()
            modifierProposition(partie.proposition)
        } else if (partie.proposition > 0 && partie.proposition < 10) { // Il y a déjà un chiffre saisi
            partie.proposition = partie.proposition * 10 + saisie
            sonChiffre.play()
            modifierProposition(partie.proposition)
            valider()
        }
    })

    $("#btn-effacer").click(function (e) {
        if (partie.fini) return

        effacer()
    })

    $("#btn-nouvelle-partie").click(function (e) {
        nouvellePartie()
    })

    $("#btn-valider").click(function (e) {
        if (partie.proposition === 0) return
        valider()
    })

    // Fonctions
    function valider() {
        if (partie.fini) return

        let comparaison = ""
        let message = ""

        partie.tentatives++

        // On lance le chrono à la première tentative
        if (partie.tentatives == 1) {
            chrono = setInterval(modifierTemps, 1000);
        }

        if (partie.nombre === partie.proposition) {
            message = `Bravo ! vous avez trouvé le nombre mystère`
            partie.fini = true
            terminerPartie()
        } else {
            if (partie.nombre < partie.proposition) comparaison = "plus petit"
            else if (partie.nombre > partie.proposition) comparaison = "plus grand"
            message = `Le nombre mystère est <span class="fw-bold">${comparaison}</span> que ${partie.proposition}`
        }

        $("#message").html(message)
        partie.proposition = 0
        tentativesEl.text(partie.tentatives)
    }

    function nouvellePartie() {
        if (!partie.fini) {
            terminerPartie()
        }

        partie = {
            proposition: 0,
            MIN: 1,
            MAX: 100,
            tentatives: 0,
            fini: false,
            tempsEcoule: 0,
        }

        partie.nombre = Math.floor(Math.random() * partie.MAX) + 1

        effacer()
        $("#message").html(messageNouvPartie)
        $("#temps").text(`${partie.tempsEcoule}s`)
        tentativesEl.text(partie.tentatives)
    }

    function modifierProposition(propo) {
        if (propo >= partie.MIN && propo <= partie.MAX) {
            $(".proposition span").text(propo)
        }
    }

    function effacer() {
        partie.proposition = 0
        $(".proposition span").text("--")
    }

    function modifierTemps() {
        if (partie.fini) return

        partie.tempsEcoule++
        $("#temps").text(`${partie.tempsEcoule}s`)

        if (partie.tempsEcoule == 59) {
            terminerPartie()
        }
    }

    function terminerPartie() {
        partie.fini = true
        clearInterval(chrono)
    }
})