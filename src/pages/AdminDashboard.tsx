import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAdmin } from "@/hooks/useAdmin";
import AdminOverview from "@/components/admin/AdminOverview";
import AdminExperiences from "@/components/admin/AdminExperiences";
import AdminPartners from "@/components/admin/AdminPartners";
import AdminBookings from "@/components/admin/AdminBookings";

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { isAdmin, loading } = useAdmin();

  // Redirect if not admin
  if (!loading && !isAdmin) {
    toast.error('Access denied. Admin privileges required.');
    navigate('/');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Admin Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(120,119,198,0.2),transparent)] animate-fade-in"></div>
        <div className="relative w-full py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-scale-in">
                <Shield className="h-4 w-4 mr-2" />
                Administrator Portal
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 animate-fade-in">
                Admin
                <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Dashboard</span>
              </h1>
              <p className="text-base font-light md:text-lg text-muted-foreground mb-8 max-w-3xl animate-fade-in">
                Monitor global conservation impact, manage experiences, and oversee platform operations in real-time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="w-full py-12 lg:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mb-8 gap-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-2">Global Overview</h2>
                  <p className="text-muted-foreground">Real-time platform metrics and conservation impact</p>
                </div>
                <TabsList className="flex w-full overflow-x-auto scrollbar-hide bg-muted/50 p-1 rounded-xl gap-1 sm:grid sm:grid-cols-2 lg:grid-cols-4">
                  <TabsTrigger value="overview" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm px-3 py-2 whitespace-nowrap">Overview</TabsTrigger>
                  <TabsTrigger value="experiences" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm px-3 py-2 whitespace-nowrap">Experiences</TabsTrigger>
                  <TabsTrigger value="partners" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm px-3 py-2 whitespace-nowrap">Partners</TabsTrigger>
                  <TabsTrigger value="bookings" className="flex-shrink-0 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm text-xs sm:text-sm px-3 py-2 whitespace-nowrap">Bookings</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="overview" className="space-y-8 animate-fade-in">
                <AdminOverview />
              </TabsContent>

              <TabsContent value="experiences" className="space-y-6 animate-fade-in">
                <AdminExperiences />
              </TabsContent>

              <TabsContent value="partners" className="space-y-6 animate-fade-in">
                <AdminPartners />
              </TabsContent>

              <TabsContent value="bookings" className="space-y-6 animate-fade-in">
                <AdminBookings />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;