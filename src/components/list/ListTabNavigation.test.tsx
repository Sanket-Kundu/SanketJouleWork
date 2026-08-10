import { describe, it, expect, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { List } from "./List";
import { ListItem } from "./ListItem";
import { ListItemBase } from "./ListItemBase";
import { Button } from "../button/Button";
import { ButtonDesign } from "../../types/button";
import { ListGrowingMode } from "../../types/list";

// Mock IntersectionObserver
beforeAll(() => {
  if (typeof globalThis.IntersectionObserver === "undefined") {
    globalThis.IntersectionObserver = class {
      constructor(public callback: IntersectionObserverCallback) {}
      observe() {}
      unobserve() {}
      disconnect() {}
      readonly root = null;
      readonly rootMargin = "";
      readonly thresholds = [];
      takeRecords(): IntersectionObserverEntry[] { return []; }
    } as unknown as typeof IntersectionObserver;
  }
});

describe("List – Tab Navigation", () => {
  describe("Exact Tab Navigation Test", () => {
    it("keyboard handling on TAB - exact replica", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button>Before button</button>
          <List
            growing={ListGrowingMode.Button}
            growingButtonText="More"
            hasMore={true}
            header={
              <Button design={ButtonDesign.Primary}>Export</Button>
            }
          >
            <ListItem text="Argentina" itemKey="argentina" />
            <ListItemBase itemKey="custom1">
              <div style={{ padding: "8px" }}>
                <button>Click me</button>
                <a href="https://www.google.bg" target="_blank">Link</a>
                <button disabled>Disabled</button>
                <input type="radio" name="option" />
              </div>
            </ListItemBase>
            <ListItem text="China" itemKey="china" />
            <ListItemBase itemKey="custom2">
              <div style={{ padding: "8px" }}>
                <input type="radio" name="option2" disabled />
              </div>
            </ListItemBase>
          </List>
          <button>After button</button>
        </div>
      );

      // Get elements
      const beforeBtn = screen.getByText("Before button");
      const exportBtn = screen.getByText("Export").closest("button") as HTMLButtonElement;
      const afterBtn = screen.getByText("After button");

      const argentinaItem = screen.getByText("Argentina").closest("li") as HTMLElement;
      const customItem1 = screen.getByText("Click me").closest("li") as HTMLElement;

      const clickMeBtn = screen.getByText("Click me") as HTMLButtonElement;
      const link = screen.getByText("Link") as HTMLAnchorElement;
      const radios = screen.getAllByRole("radio");
      const radio = radios[0] as HTMLInputElement;

      const growingBtn = screen.getByText("More").closest("button") as HTMLButtonElement;

      console.log("\n=== Starting Test ===");

      // Step 1: Focus before button
      beforeBtn.focus();
      console.log("1. After focusing before button, focus:", document.activeElement?.textContent);
      expect(document.activeElement).toBe(beforeBtn);

      // Step 2: Tab → Export button
      await user.keyboard("{Tab}");
      console.log("2. After Tab from before button, focus:", document.activeElement?.textContent);
      expect(document.activeElement).toBe(exportBtn);

      // Step 3: Tab → First list item (Argentina)
      await user.keyboard("{Tab}");
      console.log("3. After Tab from export button, focus:", document.activeElement?.getAttribute("data-item-key"));
      expect(document.activeElement).toBe(argentinaItem);

      // Step 4: Click custom list item
      await user.click(customItem1);
      console.log("4. After clicking custom item, focus:", document.activeElement?.getAttribute("data-item-key"));
      expect(document.activeElement).toBe(customItem1);

      // Step 5: Tab → First button in custom item
      await user.keyboard("{Tab}");
      console.log("5. After Tab from custom item, focus:", document.activeElement?.textContent);
      expect(document.activeElement).toBe(clickMeBtn);

      // Step 6: Tab → Link
      await user.keyboard("{Tab}");
      console.log("6. After Tab from button, focus:", document.activeElement?.textContent);
      expect(document.activeElement).toBe(link);

      // Step 7: Tab → Radio (skip disabled button)
      await user.keyboard("{Tab}");
      console.log("7. After Tab from link, focus:", (document.activeElement as HTMLInputElement)?.type);
      expect(document.activeElement).toBe(radio);

      // Step 8: Click Argentina item
      await user.click(argentinaItem);
      console.log("8. After clicking Argentina, focus:", document.activeElement?.getAttribute("data-item-key"));
      expect(document.activeElement).toBe(argentinaItem);

      // Step 9: Tab → Growing button (CRITICAL TEST!)
      await user.keyboard("{Tab}");
      console.log("9. After Tab from Argentina, focus:", document.activeElement?.textContent);
      expect(document.activeElement).toBe(growingBtn);

      // Step 10: Tab → After button
      await user.keyboard("{Tab}");
      console.log("10. After Tab from growing button, focus:", document.activeElement?.textContent);
      expect(document.activeElement).toBe(afterBtn);
    });
  });

  describe("Structure Tests", () => {
    it("Scenario 1: Tab through simple item exits list immediately", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItem text="List item 1" itemKey="item1" />
            <ListItemBase itemKey="item2">
              <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                <button data-testid="btn-item2-1">Button within list item 1</button>
                <button data-testid="btn-item2-2">Button within list item 2</button>
              </div>
            </ListItemBase>
            <ListItem text="List item 3" itemKey="item3" />
            <ListItemBase itemKey="item4">
              <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                <button data-testid="btn-item4-1">Button within list item 3</button>
                <button data-testid="btn-item4-2">Button within list item 4</button>
              </div>
            </ListItemBase>
            <ListItem text="List item 5" itemKey="item5" />
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const beforeBtn = screen.getByTestId("before");
      const afterBtn = screen.getByTestId("after");
      const item1 = screen.getByText("List item 1").closest("li") as HTMLElement;

      console.log("\n=== Scenario 1: Simple item exits immediately ===");

      // Step 1: Focus before button
      beforeBtn.focus();
      console.log("1. Focus: Before button");
      expect(document.activeElement).toBe(beforeBtn);

      // Step 2: Tab → List item 1
      await user.keyboard("{Tab}");
      console.log("2. After Tab: List item 1");
      expect(document.activeElement).toBe(item1);

      // Step 3: Tab → After button (exits list immediately, no interactive content)
      await user.keyboard("{Tab}");
      console.log("3. After Tab: After button (exited list)");
      expect(document.activeElement).toBe(afterBtn);
    });

    it("Scenario 2: Arrow to item with buttons, tab through buttons, then exit", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItem text="List item 1" itemKey="item1" />
            <ListItemBase itemKey="item2">
              <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                <button data-testid="btn-item2-1">Button within list item 1</button>
                <button data-testid="btn-item2-2">Button within list item 2</button>
              </div>
            </ListItemBase>
            <ListItem text="List item 3" itemKey="item3" />
            <ListItemBase itemKey="item4">
              <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                <button data-testid="btn-item4-1">Button within list item 3</button>
                <button data-testid="btn-item4-2">Button within list item 4</button>
              </div>
            </ListItemBase>
            <ListItem text="List item 5" itemKey="item5" />
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const beforeBtn = screen.getByTestId("before");
      const afterBtn = screen.getByTestId("after");
      const item1 = screen.getByText("List item 1").closest("li") as HTMLElement;
      const item2 = screen.getByTestId("btn-item2-1").closest("li") as HTMLElement;
      const btn1 = screen.getByTestId("btn-item2-1");
      const btn2 = screen.getByTestId("btn-item2-2");

      console.log("\n=== Scenario 2: Navigate to item with buttons, tab through them ===");

      // Step 1: Focus before button
      beforeBtn.focus();
      console.log("1. Focus: Before button");
      expect(document.activeElement).toBe(beforeBtn);

      // Step 2: Tab → List item 1
      await user.keyboard("{Tab}");
      console.log("2. After Tab: List item 1");
      expect(document.activeElement).toBe(item1);

      // Step 3: Arrow Down → List item 2 (has buttons)
      await user.keyboard("{ArrowDown}");
      console.log("3. After Arrow Down: List item 2 (has buttons)");
      expect(document.activeElement).toBe(item2);

      // Step 4: Tab → Button within list item 1
      await user.keyboard("{Tab}");
      console.log("4. After Tab: Button within list item 1");
      expect(document.activeElement).toBe(btn1);

      // Step 5: Tab → Button within list item 2
      await user.keyboard("{Tab}");
      console.log("5. After Tab: Button within list item 2");
      expect(document.activeElement).toBe(btn2);

      // Step 6: Tab → After button (exits list after last button in item)
      await user.keyboard("{Tab}");
      console.log("6. After Tab: After button (exited list)");
      expect(document.activeElement).toBe(afterBtn);
    });

    it("Scenario 3: Shift+Tab from after button goes to list item", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItem text="List item 1" itemKey="item1" />
            <ListItemBase itemKey="item2">
              <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                <button data-testid="btn-item2-1">Button within list item 1</button>
                <button data-testid="btn-item2-2">Button within list item 2</button>
              </div>
            </ListItemBase>
            <ListItem text="List item 3" itemKey="item3" />
            <ListItemBase itemKey="item4">
              <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                <button data-testid="btn-item4-1">Button within list item 3</button>
                <button data-testid="btn-item4-2">Button within list item 4</button>
              </div>
            </ListItemBase>
            <ListItem text="List item 5" itemKey="item5" />
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const afterBtn = screen.getByTestId("after");
      const item1 = screen.getByText("List item 1").closest("li") as HTMLElement;

      console.log("\n=== Scenario 3: Shift+Tab from after button ===");

      // Step 1: Focus after button
      afterBtn.focus();
      console.log("1. Focus: After button");
      expect(document.activeElement).toBe(afterBtn);

      // Step 2: Shift+Tab → List item 1 (roving tabindex - first item is focusable)
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("2. After Shift+Tab: List item 1");
      expect(document.activeElement).toBe(item1);
    });

    it("Scenario 4: Forward through list, then backward returns to list item", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItem text="List item 1" itemKey="item1" />
            <ListItemBase itemKey="item2">
              <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                <button data-testid="btn-item2-1">Button within list item 1</button>
                <button data-testid="btn-item2-2">Button within list item 2</button>
              </div>
            </ListItemBase>
            <ListItem text="List item 3" itemKey="item3" />
            <ListItemBase itemKey="item4">
              <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                <button data-testid="btn-item4-1">Button within list item 3</button>
                <button data-testid="btn-item4-2">Button within list item 4</button>
              </div>
            </ListItemBase>
            <ListItem text="List item 5" itemKey="item5" />
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const beforeBtn = screen.getByTestId("before");
      const afterBtn = screen.getByTestId("after");
      const item1 = screen.getByText("List item 1").closest("li") as HTMLElement;
      const item2 = screen.getByTestId("btn-item2-1").closest("li") as HTMLElement;
      const btn1 = screen.getByTestId("btn-item2-1");
      const btn2 = screen.getByTestId("btn-item2-2");

      console.log("\n=== Scenario 4: Forward then backward navigation ===");

      // Step 1: Focus before button
      beforeBtn.focus();
      console.log("1. Focus: Before button");
      expect(document.activeElement).toBe(beforeBtn);

      // Step 2: Tab → List item 1
      await user.keyboard("{Tab}");
      console.log("2. After Tab: List item 1");
      expect(document.activeElement).toBe(item1);

      // Step 3: Arrow Down → List item 2 (has buttons)
      await user.keyboard("{ArrowDown}");
      console.log("3. After Arrow Down: List item 2 (has buttons)");
      expect(document.activeElement).toBe(item2);

      // Step 4: Tab → Button within list item 1
      await user.keyboard("{Tab}");
      console.log("4. After Tab: Button within list item 1");
      expect(document.activeElement).toBe(btn1);

      // Step 5: Tab → Button within list item 2
      await user.keyboard("{Tab}");
      console.log("5. After Tab: Button within list item 2");
      expect(document.activeElement).toBe(btn2);

      // Step 6: Tab → After button (exits list)
      await user.keyboard("{Tab}");
      console.log("6. After Tab: After button (exited list)");
      expect(document.activeElement).toBe(afterBtn);

      // Step 7: Shift+Tab → List item 2 (back to the list item, not the button)
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("7. After Shift+Tab: List item 2 (not the button!)");
      expect(document.activeElement).toBe(item2);
    });
  });

  describe("Tab Navigation Pattern", () => {
    it("keyboard handling on TAB", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before-button">Before button</button>
          <List
            growing={ListGrowingMode.Button}
            growingButtonText="More"
            hasMore={true}
            header={
              <Button design={ButtonDesign.Primary} data-testid="export-button">
                Export
              </Button>
            }
          >
            <ListItem text="Argentina" itemKey="arg" data-testid="item-argentina" />
            <ListItemBase itemKey="custom1" data-testid="custom-item-1">
              <div style={{ display: "flex", gap: "8px", padding: "8px" }}>
                <button data-testid="custom-btn">Click me</button>
                <a href="https://www.google.bg" target="_blank" data-testid="custom-link">
                  UI5 link
                </a>
                <button disabled>Disabled</button>
                <input type="radio" name="option" data-testid="custom-radio" />
              </div>
            </ListItemBase>
            <ListItem text="China" itemKey="china" data-testid="item-china" />
            <ListItemBase itemKey="custom2" data-testid="custom-item-2">
              <div style={{ padding: "8px" }}>
                <input type="radio" name="option2" disabled data-testid="custom-radio-disabled" />
              </div>
            </ListItemBase>
          </List>
          <button data-testid="after-button">After button</button>
        </div>
      );

      // Step 1: Start at "Before button"
      const beforeBtn = screen.getByTestId("before-button");
      beforeBtn.focus();
      expect(document.activeElement).toBe(beforeBtn);

      // Step 2: Tab → Export button (in header)
      await user.keyboard("{Tab}");
      const exportBtn = screen.getByTestId("export-button");
      expect(document.activeElement).toBe(exportBtn);

      // Step 3: Tab → First list item (Argentina)
      await user.keyboard("{Tab}");
      const argentinaItem = screen.getByTestId("item-argentina");
      expect(document.activeElement).toBe(argentinaItem);

      // Step 4: Click custom list item to focus it
      const customItem1 = screen.getByTestId("custom-item-1");
      await user.click(customItem1);
      // After click, focus should be on the list item
      expect(document.activeElement).toBe(customItem1);

      // Step 5: Tab → First button in custom item
      await user.keyboard("{Tab}");
      const customBtn = screen.getByTestId("custom-btn");
      expect(document.activeElement).toBe(customBtn);

      // Step 6: Tab → Link in custom item
      await user.keyboard("{Tab}");
      const customLink = screen.getByTestId("custom-link");
      expect(document.activeElement).toBe(customLink);

      // Step 7: Tab → Radio input in custom item (disabled button is skipped)
      await user.keyboard("{Tab}");
      const customRadio = screen.getByTestId("custom-radio");
      expect(document.activeElement).toBe(customRadio);

      // Step 8: Click first list item (Argentina) to focus it
      await user.click(argentinaItem);
      expect(document.activeElement).toBe(argentinaItem);

      // Step 9: Tab → Growing button
      await user.keyboard("{Tab}");
      const growingBtn = screen.getByRole("button", { name: /more/i });
      expect(document.activeElement).toBe(growingBtn);

      // Step 10: Tab → After button
      await user.keyboard("{Tab}");
      const afterBtn = screen.getByTestId("after-button");
      expect(document.activeElement).toBe(afterBtn);
    });

    it("keyboard handling on SHIFT + TAB", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before-button">Before button</button>
          <List
            growing={ListGrowingMode.Button}
            growingButtonText="More"
            hasMore={true}
            header={
              <Button design={ButtonDesign.Primary} data-testid="export-button">
                Export
              </Button>
            }
          >
            <ListItem text="Argentina" itemKey="arg" data-testid="item-argentina" />
            <ListItem text="China" itemKey="china" data-testid="item-china" />
          </List>
          <button data-testid="after-button">After button</button>
        </div>
      );

      // Start at "After button"
      const afterBtn = screen.getByTestId("after-button");
      afterBtn.focus();
      expect(document.activeElement).toBe(afterBtn);

      // Shift+Tab → Growing button
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      const growingBtn = screen.getByRole("button", { name: /more/i });
      expect(document.activeElement).toBe(growingBtn);

      // Shift+Tab → First list item (last item in DOM order, but roving tabindex makes first focused)
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      const argentinaItem = screen.getByTestId("item-argentina");
      expect(document.activeElement).toBe(argentinaItem);

      // Shift+Tab → Export button (in header)
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      const exportBtn = screen.getByTestId("export-button");
      expect(document.activeElement).toBe(exportBtn);

      // Shift+Tab → Before button
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      const beforeBtn = screen.getByTestId("before-button");
      expect(document.activeElement).toBe(beforeBtn);
    });

    it("tab exits list after last interactive element in item with multiple tabbables", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItemBase itemKey="item1">
              <div style={{ display: "flex", gap: "8px", padding: "8px" }}>
                <input data-testid="input1" type="text" />
                <button data-testid="btn1">Button 1</button>
                <button data-testid="btn2">Button 2</button>
              </div>
            </ListItemBase>
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      // Focus the list item
      const listItem = screen.getAllByRole("listitem")[0];
      listItem.focus();

      // Tab should go to first interactive element (input)
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(screen.getByTestId("input1"));

      // Tab to second interactive element
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(screen.getByTestId("btn1"));

      // Tab to third interactive element
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(screen.getByTestId("btn2"));

      // Tab should exit the list
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(screen.getByTestId("after"));
    });

    it("tab on simple list item exits the list immediately", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItem text="Simple Item" itemKey="item1" data-testid="simple-item" />
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      // Focus the simple list item
      const simpleItem = screen.getByTestId("simple-item");
      simpleItem.focus();
      expect(document.activeElement).toBe(simpleItem);

      // Tab should exit the list immediately
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(screen.getByTestId("after"));
    });

    it("growing button is included in tab navigation after last list item", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List
            growing={ListGrowingMode.Button}
            growingButtonText="Load More"
            hasMore={true}
          >
            <ListItem text="Item 1" itemKey="item1" />
            <ListItem text="Item 2" itemKey="item2" />
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const beforeBtn = screen.getByTestId("before");
      beforeBtn.focus();

      // Tab through list items
      await user.keyboard("{Tab}"); // First item
      await user.keyboard("{Tab}"); // Should go to growing button, not second item

      const growingBtn = screen.getByRole("button", { name: /load more/i });
      expect(document.activeElement).toBe(growingBtn);

      // Tab should exit to after button
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(screen.getByTestId("after"));
    });

    it("Shift+Tab navigation through multiple buttons in same item", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItemBase itemKey="item1">
              <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                <button data-testid="btn-item1-1">Button within list item 1</button>
                <button data-testid="btn-item1-2">Button within list item 2</button>
              </div>
            </ListItemBase>
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const button2 = screen.getByTestId("btn-item1-2");
      const button1 = screen.getByTestId("btn-item1-1");
      const before = screen.getByTestId("before");
      const items = screen.getAllByRole("listitem");
      const item1 = items[0];

      console.log("\n=== Test: Shift+Tab through buttons in same item ===");

      // 1. Start at Button within list item 2 (second button)
      button2.focus();
      console.log("1. Focus: Button within list item 2");
      expect(document.activeElement).toBe(button2);

      // 2. Shift+Tab -> Button within list item 1 (first button)
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("2. After Shift+Tab: Button within list item 1");
      expect(document.activeElement).toBe(button1);

      // 3. Shift+Tab -> List item 1 (sentinel now focuses item first)
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("3. After Shift+Tab: List item 1");
      expect(document.activeElement).toBe(item1);

      // 4. Shift+Tab -> Before (now exits from list item)
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("4. After Shift+Tab: Before (exited list)");
      expect(document.activeElement).toBe(before);

      // 5. Tab -> List item (re-entering list)
      await user.keyboard("{Tab}");
      console.log("5. After Tab: List item 1");
      expect(document.activeElement).toBe(item1);
    });

    it("Tab from button in item 2 -> after, then Shift+Tab to item 2", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItemBase itemKey="item1">
              <div style={{ padding: "8px" }}>
                <button data-testid="btn-item1">Button within list item 1</button>
              </div>
            </ListItemBase>
            <ListItemBase itemKey="item2">
              <div style={{ padding: "8px" }}>
                <button data-testid="btn-item2">Button within list item 2</button>
              </div>
            </ListItemBase>
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const button2 = screen.getByTestId("btn-item2");
      const after = screen.getByTestId("after");
      const items = screen.getAllByRole("listitem");
      const item2 = items[1];

      console.log("\n=== Test: Forward navigation from button in item 2 ===");

      // 1. Start at Button within list item 2
      button2.focus();
      console.log("1. Focus: Button within list item 2");
      expect(document.activeElement).toBe(button2);

      // 2. Tab -> After
      await user.keyboard("{Tab}");
      console.log("2. After Tab: After");
      expect(document.activeElement).toBe(after);

      // 3. Shift+Tab -> List item 2
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("3. After Shift+Tab: List item 2");
      expect(document.activeElement).toBe(item2);
    });

    it("Click button -> Shift+Tab focuses list item before exiting", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItemBase itemKey="item1">
              <div style={{ padding: "8px" }}>
                <button data-testid="btn-item1">Button within list item</button>
              </div>
            </ListItemBase>
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const button = screen.getByTestId("btn-item1");
      const items = screen.getAllByRole("listitem");
      const item1 = items[0];

      console.log("\n=== FIXED: Click button then Shift+Tab ===");

      // 1. Click the button (direct focus, not via Tab navigation)
      await user.click(button);
      console.log("1. After clicking button, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(button);

      // 2. Shift+Tab -> Should go to list item (via sentinel/forward handler)
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("2. After Shift+Tab, focus:", document.activeElement?.getAttribute("data-item-key"));

      // This should now work correctly:
      expect(document.activeElement).toBe(item1);
    });

    it("Complex flow: click item2 -> tab through buttons -> after -> shift tab back -> should return to item2", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItemBase itemKey="item1">
              <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                <button data-testid="btn-item1-1">Button 1 in item 1</button>
                <button data-testid="btn-item1-2">Button 2 in item 1</button>
              </div>
            </ListItemBase>
            <ListItemBase itemKey="item2">
              <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                <button data-testid="btn-item2-1">Button 1 in item 2</button>
                <button data-testid="btn-item2-2">Button 2 in item 2</button>
              </div>
            </ListItemBase>
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const before = screen.getByTestId("before");
      const after = screen.getByTestId("after");
      const items = screen.getAllByRole("listitem");
      const item1 = items[0];
      const item2 = items[1];
      const btn2_1 = screen.getByTestId("btn-item2-1");
      const btn2_2 = screen.getByTestId("btn-item2-2");

      console.log("\n=== Complex navigation flow test ===");

      // 1. Click list item 2
      await user.click(item2);
      console.log("1. After clicking list item 2, focus:", document.activeElement?.getAttribute("data-item-key"));
      console.log("   Item1 tabIndex:", item1.getAttribute("tabindex"));
      console.log("   Item2 tabIndex:", item2.getAttribute("tabindex"));
      expect(document.activeElement).toBe(item2);

      // 2. Tab -> Button 1 in item 2
      await user.keyboard("{Tab}");
      console.log("2. After Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(btn2_1);

      // 3. Tab -> Button 2 in item 2
      await user.keyboard("{Tab}");
      console.log("3. After Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(btn2_2);

      // 4. Tab -> After (exit list)
      await user.keyboard("{Tab}");
      console.log("4. After Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(after);

      // 5. Shift+Tab -> List item 2 (return to list)
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("5. After Shift+Tab, focus:", document.activeElement?.getAttribute("data-item-key"));
      console.log("   Item1 tabIndex:", item1.getAttribute("tabindex"));
      console.log("   Item2 tabIndex:", item2.getAttribute("tabindex"));
      expect(document.activeElement).toBe(item2);

      // 6. Shift+Tab -> Before (exit list backward)
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("6. After Shift+Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      console.log("   Item1 tabIndex:", item1.getAttribute("tabindex"));
      console.log("   Item2 tabIndex:", item2.getAttribute("tabindex"));
      expect(document.activeElement).toBe(before);

      // 7. Tab -> Should return to list item 2 (the previously focused item)
      //    NOT to button inside first list item
      await user.keyboard("{Tab}");
      console.log("7. After Tab, focus:", document.activeElement?.getAttribute("data-item-key"));
      console.log("   Focused element tag:", document.activeElement?.tagName);
      console.log("   Item1 tabIndex:", item1.getAttribute("tabindex"));
      console.log("   Item2 tabIndex:", item2.getAttribute("tabindex"));
      expect(document.activeElement).toBe(item2);
    });

    it("Arrow Up navigation then Tab", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItem text="Item 1" itemKey="item1" />
            <ListItem text="Item 2" itemKey="item2" />
            <ListItem text="Item 3" itemKey="item3" />
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const before = screen.getByTestId("before");
      const after = screen.getByTestId("after");
      const items = screen.getAllByRole("listitem");
      const item1 = items[0];
      const item2 = items[1];
      const item3 = items[2];

      console.log("\n=== Arrow Up then Tab ===");

      // 1. Tab to first item
      before.focus();
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(item1);

      // 2. Arrow Down to item 3
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      console.log("1. After Arrow Down x2, focus:", document.activeElement?.getAttribute("data-item-key"));
      expect(document.activeElement).toBe(item3);

      // 3. Arrow Up to item 2
      await user.keyboard("{ArrowUp}");
      console.log("2. After Arrow Up, focus:", document.activeElement?.getAttribute("data-item-key"));
      expect(document.activeElement).toBe(item2);

      // 4. Tab -> Should exit list (no interactive children)
      await user.keyboard("{Tab}");
      console.log("3. After Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(after);
    });

    it("Shift+Tab from After through growing button to item", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List
            growing={ListGrowingMode.Button}
            growingButtonText="Load More"
            hasMore={true}
          >
            <ListItem text="Item 1" itemKey="item1" />
            <ListItem text="Item 2" itemKey="item2" />
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const after = screen.getByTestId("after");
      const growingBtn = screen.getByRole("button", { name: /load more/i });
      const items = screen.getAllByRole("listitem");
      const item1 = items[0];

      console.log("\n=== Shift+Tab from After through growing button ===");

      // 1. Start at After
      after.focus();
      expect(document.activeElement).toBe(after);

      // 2. Shift+Tab -> Growing button
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("1. After Shift+Tab, focus:", document.activeElement?.textContent);
      expect(document.activeElement).toBe(growingBtn);

      // 3. Shift+Tab -> First list item (roving tabindex)
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("2. After Shift+Tab, focus:", document.activeElement?.getAttribute("data-item-key"));
      expect(document.activeElement).toBe(item1);
    });

    it("Shift+Tab from After returns to previously focused non-first item", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItem text="Item 1" itemKey="item1" />
            <ListItem text="Item 2" itemKey="item2" />
            <ListItem text="Item 3" itemKey="item3" />
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const after = screen.getByTestId("after");
      const items = screen.getAllByRole("listitem");
      const item1 = items[0];
      const item3 = items[2];

      console.log("\n=== Shift+Tab from After to previously focused item3 ===");

      // 1. Focus item3 via Arrow navigation
      item1.focus();
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      console.log("1. After navigating to item3, focus:", document.activeElement?.getAttribute("data-item-key"));
      expect(document.activeElement).toBe(item3);

      // 2. Tab -> After (exit list)
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(after);

      // 3. Shift+Tab -> Should return to item3 (not item1)
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("2. After Shift+Tab, focus:", document.activeElement?.getAttribute("data-item-key"));
      expect(document.activeElement).toBe(item3);
    });

    it("Home/End keys then Tab", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItem text="Item 1" itemKey="item1" />
            <ListItem text="Item 2" itemKey="item2" />
            <ListItem text="Item 3" itemKey="item3" />
            <ListItem text="Item 4" itemKey="item4" />
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const after = screen.getByTestId("after");
      const items = screen.getAllByRole("listitem");
      const item1 = items[0];
      const item4 = items[3];

      console.log("\n=== Home/End keys then Tab ===");

      // 1. Focus first item
      item1.focus();
      expect(document.activeElement).toBe(item1);

      // 2. End -> Last item
      await user.keyboard("{End}");
      console.log("1. After End, focus:", document.activeElement?.getAttribute("data-item-key"));
      expect(document.activeElement).toBe(item4);

      // 3. Tab -> After (exit list)
      await user.keyboard("{Tab}");
      console.log("2. After Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(after);

      // 4. Shift+Tab -> Item 4 (return to previously focused)
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      expect(document.activeElement).toBe(item4);

      // 5. Home -> First item
      await user.keyboard("{Home}");
      console.log("3. After Home, focus:", document.activeElement?.getAttribute("data-item-key"));
      expect(document.activeElement).toBe(item1);

      // 6. Tab -> After (exit list)
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(after);
    });

    it("Arrow Down skipping items with buttons, then Tab", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItem text="Item 1" itemKey="item1" />
            <ListItemBase itemKey="item2">
              <div style={{ padding: "8px" }}>
                <button data-testid="btn-item2">Button in item 2</button>
              </div>
            </ListItemBase>
            <ListItem text="Item 3" itemKey="item3" />
            <ListItemBase itemKey="item4">
              <div style={{ padding: "8px" }}>
                <button data-testid="btn-item4">Button in item 4</button>
              </div>
            </ListItemBase>
            <ListItem text="Item 5" itemKey="item5" />
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const items = screen.getAllByRole("listitem");
      const item1 = items[0];
      const item4 = items[3];
      const btn4 = screen.getByTestId("btn-item4");
      const after = screen.getByTestId("after");

      console.log("\n=== Arrow Down skipping items ===");

      // 1. Focus item1
      item1.focus();
      expect(document.activeElement).toBe(item1);

      // 2. Arrow Down to item2, then item3, then item4
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      await user.keyboard("{ArrowDown}");
      console.log("1. After Arrow Down x3, focus:", document.activeElement?.getAttribute("data-item-key"));
      expect(document.activeElement).toBe(item4);

      // 3. Tab -> Button in item4
      await user.keyboard("{Tab}");
      console.log("2. After Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(btn4);

      // 4. Tab -> After
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(after);
    });

    it("Tab from header button when list is empty", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List
            header={
              <Button design={ButtonDesign.Primary} data-testid="export-button">
                Export
              </Button>
            }
          >
            {/* Empty list */}
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const before = screen.getByTestId("before");
      const exportBtn = screen.getByTestId("export-button");
      const after = screen.getByTestId("after");

      console.log("\n=== Empty list tab navigation ===");

      // 1. Tab from Before -> Export
      before.focus();
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(exportBtn);

      // 2. Tab -> After (skip empty list)
      await user.keyboard("{Tab}");
      console.log("1. After Tab from Export (empty list), focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(after);

      // 3. Shift+Tab -> Export (back through empty list)
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("2. After Shift+Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(exportBtn);
    });

    it("Disabled items in tab flow", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItem text="Item 1" itemKey="item1" />
            <ListItem text="Item 2 (disabled)" itemKey="item2" disabled />
            <ListItem text="Item 3" itemKey="item3" />
            <ListItemBase itemKey="item4" disabled>
              <div style={{ padding: "8px" }}>
                <button data-testid="btn-item4">Button in disabled item</button>
              </div>
            </ListItemBase>
            <ListItem text="Item 5" itemKey="item5" />
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const before = screen.getByTestId("before");
      const after = screen.getByTestId("after");
      const items = screen.getAllByRole("listitem");
      const item1 = items[0];
      const item3 = items[2];

      console.log("\n=== Disabled items in tab flow ===");

      // 1. Tab from Before -> Item 1
      before.focus();
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(item1);

      // 2. Arrow Down -> Goes to disabled item2 (arrow nav doesn't skip disabled)
      await user.keyboard("{ArrowDown}");
      console.log("1. After Arrow Down, focus:", document.activeElement?.getAttribute("data-item-key"));
      const item2 = items[1];
      expect(document.activeElement).toBe(item2);

      // 3. Arrow Down -> Item 3
      await user.keyboard("{ArrowDown}");
      console.log("2. After Arrow Down again, focus:", document.activeElement?.getAttribute("data-item-key"));
      expect(document.activeElement).toBe(item3);

      // 4. Tab -> After (Tab from disabled item still works)
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(after);
    });

    it("Focus programmatically then Tab", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItem text="Item 1" itemKey="item1" data-testid="item1" />
            <ListItemBase itemKey="item2" data-testid="item2">
              <div style={{ padding: "8px" }}>
                <button data-testid="btn-item2">Button in item 2</button>
              </div>
            </ListItemBase>
            <ListItem text="Item 3" itemKey="item3" />
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const item2 = screen.getByTestId("item2");
      const btn2 = screen.getByTestId("btn-item2");
      const after = screen.getByTestId("after");

      console.log("\n=== Programmatic focus then Tab ===");

      // 1. Programmatically focus item2
      item2.focus();
      console.log("1. After programmatic focus, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(item2);

      // 2. Tab -> Button in item2
      await user.keyboard("{Tab}");
      console.log("2. After Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(btn2);

      // 3. Tab -> After
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(after);
    });

    it("Tab through item with mixed interactive elements", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItemBase itemKey="item1">
              <div style={{ padding: "8px", display: "flex", gap: "8px", flexDirection: "column" }}>
                <input data-testid="input1" type="text" placeholder="Input" />
                <select data-testid="select1">
                  <option>Option 1</option>
                  <option>Option 2</option>
                </select>
                <textarea data-testid="textarea1" placeholder="Textarea" />
                <button data-testid="button1">Button</button>
                <div contentEditable data-testid="contenteditable1">Editable</div>
              </div>
            </ListItemBase>
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const item = screen.getAllByRole("listitem")[0];
      const input = screen.getByTestId("input1");
      const select = screen.getByTestId("select1");
      const textarea = screen.getByTestId("textarea1");
      const button = screen.getByTestId("button1");
      const contenteditable = screen.getByTestId("contenteditable1");
      const after = screen.getByTestId("after");

      console.log("\n=== Tab through mixed interactive elements ===");

      // 1. Focus item
      item.focus();
      expect(document.activeElement).toBe(item);

      // 2. Tab -> Input
      await user.keyboard("{Tab}");
      console.log("1. After Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(input);

      // 3. Tab -> Select
      await user.keyboard("{Tab}");
      console.log("2. After Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(select);

      // 4. Tab -> Textarea
      await user.keyboard("{Tab}");
      console.log("3. After Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(textarea);

      // 5. Tab -> Button
      await user.keyboard("{Tab}");
      console.log("4. After Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(button);

      // 6. Tab -> ContentEditable
      await user.keyboard("{Tab}");
      console.log("5. After Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(contenteditable);

      // 7. Tab -> After (exit list)
      await user.keyboard("{Tab}");
      console.log("6. After Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(after);
    });

    it("Shift+Tab through item with 3+ buttons", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItemBase itemKey="item1">
              <div style={{ padding: "8px", display: "flex", gap: "8px" }}>
                <button data-testid="btn1">Button 1</button>
                <button data-testid="btn2">Button 2</button>
                <button data-testid="btn3">Button 3</button>
                <button data-testid="btn4">Button 4</button>
              </div>
            </ListItemBase>
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const before = screen.getByTestId("before");
      const item = screen.getAllByRole("listitem")[0];
      const btn1 = screen.getByTestId("btn1");
      const btn2 = screen.getByTestId("btn2");
      const btn3 = screen.getByTestId("btn3");
      const btn4 = screen.getByTestId("btn4");

      console.log("\n=== Shift+Tab through 4 buttons ===");

      // 1. Focus btn4 (last button)
      btn4.focus();
      expect(document.activeElement).toBe(btn4);

      // 2. Shift+Tab -> btn3
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("1. After Shift+Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(btn3);

      // 3. Shift+Tab -> btn2
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("2. After Shift+Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(btn2);

      // 4. Shift+Tab -> btn1
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("3. After Shift+Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(btn1);

      // 5. Shift+Tab -> List item
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("4. After Shift+Tab, focus:", document.activeElement?.getAttribute("data-item-key"));
      expect(document.activeElement).toBe(item);

      // 6. Shift+Tab -> Before (exit list)
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("5. After Shift+Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(before);
    });

    it("Tab from header through empty groups to first actual item", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List
            header={
              <Button design={ButtonDesign.Primary} data-testid="header-btn">
                Header Action
              </Button>
            }
          >
            <ListItem text="Item 1" itemKey="item1" data-testid="item1" />
            <ListItem text="Item 2" itemKey="item2" />
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const headerBtn = screen.getByTestId("header-btn");
      const item1 = screen.getByTestId("item1");
      const after = screen.getByTestId("after");

      console.log("\n=== Tab from header to first item ===");

      // 1. Focus header button
      headerBtn.focus();
      expect(document.activeElement).toBe(headerBtn);

      // 2. Tab -> Item 1 (via sentinel redirect)
      await user.keyboard("{Tab}");
      console.log("1. After Tab from header, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(item1);

      // 3. Tab -> After (simple item)
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(after);
    });

    it("PageDown/PageUp then Tab", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            {Array.from({ length: 20 }, (_, i) => (
              <ListItem key={i} text={`Item ${i + 1}`} itemKey={`item${i + 1}`} />
            ))}
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const after = screen.getByTestId("after");
      const items = screen.getAllByRole("listitem");
      const item1 = items[0];

      console.log("\n=== PageDown/PageUp then Tab ===");

      // 1. Focus first item
      item1.focus();
      expect(document.activeElement).toBe(item1);

      // 2. PageDown -> Should move down ~10 items
      await user.keyboard("{PageDown}");
      const focusedAfterPageDown = document.activeElement;
      console.log("1. After PageDown, focus:", focusedAfterPageDown?.getAttribute("data-item-key"));
      expect(focusedAfterPageDown).not.toBe(item1);

      // 3. Tab -> After (exit list)
      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(after);

      // 4. Shift+Tab -> Return to the item that was focused after PageDown
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("2. After Shift+Tab, focus:", document.activeElement?.getAttribute("data-item-key"));
      expect(document.activeElement).toBe(focusedAfterPageDown);
    });

    it("Click button in last item, Tab to After, Shift+Tab returns to last item not button", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List>
            <ListItem text="Item 1" itemKey="item1" />
            <ListItemBase itemKey="item2">
              <div style={{ padding: "8px" }}>
                <button data-testid="btn-item2">Button in item 2</button>
              </div>
            </ListItemBase>
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const button = screen.getByTestId("btn-item2");
      const after = screen.getByTestId("after");
      const items = screen.getAllByRole("listitem");
      const item2 = items[1];

      console.log("\n=== Click button in last item, navigate out and back ===");

      // 1. Click button in last item
      await user.click(button);
      expect(document.activeElement).toBe(button);

      // 2. Tab -> After
      await user.keyboard("{Tab}");
      console.log("1. After Tab, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(after);

      // 3. Shift+Tab -> List item 2 (not button)
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("2. After Shift+Tab, focus:", document.activeElement?.getAttribute("data-item-key"));
      expect(document.activeElement).toBe(item2);
    });

    it("Tab from Before to list with growing button, then Shift+Tab all the way back", async () => {
      const user = userEvent.setup();

      render(
        <div>
          <button data-testid="before">Before</button>
          <List
            growing={ListGrowingMode.Button}
            growingButtonText="Load More"
            hasMore={true}
            header={
              <Button design={ButtonDesign.Primary} data-testid="header-btn">
                Header
              </Button>
            }
          >
            <ListItemBase itemKey="item1">
              <div style={{ padding: "8px" }}>
                <button data-testid="btn1">Button 1</button>
              </div>
            </ListItemBase>
            <ListItem text="Item 2" itemKey="item2" />
          </List>
          <button data-testid="after">After</button>
        </div>
      );

      const before = screen.getByTestId("before");
      const headerBtn = screen.getByTestId("header-btn");
      const item1 = screen.getAllByRole("listitem")[0];
      const btn1 = screen.getByTestId("btn1");
      const growingBtn = screen.getByRole("button", { name: /load more/i });
      const after = screen.getByTestId("after");

      console.log("\n=== Full forward and backward navigation ===");

      // Forward navigation
      before.focus();

      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(headerBtn);

      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(item1);

      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(btn1);

      await user.keyboard("{Tab}");
      expect(document.activeElement).toBe(growingBtn);

      await user.keyboard("{Tab}");
      console.log("1. After Tab x5, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(after);

      // Backward navigation
      await user.keyboard("{Shift>}{Tab}{/Shift}");
      expect(document.activeElement).toBe(growingBtn);

      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("2. After Shift+Tab, focus:", document.activeElement?.getAttribute("data-item-key"));
      expect(document.activeElement).toBe(item1);

      await user.keyboard("{Shift>}{Tab}{/Shift}");
      expect(document.activeElement).toBe(headerBtn);

      await user.keyboard("{Shift>}{Tab}{/Shift}");
      console.log("3. After Shift+Tab x4, focus:", document.activeElement?.getAttribute("data-testid"));
      expect(document.activeElement).toBe(before);
    });
  });
});
