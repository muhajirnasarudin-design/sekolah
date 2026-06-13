import { auth, db } from "./firebase.js";

import {
createUserWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
doc,
setDoc
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

document.getElementById("registerBtn")
.addEventListener("click", async () => {

const nama =
document.getElementById("nama").value;

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

try {

const result =
await createUserWithEmailAndPassword(
auth,
email,
password
);

const now = new Date();

const expire = new Date();
expire.setDate(now.getDate() + 2);

await setDoc(
doc(db,"users",result.user.uid),
{
nama:nama,
email:email,
plan:"trial",
createdAt:now.toISOString(),
expiredAt:expire.toISOString()
}
);

alert("Pendaftaran berhasil. Trial aktif 2 hari.");

location.href = "login.html";

}
catch(error){
alert(error.message);
}

});
