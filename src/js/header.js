document.addEventListener("DOMContentLoaded", function () {

  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('menu');
  const submenuButtons = document.querySelectorAll('.submenu-btn');

  function closeAllSubmenus() {
    const submenus = document.querySelectorAll('.submenu');
    submenus.forEach(submenu => {
      submenu.parentElement.classList.remove('open');
      const icon = submenu.previousElementSibling.querySelector('.icon');
      if (icon) {
        icon.textContent = '+';
      }
    });
  }

  hamburger.addEventListener('click', () => {
    if (menu.classList.contains('show')) {
      closeAllSubmenus();
    }
    menu.classList.toggle('show');
  });

  submenuButtons.forEach(button => {
    button.addEventListener('click', () => {
      const parentItem = button.parentElement;
      const icon = button.querySelector('.icon');
      const isOpen = parentItem.classList.contains('open');

      closeAllSubmenus();

      if (!isOpen) {
        parentItem.classList.add('open');
        icon.textContent = '-';
      } else {
        parentItem.classList.remove('open');
        icon.textContent = '+';
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (
      !menu.contains(event.target) &&
      !hamburger.contains(event.target) && 
      menu.classList.contains('show') 
    ) {
      closeAllSubmenus();
      menu.classList.remove('show');
    }
  });

});
