export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your organization settings
      </p>
      <div className="mt-8 rounded-lg border border-border p-6">
        <h2 className="font-semibold">Organization Name</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Configure your organization details, branding, and white-label
          settings here.
        </p>
      </div>
    </div>
  );
}
