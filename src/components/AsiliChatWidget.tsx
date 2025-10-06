import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Send, X, Bot, User, ChevronDown, MapPin, Clock, ExternalLink } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface Experience {
  id: string;
  slug: string;
  title: string;
  description: string;
  price_kes_adult: number;
  location_text: string;
  hero_image?: string;
  themes?: string[];
  duration_hours?: number;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  experiences?: Experience[];
}

interface ToolResult {
  name: string;
  data: any;
}

const AsiliChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Jambo! I\'m AsiliChat, your conservation assistant for Kenya. Ask me about wildlife, protected areas, community projects, or sustainable travel tips!',
      timestamp: new Date(),
      suggestions: ['Tell me about elephants', 'Best parks to visit', 'Community conservation projects']
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stickToBottom, setStickToBottom] = useState(true);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // External open/hide events
  useEffect(() => {
    const openHandler = () => {
      console.log('AsiliChat: Received open event');
      setIsOpen(true);
    };
    const toggleHandler = () => {
      console.log('AsiliChat: Received toggle event, current state:', isOpen);
      setIsOpen(prev => !prev);
    };
    const hideHandler = () => {
      console.log('AsiliChat: Received hide event');
      setIsOpen(false);
    };
    console.log('AsiliChat: Setting up event listeners');
    document.addEventListener('asili-chat:open', openHandler as EventListener);
    document.addEventListener('asili-chat:toggle', toggleHandler as EventListener);
    document.addEventListener('asili-chat:hide', hideHandler as EventListener);
    return () => {
      document.removeEventListener('asili-chat:open', openHandler as EventListener);
      document.removeEventListener('asili-chat:toggle', toggleHandler as EventListener);
      document.removeEventListener('asili-chat:hide', hideHandler as EventListener);
    };
  }, []);

  // Auto-scroll management
  useEffect(() => {
    if (stickToBottom && scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages, stickToBottom, isOpen]);

  const handleScroll = () => {
    if (!scrollAreaRef.current) return;
    const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollContainer) return;
    
    const { scrollTop, scrollHeight, clientHeight } = scrollContainer as HTMLElement;
    const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
    setStickToBottom(nearBottom);
  };

  const jumpToLatest = () => {
    setStickToBottom(true);
  };

  const sendMessage = async (messageText?: string) => {
    const text = messageText || input.trim();
    if (!text || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setStickToBottom(true);

    try {
      const { data, error } = await supabase.functions.invoke('asili-chat', {
        body: {
          message: text,
          userId: user?.id
        }
      });

      if (error) throw error;

      // Extract experience data from tools
      const experienceData = data.tools?.find((t: ToolResult) => t.name === "experienceSearch")?.data || [];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || 'I apologize, but I encountered an issue processing your request.',
        timestamp: new Date(),
        suggestions: data.suggestions || [],
        experiences: experienceData
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Connection Error',
        description: 'Unable to reach AsiliChat. Please try again.',
        variant: 'destructive'
      });
      
      // Add a single fallback message (avoid duplicates)
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'assistant' && last.content.includes('Please try')) {
          return prev; // prevent repeating the same technical message
        }
        const fallback: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I couldn\'t reach our AI right now. You can still ask about parks, seasons, species, or partners — I\'ll try again on your next message.',
          timestamp: new Date(),
          suggestions: ['Best parks to visit', 'Best season for wildlife', 'Tell me about elephants']
        };
        return [...prev, fallback];
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };

  const handleExperienceClick = (slug: string) => {
    setIsOpen(false);
    navigate(`/experiences/${slug}`);
  };

  return (
    <>
      {/* Chat Panel */}
      {isOpen && (
        <Card
          id="asili-chat-panel"
          className="fixed bottom-4 right-4 z-50 w-[92vw] max-w-md shadow-2xl overflow-hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          role="dialog"
          aria-label="AsiliChat - Conservation Assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-card">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AsiliChat</h3>
                <p className="text-xs text-muted-foreground">Conservation in Kenya</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} aria-label="Hide AsiliChat">
                Hide
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="relative">
            <ScrollArea 
              ref={scrollAreaRef}
              className="h-[60vh] max-h-[400px] p-4"
              onScrollCapture={handleScroll}
            >
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="space-y-2">
                    <div className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.role === 'assistant' && (
                        <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                          <Bot className="h-3 w-3 text-primary-foreground" />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                        {message.role === 'assistant' && (
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        )}
                      </div>

                      {message.role === 'user' && (
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1">
                          <User className="h-3 w-3" />
                        </div>
                      )}
                    </div>

                    {/* Experience Cards */}
                    {message.role === 'assistant' && message.experiences && message.experiences.length > 0 && (
                      <div className="ml-9 space-y-2 mt-2">
                        {message.experiences.map((exp) => (
                          <Card 
                            key={exp.id} 
                            className="p-3 hover:shadow-md transition-shadow cursor-pointer border-primary/20"
                            onClick={() => handleExperienceClick(exp.slug)}
                          >
                            <div className="flex gap-3">
                              {exp.hero_image && (
                                <img 
                                  src={exp.hero_image} 
                                  alt={exp.title}
                                  className="w-20 h-20 object-cover rounded"
                                />
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm mb-1 line-clamp-1">{exp.title}</h4>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                  <MapPin className="h-3 w-3" />
                                  <span className="line-clamp-1">{exp.location_text}</span>
                                </div>
                                {exp.duration_hours && (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{exp.duration_hours} hours</span>
                                  </div>
                                )}
                                <div className="flex items-center justify-between mt-2">
                                  <span className="font-bold text-sm">KES {exp.price_kes_adult.toLocaleString()}</span>
                                  <Button size="sm" variant="ghost" className="h-6 text-xs">
                                    View Details
                                    <ExternalLink className="h-3 w-3 ml-1" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Suggestions */}
                    {message.role === 'assistant' && message.suggestions && message.suggestions.length > 0 && (
                      <div className="flex flex-wrap gap-2 ml-9 mt-2">
                        {message.suggestions.slice(0, 3).map((suggestion, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            size="sm"
                            className="h-7 text-xs rounded-full"
                            onClick={() => handleSuggestionClick(suggestion)}
                            disabled={isLoading}
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-3 w-3 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-2xl px-3 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Jump to latest button */}
            {!stickToBottom && (
              <Button
                onClick={jumpToLatest}
                size="sm"
                variant="secondary"
                className="absolute bottom-4 right-6 text-xs h-8 px-3 rounded-full shadow-md"
              >
                <ChevronDown className="h-3 w-3 mr-1" />
                Jump to latest
              </Button>
            )}
          </div>

          {/* Input Area */}
          <div className="p-3 border-t bg-card">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about species, parks, seasons, community projects…"
                disabled={isLoading}
                className="flex-1 text-sm"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="px-3"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};

export default AsiliChatWidget;