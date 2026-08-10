import { Skeleton, Card, CardContent } from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

export function SkeletonPage() {
  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Skeleton</h1>
        <div className="px-4 py-3 rounded-lg bg-sapphire-warning-bg text-sapphire-text-primary text-sm mb-3">
          <strong>Experimental</strong> — This component is not production-ready. Use at your own risk.
        </div>
        <code className="text-sm text-primary/70 font-mono">
          {'import { Skeleton } from "@sap-ui/fx-components"'}
        </code>
        <p className="text-secondary-foreground mt-2">
          A primitive building block for loading placeholders. Size and shape it
          with className — compose multiple instances to match any layout.
        </p>
      </header>

      {/* Default */}
      <section id="default" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Default</h2>
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <CodeBlock
          language="tsx"
          code={`<div className="flex items-center gap-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="flex flex-col gap-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>`}
        />
      </section>

      {/* With Card Component */}
      <section id="with-card-component" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">With Card Component</h2>
        <div className="grid grid-cols-3 gap-7 mb-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent>
                <div className="flex flex-col gap-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-[120px] w-full mt-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <CodeBlock
          language="tsx"
          code={`import { Card, CardContent, Skeleton } from "@sap-ui/fx-components";

<Card>
  <CardContent>
    <div className="flex flex-col gap-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-[120px] w-full mt-2" />
    </div>
  </CardContent>
</Card>`}
        />
      </section>

      {/* Text */}
      <section id="text" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Text</h2>
        <div className="flex flex-col gap-2 max-w-xs mb-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <CodeBlock
          language="tsx"
          code={`<div className="flex flex-col gap-2 max-w-xs">
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-full" />
  <Skeleton className="h-4 w-3/4" />
</div>`}
        />
      </section>

      {/* Form */}
      <section id="form" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Form</h2>
        <div className="flex flex-col gap-6 max-w-xs mb-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-9 w-full rounded-md" />
          </div>
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>
        <CodeBlock
          language="tsx"
          code={`<div className="flex flex-col gap-6 max-w-xs">
  <div className="flex flex-col gap-2">
    <Skeleton className="h-4 w-20" />
    <Skeleton className="h-9 w-full rounded-md" />
  </div>
  <div className="flex flex-col gap-2">
    <Skeleton className="h-4 w-24" />
    <Skeleton className="h-9 w-full rounded-md" />
  </div>
  <Skeleton className="h-9 w-24 rounded-md" />
</div>`}
        />
      </section>
    </div>
  );
}
