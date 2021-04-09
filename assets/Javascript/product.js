
/* AFFICHER DYNAMIQUEMENT LES DONNÉES D'UN TEDDY SUR LA PAGE PRODUIT */

// déclaration de variables globales 
let teddyId;
let selectedColor;
let totalPrice;

// Utilisation des query parameters pour récupérer l'ID du teddy sélectionné 


const getTeddyId = () => {
    const urlParam = window.location.search; //attribut qui donne les param de l'url
    teddyId = urlParam.replace("?id=", ""); 
    return teddyId
};

// Fonction principale (appelle l'API puis les fonctions qui traitent la réponse)

const getTeddyData = async () => {
    try {
        var response = await fetch('http://localhost:3000/api/teddies/' + teddyId)
        if(response.ok) {
            var teddyData = await response.json();
            displayTeddyData(teddyData);
            selectColor(teddyData);
            updatePrice(teddyData);
            addToBasket(teddyData);
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

// Traduire les couleurs en français 

// Mettre la couleur à jour en fonction de la valeur choisie 

const selectColor = (data) => {
    selectedColor = data.colors[0];
    document.getElementById('selected-teddy-colors').addEventListener('input', (event) => {
        selectedColor = event.target.value; 
    });
    return selectedColor; 
}

// Mettre le prix à jour en fonction de la quantité saisie 

const updatePrice = (data) => {
    totalPrice = data.price / 100;
    document.getElementById('selected-teddy-quantity').addEventListener('input', (event) => {
        totalPrice = data.price * event.target.value / 100;
        document.getElementById("selected-teddy-price").textContent = 'Prix total : ' + totalPrice + '€';
    });
    return totalPrice;
}

// Ajouter le·s produit·s dans le localstorage 

const addToBasket = (data) => {
    document.getElementById('add-to-basket').addEventListener('click', (event) => {
        event.preventDefault();
        let item = {
            id : data._id,
            name : data.name,
            color : selectedColor,
            quantity : totalPrice / data.price * 100,
            price : totalPrice,
        };
        console.log(item);
        localStorage.setItem("item", JSON.stringify(item)); // élément bien enregistré dans le local storage
        alert('vous avez ajouté' + item.quantity + ' produit(s) à votre panier');
    });
}

// mettre seulement l'id et la quantité dans le local storage ? 

getTeddyId()
getTeddyData()



