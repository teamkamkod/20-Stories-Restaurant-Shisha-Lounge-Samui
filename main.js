(function() {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim()
    if (all) {
      return [...document.querySelectorAll(el)]
    } else {
      return document.querySelector(el)
    }
  }

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all)
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener))
      } else {
        selectEl.addEventListener(type, listener)
      }
    }
  }

  /**
   * Easy on scroll event listener 
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener)
  }

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select('#navbar .scrollto', true)
  const navbarlinksActive = () => {
    let position = window.scrollY + 200
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return
      let section = select(navbarlink.hash)
      if (!section) return
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active')
      } else {
        navbarlink.classList.remove('active')
      }
    })
  }
  window.addEventListener('load', navbarlinksActive)
  onscroll(document, navbarlinksActive)

  /**
   * Toggle .header-scrolled class to #header when page is scrolled
   */
  let selectHeader = select('#header')
  let selectTopbar = select('#topbar')
  if (selectHeader) {
    const headerScrolled = () => {
      if (window.scrollY > 100) {
        selectHeader.classList.add('header-scrolled')
        if (selectTopbar) {
          selectTopbar.classList.add('topbar-scrolled')
        }
      } else {
        selectHeader.classList.remove('header-scrolled')
        if (selectTopbar) {
          selectTopbar.classList.remove('topbar-scrolled')
        }
      }
    }
    window.addEventListener('load', headerScrolled)
    onscroll(document, headerScrolled)
  }

  /**
   * Back to top button
   */
  let backtotop = select('.back-to-top')
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active')
      } else {
        backtotop.classList.remove('active')
      }
    }
    window.addEventListener('load', toggleBacktotop)
    onscroll(document, toggleBacktotop)
  }

  /**
   * Mobile nav toggle
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('#navbar').classList.toggle('navbar-mobile')
    this.classList.toggle('fa-bars')
    this.classList.toggle('fa-times')
  })

  /**
   * Mobile nav dropdowns activate
   */
  on('click', '.navbar .dropdown > a', function(e) {
    if (select('#navbar').classList.contains('navbar-mobile')) {
      e.preventDefault()
      this.nextElementSibling.classList.toggle('dropdown-active')
    }
  }, true)

  /**
   * Menu isotope and filter
   */
  window.addEventListener('load', () => {
    let menuContainer = select('.menu-container');
    if (menuContainer) {
      let menuIsotope = new Isotope(menuContainer, {
        itemSelector: '.menu-item',
        layoutMode: 'fitRows'
      });

      let menuFilters = select('#menu-flters li', true);

      on('click', '#menu-flters li', function(e) {
        e.preventDefault();
        menuFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        menuIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        menuIsotope.on('arrangeComplete', function() {
          AOS.refresh();
        });
      }, true);
    }
  });

  /**
   * Preloader
   */
  let preloader = select('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove()
    });
  }

  /**
   * Animation on scroll
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    })
  });

  /**
   * Form Submission to Webhook
   */
  const bookingForm = document.getElementById('bookingForm');
  if(bookingForm) {
      bookingForm.addEventListener('submit', function(e) {
          e.preventDefault();
          
          let loading = select('.loading');
          let error = select('.error-message');
          let sent = select('.sent-message');
          
          loading.style.display = 'block';
          error.style.display = 'none';
          sent.style.display = 'none';

          const formData = new FormData(bookingForm);
          const data = Object.fromEntries(formData.entries());
          
          // Add GID manually
          data.gid = "ChIJFTW2SvrxVDARlZfGIQe67OU";

          fetch('https://hook.eu1.make.com/9zmguwti3y7qg2nd59x21s579xqr9f4s', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
          })
          .then(response => {
              if(response.ok) {
                  loading.style.display = 'none';
                  sent.style.display = 'block';
                  bookingForm.reset();
              } else {
                  throw new Error('Server error');
              }
          })
          .catch((err) => {
              loading.style.display = 'none';
              error.innerHTML = "Something went wrong. Please call us directly.";
              error.style.display = 'block';
              console.error('Error:', err);
          });
      });
  }

  // Simple Menu Filter (Vanilla JS alternative to Isotope if CDN fails or for lightweight)
  const menuFilters = document.querySelectorAll('#menu-flters li');
  const menuItems = document.querySelectorAll('.menu-item');

  menuFilters.forEach(filter => {
      filter.addEventListener('click', () => {
          let selectedFilter = filter.getAttribute('data-filter');
          
          // Remove active class
          menuFilters.forEach(btn => btn.classList.remove('filter-active'));
          filter.classList.add('filter-active');

          // Show/Hide items
          menuItems.forEach(item => {
              if (selectedFilter === '*' || item.classList.contains(selectedFilter.substring(1))) {
                  item.style.display = 'block';
                  item.classList.add('animated', 'fadeInUp');
              } else {
                  item.style.display = 'none';
                  item.classList.remove('animated', 'fadeInUp');
              }
          });
      });
  });

})();

/**
 * Language Switcher
 */
function switchLang(lang) {
    const enElements = document.querySelectorAll('[data-en]');
    const buttons = document.querySelectorAll('.lang-btn');
    
    // Update active button
    buttons.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`.lang-btn[onclick="switchLang('${lang}')"]`).classList.add('active');

    // Update text
    enElements.forEach(el => {
        if (lang === 'th') {
            if(el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                // For placeholders if needed (though tricky with data attributes, usually simpler to keep english placeholder or update manually)
            } else {
                el.textContent = el.getAttribute('data-th');
            }
        } else {
            el.textContent = el.getAttribute('data-en');
        }
    });
}
