const API = "http://localhost:5000";

let invoices = [];

/* ---------------- FORM TOGGLE ---------------- */
function toggleForm() {
  const modal = document.getElementById("formModal");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

/* ---------------- FETCH INVOICES ---------------- */
async function fetchInvoices() {
  try {
    const res = await fetch(`${API}/invoices-with-customers`);
    const data = await res.json();

    invoices = data;
    render();
    updateStats();
  } catch (err) {
    console.log("Error fetching invoices:", err);
  }
}

/* Call on page load */
fetchInvoices();

/* ---------------- ADD INVOICE (BACKEND) ---------------- */
async function addInvoice() {
  const customer_id = document.getElementById("customer_id").value;
  const amount = document.getElementById("amount").value;
  const due_date = document.getElementById("due_date").value;

  if (!customer_id || !amount || !due_date) {
    return showToast("Fill all fields ❌", "red");
  }

  try {
    await fetch(`${API}/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customer_id,
        amount,
        due_date
      })
    });

    showToast("Invoice added successfully ✅", "#22c55e");

    toggleForm();
    fetchInvoices(); // refresh data
  } catch (err) {
    console.log(err);
    showToast("Error adding invoice ❌", "red");
  }
}

/* ---------------- RENDER TABLE ---------------- */
function render() {
  const table = document.getElementById("table");
  table.innerHTML = "";

  invoices.forEach((i, index) => {
    table.innerHTML += `
      <tr style="animation: fadeIn 0.3s ease ${index * 0.05}s both">
        <td>${i.customer_name}</td>
        <td>₹${i.amount}</td>
        <td>${i.status}</td>
        <td>${i.due_date}</td>
      </tr>
    `;
  });
}

/* ---------------- STATS ---------------- */
function updateStats() {
  document.getElementById("total").innerText = invoices.length;

  document.getElementById("paid").innerText =
    invoices.filter(i => i.status === "paid").length;

  document.getElementById("pending").innerText =
    invoices.filter(i => i.status === "unpaid").length;
}

/* ---------------- TOAST MESSAGE ---------------- */
function showToast(msg, color) {
  const toast = document.getElementById("toast");
  toast.innerText = msg;
  toast.style.background = color;
  toast.style.opacity = "1";

  setTimeout(() => {
    toast.style.opacity = "0";
  }, 2000);
}