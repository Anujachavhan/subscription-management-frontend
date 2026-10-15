function SubscriptionForm({
  editingId,
  form,
  handleChange,
  handleSubmit,
  formError,
  setShowForm,
}) {
  return (
    <div className="modal-backdrop">
      <section className="modal">
        <h2>
          {editingId !== null ? "Edit Subscription" : "Add Subscription"}
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
  );
}

export default SubscriptionForm;