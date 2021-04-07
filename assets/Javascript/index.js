/* afficher les produits sur la page produit */
// l'API fetch permet de faire des requêtes ajax sans utliser l'objet xhr
fetch('http://localhost:3000/api/teddies')
.then(response => response.json()) // la méthode .json permet de parser la réponse et donne une nouvelle promesse 
.then(teddies => {
    for(let i = 1 ; i < 5 ; i++) {
        document.getElementById(`name-teddy-${i}`).textContent = teddies[i-1].name;
        document.getElementById(`description-teddy-${i}`).textContent = teddies[i-1].description;
        document.getElementById(`price-teddy-${i}`).textContent = teddies[i-1].price /100 + " €";
        document.getElementById(`img-teddy-${i}`).setAttribute("src", teddies[i-1].imageUrl);
        document.getElementById(`img-teddy-${i}`).setAttribute("alt", "photo de " + teddies[i-1].name);
        document.getElementById(`btn-teddy-${i}`).addEventListener('click', (e) => {
            localStorage.setItem('selectedTeddy', JSON.stringify(teddies[i-1])); // stocke les info du produit dans le local storage
        })
    }
})

.catch(error => console.log("erreur :", error))


