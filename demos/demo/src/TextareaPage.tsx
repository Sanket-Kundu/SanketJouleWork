import { useState, useRef } from "react";
import {
  Textarea,
  ValueState,
  TextareaChangeDetail,
  TextareaRef,
  Button,
  ButtonDesign,
  Label,
} from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

function StatesMatrix() {
  const colHeader = "font-medium text-sm text-secondary-foreground";
  const colWidth = "w-[220px] min-w-[200px]";
  const states = [
    { state: ValueState.Negative, label: "Negative" },
    { state: ValueState.Critical, label: "Warning" },
    { state: ValueState.Positive, label: "Positive" },
    { state: ValueState.Information, label: "Information" },
  ] as const;

  return (
    <section id="states-matrix" className="p-6 border border-border rounded-lg bg-card">
      <h2 className="text-2xl font-semibold mb-6">States Matrix</h2>

      {/* Regular */}
      <div className="mb-10">
        <h3 className="text-lg font-bold mb-6">Regular</h3>
        <div className="flex flex-wrap gap-8">
          <div className={colWidth}>
            <span className={colHeader}>Placeholder</span>
            <div className="mt-4">
              <Textarea placeholder="Write your message here." rows={3} />
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>Typed Text</span>
            <div className="mt-4">
              <Textarea defaultValue="Typed text" rows={3} />
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>Disabled</span>
            <div className="mt-4">
              <Textarea defaultValue="Typed text" rows={3} disabled />
            </div>
          </div>
          <div className={colWidth}>
            <span className={colHeader}>Read only</span>
            <div className="mt-4">
              <Textarea defaultValue="Typed text" rows={3} readonly />
            </div>
          </div>
        </div>
      </div>

      {/* Value States */}
      <div>
        <h3 className="text-lg font-bold mb-6">Value States</h3>
        <div className="flex flex-wrap gap-8">
          {/* Placeholder (shows tinted bg) */}
          <div className={colWidth}>
            <span className={colHeader}>Placeholder</span>
            <div className="mt-4 space-y-5">
              {states.map(({ state }) => (
                <Textarea
                  key={state}
                  placeholder="Write your message here."
                  rows={3}
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                />
              ))}
            </div>
          </div>
          {/* Regular */}
          <div className={colWidth}>
            <span className={colHeader}>Regular</span>
            <div className="mt-4 space-y-5">
              {states.map(({ state }) => (
                <Textarea
                  key={state}
                  defaultValue="Typed text"
                  rows={3}
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                />
              ))}
            </div>
          </div>
          {/* Disabled */}
          <div className={colWidth}>
            <span className={colHeader}>Disabled</span>
            <div className="mt-4 space-y-5">
              {states.map(({ state }) => (
                <Textarea
                  key={state}
                  defaultValue="Typed text"
                  rows={3}
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                  disabled
                />
              ))}
            </div>
          </div>
          {/* Read only */}
          <div className={colWidth}>
            <span className={colHeader}>Read only</span>
            <div className="mt-4 space-y-5">
              {states.map(({ state }) => (
                <Textarea
                  key={state}
                  defaultValue="Typed text"
                  rows={3}
                  valueState={state}
                  valueStateMessage="Message text giving further context."
                  readonly
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TextareaPage() {
  const [basicValue, setBasicValue] = useState("");
  const [controlledValue, setControlledValue] = useState("This is a controlled textarea.\n\nYou can edit this text.");
  const [commentValue, setCommentValue] = useState("");
  const [growingValue, setGrowingValue] = useState("");
  const [characterCount, setCharacterCount] = useState(0);

  const textareaRef = useRef<TextareaRef>(null);

  const handleChange = (detail: TextareaChangeDetail) => {
    console.log("onChange:", detail);
  };

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Textarea</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { Textarea } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* ================================================================
          Figma States Matrix
          ================================================================ */}
      <StatesMatrix />

      {/* Basic Textarea */}
      <section id="basic-textarea" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic Textarea</h2>
        <p className="text-secondary-foreground mb-4">
          Simple multi-line text input with placeholder.
        </p>
        <div className="max-w-2xl space-y-4">
          <Label htmlFor="textarea-basic">Comments</Label>
          <Textarea
            id="textarea-basic"
            placeholder="Enter your comments..."
            rows={4}
            onInput={(detail) => setBasicValue(detail.value)}
            onChange={handleChange}
          />
          <p className="text-sm text-secondary-foreground">
            Value: {basicValue || "(empty)"}
          </p>
        </div>
      </section>

      {/* Controlled Textarea */}
      <section id="controlled-textarea" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Controlled Textarea</h2>
        <p className="text-secondary-foreground mb-4">
          Value is controlled by parent component.
        </p>
        <div className="max-w-2xl space-y-4">
          <Label htmlFor="textarea-controlled">Controlled Text</Label>
          <Textarea
            id="textarea-controlled"
            value={controlledValue}
            onInput={(detail) => setControlledValue(detail.value)}
            onChange={handleChange}
            rows={4}
          />
          <div className="flex gap-2">
            <Button design={ButtonDesign.Secondary} onClick={() => setControlledValue("Reset Value")}>
              Reset
            </Button>
            <Button design={ButtonDesign.Tertiary} onClick={() => setControlledValue("")}>
              Clear
            </Button>
          </div>
        </div>
      </section>

      {/* Value States */}
      <section id="value-states" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Value States</h2>
        <p className="text-secondary-foreground mb-4">
          Different states for validation feedback.
        </p>
        <div className="max-w-2xl space-y-6">
          <div>
            <Label htmlFor="textarea-none">None (Default)</Label>
            <Textarea
              id="textarea-none"
              placeholder="Normal textarea"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="textarea-positive">Positive</Label>
            <Textarea
              id="textarea-positive"
              placeholder="Success state"
              valueState={ValueState.Positive}
              valueStateMessage="Comments saved successfully!"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="textarea-negative">Negative</Label>
            <Textarea
              id="textarea-negative"
              placeholder="Error state"
              valueState={ValueState.Negative}
              valueStateMessage="Comments are required. Please enter at least 10 characters."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="textarea-critical">Critical</Label>
            <Textarea
              id="textarea-critical"
              placeholder="Warning state"
              valueState={ValueState.Critical}
              valueStateMessage="Your comment contains inappropriate language."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="textarea-information">Information</Label>
            <Textarea
              id="textarea-information"
              placeholder="Info state"
              valueState={ValueState.Information}
              valueStateMessage="Tip: You can use markdown formatting in your comments."
              rows={3}
            />
          </div>
        </div>
      </section>

      {/* Character Counter */}
      <section id="character-counter" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Character Counter</h2>
        <p className="text-secondary-foreground mb-4">
          Track character count with maximum length.
        </p>
        <div className="max-w-2xl space-y-6">
          <div>
            <Label htmlFor="textarea-maxlength" required>
              With Max Length (200 characters)
            </Label>
            <Textarea
              id="textarea-maxlength"
              placeholder="Enter your feedback (max 200 characters)"
              maxLength={200}
              rows={4}
              value={commentValue}
              onInput={(detail) => {
                setCommentValue(detail.value);
                setCharacterCount(detail.value.length);
              }}
            />
            <p className="text-xs text-secondary-foreground mt-2">
              {characterCount} / 200 characters
            </p>
          </div>

          <div>
            <Label htmlFor="textarea-exceeded">
              Show Exceeded Text
            </Label>
            <Textarea
              id="textarea-exceeded"
              placeholder="Type more than 100 characters to see exceeded count"
              maxLength={100}
              showExceededText
              rows={4}
            />
          </div>
        </div>
      </section>

      {/* Growing Textarea */}
      <section id="growing-textarea" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Growing Textarea</h2>
        <p className="text-secondary-foreground mb-4">
          Auto-expands height as you type.
        </p>
        <div className="max-w-2xl space-y-6">
          <div>
            <Label htmlFor="textarea-growing">
              Growing (No Max)
            </Label>
            <Textarea
              id="textarea-growing"
              placeholder="Start typing... this textarea will grow automatically"
              growing
              value={growingValue}
              onInput={(detail) => setGrowingValue(detail.value)}
            />
          </div>

          <div>
            <Label htmlFor="textarea-growing-max">
              Growing (Max 10 Rows)
            </Label>
            <Textarea
              id="textarea-growing-max"
              placeholder="This will grow up to 10 rows, then scroll"
              growing
              growingMaxRows={10}
            />
          </div>
        </div>
      </section>

      {/* States */}
      <section id="states" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">States</h2>
        <p className="text-secondary-foreground mb-4">
          Disabled and readonly states.
        </p>
        <div className="max-w-2xl space-y-6">
          <div>
            <Label htmlFor="textarea-disabled">Disabled</Label>
            <Textarea
              id="textarea-disabled"
              placeholder="This textarea is disabled"
              disabled
              rows={3}
              defaultValue="You cannot edit this text."
            />
          </div>

          <div>
            <Label htmlFor="textarea-readonly">Readonly</Label>
            <Textarea
              id="textarea-readonly"
              placeholder="This textarea is readonly"
              readonly
              rows={3}
              defaultValue="This text is read-only and cannot be edited."
            />
          </div>

          <div>
            <Label htmlFor="textarea-required" required>Required</Label>
            <Textarea
              id="textarea-required"
              placeholder="This field is required"
              required
              rows={3}
            />
          </div>
        </div>
      </section>

      {/* Imperative API */}
      <section id="imperative-api" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Imperative API</h2>
        <p className="text-secondary-foreground mb-4">
          Control textarea programmatically using refs.
        </p>
        <div className="max-w-2xl space-y-4">
          <Label htmlFor="textarea-imperative">Imperative Control</Label>
          <Textarea
            id="textarea-imperative"
            ref={textareaRef}
            placeholder="Use the buttons below to control this textarea"
            rows={5}
          />
          <div className="flex flex-wrap gap-2">
            <Button design={ButtonDesign.Secondary} onClick={() => textareaRef.current?.focus()}>
              Focus
            </Button>
            <Button design={ButtonDesign.Secondary} onClick={() => textareaRef.current?.blur()}>
              Blur
            </Button>
            <Button design={ButtonDesign.Secondary} onClick={() => textareaRef.current?.select()}>
              Select All
            </Button>
            <Button design={ButtonDesign.Primary} onClick={() => textareaRef.current?.setValue("Programmatically set value")}>
              Set Value
            </Button>
            <Button design={ButtonDesign.Negative} onClick={() => textareaRef.current?.clear()}>
              Clear
            </Button>
            <Button
              design={ButtonDesign.Tertiary}
              onClick={() => {
                const state = textareaRef.current?.getState();
                alert(JSON.stringify(state, null, 2));
              }}
            >
              Get State
            </Button>
          </div>
        </div>
      </section>

      {/* Form Integration */}
      <section id="form-integration" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Form Integration</h2>
        <p className="text-secondary-foreground mb-4">
          Works seamlessly with HTML forms.
        </p>
        <div className="max-w-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              alert(`Submitted:\n\n${formData.get("feedback")}`);
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="form-feedback" required>
                Feedback
              </Label>
              <Textarea
                id="form-feedback"
                name="feedback"
                placeholder="Share your feedback..."
                required
                minLength={10}
                maxLength={500}
                rows={6}
              />
            </div>
            <Button design={ButtonDesign.Primary} type="submit">
              Submit Feedback
            </Button>
          </form>
        </div>
      </section>

      {/* Accessibility */}
      <section id="accessibility" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Accessibility</h2>
        <p className="text-secondary-foreground mb-4">
          Full ARIA support for screen readers.
        </p>
        <div className="max-w-2xl space-y-6">
          <div>
            <Label htmlFor="textarea-accessible">
              With Accessible Name
            </Label>
            <Textarea
              id="textarea-accessible"
              accessibleName="Product review comments"
              placeholder="Enter your review"
              rows={4}
            />
          </div>

          <div>
            <Label id="description-label" htmlFor="textarea-accessible-ref">
              With Accessible Name Ref
            </Label>
            <Textarea
              id="textarea-accessible-ref"
              accessibleNameRef="description-label"
              placeholder="Describe the issue"
              rows={4}
            />
          </div>
        </div>
      </section>

      {/* Usage Example */}
      <section id="usage-example" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-4">Usage Example</h2>
        <CodeBlock
          language="tsx"
          code={`import { Textarea, ValueState } from "@sap-ui/fx-components";

const [value, setValue] = useState("");

// Basic textarea with placeholder
<Textarea
  placeholder="Enter your comments..."
  rows={4}
  onInput={(detail) => setValue(detail.value)}
  onChange={(detail) => console.log("changed:", detail)}
/>

// Growing textarea (auto-expands as you type)
<Textarea
  placeholder="Start typing..."
  growing
  growingMaxRows={10}
  value={value}
  onInput={(detail) => setValue(detail.value)}
/>

// With validation state and message
<Textarea
  placeholder="Required field"
  rows={3}
  valueState={ValueState.Negative}
  valueStateMessage="Please enter at least 10 characters."
  required
/>

// Character counter with max length
<Textarea
  placeholder="Max 200 characters"
  maxLength={200}
  showExceededText
  rows={4}
/>`}
        />
      </section>
    </div>
  );
}
