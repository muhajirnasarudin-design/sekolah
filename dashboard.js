import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("Data user tidak ditemukan.");
      return;
    }

    const data = userSnap.data();

    document.getElementById("namaUser").textContent =
      data.nama || "Pengguna";

    document.getElementById("emailUser").textContent =
      data.email || "-";

    document.getElementById("infoNama").textContent =
      data.nama || "-";

    document.getElementById("infoEmail").textContent =
      data.email || "-";

    document.getElementById("infoPlan").textContent =
      data.plan || "trial";

    document.getElementById("planUserText").textContent =
      (data.plan || "trial").toUpperCase();

    document.getElementById("avatarUser").textContent =
      data.nama
        ? data.nama.charAt(0).toUpperCase()
        : "U";

    const now = new Date();

    if (data.expiredAt) {

      const expiredDate =
        new Date(data.expiredAt);

      if (
        now > expiredDate &&
        data.plan === "trial"
      ) {

        alert(
          "Masa trial Anda telah berakhir."
        );

        window.location.href =
          "subscribe.html";

        return;
      }
    }

  } catch (error) {

    console.error(error);

    alert(
      "Gagal memuat data user."
    );

  }

});

document
.getElementById("logoutBtn")
.addEventListener(
"click",
async () => {

  const keluar =
    confirm(
      "Yakin ingin logout?"
    );

  if (!keluar) return;

  try {

    await signOut(auth);

    window.location.href =
      "login.html";

  } catch (error) {

    alert(error.message);

  }

});
