//JQuery Module Pattern
"use strict";

const _body = $('body');
const _preloader = $("#preloader");
const _featuredProducts = $(".product");
const _productList = "assets/data/products.json";
const _sidebarClose = $(".sidebar-close");
const _navbar = $(".navbar");
const _navbarToggler = $(".navbar-toggler");
const _navbarShowHide = $(".navbar-collapse");
const _cartContainer = $(".toggle-container");
const _cartButton = $(".cart-close");
const _cartOverlay = $(".cart-overlay");
const _cartItems = $(".cart-items");
const _cartTotal = $(".cart-total");
const _cartCount = $('.cart-item-count');
const _cartCheckout = $('.cart-checkout');
const _companyButtons = $('.company-btn');
const _productSearch = $('.search-input');
const _priceRangeSelect = $('.price-filter');
const _cardDiv = $(".e-money");
const _CODDiv = $(".cash-on-delivery");
const _priceRangeValue = document.querySelector('.price-value');
const _productsContainer = document.querySelector(".products-container-outer");
const _searchEmpty = document.querySelector('.empty-search');
const _checkoutTotalSpan = document.querySelector('.total-span');
const _checkoutFinalTotalSpan = document.querySelector('.final-total-span');
let pageTitle = document.querySelector('.page-hero-title');
let updateCheckoutList = document.querySelector('.cart-list');
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let cartTotal = 0;
let item = '';

const app = {
    init() {
        app.productsLoad();
        app.updateCartCount();
        app.closeSidebar();
        app.bodyOverlay();
        app.cartShow();
        app.cartHide();
        app.addingItemsToCart();
        app.calculateCartItemsTotal();
        app.modifyCartItems();
        app.productSearch();
        app.filterByCompanyName();
        app.cashOnDeliveryToggle();
        app.updateCheckout();
    },

    // Load the Products JSON file 
    productsLoad() {
        $.ajax(_productList, {
            dataType: "json",
            method: "GET",
            success: function(response) {
                localStorage.setItem('data', JSON.stringify(response));
                // For Home Page Content  
                _featuredProducts.map((i, product) => {
                   
                  return product.innerHTML = `
                  <div class="product-container">
                  <img src="${response[i].src}" class="product-img img" alt="${response[i].name}">
                 
                  <div class="product-icons">
                    <a href="product.html?id=${response[i].id}" class="product-icon hover product-details"  data-id="${response[i].id}">
                      <i class="fa fa-search"></i>
                    </a>
                    <button class="product-cart-btn product-icon hover" data-id="${response[i].id}">
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
                  <div class="product-container" data-company="${response[i].company}">
                  <img src="${response[i].src}" class="product-img img" alt="${response[i].name}">
                 
                  <div class="product-icons">
                    <a href="product.html?id=${response[i].id}" class="product-icon hover product-details" data-id="${response[i].id}">
                      <i class="fa fa-search"></i>
                    </a>
                    <button class="product-cart-btn product-icon hover" data-id="${response[i].id}">
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
               }
                
            },
            error: function(request, errorMsg) {
                console.log("Ajax failed: " +request + errorMsg);
            }
        }) 
    },

    //Add Overlay to body and stop scroll when navbar is collapsed
    bodyOverlay() {
     _navbarToggler.on("click", (e) => {
       e.preventDefault();
       _body.addClass("overlay");
     })
    },

    //Close Navbar Sidebar
   closeSidebar () {
     _sidebarClose.on("click", function() {
        _navbarShowHide.removeClass("show").animate("slow");
        _body.removeClass("overlay");
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

   //Show Hide Cash on Delivery

   cashOnDeliveryToggle() {
    $('input[type=radio]').on("click", function() {
      if($('.card-radio:checked').length > 0) {
        _cardDiv.removeClass("none");
        _CODDiv.addClass("none");
      }
 
      else {
        _cardDiv.addClass("none");
        _CODDiv.removeClass("none");
      }
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
      let buttonClicked = event.target.closest("button") || event.target.closest('a');
      
     //Delegate & check if the cart button is clicked
     if( $(buttonClicked).hasClass("product-cart-btn")|| $(buttonClicked).hasClass("addToCartBtn")) {
      let productId = "";
      let productImageAlt = "";
      let productImageSrc = "";
      let productTitle = "";
      let productPrice = "";
       if(buttonClicked.classList.contains("product-cart-btn")) {
        let that = buttonClicked.closest('.product');
        productId = that.querySelector(".product-cart-btn").getAttribute("data-id");
        productImageAlt = that.querySelector(".product-img").alt;
        productImageSrc = that.querySelector(".product-img").attributes.src.value;
        productTitle = that.querySelector(".product-name").innerHTML;
        productPrice = parseFloat(that.querySelector(".product-price").innerHTML.slice(1));
       }

       else {
        let container = buttonClicked.closest(".single-product-container");
        let singleProductName = container.querySelector(".single-product-title");
        let singleProductPrice = container.querySelector(".single-product-price");
        let singleProductImage = container.querySelector(".single-product-image");
        productId = buttonClicked.getAttribute('data-id');
        productImageAlt = singleProductImage.alt;
        productImageSrc = singleProductImage.attributes.src.value;
        productTitle = singleProductName.innerHTML;
        productPrice = parseFloat(singleProductPrice.innerHTML.slice(1));
       }
      
      let productAmount = 1;
      let duplicateItem = cart.find(item => item.id === parseInt(productId) ? item.amount += 1 : '');
      console.log(duplicateItem);
      _cartItems.empty();

      //Check for duplicate item in cart
      if(duplicateItem) {
        duplicateItem[(duplicateItem.length)-1] += 1;
        app.calculateCartItemsTotal();
      }
      else {
        cart.push({id: parseInt(productId), imageAlt: productImageAlt, imageSrc: productImageSrc, title: productTitle, price: productPrice, amount: productAmount});
        app.calculateCartItemsTotal();
      }

      _cartOverlay.addClass("show");

      localStorage.setItem('cart', JSON.stringify(cart));
     
        cart.map((product) => {
          app.addingCartItemsToHtml(product);
        })
     }
       else if(($(buttonClicked).hasClass("product-details"))) {
          let id = buttonClicked.getAttribute('data-id')
          sessionStorage.setItem('id', JSON.stringify(id));
          window.open('/product.html?id='+ id, '_self')
         
        }
     })
   },

   // Add Cart Items to Html
   addingCartItemsToHtml(product) {
    let addedItem = `
    <div class="cart-item" data-id="${product.id}">
 <img src="${product.imageSrc}" class="cart-item-img" alt="${product.imageAlt}">  
         <div class="cart-item-details">
           <h4 class="cart-item-name">${product.title}</h4>
           <p class="cart-item-price">$${product.price}</p>
           <button class="cart-item-remove-btn" data-id="">remove</button>
         </div>
       
         <div>
           <button class="cart-item-increase-btn" data-id="${product.id}">
             <i class="fa fa-chevron-up"></i>
           </button>
           <p class="cart-item-amount" data-id="${product.id}">${product.amount}</p>
           <button class="cart-item-decrease-btn" data-id="${product.id}">
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
              item.id === buttonClicked.getAttribute('data-id') ? item.price = cartItemAmount : item.price;
            })
            localStorage.setItem('cart', JSON.stringify(cart));
            app.calculateCartItemsTotal();

      }
      if($(buttonClicked).hasClass('cart-item-decrease-btn')) {
        let cartItemAmount = Number(buttonClicked.previousElementSibling.innerHTML);
        cartItemAmount -= 1;
        cartItemAmount == 0 ? app.removeCartItems(event) : $(buttonClicked).prev('p').html(cartItemAmount);
        cart.map((item) => {
          item.id === buttonClicked.getAttribute('data-id') ? (cartItemAmount == 0 ? app.removeCartItems(event) : item.price = cartItemAmount) : item.price;
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
    parent.remove();
    cart.map((item, index) => {
       if(item.id === parent.getAttribute('data-id')) {
        cart.splice(index, 1);
        
       }
    })
    localStorage.setItem('cart', JSON.stringify(cart));
    app.calculateCartItemsTotal();
  },

  // Update Cart Count in Navbar Cart Icon
  updateCartCount() {
    let cartAmount = cart.map(item => item.amount)
    console.log(cartAmount);
    let cartCount = cartAmount.reduce((acc, cur) => acc + cur, 0)
    console.log(cartCount);
    _cartCount.html(cartCount);
  },

  //Calculate the Cart Total
  calculateCartItemsTotal() {
    cartTotal = 0;
   cart.map((item) => {
     let total = (item.price) * (item.amount);
     cartTotal = Math.round((cartTotal + total) * 100) / 100;
     
   })
   let totalContent = `Total : $${cartTotal}`;
   localStorage.setItem('total', JSON.stringify(cartTotal))
   _cartTotal.html(totalContent);
   app.updateCartCount();
 },

 productSearch() {
    $(_productSearch).on('input', function(){
     
      let productList = Array.from(document.querySelectorAll('.product-name'));
      productList.map((product)=> {
        !product.closest('.product').classList.contains('none') ? product.closest('.product').classList.add('none') : '';
      })
      let filteredCount = 0
      productList.filter((product) => {
       return ((product.innerText.toLowerCase().indexOf(this.value.toLowerCase()) ) !== -1 ?  (product.closest('.product').classList.remove('none'), filteredCount+=1) : '');
       
      })

      filteredCount === 0 ? _searchEmpty.classList.remove('none') : _searchEmpty.classList.add('none');
      if(this.value == '') {
        $(".company-btn.active").trigger('click');
      }
    })
 },

filterByCompanyName() {

  $(_companyButtons).on('click', (e) => {
    let that = e.target
    $(that).addClass('active').siblings().removeClass('active');
    let allproducts = Array.from(document.querySelectorAll('.product-container'));
    let buttonValue = e.target.innerText.toLowerCase();
    allproducts.filter((product) => {
        !product.parentElement.classList.contains('none') ? product.parentElement.classList.add('none') : '';
        let productValue = product.getAttribute('data-company').replace(/\s/g, "").slice(2).toLowerCase();
        return (buttonValue !== 'all' ?  productValue === buttonValue : product)
    }).map((item) => {
      item.parentElement.classList.remove('none');
    })
  })


},

priceRangeSelector() {
  _priceRangeValue.innerHTML = `Value : $${_priceRangeSelect.val()}`
  $(_priceRangeSelect).on('input change', (e) => {
    let allItems = [...(document.querySelectorAll('.product-price'))];
    let value = parseFloat(e.target.value);
    let textContent = `Value : $${value}`;
    _priceRangeValue.innerHTML = textContent;
    let filteredItems = allItems.filter((el) => {
      el.closest('.product').classList.add('none');
      let elValue = parseFloat((el.innerHTML).replace('$', ''));
       if(elValue <= value && value > 6) return el;
    })
    filteredItems.map((product) => {
      product.closest('.product').classList.remove('none');
    })
    filteredItems.length === 0 ? _searchEmpty.classList.remove('none') : _searchEmpty.classList.add('none');
  })  
},

singleProductDetails() {
  let productId = JSON.parse(sessionStorage.getItem('id'));
    let data = JSON.parse(localStorage.getItem('data'));
    Object.keys(data).forEach((key) => {
     if(Object.values(data[key]).includes(productId)) {
      let singleProductTitle = document.querySelector('.single-product-title');
      let singleProductCompany = document.querySelector('.single-product-company');
      let singleProductPrice = document.querySelector('.single-product-price');
      let singleProductColors = document.querySelector('.single-product-colors');
      let singleProductDescription = document.querySelector('.single-product-desc');
      let singleProductImage = document.querySelector('.single-product-image');
      let singleProductButton = document.querySelector('.addToCartBtn');
       pageTitle.innerHTML = `HOME / ${data[key].name}`;
       singleProductTitle.innerHTML = data[key].name;
       singleProductCompany.innerHTML = data[key].company;
       singleProductPrice.innerHTML = `$${data[key].price}`;
       singleProductDescription.innerHTML = data[key].description;
       singleProductImage.src = data[key].src;
       singleProductImage.alt = data[key].name;
       singleProductButton.setAttribute('data-id', data[key].id)
        if(data[key].product_colors.length !== 1) {
          let span1 = document.createElement("span");
          let span2 = document.createElement("span");
          span1.style.backgroundColor = data[key].product_colors[0].color_1;
          span1.classList.add('product-color');
          span2.style.backgroundColor = data[key].product_colors[1].color_2;
          span2.classList.add('product-color');
          singleProductColors.appendChild(span1);
          singleProductColors.appendChild(span2);
        }

        else {
          let span1 = document.createElement("span");
          span1.style.backgroundColor = data[key].product_colors[0].color_1;
          span1.classList.add('product-color');
          singleProductColors.appendChild(span1);
        }
     }
    })
},

//Update checkout page summary

updateCheckout() {
  let checkoutData = JSON.parse(localStorage.getItem('cart'));
  let checkoutTotal = 0;
  checkoutData.map((cart) => {
    let li = document.createElement("li");
    li.innerHTML = `
    <div class="checkout-img"><img src="${cart.imageSrc}" alt="${cart.imageAlt}" /></div>
      <div class="item-details">
      <span>
      ${cart.title}
      </span>
      <span>
      ${cart.amount}
      </span>
      <p class="item-price">
        $${cart.price}
      </p>
    </div>
    `
    updateCheckoutList.appendChild(li);

  })
  checkoutTotal = parseFloat(JSON.parse(localStorage.getItem('total')));
   console.log(checkoutTotal);
  _checkoutTotalSpan.innerHTML = `<b>$${checkoutTotal}</b>`;
  _checkoutFinalTotalSpan.innerHTML = `<b>$${checkoutTotal + 50}</b>`;
},


  
}



$(() => {
	app.init();
});


$(window).on('load', function() {
  let path = window.location.pathname;
  let page = path.split("/").pop();
  page === 'product.html' ? app.singleProductDetails() : '';
  page === 'products.html' ? app.priceRangeSelector() : '';
    _preloader.fadeOut('slow', function(){
		_body.css({'overflow-y':'unset'});
	});
})