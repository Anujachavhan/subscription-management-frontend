
import { useEffect, useState } from "react";
import "./App.css";
import PageHeader from "./components/PageHeader";
import StatusFilter from "./components/StatusFilter";
import SubscriptionTable from "./components/SubscriptionTable";
import SubscriptionForm from "./components/SubscriptionForm";
import DeleteConfirmation from "./components/DeleteConfirmation";


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
  const [statusFilter, setStatusFilter] = useState("All");

  
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


  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  
  function openAddForm() {
    setForm(emptyForm);
    setEditingId(null);
    setFormError("");
    setMessage("");
    setShowForm(true);
  }

  
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

  
 
  function getRemainingDays(endDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateText = String(endDate).slice(0, 10);
    const [year, month, day] = dateText.split("-").map(Number);

    const end = new Date(year, month - 1, day);
    end.setHours(0, 0, 0, 0);

    return Math.round((end - today) / (1000 * 60 * 60 * 24));
    }

  function getSubscriptionStatus(subscription) {

    if (subscription.status?.toLowerCase() === "cancelled") {
      return "Cancelled";
    }

  return getRemainingDays(subscription.end_date) < 0
    ? "Expired"
    : "Active";
  }

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    if (statusFilter === "All") return true;

    return getSubscriptionStatus(subscription) === statusFilter;
    });


  return (
    <main className="container">
      
    <PageHeader onAddSubscription={openAddForm} />

      {message && (
           <div className="notice">
              <span>{message}</span>
              <button
                type="button"
                className="notice-close"
                onClick={() => setMessage("")}
                aria-label="Close notification"
              >
                ×
              </button>
            </div>
          )}

      <section className="panel">
        <h2>All Subscriptions</h2>
        
        <StatusFilter
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
         />


        {loading && <p>Loading subscriptions...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && subscriptions.length === 0 && (
          <p>No subscriptions found. Add one to get started.</p>
        )}

        {!loading && !error && subscriptions.length > 0 && (
          
         <div className="subscriptions-panel">
           <p className="entry-count">
             Showing {filteredSubscriptions.length} of {subscriptions.length} entries
           </p>
          
          
          <SubscriptionTable
            subscriptions={filteredSubscriptions}
            getRemainingDays={getRemainingDays}
            getSubscriptionStatus={getSubscriptionStatus}
            handleEdit={handleEdit}
            setDeleteId={setDeleteId}
           />

          </div>
        )}
      </section>

      {showForm && (
          <SubscriptionForm
            editingId={editingId}
            form={form}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            formError={formError}
            setShowForm={setShowForm}
          />
    )}

        {deleteId !== null && (
          <DeleteConfirmation
           onCancel={() => setDeleteId(null)}
           onConfirm={handleDelete}
        />
      )}
    </main>
  );
}

export default App;
