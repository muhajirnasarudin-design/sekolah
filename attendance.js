import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
getFirestore,
collection,
addDoc,
getDocs,
onSnapshot
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
apiKey: "YOUR_API",
authDomain: "YOUR_AUTH",
projectId: "YOUR_PROJECT"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const studentName = document.getElementById("studentName");
const status = document.getElementById("status");
const date = document.getElementById("date");

const table = document.getElementById("attendanceTable");

const totalHadir = document.getElementById("totalHadir");
const totalIzin = document.getElementById("totalIzin");
const totalAlpha = document.getElementById("totalAlpha");

const toast = document.getElementById("toast");

const ctx = document.getElementById("attendanceChart");
let chart;

/* DATE AUTO */
date.value = new Date().toISOString().split("T")[0];

/* LOAD STUDENTS */
async function loadStudents(){
const snap = await getDocs(collection(db,"students"));
studentName.innerHTML = `<option value="">Pilih Siswa</option>`;
snap.forEach(d=>{
const opt = document.createElement("option");
opt.value = d.data().name;
opt.textContent = d.data().name;
studentName.appendChild(opt);
});
}

/* SAVE */
document.getElementById("saveAttendance").onclick = async ()=>{
if(!studentName.value || !status.value || !date.value){
showToast("Lengkapi data","error");
return;
}

await addDoc(collection(db,"attendance"),{
student:studentName.value,
status:status.value,
date:date.value
});

showToast("Berhasil","success");
};

/* REALTIME */
onSnapshot(collection(db,"attendance"),(snap)=>{
let data=[];
snap.forEach(d=>data.push(d.data()));

render(data);
stats(data);
chartRender(data);
});

/* RENDER TABLE */
function render(data){
table.innerHTML="";
data.forEach(d=>{
table.innerHTML += `
<tr>
<td>${d.student}</td>
<td><span class="badge ${d.status}">${d.status}</span></td>
<td>${d.date}</td>
</tr>
`;
});
}

/* STATS */
function stats(data){
let h=0,i=0,a=0;
data.forEach(d=>{
if(d.status=="hadir")h++;
if(d.status=="izin")i++;
if(d.status=="alpha")a++;
});
totalHadir.innerText=h;
totalIzin.innerText=i;
totalAlpha.innerText=a;
}

/* CHART */
function chartRender(data){
let h=0,i=0,a=0;
data.forEach(d=>{
if(d.status=="hadir")h++;
if(d.status=="izin")i++;
if(d.status=="alpha")a++;
});

if(chart)chart.destroy();

chart=new Chart(ctx,{
type:"bar",
data:{
labels:["Hadir","Izin","Alpha"],
datasets:[{
data:[h,i,a],
backgroundColor:["#16a34a","#f59e0b","#dc2626"]
}]
}
});
}

/* TOAST */
function showToast(msg,type){
toast.innerText=msg;
toast.className=`toast toast-${type}`;
toast.style.display="block";
setTimeout(()=>toast.style.display="none",2000);
}

/* PDF */
window.exportPDF=function(){
const {jsPDF}=window.jspdf;
const doc=new jsPDF();
doc.text("Absensi Siswa",10,10);

let y=20;
document.querySelectorAll("tbody tr").forEach(r=>{
doc.text(r.innerText,10,y);
y+=10;
});

doc.save("absensi.pdf");
};

loadStudents();
