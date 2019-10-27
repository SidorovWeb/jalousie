$(document).ready(function () {
  svg4everybody({});

  $(".js-dialog_big").magnificPopup({
    type: "inline",
    midClick: true,
    removalDelay: 300,

    callbacks: {
      open: function () {
        $(".js-mini-slider-modal")
          .not(".slick-initialized")
          .slick({
            infinite: true,
            autoplay: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplaySpeed: 3000,
            speed: 600,
            dots: true,
            nextArrow: '<i class="arrow icon-arrow-left-light"></i>',
            prevArrow: '<i class="arrow icon-arrow-right-light"></i>'
          });
      }
    }
  });

  $("audio").audioPlayer();

  // fires when the browser window reaches item
  var arrowUp = $(".arrow-up");
  $(document).scroll(function () {
    if ($(document).scrollTop() >= $(".js-type").offset().top) {
      arrowUp.addClass("arrow-up_opacity");
    } else {
      arrowUp.removeClass("arrow-up_opacity");
      arrowUp.removeClass("arrow-up_anim");
    }
  });


  var nvItem = $(".nav__item");
  nvItem.mouseenter(function () {
    nvItem.removeClass("nav__item_active");
  });
  nvItem.mouseleave(function () {
    nvItem.first().addClass("nav__item_active");
  });
  // SLIDER SLICK

  $(".js-slider").slick({
    infinite: true,
    autoplay: true,
    speed: 700,
    autoplaySpeed: 7000,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    nextArrow: '<i class="arrow icon-arrow-left-bold"></i>',
    prevArrow: '<i class="arrow icon-right-bold"></i>',
    asNavFor: ".slider-nav",
    fade: true
  });

  $(".slider-nav").slick({
    slidesToShow: 9,
    slidesToScroll: 1,
    asNavFor: ".js-slider",
    dots: false,
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1
        }
      }
    ]
  });

  $(".js-slider-review").slick({
    // infinite: true,
    // autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    // autoplaySpeed: 6000,
    dots: true,
    speed: 700,
    arrows: true
  });

  $(".js-mini-slider").slick({
    draggable: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    speed: 600,
    easing: true,
    touchMove: false,
    swipe: false,
    swipeToSlide: false,
    nextArrow: '<i class="arrow icon-arrow-left-light"></i>',
    prevArrow: '<i class="arrow icon-arrow-right-light"></i>'
  });

  // mmenu

  $(".menu-icon").click(function () {
    $(this).toggleClass("menu-icon_active");
    $(".mmenu").toggleClass("mmenu_active");
  });

  $(".mmenu__link, .mmenu__nav").click(function () {
    $(".menu-icon").removeClass("menu-icon_active");
    $(".mmenu").removeClass("mmenu_active");
  });

  arrowUp.on("click", function () {
    $(this).addClass("arrow-up_anim");
  });

  //  SCROLL TO ITEM

  $(".slowly").on("click", function (event) {
    event.preventDefault();
    var id = $(this).attr("href"),
      top = $(id).offset().top;
    $("body,html").animate({ scrollTop: top }, 600);
  });

  // FOCUS TO INPUT END TEXTAREA

  $(".form__input, .form__textarea").focus(function () {
    $(this).parent().addClass("focus");
  }).blur(function () {
    if ($(this).val() === "") {
      $(this).parent().removeClass("focus");
    }
    if ($(this).val() === "+7 (   )    -  -  ") {
      $(this).parent().removeClass("focus");
    }
  });

  // INPUT MASKED

  $("input[type='tel']").mask("+7 (999) 999-99-99", { placeholder: " " });

  // Prohibit moving pictures

  $("img, a").on("dragstart", function (event) {
    event.preventDefault();
  });

  // YANDEX MAP

  ymaps.ready(function () {
    var myMap = new ymaps.Map(
      "map",
      {
        center: [55.825689, 49.069296],
        zoom: 9,
        controls: []
      },
      {
        searchControlProvider: "yandex#search"
      }
    ),
      MyIconContentLayout = ymaps.templateLayoutFactory.createClass(
        '<div style="color: #FFFFFF; font-weight: bold;">$[properties.iconContent]</div>'
      ),
      myPlacemark = new ymaps.Placemark([55.28, 37.72]);

    myMap.controls.add("zoomControl");

    myMap.controls.add("trafficControl", {
      float: "right"
    });

    myMap.controls.add("routeButtonControl", {
      float: "right"
    });

    myMap.behaviors.disable("scrollZoom");
    myMap.behaviors.disable("drag");
    myMap.behaviors.disable("multiTouch");

    myMap.geoObjects.add(myPlacemark);
  });
  $(".js-dialog_small").magnificPopup({
    type: "inline",
    midClick: true,
    removalDelay: 300
  });

  $(".holder").fadeOut();
});
