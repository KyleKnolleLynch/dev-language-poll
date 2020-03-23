var app = new Vue({
  el: '#app',
  data: {
    languages: []
  },
  methods: {
    upvoteLanguage(id) {
      const upvote = firebase.functions().httpsCallable('upvote');
      upvote({ id })
      .catch(err => {
        showNotification(err.message);
      })
    }
  },
  mounted() {
    const ref = firebase.firestore().collection('languages').orderBy('upvotes', 'desc');

    ref.onSnapshot(snapshot => {
      let languages = [];
      snapshot.forEach(doc => {
        languages.push({ ...doc.data(), id: doc.id });
      });
      this.languages = languages;
    });
  }
});


