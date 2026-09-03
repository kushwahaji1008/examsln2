import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Users, Video, Mic, MicOff, VideoOff, MessageSquare, ListTodo } from 'lucide-react';

export default function LiveStreamViewer() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Instructor', text: 'Welcome everyone! We will begin in 2 minutes.', isInstructor: true },
    { id: 2, sender: 'Alex M.', text: 'Hi all!', isInstructor: false },
  ]);
  const [showPoll, setShowPoll] = useState(false);
  const [pollVoted, setPollVoted] = useState(false);

  // Simulate a poll popping up
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPoll(true);
    }, 15000); // Poll appears after 15 seconds
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'You', text: chatInput, isInstructor: false }]);
    setChatInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-card shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/student/live')} className="text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-500 border border-rose-500/20 animate-pulse">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Live
            </span>
            <h1 className="font-bold text-foreground">Advanced React Patterns Workshop</h1>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-semibold text-muted-foreground">
          <div className="flex items-center gap-1"><Users className="w-4 h-4" /> 244</div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Stage (Video Feed) */}
        <div className="flex-1 bg-black relative flex flex-col">
          {/* Simulated Video Feed */}
          <div className="flex-1 flex items-center justify-center">
             <div className="text-center text-white/50">
                <Video className="w-20 h-20 mx-auto mb-4 opacity-50" />
                <p className="text-xl font-medium">Instructor Video Stream</p>
                <p className="text-sm mt-2">Low-latency feed initializing...</p>
             </div>
          </div>
          
          {/* Poll Modal Overlay */}
          {showPoll && !pollVoted && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10 backdrop-blur-sm">
              <div className="bg-card border border-border p-6 rounded-2xl max-w-sm w-full shadow-2xl animate-in zoom-in-95">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2"><ListTodo className="w-5 h-5 text-primary" /> Live Poll</h3>
                <p className="text-sm font-medium text-foreground mb-4">Have you used React Server Components in production?</p>
                <div className="space-y-2">
                  {['Yes, extensively', 'Yes, a little', 'No, not yet'].map((opt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => { setPollVoted(true); setShowPoll(false); }}
                      className="w-full text-left px-4 py-3 rounded-xl border border-border bg-secondary hover:bg-primary/10 hover:border-primary text-sm font-medium transition"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Controls */}
          <div className="h-16 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-4 shrink-0 px-6 absolute bottom-0 w-full">
            {/* Student controls (mock) */}
          </div>
        </div>

        {/* Right Sidebar (Live Chat) */}
        <div className="w-80 lg:w-96 bg-card border-l border-border flex flex-col shrink-0 relative">
          <div className="p-4 border-b border-border flex items-center gap-2 shrink-0">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            <h2 className="font-bold text-sm text-foreground">Live Chat</h2>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map((msg) => (
              <div key={msg.id} className="text-sm">
                <span className={`font-bold mr-2 ${msg.isInstructor ? 'text-primary' : 'text-emerald-500'}`}>
                  {msg.sender}
                </span>
                <span className="text-foreground leading-relaxed">{msg.text}</span>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-border bg-secondary/30 shrink-0">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input 
                type="text" 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Say something..." 
                className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim()}
                className="shrink-0 w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
