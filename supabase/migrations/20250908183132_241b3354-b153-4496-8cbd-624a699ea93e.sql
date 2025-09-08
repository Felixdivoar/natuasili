-- Set up real-time triggers for when actual data changes
DROP TRIGGER IF EXISTS update_impact_metrics_on_booking ON bookings;
CREATE TRIGGER update_impact_metrics_on_booking
    AFTER INSERT OR UPDATE OR DELETE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_impact_metrics();

DROP TRIGGER IF EXISTS update_impact_metrics_on_experience ON experiences;
CREATE TRIGGER update_impact_metrics_on_experience
    AFTER INSERT OR UPDATE OR DELETE ON experiences
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_impact_metrics();

DROP TRIGGER IF EXISTS update_impact_metrics_on_partner ON partners;
CREATE TRIGGER update_impact_metrics_on_partner
    AFTER INSERT OR UPDATE OR DELETE ON partners
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_impact_metrics();