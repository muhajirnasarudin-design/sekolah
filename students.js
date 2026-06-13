import { auth, db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

let currentUser = null;
let studentsData = [];

onAuthStateChanged(auth, async(user)=>{

  if(!user){
    window.location.href="login.html";
    return;
  }

  currentUser = user;

  loadStudents();

});

// ======================
// TAMBAH SISWA
// ======================

document
.getElementById("saveBtn")
.addEventListener(
"click",
async()=>{

try{

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

if(
!nis ||
!nama ||
!kelas ||
!jk
){
alert("Lengkapi data siswa");
return;
}

await addDoc(
collection(db,"students"),
{
uid:currentUser.uid,
nis,
nama,
kelas,
jk,
alamat,
createdAt:
new Date().toISOString()
}
);

alert(
"Data siswa berhasil ditambahkan"
);

document.getElementById("nis").value="";
document.getElementById("nama").value="";
document.getElementById("kelas").value="";
document.getElementById("jk").value="";
document.getElementById("alamat").value="";

loadStudents();

}catch(error){

alert(error.message);

}

});

// ======================
// LOAD DATA
// ======================

async function loadStudents(){

const q = query(
collection(db,"students"),
where(
"uid",
"==",
currentUser.uid
)
);

const snapshot =
await getDocs(q);

studentsData = [];

snapshot.forEach((item)=>{

studentsData.push({
id:item.id,
...item.data()
});

});

renderStudents(
studentsData
);

}

// ======================
// RENDER TABLE
// ======================

function renderStudents(data){

const table =
document.getElementById(
"studentTable"
);

table.innerHTML="";

let totalL = 0;
let totalP = 0;

if(data.length===0){

table.innerHTML=`
<tr>
<td colspan="6"
style="text-align:center">
Belum ada data siswa
</td>
</tr>
`;

}

data.forEach((student)=>{

if(student.jk==="Laki-laki"){
totalL++;
}

if(student.jk==="Perempuan"){
totalP++;
}

table.innerHTML += `
<tr>

<td>
<div class="avatar">
${student.nama
.charAt(0)
.toUpperCase()}
</div>
</td>

<td>${student.nis}</td>

<td>${student.nama}</td>

<td>${student.kelas}</td>

<td>${student.jk}</td>

<td>

<button
class="action-btn delete"
onclick="hapusSiswa('${student.id}')">

Hapus

</button>

</td>

</tr>
`;

});

document.getElementById(
"totalSiswa"
).textContent =
data.length;

document.getElementById(
"totalLaki"
).textContent =
totalL;

document.getElementById(
"totalPerempuan"
).textContent =
totalP;

}

// ======================
// HAPUS SISWA
// ======================

window.hapusSiswa =
async(id)=>{

const konfirmasi =
confirm(
"Hapus siswa ini?"
);

if(!konfirmasi)
return;

await deleteDoc(
doc(
db,
"students",
id
)
);

loadStudents();

};

// ======================
// PENCARIAN
// ======================

document
.getElementById(
"searchInput"
)
.addEventListener(
"keyup",
(e)=>{

const keyword =
e.target.value
.toLowerCase();

const hasil =
studentsData.filter(
(item)=>
item.nama
.toLowerCase()
.includes(keyword)
);

renderStudents(
hasil
);

});
