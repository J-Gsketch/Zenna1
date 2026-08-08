const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
initializeApp();
const db = getFirestore('zenna-db');
db.collection('leads').get().then(snap => {
  if (snap.empty) {
    console.log("No leads found.");
  } else {
    snap.forEach(doc => console.log(doc.id, '=>', doc.data()));
  }
}).catch(console.error);
