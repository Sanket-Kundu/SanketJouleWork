/**
 * FxRenameTitle.test.tsx
 *
 * Tests for the editable title component.
 */

import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import React from "react";

import { FxRenameTitle, FxRenameTitleRef } from "./FxRenameTitle";
import { stubResizeObserver, stubIntersectionObserver } from "../../test/test-utils";

stubResizeObserver();
stubIntersectionObserver();

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("FxRenameTitle", () => {
  it("renders display text in view mode - BLI: EL-339", () => {
    render(<FxRenameTitle text="My Title" />);
    expect(screen.getByText("My Title")).toBeInTheDocument();
  });

  it("double-click enters edit mode - BLI: EL-339", () => {
    render(<FxRenameTitle text="Editable" />);
    fireEvent.doubleClick(screen.getByText("Editable"));
    expect(screen.getByDisplayValue("Editable")).toBeInTheDocument();
  });

  it("Enter key accepts edit and fires onEditAccept with value + previousValue - BLI: EL-339", () => {
    vi.useFakeTimers();
    const onEditAccept = vi.fn();
    render(<FxRenameTitle text="Original" onEditAccept={onEditAccept} />);

    fireEvent.doubleClick(screen.getByText("Original"));
    act(() => { vi.advanceTimersByTime(10); });

    const input = screen.getByDisplayValue("Original");
    fireEvent.change(input, { target: { value: "Updated" } });
    fireEvent.keyDown(input, { key: "Enter" });

    expect(onEditAccept).toHaveBeenCalledWith({
      value: "Updated",
      previousValue: "Original",
    });
  });

  it("Escape cancels edit and fires onEditCancel - BLI: EL-339", () => {
    vi.useFakeTimers();
    const onEditCancel = vi.fn();
    render(<FxRenameTitle text="Original" onEditCancel={onEditCancel} />);

    fireEvent.doubleClick(screen.getByText("Original"));
    act(() => { vi.advanceTimersByTime(10); });

    const input = screen.getByDisplayValue("Original");
    fireEvent.change(input, { target: { value: "Changed" } });
    fireEvent.keyDown(input, { key: "Escape" });

    expect(onEditCancel).toHaveBeenCalledWith({ value: "Changed" });
  });

  it("blur accepts edit when input has value - BLI: EL-339", () => {
    vi.useFakeTimers();
    const onEditAccept = vi.fn();
    render(<FxRenameTitle text="Title" onEditAccept={onEditAccept} />);
    fireEvent.doubleClick(screen.getByText("Title"));
    act(() => { vi.advanceTimersByTime(10); });

    const input = screen.getByDisplayValue("Title");
    fireEvent.change(input, { target: { value: "New Title" } });
    fireEvent.blur(input);

    expect(onEditAccept).toHaveBeenCalledWith({
      value: "New Title",
      previousValue: "Title",
    });
  });

  it("blur cancels edit when input is empty - BLI: EL-339", () => {
    vi.useFakeTimers();
    const onEditCancel = vi.fn();
    render(<FxRenameTitle text="Title" onEditCancel={onEditCancel} />);
    fireEvent.doubleClick(screen.getByText("Title"));
    act(() => { vi.advanceTimersByTime(10); });

    const input = screen.getByDisplayValue("Title");
    fireEvent.change(input, { target: { value: "" } });
    fireEvent.blur(input);

    expect(onEditCancel).toHaveBeenCalledWith({ value: "" });
  });

  it("Enter followed by blur fires onEditAccept only once - BLI: EL-339", () => {
    vi.useFakeTimers();
    const onEditAccept = vi.fn();
    render(<FxRenameTitle text="Original" onEditAccept={onEditAccept} />);

    fireEvent.doubleClick(screen.getByText("Original"));
    act(() => { vi.advanceTimersByTime(10); });

    const input = screen.getByDisplayValue("Original");
    fireEvent.change(input, { target: { value: "Updated" } });
    fireEvent.keyDown(input, { key: "Enter" });
    fireEvent.blur(input);

    expect(onEditAccept).toHaveBeenCalledTimes(1);
  });

  it("Escape followed by blur fires onEditCancel only once - BLI: EL-339", () => {
    vi.useFakeTimers();
    const onEditCancel = vi.fn();
    render(<FxRenameTitle text="Original" onEditCancel={onEditCancel} />);

    fireEvent.doubleClick(screen.getByText("Original"));
    act(() => { vi.advanceTimersByTime(10); });

    const input = screen.getByDisplayValue("Original");
    fireEvent.keyDown(input, { key: "Escape" });
    fireEvent.blur(input);

    expect(onEditCancel).toHaveBeenCalledTimes(1);
  });

  it("controlled editMode prop works - BLI: EL-339", () => {
    render(<FxRenameTitle text="Controlled" editMode={true} />);
    expect(screen.getByDisplayValue("Controlled")).toBeInTheDocument();
  });

  it("imperative ref works (enterEditMode / exitEditMode / getEditValue) - BLI: EL-339", () => {
    vi.useFakeTimers();
    const ref = React.createRef<FxRenameTitleRef>();
    render(<FxRenameTitle ref={ref} text="Ref Title" />);

    expect(ref.current).not.toBeNull();

    // enterEditMode
    act(() => { ref.current!.enterEditMode(); });
    act(() => { vi.advanceTimersByTime(10); });
    expect(screen.getByDisplayValue("Ref Title")).toBeInTheDocument();

    // getEditValue
    expect(ref.current!.getEditValue()).toBe("Ref Title");

    // exitEditMode
    act(() => { ref.current!.exitEditMode(); });
    expect(screen.getByText("Ref Title")).toBeInTheDocument();
  });

  it("forwards data-testid to display span in view mode - BLI: EL-339", () => {
    render(<FxRenameTitle text="Show" data-testid="title-id" />);
    expect(screen.getByTestId("title-id")).toBeInTheDocument();
    expect(screen.getByTestId("title-id").tagName).toBe("SPAN");
  });

  it("forwards data-testid to input in edit mode - BLI: EL-339", () => {
    render(<FxRenameTitle text="Edit" editMode data-testid="title-id" />);
    expect(screen.getByTestId("title-id")).toBeInTheDocument();
    expect(screen.getByTestId("title-id").tagName).toBe("INPUT");
  });
});
