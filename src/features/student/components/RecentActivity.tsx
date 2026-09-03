import React from 'react';
import { Target, CheckCircle2, Play, Award } from 'lucide-react';

export type ActivityType = 'exam' | 'lesson' | 'achievement';

export interface ActivityItem {
  id: string;
  title: string;
  type: ActivityType;
  timestamp: string;
  score?: number;
}

interface RecentActivityProps {
  activities?: ActivityItem[];
}

export default function RecentActivity({ activities = [] }: RecentActivityProps) {
  const getIcon = (type: ActivityType) => {
    switch (type) {
      case 'exam': return <Target className="h-4 w-4 text-destructive" />;
      case 'lesson': return <Play className="h-4 w-4 text-primary" />;
      case 'achievement': return <Award className="h-4 w-4 text-amber-600" />;
      default: return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
    }
  };

  const getBg = (type: ActivityType) => {
    switch (type) {
      case 'exam': return 'bg-destructive/10 border-destructive/20';
      case 'lesson': return 'bg-primary/10 border-primary/20';
      case 'achievement': return 'bg-amber-100 border-amber-200';
      default: return 'bg-secondary border-border';
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm h-full">
      <h2 className="text-lg font-semibold text-foreground mb-6">Recent Activity</h2>
      {activities.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">No recent activity to show.</p>
      ) : (
        <div className="space-y-4">
          {activities.map((item, idx) => (
            <div key={item.itemId} className="flex gap-4 relative">
              {/* Timeline Connector */}
              {idx !== activities.length - 1 && (
                <div className="absolute left-[1.1rem] top-10 h-[calc(100%-1rem)] w-px bg-border" />
              )}
              
              <div className={`mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${getBg(item.type)} z-10`}>
                {getIcon(item.type)}
              </div>
              
              <div className="flex-1 pb-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-medium text-foreground">{item.title}</h4>
                  <span className="text-xs font-medium text-muted-foreground shrink-0">
                    {item.timestamp}
                  </span>
                </div>
                {item.type === 'exam' && item.score !== undefined && (
                  <p className="text-xs font-medium text-emerald-600 mt-1">
                    Scored {item.score}%
                  </p>
                )}
                {item.type === 'lesson' && (
                  <p className="text-xs text-muted-foreground mt-1">Completed module</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}