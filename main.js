(function () {
  "use strict";

  AOS.init({
    ease: "slide",
    once: true,
  });

  var slider = function () {
    var heroSlider = document.querySelectorAll(".hero-slider");

    if (heroSlider.length > 0) {
      var heroSlider = tns({
        container: ".hero-slider",
        items: 1,
        mode: "carousel",
        autoplay: true,
        animateIn: "tns-fadeIn",
        animateOut: "tns-fadeOut",
        speed: 700,
        nav: true,
        controls: false,
        autoplayButtonOutput: false,
      });
    }

    var guestReviewSlider = document.querySelectorAll(".guest-review-slider");

    if (guestReviewSlider.length > 0) {
      tns({
        container: ".guest-review-slider",
        items: 1,
        mode: "carousel",
        autoplay: true,
        autoplayTimeout: 6500,
        speed: 650,
        nav: true,
        controls: true,
        autoplayButtonOutput: false,
        mouseDrag: true,
      });
    }
  };
  slider();
})();
