(() => {
  const init = () => {
    buildHTML();
    buildCSS();
    fetchProducts();
    setEvents();
  };

  const config = {
    apiUrl:
      "https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json",
  };

  const buildHTML = () => {
    const html = `
                <div class="recom-like-carousel-container">
                    <div class="recom-like-carousel-title">You Might Also Like</div>
                    <div class="recom-like-carousel-wrapper">
                        <div class="recom-like-carousel"></div>
                        <button class="recom-like-carousel-arrow left">&lt;</button>
                        <button class="recom-like-carousel-arrow right">&gt;</button>
                    </div>
                </div>
            `;
    $(".product-detail").after(html);
  };

  const buildCSS = () => {
    const css = `
      .recom-like-carousel-container {
          margin-left: 15px;
          background-color: #f4f5f7;
          padding-left: 10px;
          box-sizing: border-box;
      }     
      .recom-like-carousel-title {
          font-size: 32px;
          padding: 15px 0px;
          text-align: left;
          line-height: 33px;
          font-weight: lighter;
          color: #29323b;
      }
      .recom-like-carousel-wrapper {
          position: relative;
          overflow: hidden;
      }
      .recom-like-carousel {
          display: flex;       
          gap: 1.5rem;
      }  
       .recom-like-carousel-arrow {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-color: #ddd;
        border: none;
        padding: 10px;
        cursor: pointer;
        font-size: 20px;
        z-index: 10;
        border-radius: 50%;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      } 
      .recom-like-carousel-arrow.left {
        left: -1px;
      }
      .recom-like-carousel-arrow.right {
        right: -1px;
      } 
      .recom-like-carousel-item {
         flex: 0 0 calc(93% / 6.5);
         box-sizing: border-box;
         background-color: #fff;
         position: relative;
         box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
         transition: transform 0.3s ease, box-shadow 0.3s ease;       
      }
        img {
         width: 100%;
         height: auto;
         margin-bottom: 3px;
      }   
       h3 {
          font-size: 14px;
          font-weight: 500;
          padding:5px;
          height: 45px;
          color: #333;
      }
      p {
          color: #193db0;
          font-size: 18px;
          display: inline-block;
          line-height: 22px;
          font-weight: bold;
          margin-top: 10px;
          padding:5px;
      } 
      a:hover,
      a:focus,
      a:active {
           text-decoration: none; 
           color: #0056b3; 
      }   
      .favorite-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        z-index: 5;
        background: #fff;
        border-radius: 5px;
        padding: 5px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      } 
      .favorite-btn .heart-icon {
        fill: #ccc; 
        transition: fill 0.3s ease;
      }    
      .favorite-btn.active .heart-icon {
        fill: #193db0; 
      }
        
      /* media styles */
      @media (min-width: 992px) {
        .recom-like-carousel-container {
          padding-left: 14rem; 
          padding-right: 14rem;
        }                
      }  

      @media (min-width: 991px) and (max-width: 1200px) {
        .recom-like-carousel-item {
          flex: 0 0 calc(100% / 4);
        } 
        .recom-like-carousel-container {
          padding-left: 10rem; 
          padding-right: 10rem;
        }  
      }
        
      @media (min-width: 481px) and (max-width: 991px) {
        .recom-like-carousel-item {
         flex: 0 0 calc(100% / 2.5);
         gap:2rem;
        }
     }     

      @media (max-width: 480px) {
        .recom-like-carousel-item {
          flex: 0 0 calc(100% / 1.5);
        }
      }
      `;
    $("<style>")
      .addClass("recom-like-carousel-style")
      .html(css)
      .appendTo("head");
  };

  const setEvents = () => {
    let currentPosition = 0;
    const $carousel = $(".recom-like-carousel");
    const $wrapper = $(".recom-like-carousel-wrapper");

    $(".recom-like-carousel-arrow.left").on("click", () => {
      const itemWidth = $carousel
        .find(".recom-like-carousel-item")
        .outerWidth(true);
      currentPosition = Math.min(currentPosition + itemWidth, 0);
      $carousel.css("transform", `translateX(${currentPosition}px)`);
    });

    $(".recom-like-carousel-arrow.right").on("click", () => {
      const itemWidth = $carousel
        .find(".recom-like-carousel-item")
        .outerWidth(true);
      const wrapperWidth = $wrapper.width();
      const totalWidth = $carousel.children().length * itemWidth;
      const maxOffset = wrapperWidth - totalWidth - itemWidth;

      currentPosition = Math.max(currentPosition - itemWidth, maxOffset);
      $carousel.css("transform", `translateX(${currentPosition}px)`);
    });

    $(".recom-like-carousel").on("click", ".favorite-btn", function () {
      const $button = $(this);
      const $item = $button.closest(".recom-like-carousel-item");
      const productId = $item.data("id");
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");

      if ($button.hasClass("active")) {
        const updatedFavorites = favorites.filter((id) => id !== productId);
        localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
        $button.removeClass("active");
      } else {
        favorites.push(productId);
        localStorage.setItem("favorites", JSON.stringify(favorites));
        $button.addClass("active");
      }
    });
  };

  const fetchProducts = async () => {
    try {
      const localProducts = localStorage.getItem("products");
      let products = [];

      if (localProducts) {
        products = JSON.parse(localProducts);
      } else {
        const response = await fetch(config.apiUrl);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch products: ${response.status} ${response.statusText}`
          );
        }
        products = await response.json();
        localStorage.setItem("products", JSON.stringify(products));
      }

      populateCarousel(products);
      restoreFavorites();
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("An error occurred while fetching products!");
    }
  };

  const populateCarousel = (products) => {
    const carousel = $(".recom-like-carousel");
    products.forEach((product) => {
      const itemHTML = `
                <div class="recom-like-carousel-item" data-id="${product.id}">
                   <a href="${product.url}" target="_blank">
                        <img src="${product.img}" alt="${product.name}">
                   </a>
                  <a href="${product.url}" target="_blank">
                      <h3>${product.name}</h3>
                  </a>
                  <p>${product.price} TRY</p>                
                  <div class="favorite-btn">
                      <svg class="heart-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>
                      </svg>
                  </div>
                </div>
            `;
      carousel.append(itemHTML);
    });
  };

  const restoreFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    $(".recom-like-carousel-item").each(function () {
      const productId = $(this).data("id");
      if (favorites.includes(productId)) {
        $(this).find(".favorite-btn").addClass("active");
      } else {
        $(this).find(".favorite-btn").removeClass("active");
      }
    });
  };
  init();
})();