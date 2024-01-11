window.onload = function () {
    let button = document.querySelector('input[type=button]');
    button.onclick = calculerIMC; 
}

function calculerIMC() {
    const poids = document.getElementById('poids');
    const taille = document.getElementById('taille');
    const resultatElement = document.getElementById('resultat');

    if (!poids.value || !taille.value) {
        resultatElement.textContent = "Veuillez saisir le poids et la taille.";
        return;
    }

    const imc = poids.value / Math.pow(taille.value, 2);

    let interpretation = "Vous êtes en état ";
    if (imc < 16.5) {
        interpretation += "de dénutrition";
    } else if (imc >= 16.5 && imc < 18.5) {
        interpretation += "de maigreur";
    } else if (imc >= 18.5 && imc < 25) {
        interpretation = "Vous avez un poids normal";
    } else if (imc >= 25 && imc < 30) {
        interpretation += "de surpoids";
    } else if (imc >= 30 && imc < 35) {
        interpretation += "d'obésité modérée";
    } else if (imc >= 35 && imc < 40) {
        interpretation += "d'obésité sévère";
    } else {
        interpretation += "d'obésité morbide ou massive";
    }

    // Mettre à jour le contenu de l'élément avec l'ID "resultat"
    resultatElement.textContent = interpretation;
}
