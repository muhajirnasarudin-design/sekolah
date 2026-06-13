import { auth, db } from "./firebase.js";

import {
signInWithEmailAndPassword
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
doc,
getDoc
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

document
.getElementById("loginBtn")
.addEventListener("click", async ()=>{

const email =
document.getElementById("email").value;

const password =
document.getElementById("password").value;

try{

const userCredential =
await signInWithEmailAndPassword(
auth,
email,
password
);

const uid = userCredential.user.uid;

const snap =
await getDoc(doc(db,"users",uid));

const userData = snap.data();

const today = new Date();
const expired = new Date(userData.expiredAt);

if(today > expired && userData.plan==="trial"){
alert("Trial sudah habis");
location.href="subscribe.html";
return;
}

location.href="dashboard.html";

}catch(error){
alert(error.message);
}

});
