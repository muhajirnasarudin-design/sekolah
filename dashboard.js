import { auth, db } from "./firebase.js";

import {
onAuthStateChanged,
signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
doc,
getDoc,
collection,
getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

if (!user) {
window.location.href = "login.html";
return;
}

try {

// Ambil data user
const userRef = doc(db, "users", user.uid);
const userSnap = await getDoc(userRef);

if (!userSnap.exists()) {
  alert("Data user tidak ditemukan.");
  return;
}

const data = userSnap.data();

// Header Profil
document.getElementById("namaUser").textContent =
  data.nama || "Pengguna";

document.getElementById("emailUser").textContent =
  data.email || "-";

// Informasi Akun
document.getElementById("infoNama").textContent =
  data.nama || "-";

document.getElementById("infoEmail").textContent =
  data.email || "-";

document.getElementById("infoPlan").textContent =
  data.plan || "trial";

document.getElementById("planUserText").textContent =
  (data.plan || "trial").toUpperCase();

// Avatar otomatis
document.getElementById("avatarUser").textContent =
  data.nama
    ? data.nama.charAt(0).toUpperCase()
    : "U";

// Cek Trial
if (data.expiredAt) {

  const now = new Date();
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
      "subscription.html";

    return;
  }

}

// Total Siswa
const siswaSnapshot =
  await getDocs(
    collection(db, "students")
  );

document.getElementById(
  "totalSiswa"
).textContent =
  siswaSnapshot.size;

// Total Guru
const guruSnapshot =
  await getDocs(
    collection(db, "teachers")
  );

document.getElementById(
  "totalGuru"
).textContent =
  guruSnapshot.size;

// Total Kelas (sementara)
document.getElementById(
  "totalKelas"
).textContent = "0";

} catch (error) {

console.error(error);

alert(
  error.code +
  "\n" +
  error.message
);

}

});

// Logout
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
