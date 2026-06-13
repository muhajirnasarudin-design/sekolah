import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/* ================= FIREBASE ================= */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ================= ELEMENT ================= */
const classSelect = document.getElementById("classSelect");
const subjectSelect = document.getElementById("subjectSelect");
const studentName = document.getElementById("studentName");
const status = document.getElementById("status");
const date = document.getElementById("date");

const table = document.getElementById("attendanceTable");

const totalHadir = document.getElementById("totalHadir");
const totalIzin = document.getElementById("totalIzin");
const totalAlpha = document.getElementById("totalAlpha");

const ctx = document.getElementById("attendanceChart");
let chartInstance;

/* ================= AUTO DATE ================= */
date.value = new Date().toISOString().split("T")[0];

/* ================= LOAD DATA ================= */
async function loadClasses() {
  const snap = await getDocs(collection(db, "classes"));
  classSelect.innerHTML = `<option value="">Pilih Kelas</option>`;

  snap.forEach(d => {
    classSelect.innerHTML += `
      <option value="${d.data().name}">${d.data().name}</option>
    `;
  });
}

async function loadSubjects() {
  const snap = await getDocs(collection(db, "subjects"));
  subjectSelect.innerHTML = `<option value="">Pilih Mapel</option>`;

  snap.forEach(d => {
    subjectSelect.innerHTML += `
      <option value="${d.data().nama}">${d.data().nama}</option>
    `;
  });
}

/* ================= FILTER SISWA ================= */
classSelect.addEventListener("change", async () => {
  const snap = await getDocs(collection(db, "students"));
  studentName.innerHTML = `<option value="">Pilih Siswa</option>`;

  snap.forEach(d => {
    const data = d.data();
    if (data.class === classSelect.value) {
      studentName.innerHTML += `
        <option value="${data.name}">${data.name}</option>
      `;
    }
  });
});

/* ================= SAVE MANUAL ================= */
document.getElementById("saveAttendance").onclick = async () => {
  if (!classSelect.value || !subjectSelect.value || !studentName.value || !status.value || !date.value) {
    alert("Lengkapi semua data!");
    return;
  }

  await addDoc(collection(db, "attendance"), {
    student: studentName.value,
    class: classSelect.value,
    subject: subjectSelect.value,
    status: status.value,
    date: date.value,
    createdAt: new Date()
  });
};

/* ================= QUICK ACTION ================= */
window.quickAttendance = async (statusValue) => {
  if (!classSelect.value || !subjectSelect.value || !studentName.value || !date.value) {
    alert("Pilih kelas, mapel, dan siswa dulu!");
    return;
  }

  await addDoc(collection(db, "attendance"), {
    student: studentName.value,
    class: classSelect.value,
    subject: subjectSelect.value,
    status: statusValue,
    date: date.value,
    createdAt: new Date()
  });
};

/* ================= REALTIME ================= */
onSnapshot(collection(db, "attendance"), (snap) => {
  let data = [];

  snap.forEach(d => {
    data.push(d.data());
  });

  renderTable(data);
  updateStats(data);
  updateChart(data);
});

/* ================= TABLE ================= */
function renderTable(data) {
  table.innerHTML = "";

  if (data.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">
          Belum ada data absensi
        </td>
      </tr>
    `;
    return;
  }

  data.forEach(d => {
    table.innerHTML += `
      <tr>
        <td>${d.student}</td>
        <td>${d.class}</td>
        <td>${d.subject}</td>
        <td><span class="badge ${d.status}">${d.status}</span></td>
        <td>${d.date}</td>
      </tr>
    `;
  });
}

/* ================= STATS ================= */
function updateStats(data) {
  let h = 0, i = 0, a = 0;

  data.forEach(d => {
    if (d.status === "hadir") h++;
    if (d.status === "izin") i++;
    if (d.status === "alpha") a++;
  });

  totalHadir.textContent = h;
  totalIzin.textContent = i;
  totalAlpha.textContent = a;
}

/* ================= CHART ================= */
function updateChart(data) {
  let h = 0, i = 0, a = 0;

  data.forEach(d => {
    if (d.status === "hadir") h++;
    if (d.status === "izin") i++;
    if (d.status === "alpha") a++;
  });

  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Hadir", "Izin", "Alpha"],
      datasets: [{
        data: [h, i, a],
        backgroundColor: ["#16a34a", "#f59e0b", "#dc2626"]
      }]
    }
  });
}

/* ================= PDF ================= */
window.exportPDF = function () {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  doc.text("Laporan Absensi Siswa", 10, 10);

  let y = 20;

  document.querySelectorAll("#attendanceTable tr").forEach(row => {
    doc.text(row.innerText, 10, y);
    y += 10;
  });

  doc.save("absensi.pdf");
};

/* ================= INIT ================= */
loadClasses();
loadSubjects();
