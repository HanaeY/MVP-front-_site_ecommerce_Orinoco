/*const displaySelectedTeddy = (data) => {
    document.getElementById("selected-teddy-name").textContent = data.name;
    document.getElementById("selected-teddy-description").textContent = data.description;
    document.getElementById("selected-teddy-colors").textContent = data.color;
    document.getElementById("selected-teddy-price").textContent = data.price;
}
*/

/* AFFICHER DYNAMIQUEMENT LES DONNÉES D'UN TEDDY SUR LA PAGE PRODUIT */

// Utilisation des query parameters pour récupérer l'ID du teddy sélectionné 

const getTeddyId = () => {
    console.log(window.location); 
    const urlParam = window.location.search;
    console.log(urlParam); 
    const teddyId = urlParam.replace("?id=", ""); 
    return teddyId
};

getTeddyId()

/* Appel de l'API pour récupérer les données du Teddy sélectionné */