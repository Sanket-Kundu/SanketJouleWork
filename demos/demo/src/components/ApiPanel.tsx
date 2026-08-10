import { useState } from "react";
import type { ComponentApiData } from "./api-registry.generated";

interface ApiPanelProps {
  data: ComponentApiData | undefined;
  open: boolean;
  onToggle: () => void;
}

// Chevron icon pointing right (collapse) or left (expand)
function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {direction === "right" ? (
        <path d="M9 18l6-6-6-6" />
      ) : (
        <path d="M15 18l-6-6 6-6" />
      )}
    </svg>
  );
}

// Small chevron for section expand/collapse
function SectionChevron({ expanded }: { expanded: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-transform duration-150 ${expanded ? "rotate-90" : ""}`}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

function SectionHeader({
  title,
  expanded,
  onToggle,
  count,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="w-full flex items-center gap-1.5 px-3 py-2 text-left hover:bg-accent/50 transition-colors group"
    >
      <SectionChevron expanded={expanded} />
      <span className="text-xs font-semibold uppercase tracking-wider text-secondary-foreground group-hover:text-foreground transition-colors">
        {title}
      </span>
      {count !== undefined && (
        <span className="ml-auto text-xs text-secondary-foreground/60">{count}</span>
      )}
    </button>
  );
}

export function ApiPanel({ data, open, onToggle }: ApiPanelProps) {
  const [propsExpanded, setPropsExpanded] = useState(true);
  const [contentExpanded, setContentExpanded] = useState(true);
  const [eventsExpanded, setEventsExpanded] = useState(true);
  const [enumsExpanded, setEnumsExpanded] = useState(true);
  const [refMethodsExpanded, setRefMethodsExpanded] = useState(true);
  const [expandedEnums, setExpandedEnums] = useState<Record<string, boolean>>({});

  const toggleEnum = (name: string) => {
    setExpandedEnums((prev) => ({ ...prev, [name]: !(prev[name] ?? true) }));
  };

  // Split props: "Content" category becomes its own top-level section;
  // everything else (Visual, Behavior, Accessibility, etc.) goes under "Props"
  const propsItems: NonNullable<ComponentApiData["props"]> = [];
  const contentItems: NonNullable<ComponentApiData["props"]> = [];
  if (data?.props) {
    for (const prop of data.props) {
      if (prop.category === "Content") {
        contentItems.push(prop);
      } else {
        propsItems.push(prop);
      }
    }
  }

  const totalProps = propsItems.length;
  const totalContent = contentItems.length;
  const totalEvents = data?.events?.length ?? 0;
  const totalEnums = data?.enums?.length ?? 0;
  const totalRefMethods = data?.refMethods?.length ?? 0;

  return (
    <div className="relative flex shrink-0">
      {/* Toggle button on the left edge */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onToggle}
          className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 z-10 flex items-center justify-center w-5 h-10 rounded-l-md bg-card border border-r-0 border-border text-secondary-foreground hover:bg-accent hover:text-accent-foreground transition-colors shadow-sm"
          aria-label={open ? "Close API panel" : "Open API panel"}
          title={open ? "Close API panel" : "Open API panel"}
        >
          <ChevronIcon direction={open ? "right" : "left"} />
        </button>
      </div>

      {/* Panel body */}
      <div
        className={`
          bg-card border-l border-border flex flex-col transition-all duration-200 overflow-hidden
          ${open ? "w-80" : "w-0"}
        `}
        style={{ minWidth: open ? "320px" : "0px" }}
      >
        {open && (
          <>
            {/* Header */}
            <div className="px-3 py-2.5 border-b border-border shrink-0">
              {data ? (
                <h2 className="text-sm font-bold text-foreground">{data.name}</h2>
              ) : (
                <h2 className="text-sm font-bold text-secondary-foreground">API Reference</h2>
              )}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto">
              {!data ? (
                <div className="flex items-center justify-center h-32 px-4">
                  <p className="text-xs text-secondary-foreground/50 text-center">
                    No API data available for this component.
                  </p>
                </div>
              ) : (
                <div>
                  {/* Props section (Visual, Behavior, Accessibility — everything except Content) */}
                  {totalProps > 0 && (
                    <div className="border-b border-border">
                      <SectionHeader
                        title="Props"
                        expanded={propsExpanded}
                        onToggle={() => setPropsExpanded((v) => !v)}
                        count={totalProps}
                      />
                      {propsExpanded && (
                        <div className="pb-1">
                          {propsItems.map((prop) => (
                            <div
                              key={prop.name}
                              className="px-3 py-1.5 border-t border-border/30 first:border-0"
                            >
                              <div className="flex items-start gap-2 flex-wrap">
                                <span className="text-xs font-mono text-primary shrink-0">{prop.name}</span>
                                {prop.required && (
                                  <span className="text-xs text-destructive/70 shrink-0">*</span>
                                )}
                                <span className="text-xs font-mono text-secondary-foreground break-all">
                                  {prop.type}
                                </span>
                              </div>
                              {prop.default !== undefined && prop.default !== "" && (
                                <div className="mt-0.5">
                                  <span className="text-xs text-secondary-foreground/60">default: </span>
                                  <span className="text-xs font-mono text-secondary-foreground">{prop.default}</span>
                                </div>
                              )}
                              {prop.description && (
                                <p className="mt-0.5 text-xs text-secondary-foreground/80 leading-relaxed">
                                  {prop.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Content section (children, icon, slots, etc.) */}
                  {totalContent > 0 && (
                    <div className="border-b border-border">
                      <SectionHeader
                        title="Content"
                        expanded={contentExpanded}
                        onToggle={() => setContentExpanded((v) => !v)}
                        count={totalContent}
                      />
                      {contentExpanded && (
                        <div className="pb-1">
                          {contentItems.map((prop) => (
                            <div
                              key={prop.name}
                              className="px-3 py-1.5 border-t border-border/30 first:border-0"
                            >
                              <div className="flex items-start gap-2 flex-wrap">
                                <span className="text-xs font-mono text-primary shrink-0">{prop.name}</span>
                                {prop.required && (
                                  <span className="text-xs text-destructive/70 shrink-0">*</span>
                                )}
                                <span className="text-xs font-mono text-secondary-foreground break-all">
                                  {prop.type}
                                </span>
                              </div>
                              {prop.default !== undefined && prop.default !== "" && (
                                <div className="mt-0.5">
                                  <span className="text-xs text-secondary-foreground/60">default: </span>
                                  <span className="text-xs font-mono text-secondary-foreground">{prop.default}</span>
                                </div>
                              )}
                              {prop.description && (
                                <p className="mt-0.5 text-xs text-secondary-foreground/80 leading-relaxed">
                                  {prop.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Events section */}
                  {totalEvents > 0 && (
                    <div className="border-b border-border">
                      <SectionHeader
                        title="Events"
                        expanded={eventsExpanded}
                        onToggle={() => setEventsExpanded((v) => !v)}
                        count={totalEvents}
                      />
                      {eventsExpanded && (
                        <div className="px-3 pb-2">
                          {data.events!.map((event, idx) => (
                            <div
                              key={event.name}
                              className={`py-1.5 ${idx > 0 ? "border-t border-border/30" : ""}`}
                            >
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-xs font-mono text-primary">{event.name}</span>
                                {event.detailType && (
                                  <span className="text-xs font-mono text-secondary-foreground">
                                    {event.detailType}
                                  </span>
                                )}
                              </div>
                              {event.description && (
                                <p className="mt-0.5 text-xs text-secondary-foreground/80 leading-relaxed">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Enums section */}
                  {totalEnums > 0 && (
                    <div className="border-b border-border">
                      <SectionHeader
                        title="Enums"
                        expanded={enumsExpanded}
                        onToggle={() => setEnumsExpanded((v) => !v)}
                        count={totalEnums}
                      />
                      {enumsExpanded && (
                        <div className="px-3 pb-2 space-y-1">
                          {data.enums!.map((enumDef) => {
                            const isEnumExpanded = expandedEnums[enumDef.name] ?? true;
                            return (
                              <div
                                key={enumDef.name}
                                className="border border-border/50 rounded-md overflow-hidden"
                              >
                                <button
                                  type="button"
                                  onClick={() => toggleEnum(enumDef.name)}
                                  className="w-full flex items-center gap-1.5 px-2 py-1.5 bg-muted/40 hover:bg-accent/50 transition-colors text-left"
                                >
                                  <SectionChevron expanded={isEnumExpanded} />
                                  <span className="text-xs font-mono font-medium text-foreground">
                                    {enumDef.name}
                                  </span>
                                </button>
                                {isEnumExpanded && (
                                  <div className="px-2 py-1">
                                    {enumDef.values.map((val) => (
                                      <div key={val.name} className="py-0.5">
                                        <span className="text-xs font-mono text-primary/80">
                                          {val.name}
                                        </span>
                                        {val.description && (
                                          <span className="ml-2 text-xs text-secondary-foreground/70">
                                            {val.description}
                                          </span>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ref Methods section */}
                  {totalRefMethods > 0 && (
                    <div>
                      <SectionHeader
                        title="Ref Methods"
                        expanded={refMethodsExpanded}
                        onToggle={() => setRefMethodsExpanded((v) => !v)}
                        count={totalRefMethods}
                      />
                      {refMethodsExpanded && (
                        <div className="px-3 pb-2">
                          {data.refMethods!.map((method, idx) => (
                            <div
                              key={method.signature}
                              className={`py-1.5 ${idx > 0 ? "border-t border-border/30" : ""}`}
                            >
                              <span className="text-xs font-mono text-primary/80 break-all">
                                {method.signature}
                              </span>
                              {method.description && (
                                <p className="mt-0.5 text-xs text-secondary-foreground/80 leading-relaxed">
                                  {method.description}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
