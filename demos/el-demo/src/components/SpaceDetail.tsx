import { Card, CardHeader, CardContent, Tag, Button } from '@sap-ui/fx-components';
import { Folder, Link2, MessageSquare, Bot, TrendingUp, Users, BarChart3, Table, List as ListIcon, Activity, RefreshCw, Download, Share2, Eye, CheckCircle, XCircle, PauseCircle, Clock } from 'lucide-react';
import type { Space, SpaceWidget, Relation } from '@/types';

// Drilldown state type - matches hooks/useAppState.ts
export interface SpaceDrilldown {
  level1?: {
    id: string;
    title: string;
    type: 'widget' | 'section';
  };
  level2?: {
    id: string;
    title: string;
    type: string;
  };
}

interface SpaceDetailProps {
  space: Space;
  relations: Relation[];
  drilldown?: SpaceDrilldown | null;
  onDrilldown?: (drilldown: { id: string; title: string; type: 'widget' | 'section' }) => void;
  onDrilldownLevel2?: (drilldown: { id: string; title: string; type: string }) => void;
}

// Get widget type icon
const getWidgetIcon = (type: SpaceWidget['type']) => {
  switch (type) {
    case 'chart':
      return <BarChart3 className="h-4 w-4" />;
    case 'table':
      return <Table className="h-4 w-4" />;
    case 'kpi':
      return <TrendingUp className="h-4 w-4" />;
    case 'list':
      return <ListIcon className="h-4 w-4" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

// Get status icon for widgets
const getStatusIcon = (status: SpaceWidget['status']) => {
  switch (status) {
    case 'active':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'loading':
      return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />;
    case 'error':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'paused':
      return <PauseCircle className="h-4 w-4 text-orange-500" />;
    default:
      return <Clock className="h-4 w-4 text-muted-foreground" />;
  }
};

export function SpaceDetail({ space, relations, drilldown, onDrilldown, onDrilldownLevel2 }: SpaceDetailProps) {
  // Handle widget click for drilldown level 1
  const handleWidgetClick = (widget: SpaceWidget) => {
    onDrilldown?.({ id: widget.id, title: widget.name, type: 'widget' });
  };

  // Handle section click for drilldown level 1
  const handleSectionClick = (title: string, section: string) => {
    onDrilldown?.({ id: section, title, type: 'section' });
  };

  // Handle drilldown into level 2 from a widget
  const handleLevel2Click = (title: string, type: string) => {
    onDrilldownLevel2?.({ id: `${drilldown?.level1?.id}-${type}`, title, type });
  };

  // Get the current widget being viewed in level 1
  const getCurrentWidget = (): SpaceWidget | undefined => {
    if (drilldown?.level1?.type !== 'widget') return undefined;
    return space.widgets?.find(w => w.id === drilldown.level1?.id);
  };

  // Mock data for space visualization
  const getSpaceVisualization = () => {
    switch (space.uiType) {
      case 'insights':
        return (
          <div className="grid grid-cols-3 gap-4">
            <div
              className="cursor-pointer hover:shadow-md transition-shadow rounded-lg"
              onClick={() => handleSectionClick('Revenue Growth', 'insights-revenue')}
            >
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-2xl font-bold">+23%</p>
                  <p className="text-sm text-muted-foreground">Revenue Growth</p>
                </CardContent>
              </Card>
            </div>
            <div
              className="cursor-pointer hover:shadow-md transition-shadow rounded-lg"
              onClick={() => handleSectionClick('Active Users', 'insights-users')}
            >
              <Card>
                <CardContent className="p-4 text-center">
                  <Users className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-sm text-muted-foreground">Active Users</p>
                </CardContent>
              </Card>
            </div>
            <div
              className="cursor-pointer hover:shadow-md transition-shadow rounded-lg"
              onClick={() => handleSectionClick('Goal Progress', 'insights-goals')}
            >
              <Card>
                <CardContent className="p-4 text-center">
                  <BarChart3 className="h-8 w-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-2xl font-bold">94%</p>
                  <p className="text-sm text-muted-foreground">Goal Progress</p>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'team':
        return (
          <div
            className="space-y-4 cursor-pointer hover:bg-muted/30 transition-colors p-2 -m-2 rounded-lg"
            onClick={() => handleSectionClick('Sprint Progress', 'team-sprint')}
          >
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div>
                <p className="font-medium">Sprint 12 Progress</p>
                <p className="text-sm text-muted-foreground">14 of 15 tasks completed</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">94%</p>
                <p className="text-sm text-muted-foreground">Complete</p>
              </div>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '94%' }} />
            </div>
          </div>
        );
      case 'pipeline':
        return (
          <div
            className="space-y-4 cursor-pointer hover:bg-muted/30 transition-colors p-2 -m-2 rounded-lg"
            onClick={() => handleSectionClick('Pipeline Overview', 'pipeline-overview')}
          >
            <div className="grid grid-cols-4 gap-2">
              {['Lead', 'Qualified', 'Proposal', 'Closed'].map((stage, i) => (
                <div key={stage} className="text-center">
                  <div className={`h-24 rounded-lg flex items-end justify-center pb-2 ${
                    i === 0 ? 'bg-blue-100' : i === 1 ? 'bg-blue-200' : i === 2 ? 'bg-blue-300' : 'bg-green-200'
                  }`}>
                    <span className="font-bold">{[12, 8, 5, 3][i]}</span>
                  </div>
                  <p className="text-xs mt-1">{stage}</p>
                </div>
              ))}
            </div>
            <p className="text-center text-muted-foreground">Total Pipeline: €1.2M</p>
          </div>
        );
      default:
        return (
          <div
            className="text-center py-12 text-muted-foreground cursor-pointer hover:bg-muted/30 transition-colors rounded-lg"
            onClick={() => handleSectionClick('Space Overview', 'space-overview')}
          >
            <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Click to view space details</p>
          </div>
        );
    }
  };

  // Render level 2 drilldown view
  if (drilldown?.level2) {
    const currentWidget = getCurrentWidget();
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="h-5 w-5 text-muted-foreground" />
          <span className="text-lg font-semibold">{drilldown.level2.title}</span>
        </div>

        <Card>
          <CardHeader titleText="Detail View" />
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Viewing "{drilldown.level2.title}" from {currentWidget?.name || drilldown.level1?.title}.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Widget ID</span>
                <span className="font-mono">{drilldown.level1?.id}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">View Type</span>
                <span>{drilldown.level2.type}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Space</span>
                <span>{space.name}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader titleText="Actions" />
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button icon={<RefreshCw className="h-4 w-4" />}>Refresh</Button>
              <Button icon={<Download className="h-4 w-4" />}>Export</Button>
              <Button icon={<Share2 className="h-4 w-4" />}>Share</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render level 1 widget drilldown view
  if (drilldown?.level1?.type === 'widget') {
    const currentWidget = getCurrentWidget();
    if (!currentWidget) {
      return <div className="p-6">Widget not found</div>;
    }

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          {getWidgetIcon(currentWidget.type)}
          <span className="text-lg font-semibold">{currentWidget.name}</span>
          <Tag design={currentWidget.status === 'active' ? 'Positive' : currentWidget.status === 'error' ? 'Negative' : 'Information'}>
            {currentWidget.status}
          </Tag>
        </div>

        <Card>
          <CardHeader titleText="Widget Details" />
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Type</span>
                <span className="capitalize">{currentWidget.type}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Last Updated</span>
                <span>{currentWidget.lastUpdated}</span>
              </div>
              {currentWidget.description && (
                <div className="flex justify-between py-2">
                  <span className="text-muted-foreground">Description</span>
                  <span>{currentWidget.description}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Clickable cards for level 2 drilldown */}
        <div
          className="cursor-pointer hover:shadow-md transition-shadow rounded-lg"
          onClick={() => handleLevel2Click('Data Source', 'datasource')}
        >
          <Card>
            <CardHeader titleText="Data Source" additionalText="View configuration" />
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click to view data source configuration and connection details.
              </p>
            </CardContent>
          </Card>
        </div>

        <div
          className="cursor-pointer hover:shadow-md transition-shadow rounded-lg"
          onClick={() => handleLevel2Click('History', 'history')}
        >
          <Card>
            <CardHeader titleText="History" additionalText="View changes" />
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Click to view widget update history and change log.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader titleText="Actions" />
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {currentWidget.status === 'paused' && (
                <Button design="Primary" icon={<RefreshCw className="h-4 w-4" />}>Resume</Button>
              )}
              {currentWidget.status === 'error' && (
                <Button design="Primary" icon={<RefreshCw className="h-4 w-4" />}>Retry</Button>
              )}
              <Button icon={<RefreshCw className="h-4 w-4" />}>Refresh Data</Button>
              <Button icon={<Download className="h-4 w-4" />}>Export</Button>
              <Button icon={<Share2 className="h-4 w-4" />}>Share</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Render level 1 section drilldown view
  if (drilldown?.level1?.type === 'section') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="h-5 w-5 text-muted-foreground" />
          <span className="text-lg font-semibold">{drilldown.level1.title}</span>
        </div>

        <Card>
          <CardHeader titleText="Detailed Information" />
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This is a detailed view of "{drilldown.level1.title}" for the space "{space.name}".
            </p>
            <ul className="space-y-2 text-sm">
              <li>• Space ID: {space.id}</li>
              <li>• Type: {space.uiType}</li>
              <li>• Status: {space.timestamp}</li>
              <li>• Description: {space.desc}</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader titleText="Actions" />
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              <Button icon={<RefreshCw className="h-4 w-4" />}>Refresh Data</Button>
              <Button icon={<Download className="h-4 w-4" />}>Export</Button>
              <Button icon={<Share2 className="h-4 w-4" />}>Share</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader titleText="Recent Activity" />
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span>Viewed {drilldown.level1.title}</span>
                <span className="text-muted-foreground ml-auto">Just now</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <span>Data refreshed</span>
                <span className="text-muted-foreground ml-auto">5 min ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Normal space detail view
  return (
    <div className="p-6 space-y-6">
      {/* Widgets - Clickable for drilldown level 1 */}
      {space.widgets && space.widgets.length > 0 && (
        <Card>
          <CardHeader titleText="Widgets" additionalText={`${space.widgets.length} widgets`} />
          <CardContent className="p-0">
            <div className="divide-y">
              {space.widgets.map((widget) => (
                <div
                  key={widget.id}
                  className="p-3 flex items-center gap-3 hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleWidgetClick(widget)}
                >
                  {getStatusIcon(widget.status)}
                  <div className="p-2 rounded-lg bg-muted">
                    {getWidgetIcon(widget.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{widget.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {widget.type} · {widget.lastUpdated}
                    </p>
                  </div>
                  {widget.description && (
                    <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                      {widget.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Visualization */}
      <Card
        header={<CardHeader titleText="Overview" />}
      >
        <CardContent>
          {getSpaceVisualization()}
        </CardContent>
      </Card>

      {/* Related Items */}
      {relations.length > 0 && (
        <Card
          header={
            <CardHeader
              titleText="Related Items"
              avatar={<Link2 className="h-4 w-4" />}
            />
          }
        >
          <CardContent className="p-0 divide-y">
            {relations.map((relation) => (
              <div
                key={relation.id}
                className="p-3 flex items-center gap-3 hover:bg-muted/50 cursor-pointer"
              >
                <div className="p-2 rounded-lg bg-muted">
                  {relation.type === 'conversation' ? (
                    <MessageSquare className="h-4 w-4" />
                  ) : relation.type === 'job' ? (
                    <Bot className="h-4 w-4" />
                  ) : (
                    <Folder className="h-4 w-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{relation.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{relation.type}</p>
                </div>
                <Button design="Tertiary" iconOnly icon={<Link2 className="h-4 w-4" />} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
