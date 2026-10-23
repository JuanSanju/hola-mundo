// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-app.js";
import { getFirestore, collection, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/13.1.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCh7DEmcb0BXC-cipqsTJL2kSiQGhfMMR0",
  authDomain: "landing-juandaniel.firebaseapp.com",
  projectId: "landing-juandaniel",
  storageBucket: "landing-juandaniel.firebasestorage.app",
  messagingSenderId: "605746113794",
  appId: "1:605746113794:web:8b86de9fbb3e79f354661b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const form = document.getElementById("contact-form");
const nombreInput = document.getElementById("nombre");
const correoInput = document.getElementById("correo");
const mensajeInput = document.getElementById("mensaje");
const submitBtn = document.getElementById("btn-enviar");
const statusDiv = document.getElementById("form-status");

// Status display helper
function showStatus(message, type) {
  if (!statusDiv) return;
  statusDiv.textContent = message;
  statusDiv.className = `form-status ${type}`;
}

function clearStatus() {
  if (!statusDiv) return;
  statusDiv.textContent = "";
  statusDiv.className = "form-status";
}

// Handle form submission
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearStatus();

    const nombre = nombreInput.value.trim();
    const correo = correoInput.value.trim();
    const mensaje = mensajeInput.value.trim();

    if (!nombre || !correo || !mensaje) {
      showStatus("Por favor completa todos los campos.", "error");
      return;
    }

    const btnText = submitBtn.querySelector(".btn-text");
    const originalText = btnText ? btnText.textContent : "Enviar";

    // Set UI to loading state
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");
    if (btnText) btnText.textContent = "Enviando...";

    try {
      // Guardar en la colección "mensajes" con nombre, correo, mensaje y fecha
      await addDoc(collection(db, "mensajes"), {
        nombre: nombre,
        correo: correo,
        mensaje: mensaje,
        fecha: serverTimestamp()
      });

      showStatus("¡Mensaje enviado con éxito! Gracias por contactarme.", "success");
      form.reset();
    } catch (error) {
      console.error("Error al guardar mensaje en Firestore:", error);
      showStatus("Ocurrió un error al enviar el mensaje. Intenta nuevamente.", "error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
      if (btnText) btnText.textContent = originalText;
    }
  });
}
