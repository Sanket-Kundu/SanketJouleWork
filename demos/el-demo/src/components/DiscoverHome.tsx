import { Card, CardContent, Tag, Avatar } from '@sap-ui/fx-components';
import {
  AlertCircle,
  FileText,
  GraduationCap,
  Clock,
  TrendingUp,
  TrendingDown,
  Plane,
  Receipt,
  Bot,
  ChevronRight,
} from 'lucide-react';
import type { DiscoverData } from '@/types';

interface DiscoverHomeProps {
  data: DiscoverData;
}

export function DiscoverHome({ data }: DiscoverHomeProps) {
  return (
    <div className="p-6 space-y-6 max-w-5xl mx-auto pb-32">
      {/* Greeting */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-semibold">{data.greeting}</h1>
      </div>

      {/* Tasks Section */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Action Items</h2>
        <div className="space-y-2">
          {data.tasks.map((task) => (
            <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  task.iconType === 'warning' ? 'bg-orange-100 text-orange-600' :
                  task.iconType === 'error' ? 'bg-red-100 text-red-600' :
                  task.iconType === 'success' ? 'bg-green-100 text-green-600' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {task.iconType === 'warning' ? <AlertCircle className="h-5 w-5" /> :
                   task.iconType === 'info' ? <FileText className="h-5 w-5" /> :
                   <Clock className="h-5 w-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{task.title}</p>
                  <p className="text-sm text-muted-foreground">{task.subtitle}</p>
                </div>
                <span className="text-sm text-muted-foreground">{task.time}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Collaborators & Agents Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collaborators */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Collaborators</h2>
          <Card>
            <CardContent className="p-0 divide-y">
              {data.collaborators.map((collab) => (
                <div key={collab.id} className="p-3 flex items-center gap-3 hover:bg-muted/50 cursor-pointer">
                  {collab.avatar ? (
                    <Avatar size="S" image={collab.avatar} />
                  ) : collab.icon === 'bot' ? (
                    <div className="p-2 rounded-full bg-primary/10">
                      <Bot className="h-5 w-5 text-primary" />
                    </div>
                  ) : (
                    <Avatar size="S" initials={collab.initials} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{collab.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{collab.activity}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{collab.time}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Agents */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Running Agents</h2>
          <Card>
            <CardContent className="p-0 divide-y">
              {data.agents.map((agent) => (
                <div key={agent.id} className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{agent.name}</p>
                    <span className="text-xs text-muted-foreground">{agent.progress}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{agent.status}</p>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${agent.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>
      </div>

      {/* KPIs */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.kpis.map((kpi) => (
            <Card key={kpi.id}>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground mb-1">{kpi.title}</p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-semibold">{kpi.value}</span>
                  <span className="text-sm text-muted-foreground">{kpi.unit}</span>
                </div>
                <div className={`flex items-center gap-1 mt-1 text-sm ${kpi.good ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>{kpi.trendValue}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Continue Work */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Continue Where You Left Off</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {data.continueWork.map((item) => (
            <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <p className="font-medium text-sm truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.subtitle}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trips */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Upcoming Trips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.trips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
              <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                {trip.image && (
                  <img src={trip.image} alt={trip.title} className="w-full h-full object-cover opacity-80" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-3 text-white">
                  <p className="font-semibold">{trip.title}</p>
                  <p className="text-sm opacity-90">{trip.route}</p>
                </div>
              </div>
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{trip.dates}</span>
                </div>
                <Tag design={trip.statusType === 'success' ? 'Positive' : 'Information'}>
                  {trip.status}
                </Tag>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Events & Training Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Events */}
        <section>
          <h2 className="text-lg font-semibold mb-3">Upcoming Events</h2>
          <Card>
            <CardContent className="p-0 divide-y">
              {data.events.map((event) => (
                <div key={event.id} className="p-3 flex items-center gap-3 hover:bg-muted/50 cursor-pointer">
                  <div className="p-2 rounded-lg bg-muted text-center min-w-[50px]">
                    <p className="text-xs text-muted-foreground">{event.date.split(' ')[0]}</p>
                    <p className="font-semibold">{event.date.split(' ')[1]}</p>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground">{event.time} · {event.location}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Training */}
        <section>
          <h2 className="text-lg font-semibold mb-3">{data.training.label}</h2>
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <GraduationCap className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{data.training.title}</p>
                <p className="text-sm text-muted-foreground">
                  {data.training.type} · {data.training.duration}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Expenses */}
      <section>
        <h2 className="text-lg font-semibold mb-3">Recent Expenses</h2>
        <Card>
          <CardContent className="p-0 divide-y">
            {data.expenses.slice(0, 4).map((expense) => (
              <div key={expense.id} className="p-3 flex items-center gap-3 hover:bg-muted/50 cursor-pointer">
                <div className="p-2 rounded-lg bg-muted">
                  <Receipt className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{expense.title}</p>
                  <p className="text-xs text-muted-foreground">{expense.date} · {expense.location}</p>
                </div>
                <span className="font-medium">{expense.amount}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>

      {/* Alerts */}
      {data.alerts.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-3">Alerts</h2>
          <div className="space-y-2">
            {data.alerts.map((alert) => (
              <Card key={alert.id} className={`border-l-4 ${
                alert.type === 'warning' ? 'border-l-orange-500' :
                alert.type === 'error' ? 'border-l-red-500' :
                'border-l-blue-500'
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className={`h-5 w-5 shrink-0 ${
                      alert.type === 'warning' ? 'text-orange-500' :
                      alert.type === 'error' ? 'text-red-500' :
                      'text-blue-500'
                    }`} />
                    <div>
                      <p className="font-medium">{alert.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">{alert.time}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
