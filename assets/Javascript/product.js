
/* AFFICHER DYNAMIQUEMENT LES DONNÉES D'UN TEDDY SUR LA PAGE PRODUIT */

// Utilisation des query parameters pour récupérer l'ID du teddy sélectionné 

let teddyId;

const getTeddyId = () => {
    const urlParam = window.location.search; //attribut qui donne les param de l'url
    teddyId = urlParam.replace("?id=", ""); 
    console.log('Le teddy a pour id', teddyId); 
    return teddyId
};

// Appel de l'API pour récupérer les données du Teddy sélectionné

const getTeddyData = async () => {
    try {
        var response = await fetch('http://localhost:3000/api/teddies/' + teddyId)
        if(response.ok) {
            var teddyData = await response.json();
            displayTeddyData(teddyData);
        } else {
            console.log('Erreur. Réponse du serveur : ', response);
        }
    } catch(err) {
        console.log('erreur : ', err);
    }
};

// Affichage des données du Teddy sur la page 

const displayTeddyData = (data) => {
    document.getElementById("selected-teddy-name").textContent = data.name;
    document.getElementById("selected-teddy-description").textContent = data.description;
    document.getElementById("selected-teddy-price").textContent = 'Prix total : ' + data.price / 100 + '€';
    document.getElementById("selected-teddy-img").setAttribute("src", data.imageUrl);
    document.getElementById("selected-teddy-img").setAttribute("alt", "photo de " + data.name);
    document.getElementById("selected-teddy-img").setAttribute("href", "product.html?id=" + data._id);
    
    for(i = 0 ; i < data.colors.length ; i++) {
        let option = document.createElement("option");
        option.setAttribute("value", data.colors[i]);
        option.textContent = data.colors[i];
        document.getElementById("selected-teddy-colors").appendChild(option);
    }
};

// Mettre le prix à jour en fonction de la quantité saisie 


getTeddyId()
getTeddyData()



