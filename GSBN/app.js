const firebaseConfig = {
    apiKey: "AIzaSyDo4_WC27um8GnM9I2GS-uBi1A8iYWIERE",
    authDomain: "gsbn-ba8b3.firebaseapp.com",
    projectId: "gsbn-ba8b3",
    storageBucket: "gsbn-ba8b3.appspot.com",
    messagingSenderId: "36855542603",
    appId: "1:36855542603:web:bf85d55973a821c75ceece",
    measurementId: "G-JPQ97Z7R9M"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Form submission event handler
document.getElementById('userForm').addEventListener('submit', function (event) {
  event.preventDefault();

  // Get the input values
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const from = document.getElementById('from').value;
  const to = document.getElementById('to').value;
  const review = document.getElementById('review').value;

  // Create the user info object
  const userInfo = {
    name: name,
    email: email,
    from: from,
    to: to
  };

  // Add the user info to Firestore
  db.collection('users').add(userInfo)
    .then(() => {
      console.log('User info successfully added.');
      document.getElementById('userForm').reset(); // Reset the form
    })
    .catch((error) => {
      console.error('Error adding user info:', error);
    });

    querySnapshot.forEach((doc) => {
        // Access the matching documents here
        const data = doc.data();
        const from = data.from;
        const to = data.to;
      
        // Perform operations using the retrieved data
        console.log('From:', from);
        console.log('To:', to);
      
        // You can manipulate the data or update the HTML elements here
        // For example, you can update the value of a <div> element with the retrieved data
        document.getElementById('outputDiv').innerText = `From: ${from}, To: ${to}`;
      });
});