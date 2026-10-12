
import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/api/subscriptions";

const emptyForm = {
  user_email: "",
  plan_name: "",
  start_date: "",
  end_date: "",
  monthly_cost: "",
  status: "Active",
};

function App() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formError, setFormError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  // Get subscriptions from the backend
  async function loadSubscriptions() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load subscriptions.");
      }

      const data = await response.json();
      setSubscriptions(data);
      setError("");
    } catch {
      setError("Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubscriptions();
  }, []);

  // Update form fields when the user types
  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  // Open the form for a new subscription
  function openAddForm() {
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
    setMessage("");
    setShowForm(true);
  }

  // Open the form with existing subscription details
  function handleEdit(subscription) {
    setForm({
      user_email: subscription.user_email,
      plan_name: subscription.plan_name,
      start_date: String(subscription.start_date).slice(0, 10),
      end_date: String(subscription.end_date).slice(0, 10),
      monthly_cost: String(subscription.monthly_cost),
      status: subscription.status,
    });

    setEditingId(subscription.subscription_id);
    setFormError("");
    setMessage("");
    setShowForm(true);
  }

  // Add a new subscription or update an existing one
  async function handleSubmit(event) {
    event.preventDefault();
    setFormError("");
    setMessage("");

    if (form.end_date < form.start_date) {
      setFormError("End date cannot be before start date.");
      return;
    }

    if (Number(form.monthly_cost) < 0) {
      setFormError("Monthly cost cannot be negative.");
      return;
    }

    const isEditing = editingId !== null;
    const url = isEditing ? `${API_URL}/${editingId}` : API_URL;
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          monthly_cost: Number(form.monthly_cost),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setFormError(result.error || "Unable to save subscription.");
        return;
      }

      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);

      setMessage(
        isEditing
          ? "Subscription updated successfully!"
          : "Subscription added successfully!"
      );

      await loadSubscriptions();
    } catch {
      setFormError("Unable to connect to the backend.");
    }
  }

  // Delete a subscription after confirmation
  async function handleDelete() {
    try {
      const response = await fetch(`${API_URL}/${deleteId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error || "Unable to delete subscription.");
        return;
      }

      setDeleteId(null);
      setMessage("Subscription deleted successfully!");

      await loadSubscriptions();
    } catch {
      setMessage("Unable to connect to the backend.");
    }
  }

  // Calculate the days remaining until the end date
  function getRemainingDays(endDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const end = new Date(
      String(endDate).slice(0, 10) + "T00:00:00"
    );

    return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
  }

  return (
    <main className="container">
      <header className="page-header">
        <div>
          <p className="eyebrow">SUBSCRIPTION MANAGER</p>
          <h1>My Subscriptions</h1>
          <p className="subtitle">
            Manage and track your subscriptions in one place.
          </p>
        </div>

        <button className="primary-button" onClick={openAddForm}>
          + Add Subscription
        </button>
      </header>

      {message && <p className="notice">{message}</p>}

      <section className="panel">
        <h2>All Subscriptions</h2>

        {loading && <p>Loading subscriptions...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && subscriptions.length === 0 && (
          <p>No subscriptions found. Add one to get started.</p>
        )}

        {!loading && !error && subscriptions.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Remaining Days</th>
                  <th>Monthly Cost</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {subscriptions.map((subscription) => {
                  const days = getRemainingDays(subscription.end_date);

                  return (
                    <tr key={subscription.subscription_id}>
                      <td>{subscription.user_email}</td>
                      <td>{subscription.plan_name}</td>
                      <td>
                        {String(subscription.start_date).slice(0, 10)}
                      </td>
                      <td>
                        {String(subscription.end_date).slice(0, 10)}
                      </td>
                      <td>{days < 0 ? "Expired" : `${days} days`}</td>
                      <td>
                        ₹{Number(subscription.monthly_cost).toFixed(2)}
                      </td>
                      <td>
                        <span
                          className={`status ${subscription.status.toLowerCase()}`}
                        >
                          {subscription.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="secondary-button"
                            onClick={() => handleEdit(subscription)}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              setDeleteId(subscription.subscription_id)
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {showForm && (
        <div className="modal-backdrop">
          <section className="modal">
            <h2>
              {editingId !== null
                ? "Edit Subscription"
                : "Add Subscription"}
            </h2>

            <form onSubmit={handleSubmit}>
              <label>
                User Email
                <input
                  type="email"
                  name="user_email"
                  value={form.user_email}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Plan Name
                <input
                  type="text"
                  name="plan_name"
                  value={form.plan_name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Start Date
                <input
                  type="date"
                  name="start_date"
                  value={form.start_date}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                End Date
                <input
                  type="date"
                  name="end_date"
                  value={form.end_date}
                  min={form.start_date || undefined}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Monthly Cost (₹)
                <input
                  type="number"
                  name="monthly_cost"
                  value={form.monthly_cost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                />
              </label>

              <label>
                Status
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </label>

              {formError && <p className="error">{formError}</p>}

              <div className="form-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="primary-button">
                  {editingId !== null
                    ? "Update Subscription"
                    : "Save Subscription"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleteId !== null && (
        <div className="modal-backdrop">
          <section className="modal">
            <h2>Delete Subscription?</h2>
            <p>
              Are you sure you want to delete this subscription?
              This action cannot be undone.
            </p>

            <div className="form-actions">
              <button
                className="secondary-button"
                onClick={() => setDeleteId(null)}
              >
                Cancel
              </button>

              <button className="delete-button" onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
