import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, User, Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Message {
  id: string;
  booking_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
  booking?: {
    id: string;
    customer_name: string;
    booking_date: string;
    experience: {
      title: string;
    };
  };
  sender?: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

interface Booking {
  id: string;
  customer_name: string;
  customer_email: string;
  booking_date: string;
  status: string;
  experiences: {
    title: string;
  };
}

export default function MessageCenter() {
  const { profile } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (profile?.id) {
      fetchData();
      setupRealtimeSubscription();
    }
  }, [profile?.id]);

  const fetchData = async () => {
    try {
      // Fetch bookings based on user role
      let bookingsQuery = supabase.from('bookings').select(`
        id,
        customer_name,
        customer_email,
        booking_date,
        status,
        experiences!inner(title)
      `);

      if (profile?.role === 'partner') {
        // For partners, get bookings for their experiences
        bookingsQuery = bookingsQuery
          .eq('experiences.partner_profiles.user_id', profile.id);
      } else if (profile?.role !== 'admin') {
        // For travelers, get their own bookings
        bookingsQuery = bookingsQuery.eq('user_id', profile?.id);
      }

      const { data: bookingsData } = await bookingsQuery;
      
      // Fetch messages with a simpler query to avoid type issues
      const { data: messagesData } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      // Transform the data to include booking and sender info
      const enrichedMessages = messagesData?.map(msg => ({
        ...msg,
        booking: bookingsData?.find(b => b.id === msg.booking_id),
        sender: null // We'll fetch sender info separately if needed
      })) || [];

      setBookings(bookingsData || []);
      setMessages(enrichedMessages as any);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('messages-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'messages'
      }, () => {
        fetchData();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedBooking) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          booking_id: selectedBooking,
          sender_id: profile?.id,
          content: newMessage.trim()
        });

      if (error) throw error;

      setNewMessage('');
      toast.success('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await supabase.rpc('mark_message_read', { message_id: messageId });
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const getBookingMessages = (bookingId: string) => {
    return messages.filter(msg => msg.booking_id === bookingId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <MessageCircle className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Message Center</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle>Active Bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {bookings.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No bookings to message about</p>
            ) : (
              bookings.map(booking => {
                const bookingMessages = getBookingMessages(booking.id);
                const unreadCount = bookingMessages.filter(
                  msg => !msg.read_at && msg.sender_id !== profile?.id
                ).length;

                return (
                  <div
                    key={booking.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedBooking === booking.id 
                        ? 'bg-primary/10 border-primary' 
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedBooking(booking.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{booking.experiences.title}</h4>
                      {unreadCount > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {unreadCount} new
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-3 w-3" />
                      <span>{booking.customer_name}</span>
                      <Calendar className="h-3 w-3 ml-2" />
                      <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedBooking 
                ? `Messages - ${bookings.find(b => b.id === selectedBooking)?.experiences.title}`
                : 'Select a booking to view messages'
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!selectedBooking ? (
              <p className="text-muted-foreground text-center py-8">
                Select a booking from the left to start messaging
              </p>
            ) : (
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {getBookingMessages(selectedBooking).map(message => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${
                        message.sender_id === profile?.id
                          ? 'bg-primary/10 ml-8'
                          : 'bg-muted/50 mr-8'
                      }`}
                      onClick={() => !message.read_at && markAsRead(message.id)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {message.sender_id === profile?.id 
                            ? 'You' 
                            : message.sender 
                              ? `${message.sender.first_name} ${message.sender.last_name}`
                              : 'Unknown'
                          }
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(message.created_at).toLocaleString()}
                        </span>
                        {!message.read_at && message.sender_id !== profile?.id && (
                          <Badge variant="secondary" className="text-xs">New</Badge>
                        )}
                      </div>
                      <p className="text-sm">{message.content}</p>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Textarea
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  <Button 
                    onClick={sendMessage}
                    disabled={!newMessage.trim() || sending}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}