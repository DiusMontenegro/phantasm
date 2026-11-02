export default function DashboardLoading() {
  return (
    <main className="dashboard-content dashboard-loading" aria-busy="true">
      <div className="dashboard-loading-heading shimmer" />
      <div className="dashboard-loading-copy shimmer" />
      <div className="dashboard-loading-grid">
        <div className="shimmer" />
        <div className="shimmer" />
        <div className="shimmer" />
      </div>
    </main>
  );
}
