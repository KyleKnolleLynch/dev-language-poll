const langForm = document.querySelector('.lang-form form');
const langModal = document.querySelector('.lang-form');

document
  .querySelector('.add-lang')
  .addEventListener('click', () => langModal.classList.add('open'));

langModal.addEventListener('click', e => {
  if (e.target.classList.contains('lang-form')) {
    langModal.classList.remove('open');
  }
});

//  add new language
langForm.addEventListener('submit', e => {
  e.preventDefault();

  const addLanguage = firebase.functions().httpsCallable('addLanguage');
  addLanguage({
    text: langForm.language.value
  })
    .then(() => {
      langForm.reset();
      langModal.classList.remove('open');
      langForm.querySelector('.error').textContent = '';
      // console.log('language added');
    })
    .catch(err => {
      langForm.querySelector('.error').textContent = err.message;
    });
});

//  notification
const showNotification = message => {
  const notiDiv = document.querySelector('.notification');
  notiDiv.textContent = message;
  notiDiv.classList.add('active');
  setTimeout(() => {
    notiDiv.classList.remove('active');
    notiDiv.textContent = '';
  }, 3000);
};
