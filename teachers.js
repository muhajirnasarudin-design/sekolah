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

try{

const nip =
document.getElementById("nip").value;

const nama =
document.getElementById("nama").value;

const mapel =
document.getElementById("mapel").value;

const alamat =
document.getElementById("alamat").value;

await addDoc(
collection(db,"teachers"),
{
nip,
nama,
mapel,
alamat,
createdAt:new Date().toISOString()
}
);

alert("Guru berhasil ditambahkan");

loadTeachers();

}catch(error){

alert(
error.code + "\n" +
error.message
);

}

});

async function loadTeachers(){

const table =
document.getElementById("teacherTable");

table.innerHTML = "";

const snapshot =
await getDocs(
collection(db,"teachers")
);

snapshot.forEach((item)=>{

const data = item.data();

table.innerHTML += `

<tr>
<td>${data.nip}</td>
<td>${data.nama}</td>
<td>${data.mapel}</td>
<td>
<button onclick="hapusGuru('${item.id}')">
Hapus
</button>
</td>
</tr>
`;});

}

window.hapusGuru =
async(id)=>{

if(!confirm("Hapus guru?"))
return;

await deleteDoc(
doc(db,"teachers",id)
);

loadTeachers();

};

loadTeachers();
