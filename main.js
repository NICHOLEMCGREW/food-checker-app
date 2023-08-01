document.querySelector('button').addEventListener('click', getFetch)

function getFetch(userInput) {
    let inputVal = document.getElementById("barcode").value
    if (inputVal.length !== 12) {
        alert('Pleaes ensure that barcode is 12 characters')
        return;
    }
    const choice = userInput
    const url = `https://world.openfoodfacts.org/api/v0/product/${inputVal}.json`

    fetch(url)
    .then(res => res.json()) // parse response as JSON
    .then(data => {
        console.log(data.product)
        if (data.status === 1) {
            const item = new ProductInfo(data.product)
            item.showInfo()
            item.listIngredients()
        } else if (data.status === 0) {
            alert(`Product ${inputVal} not found. Please try another.`)
        }
    })
    .catch(err => {
        console.log(`error ${err}`)
    });
}

class ProductInfo {
    constructor(productData)  { // passing in data.produt//
        this.name = productData.product_name
        this.ingredients = productData.ingredients
        this.image = productData.image_url
    }

    showInfo() {
        document.getElementById('product-img').src = this.image
        document.getElementById('product-name').innerText = this.name
    }
    
    listIngredients() {
        let tableRef = document.getElementById('ingredient-table')
        for (let i = 1; i  < tableRef.rows.length;) {
            tableRef.deleteRow(i);
        }
        if (!(this.ingredients == null)) {

        for( let key in this.ingredients) {
            let newRow = tableRef.insertRow(-1)
            let newICell = newRow.insertCell(0)
            let newVCell = newRow.insertCell(1)
            let newIText = document.createTextNode(
                this.ingredients[key].text
            )
            let vegStatus = this.ingredients[key].vegan == null ? 
            'unknown' : this.ingredients[key].vegan
            let newVText = document.createTextNode(vegStatus)
            newICell.appendChild(newIText)
            newVCell.appendChild(newVText)
            if (vegStatus === 'no') {
                newVCell.classList.add('non-veg-item')
            } else if (vegStatus === 'unknown' || vegStatus === 'maybe') {
                newVCell.classList.add('unknown-maybe-item')
            }
            }
        }
    }
}