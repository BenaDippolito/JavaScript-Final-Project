function openMenu() {
  document.body.classList.add("menu--open");
  const backdrop = document.querySelector(".menu__backdrop");
  backdrop.style.visibility = "visible";
  backdrop.style.transform = "translate(0)";
  backdrop.style.opacity = "1";
}

function closeMenu() {
  document.body.classList.remove("menu--open");
  const backdrop = document.querySelector(".menu__backdrop");
  backdrop.style.transform = "translate(100%)";
  backdrop.style.opacity = "0";
  // Wait for transition before hiding
  setTimeout(() => {
    backdrop.style.visibility = "hidden";
  }, 300);
}
