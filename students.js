import { db } from "./firebase.js";

import {
collection,
addDoc,
getDocs,
deleteDoc,
doc
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const saveBtn =
document.getElementById("saveBtn");

saveBtn.addEventListener("click", async()=>{

const nis =
document.getElementById("nis").value;

const nama =
document.getElementById("nama").value;

const kelas =
document.getElementById("kelas").value;

const jk =
document.getElementById("jk").value;

const alamat =
document.getElementById("alamat").value;

await addDoc(
collection(db,"students"),
{
nis,
nama,
kelas,
jk,
alamat,
createdAt:new Date().toISOString()
}
);

alert("Data siswa berhasil ditambahkan");

loadStudents();

});

async function loadStudents(){

const table =
document.getElementById("studentTable");

table.innerHTML="";

const snapshot =
await getDocs(collection(db,"students"));

snapshot.forEach((item)=>{

const data = item.data();

table.innerHTML += `
<tr>
<td>${data.nis}</td>
<td>${data.nama}</td>
<td>${data.kelas}</td>
<td>${data.jk}</td>
<td>
<button onclick="hapus('${item.id}')">
Hapus
</button>
</td>
</tr>
`;

});

}

window.hapus = async(id)=>{

if(!confirm("Hapus siswa?")) return;

await deleteDoc(doc(db,"students",id));

loadStudents();

};

loadStudents();
