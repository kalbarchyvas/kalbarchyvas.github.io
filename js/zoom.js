document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img");

  const overlay = document.createElement("div");
  overlay.classList.add("zoom-overlay");

  const zoomedImg = document.createElement("img");
  zoomedImg.classList.add("zoomed-img");

  const closeBtn = document.createElement("div");
  closeBtn.classList.add("zoom-close");
  closeBtn.innerHTML = "&times;";

  overlay.appendChild(zoomedImg);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  images.forEach(img => {
    img.addEventListener("click", () => {
      zoomedImg.src = img.src;
      overlay.classList.add("active");
    });
  });

  const closeZoom = () => {
    overlay.classList.remove("active");
    zoomedImg.src = "";
  };

  closeBtn.addEventListener("click", closeZoom);

  overlay.addEventListener("click", e => {
    if (e.target === overlay) closeZoom();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeZoom();
  });
});