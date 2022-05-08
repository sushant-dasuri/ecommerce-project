const _body = $('body');
const _preloader = $("#preloader");
const _featuredProducts = $(".product")
const _productList = "assets/data/products.json";
const _sidebarClose = $(".sidebar-close");
const _navbarShowHide = $(".navbar-collapse");

const app = {
    init() {
        app.productsLoad();
        app.closeSidebar();
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
   }
}

$(() => {
	app.init();
	console.log('Ecommerce Website');
});


$(window).on('load', function() {
    _preloader.delay(2000).fadeOut('slow', function(){
		_body.css({'overflow-y':'unset'});
	});
})