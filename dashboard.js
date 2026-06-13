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

    // ==========================
    // DATA USER
    // ==========================

    const userRef =
      doc(db, "users", user.uid);

    const userSnap =
      await getDoc(userRef);

    if (!userSnap.exists()) {
      alert("Data user tidak ditemukan");
      return;
    }

    const data = userSnap.data();

    // ==========================
    // PROFIL USER
    // ==========================

    document.getElementById(
      "namaUser"
    ).textContent =
      data.nama || "Pengguna";

    document.getElementById(
      "emailUser"
    ).textContent =
      data.email || "-";

    document.getElementById(
      "infoNama"
    ).textContent =
      data.nama || "-";

    document.getElementById(
      "infoEmail"
    ).textContent =
      data.email || "-";

    document.getElementById(
      "infoPlan"
    ).textContent =
      data.plan || "trial";

    document.getElementById(
      "planUserText"
    ).textContent =
      (data.plan || "trial")
      .toUpperCase();

    // Avatar otomatis

    document.getElementById(
      "avatarUser"
    ).textContent =
      data.nama
      ? data.nama.charAt(0)
          .toUpperCase()
      : "U";

    // ==========================
    // STATUS AKUN
    // ==========================

    const statusElement =
      document.getElementById(
        "infoStatus"
      );

    statusElement.textContent =
      "Aktif";

    if (data.expiredAt) {

      const now =
        new Date();

      const expiredDate =
        new Date(
          data.expiredAt
        );

      if (
        now > expiredDate &&
        data.plan === "trial"
      ) {

        statusElement.textContent =
          "Trial Berakhir";

        alert(
          "Masa trial telah berakhir"
        );

        window.location.href =
          "subscription.html";

        return;
      }

    }

    // ==========================
    // TOTAL SISWA
    // ==========================

    const siswaQuery =
      query(
        collection(
          db,
          "students"
        ),
        where(
          "uid",
          "==",
          user.uid
        )
      );

    const siswaSnapshot =
      await getDocs(
        siswaQuery
      );

    document.getElementById(
      "totalSiswa"
    ).textContent =
      siswaSnapshot.size;

    // ==========================
    // TOTAL GURU
    // ==========================

    const guruQuery =
      query(
        collection(
          db,
          "teachers"
        ),
        where(
          "uid",
          "==",
          user.uid
        )
      );

    const guruSnapshot =
      await getDocs(
        guruQuery
      );

    document.getElementById(
      "totalGuru"
    ).textContent =
      guruSnapshot.size;

    // ==========================
    // TOTAL KELAS
    // ==========================

    try {

      const kelasQuery =
        query(
          collection(
            db,
            "classes"
          ),
          where(
            "uid",
            "==",
            user.uid
          )
        );

      const kelasSnapshot =
        await getDocs(
          kelasQuery
        );

      document.getElementById(
        "totalKelas"
      ).textContent =
        kelasSnapshot.size;

    } catch {

      document.getElementById(
        "totalKelas"
      ).textContent = "0";

    }

  } catch (error) {

    console.error(error);

    alert(
      error.message
    );

  }

});

// ==========================
// MODAL LOGOUT
// ==========================

const modal =
document.getElementById(
  "logoutModal"
);

const logoutBtn =
document.getElementById(
  "logoutBtn"
);

const cancelBtn =
document.querySelector(
  ".cancelBtn"
);

const logoutConfirm =
document.querySelector(
  ".logoutBtnConfirm"
);

if(logoutBtn){

logoutBtn.addEventListener(
"click",
(e)=>{

e.preventDefault();

modal.style.display =
"flex";

});

}

if(cancelBtn){

cancelBtn.addEventListener(
"click",
()=>{

modal.style.display =
"none";

});

}

if(logoutConfirm){

logoutConfirm.addEventListener(
"click",
async()=>{

try{

await signOut(auth);

window.location.href =
"login.html";

}catch(error){

alert(
error.message
);

}

});

}
