import React, { useState, useEffect } from 'react';
import { Search, Send, User, MessageCircle } from 'lucide-react';
import apiClient from '@/services/api/client';

interface ChatMessage {
  id: string;
  sender: 'me' | 'other';
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  unreadCount?: number;
  messages: ChatMessage[];
}

export default function Messages() {
  const [searchTerm, setSearchTerm] = useState('');
  const [inputText, setInputText] = useState('');
  
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const saved = localStorage.getItem('user_conversations');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }

    return [
      {
        id: '1',
        name: 'Prof. Sarah Jenkins',
        role: 'Computer Science Dept.',
        messages: [
          { id: 'm1', sender: 'other', text: "Hello! I've finished grading your midterm assessment. Great performance on algorithms!", timestamp: '10:40 AM' },
          { id: 'm2', sender: 'me', text: 'Thank you Professor Jenkins! I really appreciate the feedback and guidance.', timestamp: '10:42 AM' },
        ]
      },
      {
        id: '2',
        name: 'Alex Rivera',
        role: 'Proctoring Coordinator',
        messages: [
          { id: 'm3', sender: 'other', text: 'Your test environment verification passed successfully. You are cleared for upcoming exams.', timestamp: 'Yesterday' }
        ]
      },
      {
        id: '3',
        name: 'Technical Support Team',
        role: 'System Helpdesk',
        messages: [
          { id: 'm4', sender: 'other', text: 'Ticket #1042 has been marked in progress. Let us know if you need assistance with webcam setup.', timestamp: '2 days ago' }
        ]
      }
    ];
  });

  const [activeChatId, setActiveChatId] = useState<string>(conversations[0]?.id || '1');

  // Also fetch any teachers/courses dynamically if available to add contacts
  useEffect(() => {
    apiClient.get('/videos/courses').then(res => {
      if (Array.isArray(res.data) && res.data.length > 0) {
        setConversations(prev => {
          const existingIds = new Set(prev.map(c => c.id));
          const additions: Conversation[] = [];
          res.data.slice(0, 3).forEach((c: any) => {
            const id = `instructor-${c.id}`;
            if (!existingIds.has(id) && c.instructorName) {
              additions.push({
                id,
                name: c.instructorName,
                role: `${c.title} Instructor`,
                messages: [
                  { id: `init-${id}`, sender: 'other', text: `Welcome to ${c.title}! Feel free to reach out if you have any questions about the syllabus.`, timestamp: 'Recently' }
                ]
              });
            }
          });
          if (additions.length === 0) return prev;
          const merged = [...prev, ...additions];
          try {
            localStorage.setItem('user_conversations', JSON.stringify(merged));
          } catch (e) {
            console.error(e);
          }
          return merged;
        });
      }
    }).catch(() => {});
  }, []);

  const activeChat = conversations.find(c => c.id === activeChatId) || conversations[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeChat) return;

    const newMsg: ChatMessage = {
      id: String(Date.now()),
      sender: 'me',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = conversations.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          messages: [...c.messages, newMsg]
        };
      }
      return c;
    });

    setConversations(updated);
    try {
      localStorage.setItem('user_conversations', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    setInputText('');
  };

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-6.5rem)] max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6 font-sans pb-10">
      
      {/* Sidebar: Chat List */}
      <div className="w-full md:w-80 flex flex-col rounded-3xl bg-slate-900/80 border border-border/10 backdrop-blur-xl overflow-hidden shrink-0 shadow-lg">
        <div className="p-4 border-b border-border/10">
          <h2 className="text-lg font-bold text-primary-foreground mb-3 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-sky-400" /> Messages
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search conversations..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/50 border border-border/10 rounded-xl py-2 pl-9 pr-3 text-sm text-primary-foreground outline-none focus:border-sky-500 placeholder:text-slate-500" 
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredConversations.map((c) => {
            const lastMsg = c.messages[c.messages.length - 1];
            const isActive = c.id === activeChat?.id;

            return (
              <button 
                key={c.id}
                onClick={() => setActiveChatId(c.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition ${
                  isActive 
                    ? 'bg-sky-500/10 border border-sky-500/30' 
                    : 'hover:bg-slate-800/50 border border-transparent'
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-border/5">
                  <User className={`w-5 h-5 ${isActive ? 'text-sky-400' : 'text-slate-400'}`} />
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className={`text-sm font-bold truncate ${isActive ? 'text-primary-foreground' : 'text-slate-300'}`}>{c.name}</span>
                    <span className="text-[10px] text-slate-500">{lastMsg?.timestamp || ''}</span>
                  </div>
                  <p className="text-xs text-slate-400 truncate">{lastMsg?.text || c.role}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col rounded-3xl bg-slate-900/80 border border-border/10 backdrop-blur-xl overflow-hidden shadow-xl">
        {activeChat ? (
          <>
            <div className="p-4 border-b border-border/10 flex items-center gap-3 bg-slate-900/50">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-border/5">
                <User className="w-5 h-5 text-sky-400" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-primary-foreground">{activeChat.name}</h2>
                <p className="text-xs text-slate-400">{activeChat.role}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activeChat.messages.map((m) => {
                const isMe = m.sender === 'me';
                return (
                  <div 
                    key={m.id} 
                    className={`flex gap-3 max-w-[85%] sm:max-w-[70%] ${
                      isMe ? 'self-end ml-auto flex-row-reverse' : ''
                    }`}
                  >
                    {!isMe && (
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-border/5 flex items-center justify-center shrink-0">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                    )}
                    <div>
                      <div className={`p-3.5 rounded-2xl text-sm leading-relaxed ${
                        isMe 
                          ? 'bg-sky-500 text-primary-foreground rounded-tr-xs shadow-md shadow-sky-500/10' 
                          : 'bg-slate-800 border border-border/5 text-slate-200 rounded-tl-xs'
                      }`}>
                        {m.text}
                      </div>
                      <span className={`text-[10px] text-slate-500 mt-1 block ${isMe ? 'text-right mr-1' : 'ml-1'}`}>
                        {m.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t border-border/10 bg-slate-950/50">
              <div className="flex items-center gap-3 relative">
                <input 
                  type="text" 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Reply to ${activeChat.name}...`} 
                  className="flex-1 bg-slate-900 border border-border/10 rounded-full py-3 pl-4 pr-12 text-sm text-primary-foreground outline-none focus:border-sky-500 placeholder:text-slate-500" 
                />
                <button 
                  type="submit"
                  disabled={!inputText.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center text-primary-foreground hover:bg-sky-400 disabled:opacity-50 disabled:hover:bg-sky-500 transition shadow-md"
                >
                  <Send className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-500">
            Select a conversation to start chatting.
          </div>
        )}
      </div>

    </div>
  );
}