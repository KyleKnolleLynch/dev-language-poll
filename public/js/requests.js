var app = new Vue({
  el: '#app',
  data: {
    languages: []
  },
  mounted() {
    const ref = firebase.firestore().collection('languages');

    ref.onSnapshot(snapshot => {
      let languages = [];
      snapshot.forEach(doc => {
        languages.push({ ...doc.data(), id: doc.id });
      });
      this.languages = languages;
    });
  }
});
