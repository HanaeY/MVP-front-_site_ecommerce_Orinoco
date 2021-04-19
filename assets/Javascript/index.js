/* Affichage des teddies sur la page index */

// Appel de l'API pour récupérer les données des teddies 

const getTeddies = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/teddies');
        if(response.ok) {
            let teddies = await response.json();
            displayTeddies(teddies)
        } else {
            console.error('retour du serveur : ', response);
        }
    } catch(err) {
        console.log('erreur', err);
    }
};

// Modification du DOM pour insérer les données des teddies sur la page 

const displayTeddies = (data) => {
    for(let i = 0 ; i < data.length ; i++) {
        // création d'un produit teddy dans le bloc produits de la page 
        let teddy = document.createElement('div');
        teddy.classList.add('card', 'col-md-6');
        document.getElementById('bloc-produits').appendChild(teddy);
        // création des éléments de ce nouvel élément 
        let name = document.createElement('h2');
        let description = document.createElement('p');
        let price = document.createElement('p');
        let image = document.createElement('img');
        let button = document.createElement('a');
        teddy.appendChild(image);
        teddy.appendChild(name);
        teddy.appendChild(description);
        teddy.appendChild(price);
        teddy.appendChild(button);
        // définition des classes de ces éléments 
        name.classList.add('card-title');
        description.classList.add('card-text');
        price.classList.add('card-text');
        image.classList.add('card-img-top');
        button.classList.add('btn', 'btn-primary');
        // définition des attributs de ces éléments 
        image.setAttribute('src', data[i].imageUrl);
        image.setAttribute('alt', 'photo de ' + data[i].name);
        button.setAttribute('href', 'product.html?id=' + data[i]._id);
        // ajout du contenu texte
        name.textContent = data[i].name;
        description.textContent = data[i].description;
        price.textContent = data[i].price / 100 + " €";
        button.textContent = 'Voir le produit';
    }
};

// appel de la fonction 

getTeddies()
