import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ======================
   FIREBASE CONFIG
====================== */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ======================
   ELEMENT
====================== */
const studentName = document.getElementById("studentName");
const status = document.getElementById("status");
const date = document.getElementById("date");

const saveAttendance = document.getElementById("saveAttendance");
const attendanceTable = document.getElementById("attendanceTable");
const searchInput = document.getElementById("searchInput");

const toast = document.getElementById("toast");

const confirmModal = document.getElementById("confirmModal");
const cancelBtn = document.getElementById("cancelBtn");
const confirmBtn = document.getElementById("confirmBtn");

let deleteId = null;

/* ======================
   INIT DATE
====================== */
date.value = new Date().toISOString().split("T")[0];

/* ======================
   LOAD STUDENTS
====================== */
async function loadStudents() {
  const querySnapshot = await getDocs(collection(db, "students"));

  studentName.innerHTML = `<option value="">Pilih Siswa</option>`;

  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();

    const option = document.createElement("option");
    option.value = data.name;
    option.textContent = data.name;

    studentName.appendChild(option);
  });
}

/* ======================
   SAVE ATTENDANCE
====================== */
saveAttendance.addEventListener("click", async () => {
  if (!studentName.value || !status.value || !date.value) {
    showToast("Lengkapi semua data!", "error");
    return;
  }

  await addDoc(collection(db, "attendance"), {
    student: studentName.value,
    status: status.value,
    date: date.value,
    createdAt: new Date()
  });

  showToast("Absensi berhasil disimpan!", "success");

  studentName.value = "";
  status.value = "";

});

/* ======================
   REALTIME TABLE
====================== */
onSnapshot(collection(db, "attendance"), (snapshot) => {
  let data = [];

  snapshot.forEach((docSnap) => {
    data.push({ id: docSnap.id, ...docSnap.data() });
  });

  renderTable(data);
});

/* ======================
   RENDER TABLE
====================== */
function renderTable(data) {
  attendanceTable.innerHTML = "";

  if (data.length === 0) {
    attendanceTable.innerHTML = `
      <tr>
        <td colspan="4" style="text-align:center;">
          Belum ada data absensi
        </td>
      </tr>
    `;
    return;
  }

  data.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.student}</td>
      <td>
        <span class="badge ${item.status}">
          ${item.status}
        </span>
      </td>
      <td>${item.date}</td>
      <td>
        <button onclick="openDelete('${item.id}')" class="btn btn-primary">
          Hapus
        </button>
      </td>
    `;

    attendanceTable.appendChild(row);
  });
}

/* ======================
   DELETE MODAL
====================== */
window.openDelete = function(id) {
  deleteId = id;
  confirmModal.style.display = "flex";
};

cancelBtn.addEventListener("click", () => {
  confirmModal.style.display = "none";
  deleteId = null;
});

confirmBtn.addEventListener("click", async () => {
  if (deleteId) {
    await deleteDoc(doc(db, "attendance", deleteId));
    showToast("Data berhasil dihapus!", "warning");
  }

  confirmModal.style.display = "none";
  deleteId = null;
});

/* ======================
   SEARCH
====================== */
searchInput.addEventListener("input", async () => {
  const keyword = searchInput.value.toLowerCase();

  const snapshot = await getDocs(collection(db, "attendance"));

  let filtered = [];

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    if (
      data.student.toLowerCase().includes(keyword) ||
      data.status.toLowerCase().includes(keyword) ||
      data.date.includes(keyword)
    ) {
      filtered.push({ id: docSnap.id, ...data });
    }
  });

  renderTable(filtered);
});

/* ======================
   TOAST
====================== */
function showToast(message, type) {
  toast.textContent = message;
  toast.className = `toast toast-${type}`;
  toast.style.display = "block";

  setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}

/* ======================
   INIT
====================== */
loadStudents();
