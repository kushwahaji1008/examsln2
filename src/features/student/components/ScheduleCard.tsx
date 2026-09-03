import React from 'react';
import { Video, Calendar as CalendarIcon, Clock } from 'lucide-react';

export interface ScheduleEvent {
  id: string;
  title: string;
  type: 'live-class' | 'deadline';
  time: string;
  instructor?: string;
}

interface ScheduleCardProps {
  events?: ScheduleEvent[];
  dateString?: string;
}

export default function ScheduleCard({ events = [], dateString = 'Today' }: ScheduleCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <CalendarIcon className="h-5 w-5 text-primary" />
          Schedule
        </h2>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          {dateString}
        </span>
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 py-6 text-center">
          <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center mb-3">
            <Clock className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">Your day is clear.</p>
          <p className="text-xs text-muted-foreground mt-1">No scheduled classes or deadlines.</p>
        </div>
      ) : (
        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {events.map((event) => (
            <div 
              key={event.id}
              className="flex items-start gap-4 rounded-2xl bg-secondary p-4 border border-border transition hover:bg-secondary/70"
            >
              <div className="flex flex-col items-center justify-center pt-0.5">
                <span className="text-xs font-semibold text-foreground">{event.time.split(' ')[0]}</span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">{event.time.split(' ')[1]}</span>
              </div>
              <div className="w-px h-10 bg-border mx-1" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-foreground leading-tight">
                  {event.title}
                </h4>
                {event.type === 'live-class' && (
                  <div className="mt-2 flex items-center gap-1.5 text-xs text-primary font-medium">
                    <Video className="h-3.5 w-3.5" />
                    <span>Live Class {event.instructor && `with ${event.instructor}`}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}