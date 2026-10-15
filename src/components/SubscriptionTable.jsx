import StatusBadge from "./StatusBadge";

function SubscriptionTable({
  subscriptions,
  getRemainingDays,
  getSubscriptionStatus,
  handleEdit,
  setDeleteId,
}) {
  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Sub ID</th>
            <th>User Email</th>
            <th>Plan Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th className="remaining-days">Remaining Days</th>
            <th>Monthly Cost</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {subscriptions.map((subscription) => {
            const days = getRemainingDays(subscription.end_date);
            const status = getSubscriptionStatus(subscription);

            return (
              <tr key={subscription.subscription_id}>
                <td>SUB-{subscription.subscription_id}</td>
                <td>{subscription.user_email}</td>
                <td>{subscription.plan_name}</td>
                <td>
                  {String(subscription.start_date).slice(0, 10)}
                </td>
                <td>
                  {String(subscription.end_date).slice(0, 10)}
                </td>
                <td className="remaining-days-value">
                   {days < 0 ? "Expired" : `${days} days`}
                </td>
                <td>
                  ₹{Number(subscription.monthly_cost).toFixed(2)}
                </td>
                <td>
                  <StatusBadge status={status} />
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
  );
}

export default SubscriptionTable;