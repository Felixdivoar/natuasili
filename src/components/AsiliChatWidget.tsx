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

interface PageResult {
  type: 'page' | 'theme';
  title: string;
  url: string;
  description: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  experiences?: Experience[];
  pages?: PageResult[];
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
      content: 'Jambo! 🌍 I\'m AsiliChat, your smart guide for everything on NatuAsili. I can help you discover experiences, learn about our impact, find partners, answer questions, or navigate to any page. What would you like to explore?',
      timestamp: new Date(),
      suggestions: ['Explore conservation experiences', 'Learn about our impact', 'Find partners']
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

      // Extract experience and page data from tools
      const experienceData = data.tools?.find((t: ToolResult) => t.name === "experienceSearch")?.data || [];
      const pageData = data.tools?.find((t: ToolResult) => t.name === "pageSearch")?.data || [];

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer || 'I apologize, but I encountered an issue processing your request.',
        timestamp: new Date(),
        suggestions: data.suggestions || [],
        experiences: experienceData,
        pages: pageData
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: 'Connection Error',
        description: 'Unable to reach AsiliChat. Please try again.',
        variant: 'destructive'
      });
      
      // Add a helpful fallback message
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'assistant') {
          return prev; // prevent duplicates
        }
        const fallback: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'I\'m having trouble connecting right now, but I\'m still here! Try asking about elephant experiences, marine conservation, or community visits.',
          timestamp: new Date(),
          suggestions: ['Book elephant experience', 'Marine conservation', 'Cultural visits']
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

  const handlePageClick = (url: string) => {
    setIsOpen(false);
    // Handle absolute URLs
    if (url.startsWith('http')) {
      window.location.href = url;
    } else {
      navigate(url);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-br from-primary to-primary/80 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 flex items-center justify-center group"
          aria-label="Open AsiliChat"
        >
          <MessageCircle className="h-6 w-6 text-primary-foreground group-hover:scale-110 transition-transform" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background animate-pulse"></span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <Card
          id="asili-chat-panel"
          className="fixed bottom-4 right-4 z-50 w-[92vw] max-w-md shadow-2xl overflow-hidden border-2 border-primary/20 animate-in slide-in-from-bottom-4 duration-300"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          role="dialog"
          aria-label="AsiliChat - Conservation Assistant"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/10 to-primary/5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-md">
                <Bot className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-base">AsiliChat</h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></span>
                  Conservation Assistant
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsOpen(false)} 
              aria-label="Close AsiliChat"
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
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
                        <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-primary to-primary/90 text-primary-foreground'
                          : 'bg-card border border-border'
                      }`}>
                        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                        {message.role === 'assistant' && (
                          <div className="text-xs text-muted-foreground mt-1.5">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        )}
                      </div>

                      {message.role === 'user' && (
                        <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-1 border border-border">
                          <User className="h-4 w-4" />
                        </div>
                      )}
                    </div>

                    {/* Page Cards */}
                    {message.role === 'assistant' && message.pages && message.pages.length > 0 && (
                      <div className="ml-9 space-y-2.5 mt-3">
                        {message.pages.map((page, idx) => (
                          <Card 
                            key={idx}
                            className="group overflow-hidden hover:shadow-lg hover:border-primary/50 transition-all duration-200 cursor-pointer border border-primary/20 bg-gradient-to-br from-card/90 to-card/70 backdrop-blur-sm"
                            onClick={() => handlePageClick(page.url)}
                          >
                            <div className="flex items-start gap-3 p-3">
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors line-clamp-2">
                                  {page.title}
                                </h4>
                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                  {page.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                                    {page.type === 'theme' ? '🎯 Theme' : '📄 Page'}
                                  </span>
                                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors flex-shrink-0" />
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}

                    {/* Experience Cards - Enhanced */}
                    {message.role === 'assistant' && message.experiences && message.experiences.length > 0 && (
                      <div className="ml-9 space-y-3 mt-3">
                        {message.experiences.map((exp) => (
                          <Card 
                            key={exp.id} 
                            className="group overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer border border-primary/30 bg-gradient-to-br from-card/80 to-card/60 backdrop-blur-sm"
                            onClick={() => handleExperienceClick(exp.slug)}
                          >
                            <div className="flex gap-3 p-3">
                              {exp.hero_image && (
                                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
                                  <img 
                                    src={exp.hero_image} 
                                    alt={exp.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
                                  {exp.title}
                                </h4>
                                
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                  <MapPin className="h-3 w-3 flex-shrink-0" />
                                  <span className="line-clamp-1">{exp.location_text}</span>
                                </div>
                                
                                {exp.duration_hours && (
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                    <Clock className="h-3 w-3 flex-shrink-0" />
                                    <span>{exp.duration_hours}h experience</span>
                                  </div>
                                )}
                                
                                {/* Themes pills */}
                                {exp.themes && exp.themes.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mb-2">
                                    {exp.themes.slice(0, 2).map((theme: string, idx: number) => (
                                      <span 
                                        key={idx}
                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] bg-primary/10 text-primary border border-primary/20"
                                      >
                                        {theme}
                                      </span>
                                    ))}
                                  </div>
                                )}
                                
                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                                  <div>
                                    <div className="text-[10px] text-muted-foreground">From</div>
                                    <span className="font-bold text-base text-primary">
                                      KES {exp.price_kes_adult.toLocaleString()}
                                    </span>
                                  </div>
                                  <Button 
                                    size="sm" 
                                    className="h-7 text-xs bg-primary hover:bg-primary/90 group-hover:shadow-md transition-all"
                                  >
                                    Book Now
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
                            className="h-7 text-xs rounded-full border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-colors"
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
                    <div className="h-7 w-7 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="bg-card border border-border rounded-2xl px-4 py-3 shadow-sm">
                      <div className="flex space-x-1.5">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
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
          <div className="p-4 border-t bg-gradient-to-r from-primary/5 to-primary/10">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about wildlife, experiences, or conservation…"
                disabled={isLoading}
                className="flex-1 text-sm border-primary/20 focus:border-primary/40 bg-background"
              />
              <Button
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                size="sm"
                className="px-4 bg-gradient-to-br from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
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