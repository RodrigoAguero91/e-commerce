const socketClient=io()

socketClient.on("enviodeproducts",(obj)=>{
    updateProductList(obj)
})


function updateProductList(productList) {
 
    const productsDiv  = document.getElementById('list-products')

    let productosHTML = "";
  
    productList.forEach((product) => {
        productosHTML += `
        <div class="card bg-secondary mb-3 mx-4 my-4" style="max-width: 20rem;">
            <div class="card-header bg-success text-white">id: ${product.id}</div>
              <div class="card-body bg-light">
                  <ul class="list-unstyled">
                      <li>Titulo:${product.title}</li>
                      <li>Description:${product.description}</li>
                      <li>Precio:${product.price}</li>
                      <li>Stock:${product.stock}</li>
                      <li>Status:${product.status}</li>
                      <li>Categoria:${product.category}</li>
                      <li>Codigo:${product.code}</li>
                      <li>
                        <img>Img:${product.imagen}</img>
                      </li>
                  </ul>
              </div>  
        </div>`;
    });
  
    productsDiv .innerHTML = productosHTML;
  }


  let form = document.getElementById("formProduct");
  form.addEventListener("submit", (evt) => {
    evt.preventDefault();
  
    let title = form.elements.title.value;
    let description = form.elements.description.value;
    let stock = form.elements.stock.value;
    let thumbnail = form.elements.thumbnail.value;
    let category = form.elements.category.value;
    let price = form.elements.price.value;
    let code = form.elements.code.value;
    let status = form.elements.status.checked; 
    socketClient.emit("addProduct", {
      title,
      description,
      stock,
      thumbnail,
      category,
      price,
      code,
      status, 
  
    });
  
    form.reset();
  });


  
  //para eliminar por ID
document.getElementById("delete").addEventListener("click", function () {
    const deleteidinput = document.getElementById("prod");
    const deleteid = deleteidinput.value;
    socketClient.emit("deleteProduct", deleteid);
    deleteidinput.value = "";
  })



