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
const studentSelect = document.getElementById("studentSelect");
const scoreInput = document.getElementById("score");

const gradeTable = document.getElementById("gradeTable");
const avgScore = document.getElementById("avgScore");

/* ================= LOAD CLASS ================= */
async function loadClasses(){
  const snap = await getDocs(collection(db,"classes"));
  classSelect.innerHTML = `<option value="">Pilih Kelas</option>`;

  snap.forEach(d=>{
    classSelect.innerHTML += `
      <option value="${d.data().name}">${d.data().name}</option>
    `;
  });
}

/* ================= LOAD SUBJECT ================= */
async function loadSubjects(){
  const snap = await getDocs(collection(db,"subjects"));
  subjectSelect.innerHTML = `<option value="">Pilih Mapel</option>`;

  snap.forEach(d=>{
    subjectSelect.innerHTML += `
      <option value="${d.data().nama}">${d.data().nama}</option>
    `;
  });
}

/* ================= FILTER STUDENT ================= */
classSelect.addEventListener("change", async ()=>{

  const snap = await getDocs(collection(db,"students"));

  studentSelect.innerHTML = `<option value="">Pilih Siswa</option>`;

  snap.forEach(d=>{
    const data = d.data();

    if(data.class === classSelect.value){
      studentSelect.innerHTML += `
        <option value="${data.name}">${data.name}</option>
      `;
    }
  });

});

/* ================= SAVE GRADE ================= */
document.getElementById("saveGrade").onclick = async ()=>{

  if(!classSelect.value || !subjectSelect.value || !studentSelect.value || !scoreInput.value){
    alert("Lengkapi semua data!");
    return;
  }

  await addDoc(collection(db,"grades"),{
    student: studentSelect.value,
    class: classSelect.value,
    subject: subjectSelect.value,
    score: Number(scoreInput.value),
    createdAt: new Date()
  });

  scoreInput.value = "";
};

/* ================= REALTIME ================= */
onSnapshot(collection(db,"grades"),(snap)=>{

  let data = [];

  snap.forEach(d=>{
    data.push(d.data());
  });

  renderTable(data);
  calcAvg(data);

});

/* ================= TABLE ================= */
function renderTable(data){

  gradeTable.innerHTML = "";

  if(data.length === 0){
    gradeTable.innerHTML = `
      <tr>
        <td colspan="5" style="text-align:center;">
          Belum ada data nilai
        </td>
      </tr>
    `;
    return;
  }

  data.forEach(d=>{

    let ket = "";

    if(d.score >= 85) ket = "A";
    else if(d.score >= 70) ket = "B";
    else ket = "C";

    gradeTable.innerHTML += `
      <tr>
        <td>${d.student}</td>
        <td>${d.class}</td>
        <td>${d.subject}</td>
        <td>${d.score}</td>
        <td>${ket}</td>
      </tr>
    `;

  });

}

/* ================= AVERAGE ================= */
function calcAvg(data){

  if(data.length === 0){
    avgScore.textContent = 0;
    return;
  }

  let total = 0;

  data.forEach(d=>{
    total += d.score;
  });

  avgScore.textContent = (total / data.length).toFixed(2);

}

/* ================= INIT ================= */
loadClasses();
loadSubjects();
