(function () {
  "use strict";

  var backgrounds = document.querySelectorAll("[data-bg]");

  function loadBackground(element) {
    element.style.backgroundImage = element.getAttribute("data-bg");
    element.removeAttribute("data-bg");
  }

  if (!("IntersectionObserver" in window)) {
    backgrounds.forEach(loadBackground);
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        loadBackground(entry.target);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: "300px 0px" },
  );

  backgrounds.forEach(function (element) {
    observer.observe(element);
  });
})();
