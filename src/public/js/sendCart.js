const products = document.getElementsByClassName('product');
const btnCartFinal = document.getElementById('cartFinal')
const modalBody = document.getElementById('modalBody')
console.log(products)
const arrayProducts = Array.from(products);
console.log(arrayProducts)

const productsInCart = () => {
    fetch('http://localhost:8080/products/inCart')
        .then(response => response.json())
        .then(data => {

            if (data.cartLength > 0) {
                let products = ''
                data.productsInCart.forEach((product, key) => {
                    products += `<h6>${key + 1}) ${product.title} : ${product.quantity}<h6>`
                })

                modalBody.innerHTML = products
            }

            else {
                modalBody.innerHTML = `<h3> Carro Vacio!! </h3>`
            }
        });

}

arrayProducts.forEach(product => {
    product.addEventListener('click', () => {
        
        const stock = Number(product.getAttribute('data-value'))
        Swal.fire({
            title: 'Agregar cantidad',
            input: 'number',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Confirmar',
        }).then(response => {
            
            if (stock > Number(response.value) && Number(response.value) > 0) {
                Swal.fire({
                    title: 'Producto agregado',
                    text: `ID: ${product.id} - Quantity: ${response.value}`,
                    icon: 'success',

                })
                fetch('http://localhost:8080/products', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ product: { _id: product.id, quantity: Number(response.value) } }),
                })

                productsInCart()

            }
            else{
                Swal.fire({
                    title: 'producto no agregado',
                    icon: 'error',

                })
            }
        })
    })
});



btnCartFinal.addEventListener('click', () => {
    Swal.fire({
        title: 'finalizar compra?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#73be73',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes!'
    }).then(response => {
        if (response.isConfirmed) {
            fetch('http://localhost:8080/products/inCart')
                .then(response => response.json())
                .then(data => {
                    if (data.cartLength > 0) {
                        fetch('http://localhost:8080/products', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ finishBuy: true }),
                        }).then(
                            Swal.fire({
                                title: 'Compra completada!',
                                icon:'success'
                            }
                            )
                        ).then(
                            modalBody.innerHTML = `<h3> carrito vacio </h3>`
                        )
                    }
                   
                })
        }
        else {
            Swal.fire({
                title: 'La compra aún no se ha realizado',
                icon: 'info'
            }

            )
        }
    });

})


productsInCart()