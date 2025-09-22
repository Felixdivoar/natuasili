import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, MessageCircle, Leaf, CheckCircle, Globe, Users } from "lucide-react";

const ConservationChatbotPage = () => {
  const scrollToWidget = () => {
    // The widget is in the bottom right, so we just need to inform the user
    const element = document.querySelector('[aria-label="AsiliChat - Conservation Assistant"]');
    if (element) {
      (element as HTMLElement).focus();
    }
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center">
              <Bot className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4">AsiliChat</h1>
          <p className="text-xl text-muted-foreground mb-2">Conservation Assistant for Kenya</p>
          <p className="text-lg text-muted-foreground">
            Your AI-powered guide to Kenyan wildlife, conservation areas, and sustainable travel
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-primary" />
                Species Knowledge
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get detailed information about Kenya's wildlife including elephants, lions, cheetahs, and more. 
                Learn about their habitats, conservation status, and best viewing locations.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-muted px-2 py-1 rounded-full text-xs">African Elephants</span>
                <span className="bg-muted px-2 py-1 rounded-full text-xs">Lions</span>
                <span className="bg-muted px-2 py-1 rounded-full text-xs">Cheetahs</span>
                <span className="bg-muted px-2 py-1 rounded-full text-xs">Black Rhinos</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Community Conservation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Discover community-led conservation projects, learn about local partnerships, 
                and find ways to support conservation efforts during your visit.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-muted px-2 py-1 rounded-full text-xs">Community Projects</span>
                <span className="bg-muted px-2 py-1 rounded-full text-xs">Local Partners</span>
                <span className="bg-muted px-2 py-1 rounded-full text-xs">Conservation Impact</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Sustainable Travel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Get advice on low-impact travel options, best seasons to visit, 
                carbon footprint estimation, and ethical wildlife viewing practices.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-muted px-2 py-1 rounded-full text-xs">Carbon Footprint</span>
                <span className="bg-muted px-2 py-1 rounded-full text-xs">Best Seasons</span>
                <span className="bg-muted px-2 py-1 rounded-full text-xs">Ethical Tourism</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Smart Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Receive contextual follow-up suggestions based on your questions. 
                AsiliChat learns from your interests to provide relevant recommendations.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-muted px-2 py-1 rounded-full text-xs">Contextual Tips</span>
                <span className="bg-muted px-2 py-1 rounded-full text-xs">Smart Replies</span>
                <span className="bg-muted px-2 py-1 rounded-full text-xs">Personalized</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* How to Use */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              How to Use AsiliChat
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
                <p><strong>Find the chat widget</strong> - Look for the floating "AsiliChat" button in the bottom-right corner of any page</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
                <p><strong>Ask your questions</strong> - Type questions about Kenyan wildlife, conservation, or travel planning</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">3</div>
                <p><strong>Use smart suggestions</strong> - Click on the suggested follow-up questions to explore topics deeper</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">4</div>
                <p><strong>Get personalized advice</strong> - Receive recommendations based on your interests and travel plans</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Example Questions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Example Questions to Ask</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Wildlife & Species</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• "Tell me about elephants in Samburu"</li>
                  <li>• "What threats do cheetahs face in Kenya?"</li>
                  <li>• "Best places to see black rhinos"</li>
                  <li>• "Reticulated giraffe conservation status"</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Travel & Conservation</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• "Best season to visit Maasai Mara"</li>
                  <li>• "Community conservation projects in Laikipia"</li>
                  <li>• "How to minimize my travel carbon footprint"</li>
                  <li>• "Ethical wildlife viewing guidelines"</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="inline-block p-6">
            <h3 className="text-xl font-bold mb-2">Ready to Start?</h3>
            <p className="text-muted-foreground mb-4">
              Look for the AsiliChat widget in the bottom-right corner to begin your conservation journey!
            </p>
            <Button 
              onClick={scrollToWidget}
              className="bg-primary hover:bg-primary/90"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Open AsiliChat
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ConservationChatbotPage;