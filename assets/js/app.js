const _body = $('body');
const _preloader = $("#preloader");
const _featuredProducts = $(".product")
const _productList = "assets/data/products.json";
const _sidebarClose = $(".sidebar-close");
const _navbarShowHide = $(".navbar-collapse");
const _cartContainer = $(".toggle-container");
const _cartButton = $(".cart-close");
const _cartOverlay = $(".cart-overlay");
const _cartItems = $(".cart-items");
const _productContainer = $(".product");

const app = {
    init() {
        app.productsLoad();
        app.closeSidebar();
        app.cartShow();
        app.cartHide();
        app.addingItemsToCart();
    },

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
                
            },
            error: function(request, errorMsg) {
                console.log("Ajax failed: " +request + errorMsg);
            }
        }) 
    },

   closeSidebar () {
     _sidebarClose.on("click", function() {
        _navbarShowHide.removeClass("show").animate("slow");
     })
   },

   cartShow() {
    _cartContainer.on('click', function() {
        _cartOverlay.addClass("show");
    })
   },

   cartHide() {
     _cartButton.on("click", function() {
      _cartOverlay.removeClass("show");
     })
   },

   addingItemsToCart() {
     $(_productContainer).on("click", function(event){
       event.preventDefault();
       console.log($(this));
       let productTitle = $(this).find(".product-name");
       let productPrice = $(this).find(".product-price");

       console.log(productTitle.innerText, productPrice.innerTex);
      let addToCartBtn = event.target.closest("button");
     if( $(addToCartBtn).hasClass("product-cart-btn")) {
       
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