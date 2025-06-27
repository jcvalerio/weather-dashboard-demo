'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertTriangle, 
  AlertCircle, 
  Info, 
  Clock, 
  X,
  ExternalLink 
} from 'lucide-react';
import { mockWeatherAlerts } from '@/lib/mocks/weather-data';
import { formatRelativeTime } from '@/lib/utils/format';
import { cn } from '@/lib/utils';

const getAlertIcon = (type: string, severity: string) => {
  const iconProps = { size: 20 };
  
  if (severity === 'extreme' || severity === 'high') {
    return <AlertTriangle {...iconProps} className="text-red-500" />;
  } else if (severity === 'medium') {
    return <AlertCircle {...iconProps} className="text-yellow-500" />;
  } else {
    return <Info {...iconProps} className="text-blue-500" />;
  }
};

const getAlertStyles = (severity: string) => {
  switch (severity) {
    case 'extreme':
      return 'border-red-500 bg-red-50 dark:bg-red-950/20';
    case 'high':
      return 'border-orange-500 bg-orange-50 dark:bg-orange-950/20';
    case 'medium':
      return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20';
    default:
      return 'border-blue-500 bg-blue-50 dark:bg-blue-950/20';
  }
};

export function WeatherAlertsCard() {
  const alerts = mockWeatherAlerts;

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">Weather Alerts</h3>
          {alerts.length > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 rounded-full">
              {alerts.length}
            </span>
          )}
        </div>
        <Button variant="ghost" size="sm" className="text-xs">
          View All
        </Button>
      </div>

      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Info className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No active weather alerts</p>
            <p className="text-xs">We&apos;ll notify you when conditions change</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn(
                "p-4 rounded-lg border-l-4 transition-all hover:shadow-sm",
                getAlertStyles(alert.severity)
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getAlertIcon(alert.type, alert.severity)}
                  <div>
                    <h4 className="font-semibold text-sm">{alert.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{alert.type}</span>
                      <span>•</span>
                      <span className="capitalize">{alert.severity} severity</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="w-6 h-6 shrink-0">
                  <X className="w-3 h-3" />
                </Button>
              </div>
              
              <p className="text-sm mb-3 leading-relaxed">
                {alert.description}
              </p>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>
                      {formatRelativeTime(alert.startTime)} - {formatRelativeTime(alert.endTime)}
                    </span>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Details
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      {alerts.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="text-xs">
              Mark All Read
            </Button>
            <Button variant="outline" size="sm" className="text-xs">
              Alert Settings
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}