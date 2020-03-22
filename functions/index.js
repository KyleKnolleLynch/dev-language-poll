const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

//  auth trigger for new user signup
exports.newUserSignup = functions.auth.user().onCreate(user => {
  return admin
    .firestore()
    .collection('users')
    .doc(user.uid)
    .set({
      email: user.email,
      upvotedOn: []
    });
});

//  auth trigger for user deleted
exports.userDeleted = functions.auth.user().onDelete(user => {
  const doc = admin
    .firestore()
    .collection('users')
    .doc(user.uid);
  return doc.delete();
});

//  http callable function
exports.addLanguage = functions.https.onCall((data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'only authenticated users can add a language'
    );
  }
  if (data.text.length > 30) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      "language submission can't be longer than 30 characters"
    );
  }

  return admin
    .firestore()
    .collection('languages')
    .doc()
    .set({
      text: data.text,
      upvotes: 0
    });
});

//  upvote callable function
exports.upvote = functions.https.onCall((data, context) => {
  //  check auth state
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'only authenticated users can add a language'
    );
  }

  //  get refs for user doc and request doc
  const user = admin
    .firestore()
    .collection('users')
    .doc(context.auth.uid);
  const language = admin
    .firestore()
    .collection('languages')
    .doc(data.id);

  return user.get().then(doc => {
    //  check user hasn't already voted on request
    if (doc.data().upvotedOn.includes(data.id)) {
      throw new functions.https.HttpsError(
        'failed-precondition',
        'You can only upvote a language once'
      );
    }
    //  update user array
    return user
      .update({
        upvotedOn: [...doc.data().upvotedOn, data.id]
      })
      .then(() => {
        //  update votes on languages
        return language.update({
          upvotes: admin.firestore.FieldValue.increment(1)
        });
      });
  });
});
