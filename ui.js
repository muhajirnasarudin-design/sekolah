// ======================
// TOAST NOTIFICATION
// ======================

export function showToast(
message,
type="success"
){

const toast =
document.getElementById("toast");

toast.className =
"toast";

toast.classList.add(
`toast-${type}`
);

toast.innerHTML =
message;

toast.style.display =
"block";

setTimeout(()=>{

toast.style.display =
"none";

},3000);

}

// ======================
// MODAL CONFIRM
// ======================

let callback = null;

export function showConfirm(
title,
message,
onConfirm
){

callback = onConfirm;

document.getElementById(
"modalTitle"
).textContent = title;

document.getElementById(
"modalMessage"
).textContent = message;

document.getElementById(
"confirmModal"
).style.display =
"flex";

}

window.addEventListener(
"DOMContentLoaded",
()=>{

const cancelBtn =
document.getElementById(
"cancelModal"
);

const confirmBtn =
document.getElementById(
"confirmModalBtn"
);

if(cancelBtn){

cancelBtn.onclick =
()=>{

document.getElementById(
"confirmModal"
).style.display =
"none";

};

}

if(confirmBtn){

confirmBtn.onclick =
()=>{

document.getElementById(
"confirmModal"
).style.display =
"none";

if(callback)
callback();

};

}

});
