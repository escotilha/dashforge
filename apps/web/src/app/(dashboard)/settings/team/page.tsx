export default function TeamPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Team</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage team members and roles
      </p>
      <div className="mt-8 rounded-lg border border-dashed border-border py-12 text-center">
        <p className="text-sm text-muted-foreground">
          Invite team members to collaborate on dashboards.
        </p>
        <button className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Invite Member
        </button>
      </div>
    </div>
  );
}
