-- Enable RLS on all tables
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- Helper function: get user's tenant IDs
CREATE OR REPLACE FUNCTION get_user_tenant_ids()
RETURNS SETOF UUID AS $$
    SELECT tenant_id FROM tenant_members
    WHERE user_id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function: get user's role in a tenant
CREATE OR REPLACE FUNCTION get_user_role(p_tenant_id UUID)
RETURNS TEXT AS $$
    SELECT role FROM tenant_members
    WHERE user_id = auth.uid() AND tenant_id = p_tenant_id
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Tenants: users can see tenants they belong to
CREATE POLICY tenants_select ON tenants
    FOR SELECT USING (id IN (SELECT get_user_tenant_ids()));

CREATE POLICY tenants_update ON tenants
    FOR UPDATE USING (get_user_role(id) = 'owner');

-- Tenant members: users can see members of their tenants
CREATE POLICY members_select ON tenant_members
    FOR SELECT USING (tenant_id IN (SELECT get_user_tenant_ids()));

CREATE POLICY members_insert ON tenant_members
    FOR INSERT WITH CHECK (
        get_user_role(tenant_id) IN ('owner', 'admin')
        OR NOT EXISTS (SELECT 1 FROM tenant_members WHERE tenant_id = tenant_members.tenant_id)
    );

CREATE POLICY members_update ON tenant_members
    FOR UPDATE USING (get_user_role(tenant_id) IN ('owner', 'admin'));

CREATE POLICY members_delete ON tenant_members
    FOR DELETE USING (get_user_role(tenant_id) IN ('owner', 'admin'));

-- Dashboards: visible to all tenant members
CREATE POLICY dashboards_select ON dashboards
    FOR SELECT USING (tenant_id IN (SELECT get_user_tenant_ids()));

CREATE POLICY dashboards_insert ON dashboards
    FOR INSERT WITH CHECK (
        tenant_id IN (SELECT get_user_tenant_ids())
        AND get_user_role(tenant_id) IN ('owner', 'admin', 'editor')
    );

CREATE POLICY dashboards_update ON dashboards
    FOR UPDATE USING (get_user_role(tenant_id) IN ('owner', 'admin', 'editor'));

CREATE POLICY dashboards_delete ON dashboards
    FOR DELETE USING (get_user_role(tenant_id) IN ('owner', 'admin'));

-- Widgets: follow dashboard access
CREATE POLICY widgets_select ON widgets
    FOR SELECT USING (tenant_id IN (SELECT get_user_tenant_ids()));

CREATE POLICY widgets_insert ON widgets
    FOR INSERT WITH CHECK (
        tenant_id IN (SELECT get_user_tenant_ids())
        AND get_user_role(tenant_id) IN ('owner', 'admin', 'editor')
    );

CREATE POLICY widgets_update ON widgets
    FOR UPDATE USING (get_user_role(tenant_id) IN ('owner', 'admin', 'editor'));

CREATE POLICY widgets_delete ON widgets
    FOR DELETE USING (get_user_role(tenant_id) IN ('owner', 'admin', 'editor'));

-- Data sources: visible to all, modifiable by admins+
CREATE POLICY data_sources_select ON data_sources
    FOR SELECT USING (tenant_id IN (SELECT get_user_tenant_ids()));

CREATE POLICY data_sources_insert ON data_sources
    FOR INSERT WITH CHECK (
        tenant_id IN (SELECT get_user_tenant_ids())
        AND get_user_role(tenant_id) IN ('owner', 'admin')
    );

CREATE POLICY data_sources_update ON data_sources
    FOR UPDATE USING (get_user_role(tenant_id) IN ('owner', 'admin'));

CREATE POLICY data_sources_delete ON data_sources
    FOR DELETE USING (get_user_role(tenant_id) IN ('owner', 'admin'));

-- Subscriptions: visible to all tenant members
CREATE POLICY subscriptions_select ON subscriptions
    FOR SELECT USING (tenant_id IN (SELECT get_user_tenant_ids()));

-- Audit log: visible to admins+
CREATE POLICY audit_select ON audit_log
    FOR SELECT USING (get_user_role(tenant_id) IN ('owner', 'admin'));

CREATE POLICY audit_insert ON audit_log
    FOR INSERT WITH CHECK (tenant_id IN (SELECT get_user_tenant_ids()));

-- Trigger for cache invalidation on member removal
CREATE OR REPLACE FUNCTION on_member_removed()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM pg_notify('member_removed', json_build_object(
        'user_id', OLD.user_id,
        'tenant_id', OLD.tenant_id
    )::text);
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_member_removed
    AFTER DELETE ON tenant_members
    FOR EACH ROW EXECUTE FUNCTION on_member_removed();

-- Auto-create tenant + membership on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    new_tenant_id UUID;
    company TEXT;
    tenant_slug TEXT;
BEGIN
    company := COALESCE(NEW.raw_user_meta_data->>'company_name', 'My Company');
    tenant_slug := lower(regexp_replace(company, '[^a-z0-9]', '-', 'gi'));
    tenant_slug := tenant_slug || '-' || substr(gen_random_uuid()::text, 1, 8);

    INSERT INTO tenants (name, slug)
    VALUES (company, tenant_slug)
    RETURNING id INTO new_tenant_id;

    INSERT INTO tenant_members (tenant_id, user_id, role)
    VALUES (new_tenant_id, NEW.id, 'owner');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
