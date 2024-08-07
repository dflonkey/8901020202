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

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('login-button');
  const modal = document.getElementById('modal');
  const userModal = document.getElementById('user-modal');
  const userInfo = document.getElementById('logo-info');
  const logoutButton = document.getElementById('logout-button');
  const span = document.getElementsByClassName('close');
  const modal2 = document.getElementById('modal-2');
  const userModal2 = document.getElementById('user-modal-2');
  
  const span2 = document.getElementsByClassName('close-2');


  





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
                  <a id="button" class="button" href="../profiles/${user.username}.html">Профиль</a>
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
      closeModal(modal2);
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


document.querySelectorAll('.social-button').forEach(button => {
  button.addEventListener('click', function () {
      document.getElementById('social-platform').value = this.dataset.platform;
      document.getElementById('modal-2').style.display = 'block';
  });
});

document.querySelector('.modal-2 .close-2').addEventListener('click', function () {
  document.getElementById('modal-2').style.display = 'none';
});

document.getElementById('social-form').addEventListener('submit', async function (event) {
  event.preventDefault();
  const platform = document.getElementById('social-platform').value;
  const link = document.getElementById('social-link').value;

  const response = await fetch('/api/social-link', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({ platform, link })
  });

  if (response.ok) {
      const result = await response.json();
      const socialLinksDiv = document.getElementById('social-links');
      const newLink = document.createElement('a');
      newLink.href = result.link;
      newLink.className = 'social-icon';
      newLink.innerHTML = '<i class="fab fa-${result.platform}"></i>';
      socialLinksDiv.appendChild(newLink);
      document.getElementById('modal-2').style.display = 'none';
  } else {
      alert('Ошибка при привязке социальной сети');
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const deleteButton = document.getElementById('delete-account-button');
  const modal3 = document.getElementById('modal-3');
  const closeModal3 = document.querySelector('.close-3');
  const confirmDeleteButton = document.getElementById('confirm-delete');
  const cancelDeleteButton = document.getElementById('cancel-delete');

  // Открыть модальное окно подтверждения удаления
  deleteButton.addEventListener('click', () => {
      modal3.classList.add('fade-in');
      modal3.classList.remove('fade-out');
      modal3.style.display = 'block';
  });

  // Закрыть модальное окно подтверждения удаления
  closeModal3.addEventListener('click', () => {
      modal3.classList.add('fade-out');
      modal3.classList.remove('fade-in');
      modal3.addEventListener('transitionend', () => {
          modal3.style.display = 'none';
      }, { once: true });
  });

  cancelDeleteButton.addEventListener('click', () => {
      modal3.classList.add('fade-out');
      modal3.classList.remove('fade-in');
      modal3.addEventListener('transitionend', () => {
          modal3.style.display = 'none';
      }, { once: true });
  });

  // Подтвердить удаление аккаунта
  confirmDeleteButton.addEventListener('click', async () => {
      try {
          const response = await fetch('/api/delete-account', {
              method: 'DELETE',
              headers: {
                  'Content-Type': 'application/json'
              }
          });

          if (response.ok) {
              // Успешно удалено, перенаправляем на домашнюю страницу
              window.location.href = '/';
          } else {
              alert('Ошибка при удалении аккаунта');
          }
      } catch (error) {
          console.error('Ошибка удаления аккаунта:', error);
          alert('Ошибка при удалении аккаунта');
      }
  });
});
