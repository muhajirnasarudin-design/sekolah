let subjects = JSON.parse(localStorage.getItem("subjects")) || [];

const kodeMapel = document.getElementById("kodeMapel");
const namaMapel = document.getElementById("namaMapel");
const guruMapel = document.getElementById("guruMapel");

const saveBtn = document.getElementById("saveBtn");
const subjectTable = document.getElementById("subjectTable");
const totalSubjects = document.getElementById("totalSubjects");

const searchInput = document.getElementById("searchInput");

const toast = document.getElementById("toast");

const confirmModal = document.getElementById("confirmModal");
const confirmModalBtn = document.getElementById("confirmModalBtn");
const cancelModal = document.getElementById("cancelModal");

let deleteIndex = null;

/* ======================
   INIT
====================== */
document.addEventListener("DOMContentLoaded", () => {
    renderTable();
    updateStats();
});

/* ======================
   ADD SUBJECT
====================== */
saveBtn.addEventListener("click", () => {
    const kode = kodeMapel.value.trim();
    const nama = namaMapel.value.trim();
    const guru = guruMapel.value.trim();

    if (!kode || !nama || !guru) {
        showToast("Lengkapi semua data!", "error");
        return;
    }

    const newSubject = { kode, nama, guru };
    subjects.push(newSubject);

    localStorage.setItem("subjects", JSON.stringify(subjects));

    kodeMapel.value = "";
    namaMapel.value = "";
    guruMapel.value = "";

    showToast("Mata pelajaran berhasil ditambahkan!", "success");

    renderTable();
    updateStats();
});

/* ======================
   RENDER TABLE
====================== */
function renderTable(data = subjects) {
    subjectTable.innerHTML = "";

    if (data.length === 0) {
        subjectTable.innerHTML = `
            <tr>
                <td colspan="4" style="text-align:center;">
                    Belum ada data mata pelajaran
                </td>
            </tr>
        `;
        return;
    }

    data.forEach((item, index) => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${item.kode}</td>
            <td>${item.nama}</td>
            <td>${item.guru}</td>
            <td>
                <button class="action-btn delete" onclick="openDeleteModal(${index})">
                    Hapus
                </button>
            </td>
        `;

        subjectTable.appendChild(row);
    });
}

/* ======================
   DELETE MODAL
====================== */
window.openDeleteModal = function(index) {
    deleteIndex = index;
    confirmModal.style.display = "flex";
};

cancelModal.addEventListener("click", () => {
    confirmModal.style.display = "none";
    deleteIndex = null;
});

confirmModalBtn.addEventListener("click", () => {
    if (deleteIndex !== null) {
        subjects.splice(deleteIndex, 1);
        localStorage.setItem("subjects", JSON.stringify(subjects));

        showToast("Data berhasil dihapus!", "warning");
        renderTable();
        updateStats();
    }

    confirmModal.style.display = "none";
    deleteIndex = null;
});

/* ======================
   SEARCH
====================== */
searchInput.addEventListener("input", () => {
    const keyword = searchInput.value.toLowerCase();

    const filtered = subjects.filter(item =>
        item.kode.toLowerCase().includes(keyword) ||
        item.nama.toLowerCase().includes(keyword) ||
        item.guru.toLowerCase().includes(keyword)
    );

    renderTable(filtered);
});

/* ======================
   UPDATE STATS
====================== */
function updateStats() {
    totalSubjects.textContent = subjects.length;
}

/* ======================
   TOAST
====================== */
function showToast(message, type = "success") {
    toast.textContent = message;

    toast.className = "toast";
    toast.classList.add(`toast-${type}`);

    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}

/* ======================
   CLICK OUTSIDE MODAL
====================== */
window.addEventListener("click", (e) => {
    if (e.target === confirmModal) {
        confirmModal.style.display = "none";
    }
});
