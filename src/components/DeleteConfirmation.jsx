function DeleteConfirmation({ onCancel, onConfirm }) {
  return (
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
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="delete-button"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
        </div>
      </section>
    </div>
  );
}

export default DeleteConfirmation;