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
        nav: false,
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

  var nearbyVideos = document.querySelectorAll("video[data-nearby-autoplay]");
  var reducedMotion = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function loadVideo(video) {
    var source = video.querySelector("source[data-src]");
    if (!source) return;

    source.src = source.getAttribute("data-src");
    source.removeAttribute("data-src");
    video.load();
  }

  function playVideo(video) {
    if (reducedMotion && video.classList.contains("hero-background-video")) return;

    loadVideo(video);
    if (reducedMotion) return;

    var playback = video.play();
    if (playback && typeof playback.catch === "function") {
      playback.catch(function (error) {
        if (error.name !== "NotAllowedError" && error.name !== "AbortError") {
          console.warn("Unable to autoplay nearby video.", error);
        }
      });
    }
  }

  if ("IntersectionObserver" in window) {
    var videoObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.dataset.nearby = "true";
            playVideo(entry.target);
          } else {
            delete entry.target.dataset.nearby;
            entry.target.pause();
          }
        });
      },
      { rootMargin: "250px 0px", threshold: 0.1 },
    );

    nearbyVideos.forEach(function (video) {
      videoObserver.observe(video);
    });
  } else {
    var checkNearbyVideos = function () {
      nearbyVideos.forEach(function (video) {
        var bounds = video.getBoundingClientRect();
        if (bounds.bottom >= -250 && bounds.top <= window.innerHeight + 250) {
          if (video.dataset.nearby !== "true") {
            video.dataset.nearby = "true";
            playVideo(video);
          }
        } else if (video.dataset.nearby === "true") {
          delete video.dataset.nearby;
          video.pause();
        }
      });
    };

    window.addEventListener("scroll", checkNearbyVideos, { passive: true });
    window.addEventListener("resize", checkNearbyVideos);
    checkNearbyVideos();
  }
})();
