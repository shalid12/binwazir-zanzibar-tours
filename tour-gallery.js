document.addEventListener("DOMContentLoaded", function () {
  var links = Array.prototype.slice.call(
    document.querySelectorAll(".gallery-grid a[data-gallery]"),
  );
  if (links.length) {
    var current = 0,
      viewer = document.createElement("div");
    viewer.className = "tour-lightbox";
    viewer.setAttribute("role", "dialog");
    viewer.setAttribute("aria-modal", "true");
    viewer.setAttribute("aria-label", "Tour image gallery");
    viewer.innerHTML =
      '<button class="tour-lightbox-close" type="button" aria-label="Close gallery">&times;</button><button class="tour-lightbox-prev" type="button" aria-label="Previous image"><i class="fa fa-chevron-left"></i></button><figure><img src="" alt=""><figcaption></figcaption></figure><button class="tour-lightbox-next" type="button" aria-label="Next image"><i class="fa fa-chevron-right"></i></button><div class="tour-lightbox-count" aria-live="polite"></div>';
    document.body.appendChild(viewer);
    var image = viewer.querySelector("img"),
      caption = viewer.querySelector("figcaption"),
      count = viewer.querySelector(".tour-lightbox-count"),
      closeButton = viewer.querySelector(".tour-lightbox-close");
    function show(index) {
      current = (index + links.length) % links.length;
      image.src = links[current].getAttribute("href");
      image.alt =
        links[current].getAttribute("aria-label") || "Tour gallery image";
      caption.textContent = image.alt;
      count.textContent = current + 1 + " / " + links.length;
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
