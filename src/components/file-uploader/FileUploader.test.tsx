import { describe, it, expect, vi } from "vitest";
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FileUploader } from "./FileUploader";
import { ValueState } from "../../types/file-uploader";

/**
 * Helper to create a mock FileList using DataTransfer (with fallback for jsdom).
 */
function createMockFileList(
  files: Array<{ name: string; size?: number; type?: string }>
): FileList {
  // jsdom doesn't have DataTransfer — build a mock FileList
  const fileObjs = files.map((f) => {
    const content = new Uint8Array(f.size ?? 100);
    return new File([content], f.name, { type: f.type ?? "text/plain" });
  });

  // Create an array-like object that mimics FileList
  const fileList = Object.create(FileList.prototype);
  fileObjs.forEach((file, i) => {
    fileList[i] = file;
  });
  Object.defineProperty(fileList, "length", { value: fileObjs.length });
  fileList.item = (index: number) => fileList[index] ?? null;
  // Make it iterable
  fileList[Symbol.iterator] = function* () {
    for (let i = 0; i < fileObjs.length; i++) yield fileList[i];
  };
  return fileList as FileList;
}

/**
 * Helper to get the styled container element (no role, found via data-testid).
 */
function getContainer() {
  return screen.getByTestId("fu-container");
}

/**
 * Helper to get the native file input (focus target, carries aria attrs).
 */
function getInput() {
  return screen.getByTestId("fu-input");
}

describe("FileUploader", () => {
  // ─── Rendering ───────────────────────────────────────────────────

  describe("Rendering", () => {
    it("renders with default placeholder - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      expect(screen.getByText("Browse or drop a file")).toBeInTheDocument();
    });

    it("renders with multiple placeholder when multiple is true - BLI: EL-339", () => {
      render(<FileUploader multiple data-testid="fu" />);
      expect(screen.getByText("Browse or drop files")).toBeInTheDocument();
    });

    it("renders with custom placeholder - BLI: EL-339", () => {
      render(<FileUploader placeholder="Upload here" />);
      expect(screen.getByText("Upload here")).toBeInTheDocument();
    });

    it("renders browse icon - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      expect(screen.getByLabelText("Browse files")).toBeInTheDocument();
    });

    it("supports data-testid - BLI: EL-339", () => {
      render(<FileUploader data-testid="my-uploader" />);
      expect(screen.getByTestId("my-uploader")).toBeInTheDocument();
    });

    it("supports className - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" className="custom-class" />);
      expect(screen.getByTestId("fu")).toHaveClass("custom-class");
    });

    it("supports style - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" style={{ maxWidth: "300px" }} />);
      expect(screen.getByTestId("fu")).toHaveStyle({ maxWidth: "300px" });
    });

    it("supports id - BLI: EL-339", () => {
      render(<FileUploader id="my-id" data-testid="fu" />);
      expect(screen.getByTestId("fu")).toHaveAttribute("id", "my-id");
    });

    it("passes name to native input - BLI: EL-339", () => {
      render(<FileUploader name="attachment" data-testid="fu" />);
      expect(getInput()).toHaveAttribute("name", "attachment");
    });

    it("passes accept to native input - BLI: EL-339", () => {
      render(<FileUploader accept=".pdf,.doc" data-testid="fu" />);
      expect(getInput()).toHaveAttribute("accept", ".pdf,.doc");
    });

    it("passes multiple to native input - BLI: EL-339", () => {
      render(<FileUploader multiple data-testid="fu" />);
      expect(getInput()).toHaveAttribute("multiple");
    });
  });

  // ─── hideInput mode ──────────────────────────────────────────────

  describe("hideInput mode", () => {
    it("hides the styled container and renders children - BLI: EL-339", () => {
      render(
        <FileUploader hideInput data-testid="fu">
          <button>Upload</button>
        </FileUploader>
      );
      // Children should be visible
      expect(screen.getByText("Upload")).toBeInTheDocument();
      // Placeholder should not be visible
      expect(screen.queryByText("Browse or drop a file")).not.toBeInTheDocument();
    });

    it("clicking children opens file dialog - BLI: EL-339", () => {
      render(
        <FileUploader hideInput data-testid="fu">
          <button>Upload</button>
        </FileUploader>
      );
      const hiddenInput = getInput();
      const clickSpy = vi.spyOn(hiddenInput, "click");
      fireEvent.click(screen.getByText("Upload"));
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  // ─── Disabled state ──────────────────────────────────────────────

  describe("Disabled state", () => {
    it("applies disabled styling - BLI: EL-339", () => {
      render(<FileUploader disabled data-testid="fu" />);
      const container = getContainer();
      expect(container).toHaveClass("opacity-40");
      expect(container).toHaveClass("pointer-events-none");
    });

    it("sets disabled on native input - BLI: EL-339", () => {
      render(<FileUploader disabled data-testid="fu" />);
      expect(getInput()).toBeDisabled();
    });

    it("does not open dialog on click when disabled - BLI: EL-339", () => {
      render(<FileUploader disabled data-testid="fu" />);
      const input = getInput();
      const clickSpy = vi.spyOn(input, "click");
      fireEvent.click(getContainer());
      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  // ─── File selection ──────────────────────────────────────────────

  describe("File selection", () => {
    it("clicking the container opens file dialog - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      const input = getInput();
      const clickSpy = vi.spyOn(input, "click");
      fireEvent.click(getContainer());
      expect(clickSpy).toHaveBeenCalled();
    });

    it("fires onChange when files are selected - BLI: EL-339", () => {
      const handleChange = vi.fn();
      render(<FileUploader onChange={handleChange} data-testid="fu" />);
      const input = getInput();
      const files = createMockFileList([{ name: "test.pdf" }]);
      fireEvent.change(input, { target: { files } });
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({ files: expect.any(Object) })
      );
    });

    it("displays file name as Token after selection - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      const input = getInput();
      const files = createMockFileList([{ name: "report.pdf" }]);
      fireEvent.change(input, { target: { files } });
      expect(screen.getByText("report.pdf")).toBeInTheDocument();
    });

    it("displays multiple file names as Tokens - BLI: EL-339", () => {
      render(<FileUploader multiple data-testid="fu" />);
      const input = getInput();
      const files = createMockFileList([
        { name: "file1.pdf" },
        { name: "file2.doc" },
      ]);
      fireEvent.change(input, { target: { files } });
      expect(screen.getByText("file1.pdf")).toBeInTheDocument();
      expect(screen.getByText("file2.doc")).toBeInTheDocument();
    });

    it("hides placeholder when files are selected - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      expect(screen.getByText("Browse or drop a file")).toBeInTheDocument();
      const input = getInput();
      const files = createMockFileList([{ name: "test.txt" }]);
      fireEvent.change(input, { target: { files } });
      expect(screen.queryByText("Browse or drop a file")).not.toBeInTheDocument();
    });

    it("displays value prop as token names when provided - BLI: EL-339", () => {
      render(<FileUploader value="doc1.pdf, doc2.txt" data-testid="fu" />);
      expect(screen.getByText("doc1.pdf")).toBeInTheDocument();
      expect(screen.getByText("doc2.txt")).toBeInTheDocument();
    });
  });

  // ─── Clear functionality ─────────────────────────────────────────

  describe("Clear functionality", () => {
    it("shows clear button when files are selected - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      // No clear button initially
      expect(screen.queryByLabelText("Clear all")).not.toBeInTheDocument();
      // Select a file
      const input = getInput();
      const files = createMockFileList([{ name: "test.pdf" }]);
      fireEvent.change(input, { target: { files } });
      // Clear button should appear
      expect(screen.getByLabelText("Clear all")).toBeInTheDocument();
    });

    it("clears files and fires onChange(null) on clear click - BLI: EL-339", () => {
      const handleChange = vi.fn();
      render(<FileUploader onChange={handleChange} data-testid="fu" />);
      const input = getInput();
      const files = createMockFileList([{ name: "test.pdf" }]);
      fireEvent.change(input, { target: { files } });
      handleChange.mockClear();

      fireEvent.click(screen.getByLabelText("Clear all"));
      expect(handleChange).toHaveBeenCalledWith({ files: null });
      // File name should be gone
      expect(screen.queryByText("test.pdf")).not.toBeInTheDocument();
    });

    it("hides clear button when no files are selected - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      expect(screen.queryByLabelText("Clear all")).not.toBeInTheDocument();
    });

    it("shows clear button when value prop is controlled - BLI: EL-339", () => {
      render(<FileUploader value="controlled.pdf" data-testid="fu" />);
      // File tokens are shown and clear button is visible
      expect(screen.getByText("controlled.pdf")).toBeInTheDocument();
      expect(screen.getByLabelText("Clear all")).toBeInTheDocument();
    });
  });

  // ─── Value state ─────────────────────────────────────────────────

  describe("Value state", () => {
    it("applies None state by default - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      const container = getContainer();
      expect(container).toHaveClass("border-sapphire-border-active");
    });

    it("applies Negative state classes - BLI: EL-339", () => {
      render(<FileUploader valueState={ValueState.Negative} data-testid="fu" />);
      const container = getContainer();
      expect(container).toHaveClass("border-sapphire-negative");
    });

    it("applies Positive state classes - BLI: EL-339", () => {
      render(<FileUploader valueState={ValueState.Positive} data-testid="fu" />);
      const container = getContainer();
      expect(container).toHaveClass("border-sapphire-positive");
    });

    it("applies Critical state classes - BLI: EL-339", () => {
      render(<FileUploader valueState={ValueState.Critical} data-testid="fu" />);
      const container = getContainer();
      expect(container).toHaveClass("border-sapphire-warning");
    });

    it("applies Information state classes - BLI: EL-339", () => {
      render(<FileUploader valueState={ValueState.Information} data-testid="fu" />);
      const container = getContainer();
      expect(container).toHaveClass("border-sapphire-info");
    });

    it("renders value state message when provided - BLI: EL-339", () => {
      render(
        <FileUploader
          valueState={ValueState.Negative}
          valueStateMessage="File is required"
          data-testid="fu"
        />
      );
      expect(screen.getByText("File is required")).toBeInTheDocument();
    });

    it("does not render value state message for None state - BLI: EL-339", () => {
      render(
        <FileUploader
          valueState={ValueState.None}
          valueStateMessage="Should not show"
          data-testid="fu"
        />
      );
      expect(screen.queryByText("Should not show")).not.toBeInTheDocument();
    });

    it("accepts string literal for valueState - BLI: EL-339", () => {
      render(<FileUploader valueState="Negative" data-testid="fu" />);
      const container = getContainer();
      expect(container).toHaveClass("border-sapphire-negative");
    });
  });

  // ─── Drag and drop ───────────────────────────────────────────────

  describe("Drag and drop", () => {
    it("handles dragover event (preventDefault is called internally) - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      const container = getContainer();
      expect(() => fireEvent.dragOver(container)).not.toThrow();
    });

    it("applies drag-over highlight on drag enter - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      const container = getContainer();
      fireEvent.dragEnter(container);
      expect(container).toHaveClass("border-sapphire-border-accent");
    });

    it("removes drag-over highlight on drag leave - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      const container = getContainer();
      fireEvent.dragEnter(container);
      fireEvent.dragLeave(container);
      expect(container).toHaveClass("border-sapphire-border-active");
    });

    it("fires onChange on drop with files - BLI: EL-339", () => {
      const handleChange = vi.fn();
      render(<FileUploader onChange={handleChange} data-testid="fu" />);
      const container = getContainer();
      const files = createMockFileList([{ name: "dropped.pdf" }]);

      fireEvent.drop(container, {
        dataTransfer: { files },
      });

      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({ files: expect.any(Object) })
      );
      expect(screen.getByText("dropped.pdf")).toBeInTheDocument();
    });

    it("does not handle drop when disabled - BLI: EL-339", () => {
      const handleChange = vi.fn();
      render(<FileUploader disabled onChange={handleChange} data-testid="fu" />);
      const container = getContainer();
      const files = createMockFileList([{ name: "dropped.pdf" }]);

      fireEvent.drop(container, {
        dataTransfer: { files },
      });

      expect(handleChange).not.toHaveBeenCalled();
    });
  });

  // ─── maxFileSize validation ──────────────────────────────────────

  describe("maxFileSize validation", () => {
    it("fires onFileSizeExceed for oversized files - BLI: EL-339", () => {
      const handleExceed = vi.fn();
      render(
        <FileUploader
          maxFileSize={1}
          onFileSizeExceed={handleExceed}
          data-testid="fu"
        />
      );
      const input = getInput();
      // 2MB file
      const files = createMockFileList([{ name: "big.pdf", size: 2 * 1024 * 1024 }]);
      fireEvent.change(input, { target: { files } });
      expect(handleExceed).toHaveBeenCalledWith({
        filesData: [
          expect.objectContaining({
            fileName: "big.pdf",
            fileSize: expect.any(Number),
          }),
        ],
      });
    });

    it("blocks onChange for oversized files - BLI: EL-339", () => {
      const handleChange = vi.fn();
      render(
        <FileUploader
          maxFileSize={1}
          onChange={handleChange}
          data-testid="fu"
        />
      );
      const input = getInput();
      const files = createMockFileList([{ name: "big.pdf", size: 2 * 1024 * 1024 }]);
      fireEvent.change(input, { target: { files } });
      expect(handleChange).not.toHaveBeenCalled();
    });

    it("passes valid files through - BLI: EL-339", () => {
      const handleChange = vi.fn();
      render(
        <FileUploader
          maxFileSize={5}
          onChange={handleChange}
          data-testid="fu"
        />
      );
      const input = getInput();
      const files = createMockFileList([{ name: "small.pdf", size: 1024 }]);
      fireEvent.change(input, { target: { files } });
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({ files: expect.any(Object) })
      );
    });

    it("returns correct detail with fileName and fileSize in MB - BLI: EL-339", () => {
      const handleExceed = vi.fn();
      const fileSizeBytes = 3 * 1024 * 1024; // 3MB
      render(
        <FileUploader
          maxFileSize={2}
          onFileSizeExceed={handleExceed}
          data-testid="fu"
        />
      );
      const input = getInput();
      const files = createMockFileList([{ name: "huge.zip", size: fileSizeBytes }]);
      fireEvent.change(input, { target: { files } });
      expect(handleExceed).toHaveBeenCalledWith({
        filesData: [
          {
            fileName: "huge.zip",
            fileSize: expect.closeTo(3, 0),
          },
        ],
      });
    });
  });

  // ─── Keyboard ────────────────────────────────────────────────────

  describe("Keyboard interactions", () => {
    it("opens file dialog on Enter - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      const input = getInput();
      const clickSpy = vi.spyOn(input, "click");
      fireEvent.keyDown(input, { key: "Enter" });
      expect(clickSpy).toHaveBeenCalled();
    });

    it("opens file dialog on Space (keyup) - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      const input = getInput();
      const clickSpy = vi.spyOn(input, "click");
      fireEvent.keyDown(input, { key: " " });
      fireEvent.keyUp(input, { key: " " });
      expect(clickSpy).toHaveBeenCalled();
    });

    it("opens file dialog on F4 (keyup) - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      const input = getInput();
      const clickSpy = vi.spyOn(input, "click");
      fireEvent.keyDown(input, { key: "F4" });
      fireEvent.keyUp(input, { key: "F4" });
      expect(clickSpy).toHaveBeenCalled();
    });

    it("clears files on Delete key - BLI: EL-339", () => {
      const handleChange = vi.fn();
      render(<FileUploader onChange={handleChange} data-testid="fu" />);
      const input = getInput();
      const files = createMockFileList([{ name: "test.pdf" }]);
      fireEvent.change(input, { target: { files } });
      handleChange.mockClear();

      fireEvent.keyDown(input, { key: "Delete" });
      expect(handleChange).toHaveBeenCalledWith({ files: null });
    });

    it("opens file dialog on Alt+Down (keyup) - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      const input = getInput();
      const clickSpy = vi.spyOn(input, "click");
      fireEvent.keyDown(input, { key: "ArrowDown", altKey: true });
      fireEvent.keyUp(input, { key: "ArrowDown", altKey: true });
      expect(clickSpy).toHaveBeenCalled();
    });
  });

  // ─── Token keyboard navigation ───────────────────────────────────

  describe("Token keyboard navigation", () => {
    it("ArrowRight from input moves focus into the tokenizer when multiple files present", () => {
      render(<FileUploader value="a.pdf, b.pdf, c.pdf" data-testid="fu" />);
      const input = getInput();
      act(() => input.focus());
      fireEvent.keyDown(input, { key: "ArrowRight" });
      const listbox = screen.getByRole("listbox");
      expect(listbox.contains(document.activeElement)).toBe(true);
    });

    it("ArrowRight/ArrowLeft navigates between tokens inside the tokenizer", async () => {
      const user = userEvent.setup();
      render(<FileUploader value="a.pdf, b.pdf, c.pdf" data-testid="fu" />);
      const options = screen.getAllByRole("option");
      act(() => options[0].focus());
      expect(document.activeElement).toBe(options[0]);

      await user.keyboard("{ArrowRight}");
      expect(document.activeElement).toBe(options[1]);

      await user.keyboard("{ArrowLeft}");
      expect(document.activeElement).toBe(options[0]);
    });

    it("Home/End keys navigate to first/last token", async () => {
      const user = userEvent.setup();
      render(<FileUploader value="a.pdf, b.pdf, c.pdf" data-testid="fu" />);
      const options = screen.getAllByRole("option");
      act(() => options[0].focus());

      await user.keyboard("{End}");
      expect(document.activeElement).toBe(options[2]);

      await user.keyboard("{Home}");
      expect(document.activeElement).toBe(options[0]);
    });

    it("ArrowRight enters token for a single file too", () => {
      render(<FileUploader value="only.pdf" data-testid="fu" />);
      const input = getInput();
      act(() => input.focus());
      fireEvent.keyDown(input, { key: "ArrowRight" });
      const listbox = screen.getByRole("listbox");
      expect(listbox.contains(document.activeElement)).toBe(true);
    });

    it("tokenizer renders with role listbox for multiple files", () => {
      render(<FileUploader value="a.pdf, b.pdf" data-testid="fu" />);
      expect(screen.getByRole("listbox")).toBeInTheDocument();
    });

    it("clicking a token does not open the file browser", () => {
      render(<FileUploader value="a.pdf, b.pdf" data-testid="fu" />);
      const input = getInput();
      const clickSpy = vi.spyOn(input, "click");
      const token = screen.getByText("a.pdf").closest('[data-part="root"]')!;
      fireEvent.click(token);
      expect(clickSpy).not.toHaveBeenCalled();
    });
  });

  // ─── Accessibility ───────────────────────────────────────────────

  describe("Accessibility", () => {
    it("native file input is the focus target - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      const input = getInput();
      expect(input).toHaveAttribute("type", "file");
      expect(input.tabIndex).toBe(0);
    });

    it("has aria-roledescription on native input - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      expect(getInput()).toHaveAttribute(
        "aria-roledescription",
        "File upload"
      );
    });

    it("applies aria-label from accessibleName - BLI: EL-339", () => {
      render(<FileUploader accessibleName="Resume upload" data-testid="fu" />);
      expect(getInput()).toHaveAttribute(
        "aria-label",
        "Resume upload"
      );
    });

    it("applies aria-labelledby from accessibleNameRef - BLI: EL-339", () => {
      render(
        <FileUploader accessibleNameRef="my-label" data-testid="fu" />
      );
      expect(getInput()).toHaveAttribute(
        "aria-labelledby",
        "my-label"
      );
    });

    it("applies aria-required when required - BLI: EL-339", () => {
      render(<FileUploader required data-testid="fu" />);
      expect(getInput()).toHaveAttribute("aria-required", "true");
    });

    it("applies aria-invalid for Negative state - BLI: EL-339", () => {
      render(<FileUploader valueState={ValueState.Negative} data-testid="fu" />);
      expect(getInput()).toHaveAttribute("aria-invalid", "true");
    });

    it("does not apply aria-invalid for non-Negative states - BLI: EL-339", () => {
      render(<FileUploader valueState={ValueState.Positive} data-testid="fu" />);
      expect(getInput()).not.toHaveAttribute("aria-invalid");
    });

    it("has aria-haspopup dialog - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      expect(getInput()).toHaveAttribute(
        "aria-haspopup",
        "dialog"
      );
    });

    it("has accessible labels on browse and clear buttons - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      expect(screen.getByLabelText("Browse files")).toBeInTheDocument();
      // Select a file to make clear button appear
      const input = getInput();
      const files = createMockFileList([{ name: "test.pdf" }]);
      fireEvent.change(input, { target: { files } });
      expect(screen.getByLabelText("Clear all")).toBeInTheDocument();
    });

    it("renders accessibleDescription as hidden span with aria-describedby - BLI: EL-339", () => {
      render(
        <FileUploader accessibleDescription="Upload your documents here" data-testid="fu" />
      );
      const input = getInput();
      const describedBy = input.getAttribute("aria-describedby");
      expect(describedBy).toBeTruthy();
      const span = document.getElementById(describedBy!);
      expect(span).toBeInTheDocument();
      expect(span).toHaveTextContent("Upload your documents here");
    });

    it("renders accessibleDescriptionRef as aria-describedby - BLI: EL-339", () => {
      render(
        <FileUploader accessibleDescriptionRef="ext-desc" data-testid="fu" />
      );
      expect(getInput()).toHaveAttribute("aria-describedby", "ext-desc");
    });
  });

  // ─── Imperative API ──────────────────────────────────────────────

  describe("Imperative API", () => {
    it("focus() focuses the native input - BLI: EL-339", () => {
      const ref = React.createRef<any>();
      render(<FileUploader ref={ref} data-testid="fu" />);
      act(() => ref.current.focus());
      expect(getInput()).toHaveFocus();
    });

    it("openFileBrowser() opens the dialog - BLI: EL-339", () => {
      const ref = React.createRef<any>();
      render(<FileUploader ref={ref} data-testid="fu" />);
      const input = getInput();
      const clickSpy = vi.spyOn(input, "click");
      act(() => ref.current.openFileBrowser());
      expect(clickSpy).toHaveBeenCalled();
    });

    it("clear() clears selected files - BLI: EL-339", () => {
      const handleChange = vi.fn();
      const ref = React.createRef<any>();
      render(<FileUploader ref={ref} onChange={handleChange} data-testid="fu" />);
      // Select a file first
      const input = getInput();
      const files = createMockFileList([{ name: "test.pdf" }]);
      fireEvent.change(input, { target: { files } });
      handleChange.mockClear();

      act(() => ref.current.clear());
      expect(handleChange).toHaveBeenCalledWith({ files: null });
    });

    it("nativeInput returns the native input element - BLI: EL-339", () => {
      const ref = React.createRef<any>();
      render(<FileUploader ref={ref} data-testid="fu" />);
      expect(ref.current.nativeInput).toBe(getInput());
    });
  });

  // ─── Form integration ────────────────────────────────────────────

  describe("Form integration", () => {
    it("passes name attribute to native input - BLI: EL-339", () => {
      render(<FileUploader name="myFile" data-testid="fu" />);
      expect(getInput()).toHaveAttribute("name", "myFile");
    });

    it("passes required attribute to native input - BLI: EL-339", () => {
      render(<FileUploader required data-testid="fu" />);
      expect(getInput()).toBeRequired();
    });
  });

  // ─── Accept filtering on drop ────────────────────────────────────

  describe("Accept filtering on drop", () => {
    it("filters dropped files by accept extension - BLI: EL-339", () => {
      const handleChange = vi.fn();
      render(
        <FileUploader accept=".pdf" onChange={handleChange} data-testid="fu" />
      );
      const container = getContainer();
      const files = createMockFileList([
        { name: "valid.pdf", type: "application/pdf" },
        { name: "invalid.txt", type: "text/plain" },
      ]);

      fireEvent.drop(container, {
        dataTransfer: { files },
      });

      // Only valid.pdf should be in the callback
      expect(handleChange).toHaveBeenCalled();
      const passedFiles = handleChange.mock.calls[0][0].files;
      expect(passedFiles).toHaveLength(1);
      expect(passedFiles[0].name).toBe("valid.pdf");
    });

    it("filters dropped files by MIME type wildcard - BLI: EL-339", () => {
      const handleChange = vi.fn();
      render(
        <FileUploader accept="image/*" onChange={handleChange} data-testid="fu" />
      );
      const container = getContainer();
      const files = createMockFileList([
        { name: "photo.png", type: "image/png" },
        { name: "doc.pdf", type: "application/pdf" },
      ]);

      fireEvent.drop(container, {
        dataTransfer: { files },
      });

      expect(handleChange).toHaveBeenCalled();
      const passedFiles = handleChange.mock.calls[0][0].files;
      expect(passedFiles).toHaveLength(1);
      expect(passedFiles[0].name).toBe("photo.png");
    });
  });

  // ─── Size variants ────────────────────────────────────────────────

  describe("Size variants", () => {
    it("defaults to Large size with h-10 and rounded-lg - BLI: EL-339", () => {
      render(<FileUploader data-testid="fu" />);
      const container = getContainer();
      expect(container).toHaveClass("h-10");
      expect(container).toHaveClass("rounded-lg");
    });

    it("renders Medium size with h-8 and rounded - BLI: EL-339", () => {
      render(<FileUploader size="Medium" data-testid="fu" />);
      const container = getContainer();
      expect(container).toHaveClass("h-8");
      expect(container).toHaveClass("rounded");
      expect(container).not.toHaveClass("rounded-lg");
    });

    it("Large size does not have h-8 class - BLI: EL-339", () => {
      render(<FileUploader size="Large" data-testid="fu" />);
      const container = getContainer();
      expect(container).not.toHaveClass("h-8");
      expect(container).toHaveClass("h-10");
    });

    it("Medium size renders Small browse button - BLI: EL-339", () => {
      render(<FileUploader size="Medium" data-testid="fu" />);
      const browseBtn = screen.getByLabelText("Browse files");
      expect(browseBtn).toHaveClass("h-6");
    });

    it("Large size renders Medium browse button - BLI: EL-339", () => {
      render(<FileUploader size="Large" data-testid="fu" />);
      const browseBtn = screen.getByLabelText("Browse files");
      expect(browseBtn).toHaveClass("h-8");
    });

    it("Medium size renders smaller clear button - BLI: EL-339", () => {
      render(<FileUploader size="Medium" value="test.pdf" data-testid="fu" />);
      const clearBtn = screen.getByLabelText("Clear all");
      expect(clearBtn).toHaveClass("h-6");
    });

    it("Large size renders medium clear button - BLI: EL-339", () => {
      render(<FileUploader size="Large" value="test.pdf" data-testid="fu" />);
      const clearBtn = screen.getByLabelText("Clear all");
      expect(clearBtn).toHaveClass("h-8");
    });
  });
});
