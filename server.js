const express = require("express");
const connection = require("./db.js");

const app = express();
app.use(express.json());

/* ---------------- HEALTH CHECK ---------------- */
app.get("/", (req, res) => {
    res.send("Invoice Management System API is running");
});

/* ---------------- CUSTOMERS ---------------- */

// Create customer
app.post("/customers", (req, res) => {
    const { customer_name, email, phone } = req.body;

    if (!customer_name || !email || !phone) {
        return res.status(400).send("All fields are required");
    }

    const sql = `
        INSERT INTO customers (customer_name, email, phone)
        VALUES (?, ?, ?)
    `;

    connection.query(sql, [customer_name, email, phone], (err) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Database error");
        }
        res.send("Customer created successfully");
    });
});

// Get all customers
app.get("/customers", (req, res) => {
    connection.query("SELECT * FROM customers", (err, result) => {
        if (err) return res.status(500).send("Database error");
        res.json(result);
    });
});

// Get customer by id
app.get("/customers/:id", (req, res) => {
    connection.query(
        "SELECT * FROM customers WHERE customer_id = ?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send("Database error");
            res.json(result);
        }
    );
});

// Update customer
app.put("/customers/:id", (req, res) => {
    const { customer_name, email, phone } = req.body;

    connection.query(
        `UPDATE customers SET customer_name=?, email=?, phone=? WHERE customer_id=?`,
        [customer_name, email, phone, req.params.id],
        (err) => {
            if (err) return res.status(500).send("Database error");
            res.send("Customer updated");
        }
    );
});

// Delete customer
app.delete("/customers/:id", (req, res) => {
    connection.query(
        "DELETE FROM customers WHERE customer_id=?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).send("Database error");
            if (result.affectedRows === 0)
                return res.status(404).send("Customer not found");

            res.send("Customer deleted");
        }
    );
});

/* ---------------- INVOICES ---------------- */

// Create invoice (with validation)
app.post("/invoices", (req, res) => {
    const { customer_id, amount, due_date } = req.body;

    if (!customer_id || !amount || !due_date) {
        return res.status(400).send("All fields required");
    }

    // check customer exists
    connection.query(
        "SELECT * FROM customers WHERE customer_id=?",
        [customer_id],
        (err, result) => {
            if (err) return res.status(500).send("Database error");

            if (result.length === 0) {
                return res.status(400).send("Invalid customer_id");
            }

            const sql = `
                INSERT INTO invoices (customer_id, amount, due_date, status)
                VALUES (?, ?, ?, 'unpaid')
            `;

            connection.query(sql, [customer_id, amount, due_date], (err) => {
                if (err) return res.status(500).send("Database error");
                res.send("Invoice created");
            });
        }
    );
});

// Get all invoices
app.get("/invoices", (req, res) => {
    connection.query("SELECT * FROM invoices", (err, result) => {
        if (err) return res.status(500).send("Database error");
        res.json(result);
    });
});

// Invoice with customer details (IMPORTANT FOR INTERVIEW)
app.get("/invoices-with-customers", (req, res) => {
    const sql = `
        SELECT 
            i.invoice_id,
            i.amount,
            i.due_date,
            i.status,
            c.customer_name,
            c.email,
            c.phone
        FROM invoices i
        JOIN customers c ON i.customer_id = c.customer_id
    `;

    connection.query(sql, (err, result) => {
        if (err) return res.status(500).send("Database error");
        res.json(result);
    });
});

// Update invoice status (VERY IMPORTANT FEATURE)
app.put("/invoices/:id/status", (req, res) => {
    const { status } = req.body; // paid / unpaid

    connection.query(
        "UPDATE invoices SET status=? WHERE invoice_id=?",
        [status, req.params.id],
        (err) => {
            if (err) return res.status(500).send("Database error");
            res.send("Invoice status updated");
        }
    );
});

/* ---------------- SERVER ---------------- */
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});