import { useState } from "react";
import {
  FileUploader,
  FileUploaderSize,
  ValueState,
  Button,
  Label,
} from "@sap-ui/fx-components";
import type {
  FileUploaderChangeDetail,
  FileUploaderFileSizeExceedDetail,
} from "@sap-ui/fx-components";
import { CodeBlock } from "./components/CodeBlock";

export function FileUploaderPage() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [multiFiles, setMultiFiles] = useState<string[]>([]);
  const [exceedMessage, setExceedMessage] = useState("");
  const [lastEvent, setLastEvent] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [matrixFile, setMatrixFile] = useState("Uploaded File.pdf");
  const [matrixDisabledFile] = useState("Uploaded File.pdf");

  const handleChange = (detail: FileUploaderChangeDetail) => {
    if (detail.files) {
      const names = Array.from(detail.files).map((f) => f.name);
      setSelectedFiles(names);
      setLastEvent(`onChange: ${names.join(", ")}`);
    } else {
      setSelectedFiles([]);
      setLastEvent("onChange: cleared");
    }
  };

  const handleMultiChange = (detail: FileUploaderChangeDetail) => {
    if (detail.files) {
      setMultiFiles(Array.from(detail.files).map((f) => f.name));
    } else {
      setMultiFiles([]);
    }
  };

  const handleFileSizeExceed = (detail: FileUploaderFileSizeExceedDetail) => {
    const exceeded = detail.filesData
      .map((f) => `${f.fileName} (${f.fileSize.toFixed(1)} MB)`)
      .join(", ");
    setExceedMessage(`Exceeded: ${exceeded}`);
  };

  return (
    <div className="space-y-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">FileUploader</h1>
        <code className="text-sm text-primary/70 font-mono">
          {'import { FileUploader } from "@sap-ui/fx-components"'}
        </code>
      </header>

      {/* Event Tracker */}
      <section className="p-4 border border-border rounded-lg bg-muted/50">
        <div className="flex items-center gap-4 text-sm">
          <span>
            <strong>Last Event:</strong> {lastEvent || "None"}
          </span>
          <span>
            <strong>Selected:</strong>{" "}
            {selectedFiles.length > 0 ? selectedFiles.join(", ") : "None"}
          </span>
        </div>
      </section>

      {/* Basic FileUploader */}
      <section id="basic" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic</h2>
        <div className="max-w-md space-y-4">
          <div>
            <Label id="basic-large-label" showColon>File (Large)</Label>
            <FileUploader placeholder="Browse or drop a file" accessibleNameRef="basic-large-label" />
          </div>
          <div>
            <Label id="basic-medium-label" showColon>File (Medium)</Label>
            <FileUploader placeholder="Browse or drop a file (Medium)" size={FileUploaderSize.Medium} accessibleNameRef="basic-medium-label" />
          </div>
        </div>
      </section>

      {/* States Matrix - mirrors Figma spec layout */}
      <section id="states-matrix" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-6">States Matrix</h2>
        <p className="text-secondary-foreground mb-6">
          Matches the Figma spec: Regular, Hover (interactive), Pressed/Focus
          (click to see), and Disabled states.
        </p>

        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Large — 40px</h3>
          <div className="flex gap-8 flex-wrap">
            <div className="w-[280px]">
              <span className="text-sm font-medium text-secondary-foreground">
                Regular
              </span>
              <div className="mt-3 space-y-4">
                <div>
                  <Label id="matrix-large-empty-label" showColon>Upload</Label>
                  <FileUploader placeholder="Browse or drop a file" size={FileUploaderSize.Large} accessibleNameRef="matrix-large-empty-label" />
                </div>
                <div>
                  <Label id="matrix-large-file-label" showColon>Upload</Label>
                  <FileUploader
                    value={matrixFile}
                    size={FileUploaderSize.Large}
                    onChange={() => setMatrixFile("")}
                    accessibleNameRef="matrix-large-file-label"
                  />
                </div>
              </div>
            </div>
            <div className="w-[280px]">
              <span className="text-sm font-medium text-secondary-foreground">
                Disabled
              </span>
              <div className="mt-3 space-y-4">
                <div>
                  <Label id="matrix-large-disabled-empty-label" showColon>Upload</Label>
                  <FileUploader
                    placeholder="Browse or drop a file"
                    disabled
                    size={FileUploaderSize.Large}
                    accessibleNameRef="matrix-large-disabled-empty-label"
                  />
                </div>
                <div>
                  <Label id="matrix-large-disabled-file-label" showColon>Upload</Label>
                  <FileUploader value={matrixDisabledFile} disabled size={FileUploaderSize.Large} accessibleNameRef="matrix-large-disabled-file-label" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-bold mb-4">Medium — 32px</h3>
          <div className="flex gap-8 flex-wrap">
            <div className="w-[280px]">
              <span className="text-sm font-medium text-secondary-foreground">
                Regular
              </span>
              <div className="mt-3 space-y-4">
                <div>
                  <Label id="matrix-medium-empty-label" showColon>Upload</Label>
                  <FileUploader placeholder="Browse or drop a file" size={FileUploaderSize.Medium} accessibleNameRef="matrix-medium-empty-label" />
                </div>
                <div>
                  <Label id="matrix-medium-file-label" showColon>Upload</Label>
                  <FileUploader
                    value={matrixFile}
                    size={FileUploaderSize.Medium}
                    onChange={() => setMatrixFile("")}
                    accessibleNameRef="matrix-medium-file-label"
                  />
                </div>
              </div>
            </div>
            <div className="w-[280px]">
              <span className="text-sm font-medium text-secondary-foreground">
                Disabled
              </span>
              <div className="mt-3 space-y-4">
                <div>
                  <Label id="matrix-medium-disabled-empty-label" showColon>Upload</Label>
                  <FileUploader
                    placeholder="Browse or drop a file"
                    disabled
                    size={FileUploaderSize.Medium}
                    accessibleNameRef="matrix-medium-disabled-empty-label"
                  />
                </div>
                <div>
                  <Label id="matrix-medium-disabled-file-label" showColon>Upload</Label>
                  <FileUploader value={matrixDisabledFile} disabled size={FileUploaderSize.Medium} accessibleNameRef="matrix-medium-disabled-file-label" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <CodeBlock
          language="tsx"
          code={`<Label id="upload-label" showColon>Upload</Label>
<FileUploader placeholder="Browse or drop a file" accessibleNameRef="upload-label" />
<FileUploader value="Uploaded File.pdf" accessibleNameRef="upload-label" />
<FileUploader disabled accessibleNameRef="upload-label" />
<FileUploader value="Uploaded File.pdf" disabled accessibleNameRef="upload-label" />`}
        />
      </section>

      {/* Long File Name */}
      <section id="long-file-name" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Long File Name</h2>
        <p className="text-secondary-foreground mb-4">
          Token text truncates with ellipsis. Hover to see the full name in a tooltip.
        </p>
        <div className="max-w-md">
          <Label id="long-name-label" showColon>Attachment</Label>
          <FileUploader value="This is a very long file name that should be truncated with an ellipsis indicator.pdf" accessibleNameRef="long-name-label" />
        </div>
        <CodeBlock
          language="tsx"
          code={`<Label id="long-name-label" showColon>Attachment</Label>
<FileUploader value="This is a very long file name that should be truncated..." accessibleNameRef="long-name-label" />`}
        />
      </section>

      {/* Multiple Files with Long Names */}
      <section id="multiple-files" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Multiple Files</h2>
        <p className="text-secondary-foreground mb-4">
          Tokens that don't fit show an "n More" indicator.
          Tab into the field, then press <code>ArrowRight</code> to navigate
          through tokens. <code>ArrowLeft</code> on the first token returns
          focus to the field. <code>Tab</code> exits the field.
        </p>
        <div className="max-w-md space-y-4">
          <div>
            <Label id="multi-files-label" showColon>Attachments</Label>
            <FileUploader value="Quarterly-Report-2026-Q1-Final.pdf, Presentation-Slides-Annual-Review.pptx, Budget-Spreadsheet-Updated.xlsx" accessibleNameRef="multi-files-label" />
          </div>
          <div>
            <Label id="multi-files-label-2" showColon>Documents</Label>
            <FileUploader value="Report.pdf, Slides.pptx, Budget.xlsx, Invoice-January.pdf, Meeting-Notes.docx, Photo-Team-Offsite.png" accessibleNameRef="multi-files-label-2" />
          </div>
        </div>
        <CodeBlock
          language="tsx"
          code={`<Label id="attachments-label" showColon>Attachments</Label>
<FileUploader value="Quarterly-Report.pdf, Presentation-Slides.pptx, Budget.xlsx" accessibleNameRef="attachments-label" />`}
        />
      </section>

      {/* Basic */}
      <section id="basic-2" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Basic</h2>
        <p className="text-secondary-foreground mb-4">
          Single file upload with default placeholder. Select a file to see the
          Token display.
        </p>
        <div className="max-w-md">
          <Label id="basic-upload-label" showColon>File</Label>
          <FileUploader onChange={handleChange} accessibleNameRef="basic-upload-label" />
        </div>
      </section>

      {/* Custom Placeholder */}
      <section id="custom-placeholder" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Custom Placeholder</h2>
        <p className="text-secondary-foreground mb-4">
          Use the <code>placeholder</code> prop to customize the hint text.
        </p>
        <div className="max-w-md">
          <Label id="resume-label" showColon>Resume</Label>
          <FileUploader placeholder="Drag your resume here..." accessibleNameRef="resume-label" />
        </div>
        <CodeBlock
          language="tsx"
          code={`<Label id="resume-label" showColon>Resume</Label>
<FileUploader placeholder="Drag your resume here..." accessibleNameRef="resume-label" />`}
        />
      </section>

      {/* Multiple Files */}
      <section id="multiple-files-2" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Multiple Files</h2>
        <p className="text-secondary-foreground mb-4">
          Enable <code>multiple</code> to allow selecting several files at once.
          Each file appears as a Token.
        </p>
        <div className="max-w-md space-y-2">
          <Label id="multi-upload-label" showColon>Files</Label>
          <FileUploader multiple onChange={handleMultiChange} accessibleNameRef="multi-upload-label" />
          {multiFiles.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Selected: {multiFiles.join(", ")}
            </p>
          )}
        </div>
        <CodeBlock language="tsx" code={`<Label id="files-label" showColon>Files</Label>
<FileUploader multiple accessibleNameRef="files-label" />`} />
      </section>

      {/* Accept Filter */}
      <section id="accept-filter" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Accept Filter</h2>
        <p className="text-secondary-foreground mb-4">
          Restrict allowed file types with the <code>accept</code> prop.
        </p>
        <div className="flex flex-wrap gap-6">
          <div className="w-[280px]">
            <Label id="docs-label" showColon>Documents (.pdf, .doc)</Label>
            <FileUploader accept=".pdf,.doc,.docx" accessibleNameRef="docs-label" />
          </div>
          <div className="w-[280px]">
            <Label id="images-label" showColon>Images</Label>
            <FileUploader accept="image/*" accessibleNameRef="images-label" />
          </div>
        </div>
        <CodeBlock
          language="tsx"
          code={`<Label id="docs-label" showColon>Documents (.pdf, .doc)</Label>
<FileUploader accept=".pdf,.doc,.docx" accessibleNameRef="docs-label" />

<Label id="images-label" showColon>Images</Label>
<FileUploader accept="image/*" accessibleNameRef="images-label" />`}
        />
      </section>

      {/* Max File Size */}
      <section id="max-file-size" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Max File Size</h2>
        <p className="text-secondary-foreground mb-4">
          Set <code>maxFileSize</code> (in MB) to reject oversized files. The{" "}
          <code>onFileSizeExceed</code> callback provides details.
        </p>
        <div className="max-w-md space-y-2">
          <Label id="maxsize-label" showColon>File (max 2 MB)</Label>
          <FileUploader
            maxFileSize={2}
            onFileSizeExceed={handleFileSizeExceed}
            valueState={exceedMessage ? ValueState.Negative : ValueState.None}
            valueStateMessage={exceedMessage || undefined}
            accessibleNameRef="maxsize-label"
          />
          {exceedMessage && (
            <Button
              design="Transparent"
              onClick={() => setExceedMessage("")}
            >
              Dismiss
            </Button>
          )}
        </div>
        <CodeBlock
          language="tsx"
          code={`<Label id="maxsize-label" showColon>File (max 2 MB)</Label>
<FileUploader
  maxFileSize={2}
  onFileSizeExceed={({ filesData }) => {
    console.log("Exceeded:", filesData);
  }}
  accessibleNameRef="maxsize-label"
/>`}
        />
      </section>

      {/* Disabled */}
      <section id="disabled" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Disabled</h2>
        <p className="text-secondary-foreground mb-4">
          A disabled FileUploader is non-interactive with reduced opacity.
        </p>
        <div className="flex flex-wrap gap-4 max-w-md">
          <div>
            <Label id="disabled-empty-label" showColon>File</Label>
            <FileUploader disabled accessibleNameRef="disabled-empty-label" />
          </div>
          <div>
            <Label id="disabled-file-label" showColon>File</Label>
            <FileUploader disabled value={matrixDisabledFile} accessibleNameRef="disabled-file-label" />
          </div>
        </div>
        <CodeBlock language="tsx" code={`<Label id="disabled-label" showColon>File</Label>
<FileUploader disabled accessibleNameRef="disabled-label" />`} />
      </section>

      {/* Button-Only (hideInput) */}
      <section className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">
          Button-Only (hideInput)
        </h2>
        <p className="text-secondary-foreground mb-4">
          Use <code>hideInput</code> with a <code>Button</code> child for a
          compact file upload trigger.
        </p>
        <div className="flex items-center gap-4">
          <FileUploader hideInput onChange={handleChange} accessibleName="Choose file">
            <Button design="Primary">Choose File</Button>
          </FileUploader>
          <FileUploader hideInput disabled accessibleName="Choose file (disabled)">
            <Button design="Primary" disabled>Choose File (Disabled)</Button>
          </FileUploader>
        </div>
        <CodeBlock
          language="tsx"
          code={`<FileUploader hideInput onChange={handleChange} accessibleName="Choose file">
  <Button design="Primary">Choose File</Button>
</FileUploader>`}
        />
      </section>

      {/* Required (Form) */}
      <section id="required-form" className="p-6 border border-border rounded-lg bg-card">
        <h2 className="text-2xl font-semibold mb-2">Required (Form)</h2>
        <p className="text-secondary-foreground mb-4">
          Used inside a form with <code>required</code> and <code>name</code>{" "}
          props.
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setFormSubmitted(true);
          }}
          className="max-w-md space-y-4"
        >
          <div>
            <Label id="required-label" showColon required>Document</Label>
            <FileUploader name="document" required accessibleNameRef="required-label" />
          </div>
          <Button design="Primary" type="Submit">
            Submit
          </Button>
          {formSubmitted && (
            <p className="text-sm text-sapphire-positive">Form submitted successfully.</p>
          )}
        </form>
        <CodeBlock
          language="tsx"
          code={`<Label id="doc-label" showColon required>Document</Label>
<FileUploader name="document" required accessibleNameRef="doc-label" />`}
        />
      </section>
    </div>
  );
}
