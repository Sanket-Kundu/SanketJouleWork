import { Card, CardHeader, CardContent, Tag, Button } from '@sap-ui/fx-components';
import { Code, GitBranch, Clock, Play, Settings, Terminal, FileCode, ExternalLink } from 'lucide-react';
import type { Project } from '@/types';

interface ProjectDetailProps {
  project: Project;
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const getStatusDesign = () => {
    switch (project.status) {
      case 'deployed': return 'Positive';
      case 'building': return 'Information';
      case 'testing': return 'Neutral';
      case 'error': return 'Negative';
      default: return 'Neutral';
    }
  };

  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'typescript': return 'bg-blue-500 text-white';
      case 'javascript': return 'bg-yellow-500 text-black';
      case 'groovy': return 'bg-purple-500 text-white';
      case 'bpmn': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <Code className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold">{project.name}</h1>
              <span className={`px-2 py-0.5 text-xs rounded ${getLanguageColor(project.language)}`}>
                {project.language}
              </span>
            </div>
            <p className="text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <Tag design={getStatusDesign() as any}>
          {project.status}
        </Tag>
      </div>

      {/* Quick Info */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <GitBranch className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Branch</p>
              <p className="font-medium">{project.branch}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <FileCode className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Framework</p>
              <p className="font-medium">{project.framework}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Modified</p>
              <p className="font-medium">{project.lastModified}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <Card
        header={<CardHeader titleText="Quick Actions" />}
      >
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button design="Primary" icon={<Play className="h-4 w-4" />}>
              Run
            </Button>
            <Button design="Secondary" icon={<Terminal className="h-4 w-4" />}>
              Terminal
            </Button>
            <Button design="Secondary" icon={<Settings className="h-4 w-4" />}>
              Settings
            </Button>
            <Button design="Tertiary" icon={<ExternalLink className="h-4 w-4" />}>
              Open in IDE
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card
        header={<CardHeader titleText="Recent Activity" />}
      >
        <CardContent className="p-0 divide-y">
          {[
            { action: 'Deployed to production', time: '2 hours ago', user: 'CI/CD Pipeline' },
            { action: 'Merged PR #42', time: '3 hours ago', user: 'Maria Schmidt' },
            { action: 'Tests passed', time: '4 hours ago', user: 'CI/CD Pipeline' },
            { action: 'Code review completed', time: '5 hours ago', user: 'Thomas Müller' },
          ].map((activity, i) => (
            <div key={i} className="p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground">{activity.user}</p>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Code Preview Placeholder */}
      <Card
        header={<CardHeader titleText="Code Preview" />}
      >
        <CardContent>
          <div className="bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{`// ${project.name}/src/index.ts
import { Application } from './${project.framework.toLowerCase()}';

const app = new Application({
  name: '${project.name}',
  version: '1.0.0'
});

app.start();`}</pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
