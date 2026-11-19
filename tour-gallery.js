document.addEventListener("DOMContentLoaded", function () {
  var links = Array.prototype.slice.call(
    document.querySelectorAll(".gallery-grid a[data-gallery]"),
  );
  if (links.length) {
    var current = 0,
      requestId = 0,
      imageCache = Object.create(null),
      viewer = document.createElement("div");
    viewer.className = "tour-lightbox";
    viewer.setAttribute("role", "dialog");
    viewer.setAttribute("aria-modal", "true");
    viewer.setAttribute(
      "aria-label",
      links[0].getAttribute("data-gallery") === "stone-town"
        ? "Stone Town image gallery"
        : "Tour image gallery",
    );
    viewer.innerHTML =
      '<button class="tour-lightbox-close" type="button" aria-label="Close gallery">&times;</button><button class="tour-lightbox-prev" type="button" aria-label="Previous image"><i class="fa fa-chevron-left"></i></button><figure><img src="" alt=""><figcaption></figcaption></figure><button class="tour-lightbox-next" type="button" aria-label="Next image"><i class="fa fa-chevron-right"></i></button><div class="tour-lightbox-count" aria-live="polite"></div><div class="tour-lightbox-status" role="status" aria-live="polite"></div>';
    document.body.appendChild(viewer);
    var image = viewer.querySelector("img"),
      caption = viewer.querySelector("figcaption"),
      count = viewer.querySelector(".tour-lightbox-count"),
      status = viewer.querySelector(".tour-lightbox-status"),
      closeButton = viewer.querySelector(".tour-lightbox-close");
    function preloadImage(source) {
      if (!imageCache[source]) {
        imageCache[source] = new Promise(function (resolve, reject) {
          var preload = new Image();
          preload.decoding = "async";
          preload.onload = function () {
            resolve(preload);
          };
          preload.onerror = function () {
            delete imageCache[source];
            reject(new Error("Unable to load gallery image: " + source));
          };
          preload.src = source;
          if (preload.complete) {
            if (preload.naturalWidth) {
              resolve(preload);
            } else {
              delete imageCache[source];
              reject(new Error("Unable to load gallery image: " + source));
            }
          }
        });
      }
      return imageCache[source];
    }
    function show(index) {
      current = (index + links.length) % links.length;
      var source = links[current].getAttribute("href");
      var alt =
        links[current].getAttribute("aria-label") || "Tour gallery image";
      var requestedId = ++requestId;
      viewer.classList.add("is-loading");
      viewer.classList.remove("has-error");
      status.textContent = "Loading image";

      preloadImage(source)
        .then(function (loadedImage) {
          if (requestedId !== requestId) return;
          image.src = loadedImage.src;
          image.alt = alt;
          caption.textContent = alt;
          count.textContent = current + 1 + " / " + links.length;
          status.textContent = "";
          viewer.classList.remove("is-loading");
        })
        .catch(function () {
          if (requestedId !== requestId) return;
          viewer.classList.remove("is-loading");
          viewer.classList.add("has-error");
          status.textContent = "This image could not be loaded.";
        });

      [1, -1].forEach(function (offset) {
        var adjacent = links[(current + offset + links.length) % links.length];
        preloadImage(adjacent.getAttribute("href")).catch(function (error) {
          console.warn("Unable to preload adjacent gallery image.", error);
        });
      });
    }
    function openGallery(index) {
      show(index);
      viewer.classList.add("is-open");
      document.body.classList.add("gallery-open");
      closeButton.focus();
    }
    function closeGallery() {
      viewer.classList.remove("is-open");
      document.body.classList.remove("gallery-open");
    }
    links.forEach(function (link, index) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        openGallery(index);
      });
    });
    var viewAll = document.getElementById("gallery-view-all");
    if (viewAll)
      viewAll.addEventListener("click", function () {
        openGallery(0);
      });
    viewer
      .querySelector(".tour-lightbox-prev")
      .addEventListener("click", function () {
        show(current - 1);
      });
    viewer
      .querySelector(".tour-lightbox-next")
      .addEventListener("click", function () {
        show(current + 1);
      });
    closeButton.addEventListener("click", closeGallery);
    viewer.addEventListener("click", function (event) {
      if (event.target === viewer) closeGallery();
    });
    document.addEventListener("keydown", function (event) {
      if (!viewer.classList.contains("is-open")) return;
      if (event.key === "Escape") closeGallery();
      if (event.key === "ArrowLeft") show(current - 1);
      if (event.key === "ArrowRight") show(current + 1);
    });
  }
});
