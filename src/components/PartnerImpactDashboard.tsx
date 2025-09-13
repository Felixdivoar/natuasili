import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Upload, FileText, TrendingUp, Users, DollarSign } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface ImpactMetrics {
  trees_planted: number;
  carbon_offset: number;
  wildlife_protected: number;
  community_members_supported: number;
  total_funding: number;
  period_start: string;
  period_end: string;
  narrative: string;
}

interface Upload {
  id: string;
  file_url: string;
  file_type: string;
  uploaded_at: string;
  status: string;
  processed_at?: string;
}

const PartnerImpactDashboard: React.FC = () => {
  const [impactData, setImpactData] = useState<ImpactMetrics | null>(null);
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchImpactData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('impact-tracker', {
        body: {
          action: 'get_partner_metrics',
          userId: user.id
        }
      });

      if (error) throw error;

      setImpactData(data.metrics);
      setUploads(data.uploads || []);
    } catch (error) {
      console.error('Error fetching impact data:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch impact data',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    if (!uploadFile || !user) return;

    setIsUploading(true);
    try {
      // Upload file to Supabase storage
      const fileExt = uploadFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('partner-files')
        .upload(fileName, uploadFile);

      if (uploadError) throw uploadError;

      // Process the upload
      const { data, error } = await supabase.functions.invoke('impact-tracker', {
        body: {
          action: 'process_upload',
          userId: user.id,
          file_url: uploadData.path,
          file_type: uploadFile.type
        }
      });

      if (error) throw error;

      toast({
        title: 'Upload Successful',
        description: 'Your impact report has been uploaded and is being processed.',
      });

      setUploadFile(null);
      fetchImpactData(); // Refresh data
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload Failed',
        description: 'Failed to upload impact report',
        variant: 'destructive'
      });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    fetchImpactData();
  }, [user]);

  if (!user) {
    return (
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Partner Impact Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Please login as a partner to view your impact dashboard.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5 text-primary" />
            Partner Impact Dashboard
          </CardTitle>
        </CardHeader>
      </Card>

      <Tabs defaultValue="metrics" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics">Impact Metrics</TabsTrigger>
          <TabsTrigger value="uploads">File Uploads</TabsTrigger>
          <TabsTrigger value="reports">Generate Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : impactData ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Trees Planted</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {impactData.trees_planted.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Carbon Offset</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">
                      {impactData.carbon_offset.toLocaleString()} kg
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-4 w-4 text-orange-600" />
                      <span className="text-sm font-medium">Wildlife Protected</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {impactData.wildlife_protected.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Total Funding</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">
                      KES {impactData.total_funding.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {impactData.narrative && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Impact Narrative</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{impactData.narrative}</p>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <BarChart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Impact Data Available</h3>
                <p className="text-muted-foreground">
                  Upload your impact reports to see metrics and analytics here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="uploads" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Impact Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="flex-1"
                />
                <Button 
                  onClick={handleFileUpload}
                  disabled={!uploadFile || isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Supported formats: PDF, Word documents, Excel spreadsheets, CSV files
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
            </CardHeader>
            <CardContent>
              {uploads.length > 0 ? (
                <div className="space-y-3">
                  {uploads.map((upload) => (
                    <div key={upload.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{upload.file_url.split('/').pop()}</p>
                          <p className="text-sm text-muted-foreground">
                            Uploaded {new Date(upload.uploaded_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={upload.status === 'processed' ? 'default' : 'secondary'}>
                        {upload.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  No uploads yet. Upload your first impact report above.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Coming soon: Generate comprehensive impact reports for stakeholders and donors.
              </p>
              <Button disabled variant="outline">
                Generate Monthly Report
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PartnerImpactDashboard;