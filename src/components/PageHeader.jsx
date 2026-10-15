function PageHeader({ onAddSubscription }) {
  return (
    <header className="page-header">
      <div className="header-content">
        <h1>Subscription Management System</h1>
        <p>
          Manage and track all your subscriptions in one place.
        </p>
      </div>

      <button
        type="button"
        className="add-subscription-btn"
        onClick={onAddSubscription}
      >
        <span aria-hidden="true">+</span>
        Add Subscription
      </button>
    </header>
  );
}

export default PageHeader;