
/* AFFICHER DYNAMIQUEMENT LES DONNÉES D'UN TEDDY SUR LA PAGE PRODUIT */

// déclaration de variables globales 
let teddyId;
let selectedColor;
let quantity = document.getElementById('selected-teddy-quantity').value;
let basket;

class BasketItem {
    constructor(id, color, quantity) {
        this.id = id;
        this.color = color;
        this.quantity = quantity;
    }
};

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
            addToBasket();
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
};

// Mettre le prix à jour en fonction de la quantité saisie 

const updatePrice = (data) => {
    totalPrice = data.price / 100;
    document.getElementById('selected-teddy-quantity').addEventListener('input', (event) => {
        quantity = event.target.value;
        totalPrice = data.price * quantity / 100;
        document.getElementById("selected-teddy-price").textContent = 'Prix total : ' + totalPrice + '€';
    });
};

// Ajouter le·s produit·s dans le localstorage 

const addToBasket = () => {
    document.getElementById('add-to-basket').addEventListener('click', (e) => {
        e.preventDefault();
        let item = new BasketItem(teddyId, selectedColor, quantity);
        console.log('item', item);
        //récupérer le contenu du local storage
        basket = JSON.parse(localStorage.getItem('basket'));
        if(basket == null) {
            basket = [];
        }
        //ajouter le nouvel item dans le panier
        basket.push(item);
        console.log('basket', basket); // 
        //remettre le panier sur le local storage
        localStorage.setItem("basket", JSON.stringify(basket)); // le localstorage est un tableau d'objets (id, couleur, qté)

        //message d'info
        document.getElementById('info').textContent = 'Vous avez ajouté ' + item.quantity + ' produit(s) à votre panier';
        document.getElementById('info').classList.add('alert', 'alert-success');
    });
};

getTeddyId()
getTeddyData()





