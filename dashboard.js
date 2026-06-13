import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "login.html";
    return;
  }

  try {

    // =====================
    // DATA USER
    // =====================

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("Data user tidak ditemukan.");
      return;
    }

    const data = userSnap.data();

    // Header
    document.getElementById("namaUser").textContent =
      data.nama || "Pengguna";

    document.getElementById("emailUser").textContent =
      data.email || "-";

    // Avatar
    document.getElementById("avatarUser").textContent =
      data.nama
        ? data.nama.charAt(0).toUpperCase()
        : "U";

    // Informasi akun
    document.getElementById("infoNama").textContent =
      data.nama || "-";

    document.getElementById("infoEmail").textContent =
      data.email || "-";

    document.getElementById("infoPlan").textContent =
      data.plan || "trial";

    document.getElementById("planUserText").textContent =
      (data.plan || "trial").toUpperCase();

    // =====================
    // STATUS AKUN
    // =====================

    const statusElement =
      document.getElementById("infoStatus");

    statusElement.textContent = "Aktif";

    if (data.expiredAt) {

      const now = new Date();
      const expiredDate =
        new Date(data.expiredAt);

      if (
        now > expiredDate &&
        data.plan === "trial"
      ) {

        statusElement.textContent =
          "Trial Berakhir";

        alert(
          "Masa trial Anda telah berakhir."
        );

        window.location.href =
          "subscription.html";

        return;
      }

    }

    // =====================
    // TOTAL SISWA
    // =====================

    const siswaQuery = query(
      collection(db, "students"),
      where("uid", "==", user.uid)
    );

    const siswaSnapshot =
      await getDocs(siswaQuery);

    document.getElementById(
      "totalSiswa"
    ).textContent =
      siswaSnapshot.size;

    // =====================
    // TOTAL GURU
    // =====================

    const guruQuery = query(
      collection(db, "teachers"),
      where("uid", "==", user.uid)
    );

    const guruSnapshot =
      await getDocs(guruQuery);

    document.getElementById(
      "totalGuru"
    ).textContent =
      guruSnapshot.size;

    // =====================
    // TOTAL KELAS
    // =====================

    const kelasQuery = query(
      collection(db, "classes"),
      where("uid", "==", user.uid)
    );

    const kelasSnapshot =
      await getDocs(kelasQuery);

    document.getElementById(
      "totalKelas"
    ).textContent =
      kelasSnapshot.size;

  } catch (error) {

    console.error(error);

    alert(
      error.code +
      "\n" +
      error.message
    );

  }

});

// =====================
// LOGOUT
// =====================

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

    alert(
      error.code +
      "\n" +
      error.message
    );

  }

});
