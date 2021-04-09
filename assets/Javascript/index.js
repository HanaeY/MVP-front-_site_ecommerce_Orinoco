/* AFFICHER LES TEDDIES SUR LA PAGE INDEX */

// Appel de l'API pour récupérer les données des teddies 
const getTeddies = async () => {
    try {
        var response = await fetch('http://localhost:3000/api/teddies');
        if(response.ok) {
            var teddies = await response.json(); // la méthode .json retourne une promesse 
            displayTeddies(teddies)
        } else {
            console.error('retour du serveur : ', response);
        }
    } catch(err) {
        console.log('erreur', err);
    }
}

// Modification du DOM pour insérer les données des teddies sur la page 
const displayTeddies = (data) => {
    for(let i = 1 ; i < 5 ; i++) {
        document.getElementById(`name-teddy-${i}`).textContent = data[i-1].name;
        document.getElementById(`description-teddy-${i}`).textContent = data[i-1].description;
        document.getElementById(`price-teddy-${i}`).textContent = data[i-1].price /100 + " €";
        document.getElementById(`img-teddy-${i}`).setAttribute("src", data[i-1].imageUrl);
        document.getElementById(`img-teddy-${i}`).setAttribute("alt", "photo de " + data[i-1].name);
        document.getElementById(`btn-teddy-${i}`).setAttribute("href", "product.html?id=" + data[i-1]._id);
    }
}

getTeddies()

// TO DO : 
// faire une recherche sur les paramètres de requête en js >> jeudi,OK
// page produit appelle les param de la requête >> vendredi, OK 
// implémenter l'ajout de teddy au panier 
// recherche sur le local storage 
// passer une commande et récupérer l'identifiant 
// https://openclassrooms.workplace.com/100049595616417/videos/173124777684042

// prochaine session jeudi 15 à 15h. 
