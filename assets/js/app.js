//JQuery Module Pattern
"use strict";

const _body = $('body');
const _preloader = $("#preloader");
const _featuredProducts = $(".product");
const _productList = "assets/data/products.json";
const _sidebarClose = $(".sidebar-close");
const _navbarShowHide = $(".navbar-collapse");
const _cartContainer = $(".toggle-container");
const _cartButton = $(".cart-close");
const _cartOverlay = $(".cart-overlay");
const _cartItems = $(".cart-items");
const _cartTotal = $(".cart-total");
const _cartCount = $('.cart-item-count');
const _productsContainer = document.querySelector(".products-container");
const _productSearch = $('.search-input');
const _searchEmpty = document.querySelector('.empty-search');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartTotal = 0;
let item = '';

const app = {
    init() {
        app.productsLoad();
        app.updateCartCount();
        app.closeSidebar();
        app.cartShow();
        app.cartHide();
        app.addingItemsToCart();
        app.calculateCartItemsTotal();
        app.modifyCartItems();
        app.productSearch();
    },

    // Load the Products JSON file 
    productsLoad() {
        $.ajax(_productList, {
            dataType: "json",
            method: "GET",
            success: function(response) {

                // For Home Page Content
                _featuredProducts.map((i, product) => {
                   
                  return product.innerHTML = `
                  <div class="product-container">
                  <img src="${response[i].src}" class="product-img img" alt="${response[i].name}">
                 
                  <div class="product-icons">
                    <a href="product.html?id=${response[i].id}" class="product-icon">
                      <i class="fa fa-search"></i>
                    </a>
                    <button class="product-cart-btn product-icon" data-id="${response[i].id}">
                      <i class="fa fa-shopping-cart"></i>
                    </button>
                  </div>
                </div>
                <footer>
                  <p class="product-name">${response[i].name}</p>
                  <h4 class="product-price">$${response[i].price}</h4>
                </footer>
                  `
                })

                //For Products Page

               if(_productsContainer !== (undefined || null)) {
                for(let i = 0; i < response.length; i++) {
                  let item = document.createElement("div");
                  let  itemContent = `
                  <div class="product-container">
                  <img src="${response[i].src}" class="product-img img" alt="${response[i].name}">
                 
                  <div class="product-icons">
                    <a href="product.html?id=${response[i].id}" class="product-icon">
                      <i class="fa fa-search"></i>
                    </a>
                    <button class="product-cart-btn product-icon" data-id="${response[i].id}">
                      <i class="fa fa-shopping-cart"></i>
                    </button>
                  </div>
                </div>
                <footer>
                  <p class="product-name">${response[i].name}</p>
                  <h4 class="product-price">$${response[i].price}</h4>
                </footer>
                  `
                  item.className= "product";
                  item.innerHTML = itemContent
                  _productsContainer.appendChild(item);
                 }
                 console.log(_featuredProducts);
               }
                
            },
            error: function(request, errorMsg) {
                console.log("Ajax failed: " +request + errorMsg);
            }
        }) 
    },

    //Close Navbar Sidebar
   closeSidebar () {
     _sidebarClose.on("click", function() {
        _navbarShowHide.removeClass("show").animate("slow");
     })
   },

   //Show Cart
   cartShow() {
    _cartContainer.on('click', function() {
        _cartOverlay.addClass("show");
    })
   },

   //Hide Cart
   cartHide() {
     _cartButton.on("click", function() {
      _cartOverlay.removeClass("show");
     })
   },

   //Add Items to the Cart
   addingItemsToCart() {

    cart.map((product) => {
      app.addingCartItemsToHtml(product);
    })

    let _container = $('#products-container');

    //Listen Click on products or product Container
     $(_container).add(_featuredProducts).on("click", function(event){
      event.preventDefault();
      console.log(event.target);
      let addToCartBtn = event.target.closest("button");
      
     //Delegate & check if the cart button is clicked
     if( $(addToCartBtn).hasClass("product-cart-btn")) {
      let that = addToCartBtn.closest('.product');
      let productId = that.querySelector(".product-cart-btn").getAttribute("data-id");
      let productImageAlt = that.querySelector(".product-img").alt;
      let productImageSrc = that.querySelector(".product-img").attributes.src.value;
      let productTitle = that.querySelector(".product-name").innerHTML;
      let productPrice = parseFloat(that.querySelector(".product-price").innerHTML.slice(1));
      let productAmount = 1;
      let duplicateItem = cart.find(([item]) => item === productId);
      _cartItems.empty();

      //Check for duplicate item in cart
      if(duplicateItem) {
        duplicateItem[(duplicateItem.length)-1] += 1;
        app.calculateCartItemsTotal();
      }
      else {
        cart.push([productId, productImageAlt, productImageSrc, productTitle, productPrice, productAmount]);
        _cartOverlay.addClass("show");
        app.calculateCartItemsTotal();
      }

      console.log(cart.length);
      localStorage.setItem('cart', JSON.stringify(cart));
     
        cart.map((product) => {
          app.addingCartItemsToHtml(product);
        })
     }
     })
   },

   // Add Cart Items to Html
   addingCartItemsToHtml(product) {
    let addedItem = `
    <div class="cart-item" data-id="${product[0]}">
 <img src="${product[2]}" class="cart-item-img" alt="${product[1]}">  
         <div class="cart-item-details">
           <h4 class="cart-item-name">${product[3]}</h4>
           <p class="cart-item-price">$${product[4]}</p>
           <button class="cart-item-remove-btn" data-id="">remove</button>
         </div>
       
         <div>
           <button class="cart-item-increase-btn" data-id="${product[0]}">
             <i class="fa fa-chevron-up"></i>
           </button>
           <p class="cart-item-amount" data-id="${product[0]}">${product[5]}</p>
           <button class="cart-item-decrease-btn" data-id="${product[0]}">
             <i class="fa fa-chevron-down"></i>
           </button>
         </div>
</div>`
let cartContainer = document.createElement('div');
cartContainer.innerHTML = addedItem;
_cartItems.append(cartContainer);

   },

   // Add or Delete Cart Items
  modifyCartItems() {

    _cartItems.on('click', function(event) {
      let cartItemAmount = 0;
      let buttonClicked = event.target.closest('button');
      if($(buttonClicked).hasClass('cart-item-increase-btn')) {
        cartItemAmount = Number(buttonClicked.nextElementSibling.innerHTML);
            cartItemAmount += 1;
            $(buttonClicked).next('p').html(cartItemAmount);
            cart.map((item) => {
              item[0] === buttonClicked.getAttribute('data-id') ? item[5] = cartItemAmount : item[5];
            })
            localStorage.setItem('cart', JSON.stringify(cart));
            app.calculateCartItemsTotal();

      }
      if($(buttonClicked).hasClass('cart-item-decrease-btn')) {
        let cartItemAmount = Number(buttonClicked.previousElementSibling.innerHTML);
        cartItemAmount -= 1;
        cartItemAmount == 0 ? app.removeCartItems(event) : $(buttonClicked).prev('p').html(cartItemAmount);
        cart.map((item) => {
          item[0] === buttonClicked.getAttribute('data-id') ? (cartItemAmount == 0 ? app.removeCartItems(event) : item[5] = cartItemAmount) : item[5];
        })
        localStorage.setItem('cart', JSON.stringify(cart));
        app.calculateCartItemsTotal();
      }
      if($(buttonClicked).hasClass('cart-item-remove-btn')) {
        app.removeCartItems(event);
      }

    })
  },

  // Remove Cart Items on remove button click
  removeCartItems(event) {
    let parent = event.target.closest(".cart-item");
    console.log(parent);
    parent.remove();
    cart.map((item, index) => {
       if(item[0] === parent.getAttribute('data-id')) {
        console.log(cart[index]);
        cart.splice(index, 1);
        
       }
    })
    localStorage.setItem('cart', JSON.stringify(cart));
    app.calculateCartItemsTotal();
  },

  // Update Cart Count in Navbar Cart Icon
  updateCartCount() {
    let cartCount = 0;
    cart.map((item) => {
       cartCount += item[item.length - 1];
    })
    _cartCount.html(cartCount);
  },

  //Calculate the Cart Total
  calculateCartItemsTotal() {
    cartTotal = 0;
   cart.map((item) => {
     let total = (item[item.length - 2]) * (item[item.length - 1]);
     cartTotal = Math.round((cartTotal + total) * 100) / 100;
     
   })
   let totalContent = `Total : $${cartTotal}`;
   _cartTotal.html(totalContent);
   app.updateCartCount();
 },

 productSearch() {
    $(_productSearch).on('input', function(){
      console.log(this.value);
      let productList = Array.from(document.querySelectorAll('.product-name'));
      productList.map((product)=> {
        product.closest('.product').classList.add('none');
      })
     if (productList.filter((product) => {
        return ((product.innerText.toLowerCase().indexOf(this.value.toLowerCase()) ) !== -1 ?  product.closest('.product').classList.remove('none') : '');
      }) == 0) return _searchEmpty.classList.remove('none');
      else {
        _searchEmpty.classList.add('none');
      }
    })
 }


  
}



$(() => {
	app.init();
});


$(window).on('load', function() {
    _preloader.fadeOut('slow', function(){
		_body.css({'overflow-y':'unset'});
	});
})