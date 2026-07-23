document.addEventListener("DOMContentLoaded", () => {
  const lazyImages = document.querySelectorAll("img[data-src]");

  if (!("IntersectionObserver" in window)) {
    lazyImages.forEach((img) => {
      img.src = img.dataset.src;
      img.removeAttribute("data-src");
    });

    return;
  }

  const imageObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const img = entry.target;

        console.log("Loading:", img.dataset.src);

        img.src = img.dataset.src;

        img.onload = () => {
          img.removeAttribute("data-src");
          img.classList.remove("lazy");
        };

        observer.unobserve(img);
      });
    },
    {
      root: null,
      rootMargin: "100px",
      threshold: 0.1,
    },
  );

  lazyImages.forEach((img) => {
    imageObserver.observe(img);
  });
});
