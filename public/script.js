const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["самый уникальный сервер.", "самое дружелюбное коммьюнити.", "отзывчивая администрация.", "постоянные ивенты."];
const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 1000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
  if (charIndex < textArray[textArrayIndex].length) {
    if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
    charIndex++;
    setTimeout(type, typingDelay);
  }
  else {
    cursorSpan.classList.remove("typing");
    setTimeout(erase, newTextDelay);
  }
}

function erase() {
  if (charIndex > 0) {
    if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
    typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
    charIndex--;
    setTimeout(erase, erasingDelay);
  }
  else {
    cursorSpan.classList.remove("typing");
    textArrayIndex++;
    if (textArrayIndex >= textArray.length) textArrayIndex = 0;
    setTimeout(type, typingDelay + 1100);
  }
}

document.addEventListener("DOMContentLoaded", function () { // On DOM Load initiate the effect
  if (textArray.length) setTimeout(type, newTextDelay + 250);
});



const copy = document.querySelector('.copy');
const copied = document.querySelector('.copied')

copy.addEventListener('click', () => {
  copy.style.display = "none";
  copied.style.display = "block";
  copy2.style.display = "block";
  copied2.style.display = "none";


});






const copy2 = document.querySelector('.copy-button');
const copied2 = document.querySelector('.copied-button')

copy2.addEventListener('click', () => {
  copy.style.display = "block";
  copied.style.display = "none";
  copy2.style.display = "none";
  copied2.style.display = "block";



});






function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 350;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}

window.addEventListener("scroll", reveal, { passive: true });



document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login-button');
  const modal = document.getElementById('modal');
  const userModal = document.getElementById('user-modal');
  const userInfo = document.getElementById('user-info');
  const logoutButton = document.getElementById('logout-button');
  const span = document.getElementsByClassName('close');

  // Fetch user data from the server
  fetch('/api/user')
    .then(response => response.json())
    .then(user => {
      const avatarUrl = `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`;
      userInfo.innerHTML = `<img src="${avatarUrl}" alt="User Avatar" id="user-avatar">`;

      document.getElementById('user-avatar').onclick = () => {
        const creationDate = new Date(user.createdAt).toLocaleDateString();
        document.getElementById('user-details').innerHTML = `
                  <p><span style="font-weight:800">Ник:</span> ${user.username}</p>
                 
                  <p><span style="font-weight:800">Discord ID:</span> ${user.discordId}</p>
                  <p id="account-created"><span style="font-weight:800">Аккаунт создан:</span> ${creationDate}</p>
                  <a id="button" class="button" href="./profiles/${user.username}.html">Профиль</a>
              `;
        userModal.style.display = "block";
      };

      // Hide login button if user is logged in
      loginButton.style.display = "none";
    })
    .catch(() => {
      // If user is not logged in, show login button
      loginButton.style.display = "inline-block";
    });

  // Show login modal
  loginButton.onclick = () => {
    modal.classList.remove('fade-out');
    modal.style.display = "block";
  }

  // Close modals with animation
  Array.from(span).forEach(element => {
    element.onclick = () => {
      closeModal(modal);
      closeModal(userModal);
    }
  });

  window.onclick = (event) => {
    if (event.target == modal) {
      closeModal(modal);
    } else if (event.target == userModal) {
      closeModal(userModal);
    }
  };

  // Log out button
  logoutButton.onclick = () => {
    window.location.href = '/logout';
  }

  // Function to close modal with animation
  function closeModal(modalElement) {
    modalElement.classList.add('fade-out');
    const modalContent = modalElement.querySelector('.modal-content');
    modalContent.classList.add('slide-up');
    modalContent.addEventListener('animationend', () => {
      modalElement.style.display = 'none';
      modalElement.classList.remove('fade-out');
      modalContent.classList.remove('slide-up');
    }, { once: true });
  }
});

const darkBtn = document.querySelector('.fas');
const bodyEl = document.querySelector('body');

const darkMode = () => {
  bodyEl.classList.toggle('dark')
}

darkBtn.addEventListener('click', () => {

  setDarkMode = localStorage.getItem('dark');

  if (setDarkMode !== "on") {
    darkMode();
    

    setDarkMode = localStorage.setItem('dark', 'on');
  } else {
    darkMode();
    


    setDarkMode = localStorage.setItem('dark', null);

  }
  darkBtn.classList.add('fa-moon')
});


let setDarkMode = localStorage.getItem('dark');


if (setDarkMode === 'on') {
  darkMode();
}


