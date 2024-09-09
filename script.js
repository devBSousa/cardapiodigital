const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const cartObs = document.getElementById("obs")
const nameInput = document.getElementById("name")
const nameWarn = document.getElementById("name-warn")
const bairroInput = document.getElementById("bairro")
const bairroWarn = document.getElementById("bairro-warn")
const ruaInput = document.getElementById("rua")
const ruaWarn = document.getElementById("rua-warn")
const hnumberInput = document.getElementById("housenumber")
const hnumberWarn = document.getElementById("hnumber-warn")
const complementoInput = document.getElementById("complemento")

let cart = [];


cartBtn.addEventListener("click", function(){
    updateCartModal();
    cartModal.style.display = "flex"
})

cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    } 
})

closeModalBtn.addEventListener("click", function(event){
    cartModal.style.display = "none"
})

menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    
    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
    if(parentButton){
        Toastify({
            text: "Item adicionado ao carrinho",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#22c55e",
            },
            onClick: function(){} // Callback after click
          }).showToast();
        return;
    }
})


function addToCart(name, price){
    const existemItem = cart.find(item => item.name === name)
    if(existemItem){
        existemItem.quantity +=1
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }
   
    updateCartModal()
}

//atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item =>{
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                    <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
                    
                </div>
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>  
            </div>
        `
        total += item.price * item.quantity;
        
        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

//função para remover item do carrinho
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")
        removeItemCart(name);
    }
}) 

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1){
        const item = cart[index];
        console.log(item);
        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal()
    }
}

//funções dos inputs de dados do usuário
nameInput.addEventListener("input", function(event){
    let InputValue = event.target.value;
    
    if(InputValue !== ""){
        nameInput.classList.remove("border-red-500")
        nameWarn.classList.add("hidden")
    }
})

bairroInput.addEventListener("input", function(event){
    let inputValue = event.target.value;
    if(inputValue !==""){
        bairroWarn.classList.add("hidden")
    }
})

ruaInput.addEventListener("input", function(event){
    let InputValue = event.target.value;
    if(InputValue !==""){
        ruaWarn.classList.add("hidden")
    }
})

hnumberInput.addEventListener("input", function(event){
    let InputValue = event.target.value;
    if(InputValue !==""){
        hnumberWarn.classList.add("hidden")
    }
})

//funções botao finalizar pedido
checkoutBtn.addEventListener("click", function(){
    
    const isOpen = checkopen();
    if(!isOpen){
        Toastify({
            text: "Estabelecimento fechado no momento!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
            onClick: function(){} // Callback after click
          }).showToast();
        return;
    }
    
    if(cart.length === 0){
        Toastify({
            text: "Seu carrinho está vázio!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
            onClick: function(){} // Callback after click
          }).showToast();
          return;
    };

    if(nameInput.value === ""){
        nameWarn.classList.remove("hidden")
        nameInput.classList.add("border-red-500")
        return;
    }

    if(bairroInput.value === ""){
        bairroWarn.classList.remove("hidden")
        return;
    }

    if(ruaInput.value ===""){
        ruaWarn.classList.remove("hidden")
        return;
    }

    if(hnumberInput.value ===""){
        hnumberWarn.classList.remove("hidden")
        return;
    }

    
    
    let taxaEntrega = 5
    let total = cart.reduce((acc, item) => acc + item.price * item.quantity + taxaEntrega, 0);

    //Enviar para o whatsApp
    const cartItems = cart.map((item) => {
        const totItem = (item.quantity * item.price).toFixed(2);
        return(
            `${item.name} - QTD: ${item.quantity} - Preço: R$${totItem}`
        )
    }).join("\n")
    const separator = "-".repeat(50);
    const message = `*Resumo do Pedido:*\n${cartItems}\n\n*Observação:* ${cartObs.value}\n${separator}\n*Nome:* ${nameInput.value}\n*Rua:* ${ruaInput.value} - ${hnumberInput.value}\n*Bairro* ${bairroInput.value}\n*Complemento:* ${complementoInput.value}\n${separator}\n*TOTAL + taxa de entrega:* *R$${total.toFixed(2)}*`
    const phone = "5588997349933"

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank")

    cart = [];
    updateCartModal()
    
})

//verificar hora e manipular horario 
function checkopen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 0 && hora < 24;
    //estabelecimento aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkopen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}
