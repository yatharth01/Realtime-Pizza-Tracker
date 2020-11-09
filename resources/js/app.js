import axios from 'axios'
const { update } = require("../../app/models/Menu")

let addToCart = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(pizza){
    axios.post('/update-cart',pizza).then((res)=>{
        console.log(res)
        cartCounter.innerHTML = res.data.totalQty
    })
}

addToCart.forEach((btn)=>{
    btn.addEventListener('click',(e)=>{
        let pizza = JSON.parse(btn.dataset.pizza)
        console.log(pizza)
        updateCart(pizza)
    })
})