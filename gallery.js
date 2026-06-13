import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.12/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.12/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.12/firebase-auth.js";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

/* ================= ELEMENT ================= */
const title = document.getElementById("title");
const desc = document.getElementById("desc");
const imageUrl = document.getElementById("imageUrl");
const galleryList = document.getElementById("galleryList");

let isAdmin = false;

/* ================= USER CHECK ================= */
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    isAdmin = snap.data().role === "admin";
  }

  loadGallery();
});

/* ================= UPLOAD ================= */
document.getElementById("uploadBtn").onclick = async () => {

  if (!title.value || !imageUrl.value) {
    alert("Isi judul dan URL gambar!");
    return;
  }

  await addDoc(collection(db, "gallery"), {
    title: title.value,
    desc: desc.value,
    imageUrl: imageUrl.value,
    views: 0,
    createdAt: new Date()
  });

  title.value = "";
  desc.value = "";
  imageUrl.value = "";
};

/* ================= LOAD GALLERY ================= */
function loadGallery() {

  const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));

  onSnapshot(q, (snap) => {

    galleryList.innerHTML = "";

    if (snap.empty) {
      galleryList.innerHTML = `<p style="color:#666;">Belum ada foto</p>`;
      return;
    }

    snap.forEach((d) => {

      const data = d.data();

      galleryList.innerHTML += `
        <div class="photo-card">

          <img src="${data.imageUrl}" alt="photo">

          <div class="photo-body">

            <div class="photo-title">${data.title}</div>

            <div class="photo-desc">${data.desc || ""}</div>

            <small>👁 ${data.views || 0} views</small>

            <br><br>

            <button onclick="openPhoto('${d.id}', ${data.views || 0})"
              style="background:#2563eb;color:white;padding:6px 10px;border:none;border-radius:10px;">
              Lihat
            </button>

            ${isAdmin ? `
              <button onclick="deletePhoto('${d.id}')"
                style="background:#dc2626;color:white;padding:6px 10px;border:none;border-radius:10px;">
                Hapus
              </button>
            ` : ""}

          </div>

        </div>
      `;
    });

  });
}

/* ================= VIEW COUNTER ================= */
window.openPhoto = async (id, views) => {

  const ref = doc(db, "gallery", id);

  await updateDoc(ref, {
    views: views + 1
  });

  alert("Foto dibuka (view +1)");
};

/* ================= DELETE ================= */
window.deletePhoto = async (id) => {

  if (!isAdmin) return alert("❌ tidak punya akses");

  await deleteDoc(doc(db, "gallery", id));
};
