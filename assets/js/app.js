$(document).ready(function(){
    // Variables
    let partie = {}
    let tentativesEl = $("#tentatives")
    let messageNouvPartie = "Quel est le nombre mystère ? <br> Il est compris entre 1 et 100"

    // Traitement principal
    nouvellePartie()

    // Evenements
    $(".chiffre").click(function(e){
        if (partie.fini) return

        const chiffre = $(this).data("chiffre")
        const saisie = parseInt(chiffre)
        
        // Il y a deux chiffres saisis
        if (partie.proposition > 9) partie.proposition = 0
        
        if (partie.proposition === 0) { // Il n'y a pas de proposition
            partie.proposition = saisie
            modifierProposition(partie.proposition)
        } else if (partie.proposition > 0 && partie.proposition < 10) { // Il y a déjà un chiffre saisi
            partie.proposition = partie.proposition * 10 + saisie
            modifierProposition(partie.proposition)
            valider()
        }
    })

    $("#btn-effacer").click(function(e){
        if (partie.fini) return
        
        effacer()
    })

    $("#btn-nouvelle-partie").click(function(e){
        nouvellePartie()
    })

    $("#btn-valider").click(function(e) {
        if (partie.proposition === 0) return
        valider()
    })

    // Fonctions
    function valider() {
        if (partie.fini) return

        let comparaison = ""
        let message = ""

        partie.tentatives++
        
        if (partie.nombre === partie.proposition) {
            message = `Bravo ! vous avez trouvé le nombre mystère`
            partie.fini = true
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
        partie = {
            proposition : 0,
            MIN: 1,
            MAX: 100,
            tentatives: 0,
            fini: false,
        }

        partie.nombre = Math.floor(Math.random() * partie.MAX) + 1

        effacer()
        $("#message").html(messageNouvPartie)
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
})