
/*Affichage dynamique du produit et ajout dans le localstorage */

// variables principales 
let teddyId;
let selectedColor;
let quantity = document.getElementById('selected-teddy-quantity').value;
let basket;

class BasketItem {
    constructor(id, name, color, quantity, price) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.quantity = quantity;
        this.price = price/100;
    }
};

// Récupération de l'id produit avec les query parameters

const getTeddyId = () => {
    const urlParam = window.location.search; 
    teddyId = urlParam.replace('?id=', ''); 
    return teddyId
};

// Fonction principale

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
            alert('oups, une erreur serveur a été rencontrée (statut ' + response.status + ')');
        }
    } catch(err) {
        console.log('erreur : ', err);
        alert('oups, une erreur est survenue, veuillez nous contacter si cela persiste');
    }
};

// Affichage des données du Teddy sur la page 

const displayTeddyData = (data) => {
    document.getElementById('selected-teddy-name').textContent = data.name;
    document.getElementById('selected-teddy-description').textContent = data.description;
    document.getElementById('selected-teddy-price').textContent = 'Prix total : ' + data.price / 100 + '€';
    document.getElementById('selected-teddy-img').setAttribute('src', data.imageUrl);
    document.getElementById('selected-teddy-img').setAttribute('alt', 'photo de ' + data.name);
    document.getElementById('selected-teddy-img').setAttribute('href', 'product.html?id=' + data._id);
    
    for(i = 0 ; i < data.colors.length ; i++) {
        let option = document.createElement('option');
        option.setAttribute('value', data.colors[i]);
        option.textContent = data.colors[i];
        document.getElementById('selected-teddy-colors').appendChild(option);
    }
};

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
        document.getElementById('selected-teddy-price').textContent = 'Prix de la sélection : ' + totalPrice + '€';
    });
};

// Ajouter le·s produit·s dans le localstorage 

const addToBasket = (data) => {
    document.getElementById('add-to-basket').addEventListener('click', (e) => {
        e.preventDefault();
        let item = new BasketItem(teddyId, data.name, selectedColor, quantity, data.price);
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
        localStorage.setItem('basket', JSON.stringify(basket)); // le localstorage est un tableau d'objets (id, couleur, qté)

        //message d'info
        
        let info = document.createElement('div');
        document.getElementById('info').appendChild(info);
        info.classList.add('alert', 'alert-success');

        if(item.quantity == 1) {
            info.textContent = 'Vous avez ajouté 1 produit à votre panier';
        } else {
            info.textContent = 'Vous avez ajouté ' + item.quantity + ' produits à votre panier';
        }
        
    });
};

getTeddyId()
getTeddyData()





