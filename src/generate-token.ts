import * as admin from 'firebase-admin';
import { config } from 'dotenv';
import { initializeApp as initializeClientApp } from 'firebase/app';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

// Cargar variables de entorno
config();

// Inicializar Firebase Admin si no está inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

async function generateIdToken() {
  try {
    // Generar un custom token para un usuario de prueba (puedes personalizar el uid)
    const uid = 'usuario-prueba-1';
    const customToken = await admin.auth().createCustomToken(uid);

    console.log('Custom Token generado:');
    console.log(customToken);

    // Simular el intercambio del custom token por un ID token
    const idToken = await simulateSignInWithCustomToken(customToken);

    console.log('\nID Token generado:');
    console.log(idToken);
  } catch (error) {
    console.error('Error al generar el ID Token:', error);
  }
}

// Simular el intercambio del custom token por un ID token
async function simulateSignInWithCustomToken(
  customToken: string,
): Promise<string> {
  // Firebase client configuration
  const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  };

  // Initialize Firebase client app
  const clientApp = initializeClientApp(firebaseConfig);

  const auth = getAuth(clientApp);

  // Sign in with the custom token and get the ID token
  const userCredential = await signInWithCustomToken(auth, customToken);
  const idToken = await userCredential.user.getIdToken();
  return idToken;
}

generateIdToken();

console.log('FIREBASE_API_KEY:', process.env.FIREBASE_API_KEY);
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
