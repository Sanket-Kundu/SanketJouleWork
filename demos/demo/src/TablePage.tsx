import { useState, useRef, useCallback, useMemo } from "react";
import { CodeBlock } from "./components/CodeBlock";
import {
  Table,
  TableHeaderRow,
  TableHeaderCell,
  TableRow,
  TableCell,
  TableSelectionMulti,
  TableSelectionSingle,
  TableGrowing,
  TableToolbar,

  TableRowAction,
  TableRowActionNavigation,
  TableOverflowMode,
  TableGrowingMode,

  TableSelectionBehavior,
  Button,
  Tag,
  TagDesign,
  ToolbarButton,
  ToolbarSpacer,
  ToolbarSeparator,
  Title,
  SearchField,
  NoData,
  IllustrationDesign,
  Link,
  Popover,
  Input,
  Select,
  Option,
  Switch,
  CheckBox,
  RadioButton,
  ActivityItemsIcon,
  ActionSettingsIcon,
  ExcelAttachmentIcon,
  FullScreenIcon,
} from "@sap-ui/fx-components";
import type {
  TableRef,
  TableSelectionMultiRef,
  TableSelectionSingleRef,
  TableSelectionChangeEventDetail,
  TableRowClickEventDetail,
} from "@sap-ui/fx-components";
import {
  Edit,
  Trash2,
  Eye,
} from "lucide-react";

// ============================================================================
// SAMPLE DATA
// ============================================================================

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: "active" | "inactive" | "discontinued";
  rating: number;
}

const generateProducts = (count: number): Product[] => {
  const categories = ["Electronics", "Clothing", "Home & Garden", "Sports", "Books", "Toys"];
  const statuses: Product["status"][] = ["active", "inactive", "discontinued"];
  const adjectives = ["Premium", "Basic", "Pro", "Lite", "Ultra", "Mini", "Max"];
  const nouns = ["Widget", "Gadget", "Device", "Tool", "Kit", "Set", "Pack"];

  return Array.from({ length: count }, (_, i) => ({
    id: `PRD-${String(i + 1).padStart(4, "0")}`,
    name: `${adjectives[i % adjectives.length]} ${nouns[i % nouns.length]} ${i + 1}`,
    category: categories[i % categories.length],
    price: Math.round((Math.random() * 500 + 10) * 100) / 100,
    stock: Math.floor(Math.random() * 1000),
    status: statuses[i % statuses.length],
    rating: Math.round((Math.random() * 4 + 1) * 10) / 10,
  }));
};

const sampleProducts = generateProducts(20);

// ============================================================================
// DEMO SECTIONS
// ============================================================================

// ─── Basic Table ─────────────────────────────────────────────────────────────

function BasicTableDemo() {
  return (
    <Table accessibleName="Products" data-testid="basic-table">
      <TableHeaderRow>
        <TableHeaderCell width="120px">ID</TableHeaderCell>
        <TableHeaderCell minWidth="200px">Product Name</TableHeaderCell>
        <TableHeaderCell width="150px">Category</TableHeaderCell>
        <TableHeaderCell width="100px" horizontalAlign="End">Price</TableHeaderCell>
        <TableHeaderCell width="80px" horizontalAlign="End">Stock</TableHeaderCell>
      </TableHeaderRow>
      {sampleProducts.slice(0, 5).map((p) => (
        <TableRow key={p.id} rowKey={p.id}>
          <TableCell>{p.id}</TableCell>
          <TableCell>{p.name}</TableCell>
          <TableCell>{p.category}</TableCell>
          <TableCell>${p.price.toFixed(2)}</TableCell>
          <TableCell>{p.stock}</TableCell>
        </TableRow>
      ))}
    </Table>
  );
}

const basicTableCode = `<Table accessibleName="Products">
  <TableHeaderRow>
    <TableHeaderCell width="120px">ID</TableHeaderCell>
    <TableHeaderCell minWidth="200px">Product Name</TableHeaderCell>
    <TableHeaderCell width="150px">Category</TableHeaderCell>
    <TableHeaderCell width="100px" horizontalAlign="End">Price</TableHeaderCell>
    <TableHeaderCell width="80px" horizontalAlign="End">Stock</TableHeaderCell>
  </TableHeaderRow>
  {products.map((p) => (
    <TableRow key={p.id} rowKey={p.id}>
      <TableCell>{p.id}</TableCell>
      <TableCell>{p.name}</TableCell>
      <TableCell>{p.category}</TableCell>
      <TableCell>\${p.price.toFixed(2)}</TableCell>
      <TableCell>{p.stock}</TableCell>
    </TableRow>
  ))}
</Table>`;

// ─── Multi Selection ─────────────────────────────────────────────────────────

function MultiSelectionDemo() {
  const [log, setLog] = useState<string[]>([]);
  const selectionRef = useRef<TableSelectionMultiRef>(null);

  const handleChange = useCallback((detail: TableSelectionChangeEventDetail) => {
    setLog((prev) => [
      `Selected: [${[...detail.selectedKeys].join(", ")}]`,
      ...prev.slice(0, 4),
    ]);
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        <Button size="Medium" onClick={() => selectionRef.current?.setSelectedAsSet(new Set(sampleProducts.slice(0, 8).map((p) => p.id)))}>
          Select All
        </Button>
        <Button size="Medium" onClick={() => selectionRef.current?.setSelectedAsSet(new Set())}>
          Deselect All
        </Button>
        <Button size="Medium" onClick={() => selectionRef.current?.setSelected("PRD-0003", true)}>
          Select PRD-0003
        </Button>
        <Button size="Medium" onClick={() => {
          const selected = selectionRef.current?.getSelectedAsSet();
          setLog((prev) => [`getSelectedAsSet(): [${[...(selected ?? [])].join(", ")}]`, ...prev.slice(0, 4)]);
        }}>
          Log Selected
        </Button>
      </div>
      <Table accessibleName="Products with multi-selection">
        <TableSelectionMulti onChange={handleChange} ref={selectionRef} />
        <TableHeaderRow>
          <TableHeaderCell width="120px">ID</TableHeaderCell>
          <TableHeaderCell minWidth="200px">Product Name</TableHeaderCell>
          <TableHeaderCell width="150px">Category</TableHeaderCell>
          <TableHeaderCell width="100px" horizontalAlign="End">Price</TableHeaderCell>
        </TableHeaderRow>
        {sampleProducts.slice(0, 8).map((p) => (
          <TableRow key={p.id} rowKey={p.id}>
            <TableCell>{p.id}</TableCell>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.category}</TableCell>
            <TableCell>${p.price.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </Table>
      {log.length > 0 && (
        <div className="text-xs text-muted-foreground font-mono bg-muted/50 rounded p-2 max-h-24 overflow-auto">
          {log.map((entry, i) => (
            <div key={i}>{entry}</div>
          ))}
        </div>
      )}
    </div>
  );
}

const multiSelectionCode = `const selectionRef = useRef<TableSelectionMultiRef>(null);

{/* Imperative API via ref */}
<Button onClick={() => selectionRef.current?.setSelectedAsSet(new Set(allKeys))}>Select All</Button>
<Button onClick={() => selectionRef.current?.setSelectedAsSet(new Set())}>Deselect All</Button>
<Button onClick={() => selectionRef.current?.setSelected("PRD-0003", true)}>Select PRD-0003</Button>
<Button onClick={() => console.log(selectionRef.current?.getSelectedAsSet())}>Log Selected</Button>

<Table accessibleName="Products with multi-selection">
  <TableSelectionMulti onChange={handleChange} ref={selectionRef} />
  <TableHeaderRow>
    <TableHeaderCell width="120px">ID</TableHeaderCell>
    <TableHeaderCell minWidth="200px">Product Name</TableHeaderCell>
    <TableHeaderCell width="150px">Category</TableHeaderCell>
    <TableHeaderCell width="100px" horizontalAlign="End">Price</TableHeaderCell>
  </TableHeaderRow>
  {products.map((p) => (
    <TableRow key={p.id} rowKey={p.id}>
      <TableCell>{p.id}</TableCell>
      <TableCell>{p.name}</TableCell>
      <TableCell>{p.category}</TableCell>
      <TableCell>\${p.price.toFixed(2)}</TableCell>
    </TableRow>
  ))}
</Table>`;

// ─── Single Selection ────────────────────────────────────────────────────────

function SingleSelectionDemo() {
  const [selectedKey, setSelectedKey] = useState("");
  const selectionRef = useRef<TableSelectionSingleRef>(null);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        <Button size="Medium" onClick={() => setSelectedKey("PRD-0002")}>
          Select PRD-0002
        </Button>
        <Button size="Medium" onClick={() => setSelectedKey("")}>
          Clear Selection
        </Button>
        <Button size="Medium" onClick={() => alert(`isSelected("PRD-0002"): ${selectionRef.current?.isSelected("PRD-0002")}`)}>
          Check PRD-0002
        </Button>
      </div>
      <Table accessibleName="Products with single selection">
        <TableSelectionSingle
          ref={selectionRef}
          selected={selectedKey}
          onChange={(detail) => {
            const keys = [...detail.selectedKeys];
            setSelectedKey(keys[0] ?? "");
          }}
        />
        <TableHeaderRow>
          <TableHeaderCell width="120px">ID</TableHeaderCell>
          <TableHeaderCell minWidth="200px">Product Name</TableHeaderCell>
          <TableHeaderCell width="100px" horizontalAlign="End">Price</TableHeaderCell>
        </TableHeaderRow>
        {sampleProducts.slice(0, 5).map((p) => (
          <TableRow key={p.id} rowKey={p.id}>
            <TableCell>{p.id}</TableCell>
            <TableCell>{p.name}</TableCell>
            <TableCell>${p.price.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </Table>
      {selectedKey && (
        <p className="text-sm text-muted-foreground">Selected: {selectedKey}</p>
      )}
    </div>
  );
}

const singleSelectionCode = `const selectionRef = useRef<TableSelectionSingleRef>(null);
const [selectedKey, setSelectedKey] = useState("");

{/* Controlled selection — update state directly */}
<Button onClick={() => setSelectedKey("PRD-0002")}>Select PRD-0002</Button>
<Button onClick={() => setSelectedKey("")}>Clear Selection</Button>

{/* Read-only ref API */}
<Button onClick={() => alert(selectionRef.current?.isSelected("PRD-0002"))}>Check PRD-0002</Button>

<Table accessibleName="Products with single selection">
  <TableSelectionSingle
    ref={selectionRef}
    selected={selectedKey}
    onChange={(detail) => {
      const keys = [...detail.selectedKeys];
      setSelectedKey(keys[0] ?? "");
    }}
  />
  <TableHeaderRow>
    <TableHeaderCell width="120px">ID</TableHeaderCell>
    <TableHeaderCell minWidth="200px">Product Name</TableHeaderCell>
    <TableHeaderCell width="100px" horizontalAlign="End">Price</TableHeaderCell>
  </TableHeaderRow>
  {products.map((p) => (
    <TableRow key={p.id} rowKey={p.id}>
      <TableCell>{p.id}</TableCell>
      <TableCell>{p.name}</TableCell>
      <TableCell>\${p.price.toFixed(2)}</TableCell>
    </TableRow>
  ))}
</Table>`;

// ─── RowOnly Selection ───────────────────────────────────────────────────────

function RowOnlySelectionDemo() {
  const [log, setLog] = useState<string[]>([]);

  const handleChange = useCallback((detail: TableSelectionChangeEventDetail) => {
    setLog((prev) => [
      `Selected: [${[...detail.selectedKeys].join(", ")}]`,
      ...prev.slice(0, 4),
    ]);
  }, []);

  return (
    <div className="space-y-3">
      <Table accessibleName="Products with row-only selection">
        <TableSelectionMulti behavior={TableSelectionBehavior.RowOnly} onChange={handleChange} />
        <TableHeaderRow>
          <TableHeaderCell width="120px">ID</TableHeaderCell>
          <TableHeaderCell minWidth="200px">Product Name</TableHeaderCell>
          <TableHeaderCell width="100px" horizontalAlign="End">Price</TableHeaderCell>
        </TableHeaderRow>
        {sampleProducts.slice(0, 5).map((p) => (
          <TableRow key={p.id} rowKey={p.id}>
            <TableCell>{p.id}</TableCell>
            <TableCell>{p.name}</TableCell>
            <TableCell>${p.price.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </Table>
      {log.length > 0 && (
        <div className="text-xs text-muted-foreground font-mono bg-muted/50 rounded p-2 max-h-24 overflow-auto">
          {log.map((entry, i) => (
            <div key={i}>{entry}</div>
          ))}
        </div>
      )}
    </div>
  );
}

const rowOnlySelectionCode = `<Table accessibleName="Products with row-only selection">
  <TableSelectionMulti behavior={TableSelectionBehavior.RowOnly} onChange={handleChange} />
  <TableHeaderRow>
    <TableHeaderCell width="120px">ID</TableHeaderCell>
    <TableHeaderCell minWidth="200px">Product Name</TableHeaderCell>
    <TableHeaderCell width="100px" horizontalAlign="End">Price</TableHeaderCell>
  </TableHeaderRow>
  {products.map((p) => (
    <TableRow key={p.id} rowKey={p.id}>
      <TableCell>{p.id}</TableCell>
      <TableCell>{p.name}</TableCell>
      <TableCell>\${p.price.toFixed(2)}</TableCell>
    </TableRow>
  ))}
</Table>`;

// ─── Row Actions ─────────────────────────────────────────────────────────────

function RowActionsDemo() {
  const [log, setLog] = useState<string[]>([]);

  return (
    <div className="space-y-3">
      <Table accessibleName="Products with actions" rowActionCount={3} overflowMode="Scroll">
        <TableSelectionMulti />
        <TableHeaderRow>
          <TableHeaderCell width="120px">ID</TableHeaderCell>
          <TableHeaderCell minWidth="200px">Product Name</TableHeaderCell>
          <TableHeaderCell width="100px" horizontalAlign="End">Price</TableHeaderCell>
        </TableHeaderRow>
        {sampleProducts.slice(0, 5).map((p) => (
          <TableRow key={p.id} rowKey={p.id} interactive>
            <TableCell>{p.id}</TableCell>
            <TableCell>{p.name}</TableCell>
            <TableCell>${p.price.toFixed(2)}</TableCell>
            <TableRowActionNavigation onClick={() => setLog((prev) => [`Navigate: ${p.id}`, ...prev.slice(0, 4)])} />
            <TableRowAction icon={<Eye className="h-4 w-4" />} text="View" onClick={() => setLog((prev) => [`View: ${p.id}`, ...prev.slice(0, 4)])} />
            <TableRowAction icon={<Edit className="h-4 w-4" />} text="Edit" onClick={() => setLog((prev) => [`Edit: ${p.id}`, ...prev.slice(0, 4)])} />
            <TableRowAction icon={<Trash2 className="h-4 w-4" />} text="Delete" onClick={() => setLog((prev) => [`Delete: ${p.id}`, ...prev.slice(0, 4)])} />
          </TableRow>
        ))}
      </Table>
      {log.length > 0 && (
        <div className="text-xs text-muted-foreground font-mono bg-muted/50 rounded p-2 max-h-24 overflow-auto">
          {log.map((entry, i) => (
            <div key={i}>{entry}</div>
          ))}
        </div>
      )}
    </div>
  );
}

const rowActionsCode = `<Table accessibleName="Products with actions" rowActionCount={3} overflowMode="Scroll">
  <TableSelectionMulti />
  <TableHeaderRow>
    <TableHeaderCell width="120px">ID</TableHeaderCell>
    <TableHeaderCell minWidth="200px">Product Name</TableHeaderCell>
    <TableHeaderCell width="100px" horizontalAlign="End">Price</TableHeaderCell>
  </TableHeaderRow>
  {products.map((p) => (
    <TableRow key={p.id} rowKey={p.id} interactive>
      <TableCell>{p.id}</TableCell>
      <TableCell>{p.name}</TableCell>
      <TableCell>\${p.price.toFixed(2)}</TableCell>
      <TableRowActionNavigation onClick={() => handleNav(p.id)} />
      <TableRowAction icon={<Eye />} text="View" onClick={() => handleView(p.id)} />
      <TableRowAction icon={<Edit />} text="Edit" onClick={() => handleEdit(p.id)} />
      <TableRowAction icon={<Trash2 />} text="Delete" onClick={() => handleDelete(p.id)} />
    </TableRow>
  ))}
</Table>`;

// ─── Interactive Rows ────────────────────────────────────────────────────────

function InteractiveRowsDemo() {
  const [clickedRow, setClickedRow] = useState<string | null>(null);
  const [navigatedRow, setNavigatedRow] = useState<string | null>(sampleProducts[1]?.id ?? null);

  const handleRowClick = useCallback((detail: TableRowClickEventDetail) => {
    setClickedRow(detail.rowKey);
    setNavigatedRow(detail.rowKey);
  }, []);

  return (
    <div className="space-y-3">
      <Table accessibleName="Interactive products" onRowClick={handleRowClick} rowActionCount={1}>
        <TableHeaderRow>
          <TableHeaderCell width="120px">ID</TableHeaderCell>
          <TableHeaderCell minWidth="200px">Product Name</TableHeaderCell>
          <TableHeaderCell width="100px" horizontalAlign="End" importance={0} popinText="Price">Price</TableHeaderCell>
        </TableHeaderRow>
        {sampleProducts.slice(0, 5).map((p) => (
          <TableRow key={p.id} rowKey={p.id} interactive navigated={navigatedRow === p.id}>
            <TableCell>{p.id}</TableCell>
            <TableCell>{p.name}</TableCell>
            <TableCell>${p.price.toFixed(2)}</TableCell>
            <TableRowAction icon={<Edit className="h-4 w-4" />} text="Edit" onClick={() => setClickedRow(p.id)} />
          </TableRow>
        ))}
      </Table>
      {clickedRow && (
        <p className="text-sm text-muted-foreground">Last clicked: {clickedRow}</p>
      )}
    </div>
  );
}

const interactiveRowsCode = `<Table accessibleName="Interactive products" onRowClick={handleRowClick} rowActionCount={1}>
  <TableHeaderRow>
    <TableHeaderCell width="120px">ID</TableHeaderCell>
    <TableHeaderCell minWidth="200px">Product Name</TableHeaderCell>
    <TableHeaderCell width="100px" horizontalAlign="End" importance={0} popinText="Price">Price</TableHeaderCell>
  </TableHeaderRow>
  {products.map((p) => (
    <TableRow key={p.id} rowKey={p.id} interactive navigated={navigatedRow === p.id}>
      <TableCell>{p.id}</TableCell>
      <TableCell>{p.name}</TableCell>
      <TableCell>\${p.price.toFixed(2)}</TableCell>
      <TableRowAction icon={<Edit />} text="Edit" onClick={() => handleEdit(p.id)} />
    </TableRow>
  ))}
</Table>`;

// ─── Growing (Button) ────────────────────────────────────────────────────────

function GrowingButtonDemo() {
  const allProducts = useMemo(() => generateProducts(24), []);
  const [visibleCount, setVisibleCount] = useState(5);

  const handleLoadMore = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 800));
    setVisibleCount((prev) => Math.min(prev + 5, allProducts.length));
  }, [allProducts.length]);

  const allLoaded = visibleCount >= allProducts.length;

  return (
    <Table accessibleName="Growing table (button)">
      {!allLoaded && (
        <TableGrowing
          mode={TableGrowingMode.Button}
          text="Load More"
          subtext={`${visibleCount} of ${allProducts.length}`}
          onLoadMore={handleLoadMore}
        />
      )}
      <TableHeaderRow>
        <TableHeaderCell width="120px">ID</TableHeaderCell>
        <TableHeaderCell minWidth="200px">Product Name</TableHeaderCell>
        <TableHeaderCell width="150px">Category</TableHeaderCell>
        <TableHeaderCell width="100px" horizontalAlign="End">Price</TableHeaderCell>
      </TableHeaderRow>
      {allProducts.slice(0, visibleCount).map((p) => (
        <TableRow key={p.id} rowKey={p.id}>
          <TableCell>{p.id}</TableCell>
          <TableCell>{p.name}</TableCell>
          <TableCell>{p.category}</TableCell>
          <TableCell>${p.price.toFixed(2)}</TableCell>
        </TableRow>
      ))}
    </Table>
  );
}

const growingButtonCode = `const allLoaded = visibleCount >= allProducts.length;

<Table accessibleName="Growing table (button)">
  {!allLoaded && (
    <TableGrowing
      mode={TableGrowingMode.Button}
      text="Load More"
      subtext={\`\${visibleCount} of \${total}\`}
      onLoadMore={handleLoadMore}
    />
  )}
  <TableHeaderRow>
    <TableHeaderCell width="120px">ID</TableHeaderCell>
    <TableHeaderCell minWidth="200px">Product Name</TableHeaderCell>
    <TableHeaderCell width="150px">Category</TableHeaderCell>
    <TableHeaderCell width="100px" horizontalAlign="End">Price</TableHeaderCell>
  </TableHeaderRow>
  {products.slice(0, visibleCount).map((p) => (
    <TableRow key={p.id} rowKey={p.id}>
      <TableCell>{p.id}</TableCell>
      <TableCell>{p.name}</TableCell>
      <TableCell>{p.category}</TableCell>
      <TableCell>\${p.price.toFixed(2)}</TableCell>
    </TableRow>
  ))}
</Table>`;

// ─── Growing (Scroll) ────────────────────────────────────────────────────────

function GrowingScrollDemo() {
  const allProducts = useMemo(() => generateProducts(24), []);
  const [visibleCount, setVisibleCount] = useState(5);

  const handleLoadMore = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 500));
    setVisibleCount((prev) => Math.min(prev + 5, allProducts.length));
  }, [allProducts.length]);

  const allLoaded = visibleCount >= allProducts.length;

  return (
    <Table accessibleName="Growing table (scroll)" overflowMode="Scroll" scrollHeight="250px">
      {!allLoaded && (
        <TableGrowing mode={TableGrowingMode.Scroll} onLoadMore={handleLoadMore} />
      )}
      <TableToolbar>
        <Title level="H4">Products</Title>
      </TableToolbar>
      <TableHeaderRow sticky>
        <TableHeaderCell width="120px">ID</TableHeaderCell>
        <TableHeaderCell minWidth="200px">Product Name</TableHeaderCell>
        <TableHeaderCell width="150px">Category</TableHeaderCell>
        <TableHeaderCell width="100px" horizontalAlign="End">Price</TableHeaderCell>
      </TableHeaderRow>
      {allProducts.slice(0, visibleCount).map((p) => (
        <TableRow key={p.id} rowKey={p.id}>
          <TableCell>{p.id}</TableCell>
          <TableCell>{p.name}</TableCell>
          <TableCell>{p.category}</TableCell>
          <TableCell>${p.price.toFixed(2)}</TableCell>
        </TableRow>
      ))}
    </Table>
  );
}

const growingScrollCode = `const allLoaded = visibleCount >= allProducts.length;

<Table accessibleName="Growing table (scroll)" overflowMode="Scroll" scrollHeight="250px">
  {!allLoaded && (
    <TableGrowing mode={TableGrowingMode.Scroll} onLoadMore={handleLoadMore} />
  )}
  <TableToolbar>
    <Title level="H4">Products</Title>
  </TableToolbar>
  <TableHeaderRow sticky>
    <TableHeaderCell width="120px">ID</TableHeaderCell>
    <TableHeaderCell minWidth="200px">Product Name</TableHeaderCell>
    <TableHeaderCell width="150px">Category</TableHeaderCell>
    <TableHeaderCell width="100px" horizontalAlign="End">Price</TableHeaderCell>
  </TableHeaderRow>
  {products.slice(0, visibleCount).map((p) => (
    <TableRow key={p.id} rowKey={p.id}>
      <TableCell>{p.id}</TableCell>
      <TableCell>{p.name}</TableCell>
      <TableCell>{p.category}</TableCell>
      <TableCell>\${p.price.toFixed(2)}</TableCell>
    </TableRow>
  ))}
</Table>`;

// ─── Popin ───────────────────────────────────────────────────────────────────

function PopinDemo() {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        Resize the browser window to see columns collapse into popin sub-rows.
      </p>
      <Table accessibleName="Responsive products" overflowMode={TableOverflowMode.Popin} rowActionCount={1}>
        <TableSelectionMulti />
        <TableHeaderRow>
          <TableHeaderCell width="120px" importance={6}>ID</TableHeaderCell>
          <TableHeaderCell minWidth="200px" importance={5} popinText="Product">Product Name</TableHeaderCell>
          <TableHeaderCell width="150px" importance={3} popinText="Category">Category</TableHeaderCell>
          <TableHeaderCell width="100px" importance={4} horizontalAlign="End" popinText="Price">Price</TableHeaderCell>
          <TableHeaderCell width="80px" importance={2} horizontalAlign="End" popinText="Stock">Stock</TableHeaderCell>
          <TableHeaderCell width="80px" importance={1} horizontalAlign="End" popinText="Rating">Rating</TableHeaderCell>
        </TableHeaderRow>
        {sampleProducts.slice(0, 8).map((p) => (
          <TableRow key={p.id} rowKey={p.id} interactive>
            <TableCell>{p.id}</TableCell>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.category}</TableCell>
            <TableCell>${p.price.toFixed(2)}</TableCell>
            <TableCell>{p.stock}</TableCell>
            <TableCell>{p.rating}</TableCell>
            <TableRowActionNavigation />
          </TableRow>
        ))}
      </Table>
    </div>
  );
}

const popinCode = `<Table accessibleName="Responsive products" overflowMode={TableOverflowMode.Popin} rowActionCount={1}>
  <TableSelectionMulti />
  <TableHeaderRow>
    <TableHeaderCell width="120px" importance={6}>ID</TableHeaderCell>
    <TableHeaderCell minWidth="200px" importance={5} popinText="Product">Product Name</TableHeaderCell>
    <TableHeaderCell width="150px" importance={3} popinText="Category">Category</TableHeaderCell>
    <TableHeaderCell width="100px" importance={4} horizontalAlign="End" popinText="Price">Price</TableHeaderCell>
    <TableHeaderCell width="80px" importance={2} horizontalAlign="End" popinText="Stock">Stock</TableHeaderCell>
    <TableHeaderCell width="80px" importance={1} horizontalAlign="End" popinText="Rating">Rating</TableHeaderCell>
  </TableHeaderRow>
  {products.map((p) => (
    <TableRow key={p.id} rowKey={p.id} interactive>
      <TableCell>{p.id}</TableCell>
      <TableCell>{p.name}</TableCell>
      <TableCell>{p.category}</TableCell>
      <TableCell>\${p.price.toFixed(2)}</TableCell>
      <TableCell>{p.stock}</TableCell>
      <TableCell>{p.rating}</TableCell>
      <TableRowActionNavigation />
    </TableRow>
  ))}
</Table>`;

// ─── Loading / Empty ─────────────────────────────────────────────────────────

function LoadingEmptyDemo() {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmpty, setShowEmpty] = useState(false);
  const [showIllustration, setShowIllustration] = useState(false);
  const tableRef = useRef<TableRef>(null);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        <Button size="Medium" onClick={() => { setIsLoading(true); setShowEmpty(false); setShowIllustration(false); setTimeout(() => setIsLoading(false), 4000); }}>
          Toggle Loading (4s)
        </Button>
        <Button size="Medium" onClick={() => { setShowEmpty(!showEmpty); setShowIllustration(false); setIsLoading(false); }}>
          Toggle Empty
        </Button>
        <Button size="Medium" onClick={() => { setShowIllustration(!showIllustration); setShowEmpty(false); setIsLoading(false); }}>
          Toggle Empty (Illustration)
        </Button>
        <Button size="Medium" onClick={() => { tableRef.current?.focus(); }}>
          Focus Table
        </Button>
      </div>
      <Table
        ref={tableRef}
        accessibleName="Loading and empty states"
        loading={isLoading}
        loadingDelay={300}
        noDataText={showEmpty ? "No products found. Try adjusting your filters." : undefined}
        noData={showIllustration ? (
          <NoData
            design={IllustrationDesign.ExtraSmall}
            titleText="No Products Available"
            subtitleText="There are no products to display. Try adjusting your search or filters."
          />
        ) : undefined}
      >
        <TableHeaderRow>
          <TableHeaderCell width="120px">ID</TableHeaderCell>
          <TableHeaderCell minWidth="200px">Product Name</TableHeaderCell>
          <TableHeaderCell width="100px" horizontalAlign="End">Price</TableHeaderCell>
        </TableHeaderRow>
        {!showEmpty && !showIllustration && sampleProducts.slice(0, 3).map((p) => (
          <TableRow key={p.id} rowKey={p.id}>
            <TableCell>{p.id}</TableCell>
            <TableCell>{p.name}</TableCell>
            <TableCell>${p.price.toFixed(2)}</TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  );
}

const loadingEmptyCode = `{/* Simple text empty state */}
<Table
  accessibleName="Loading and empty states"
  loading={isLoading}
  loadingDelay={300}
  noDataText="No products found. Try adjusting your filters."
>
  <TableHeaderRow>...</TableHeaderRow>
  {data.map((p) => (
    <TableRow key={p.id} rowKey={p.id}>...</TableRow>
  ))}
</Table>

{/* Empty state with Illustration via noData slot */}
<Table
  accessibleName="Empty table with illustration"
  noData={
    <NoData
      design={IllustrationDesign.ExtraSmall}
      titleText="No Products Available"
      subtitleText="There are no products to display."
    />
  }
>
  <TableHeaderRow>...</TableHeaderRow>
</Table>`;

// ─── Alternate Row Colors ────────────────────────────────────────────────────

function AlternateRowColorsDemo() {
  return (
    <Table accessibleName="Striped table" alternateRowColors>
      <TableSelectionMulti />
      <TableHeaderRow>
        <TableHeaderCell width="120px">ID</TableHeaderCell>
        <TableHeaderCell minWidth="200px" importance={1}>Product Name</TableHeaderCell>
        <TableHeaderCell width="150px" popinText="Category">Category</TableHeaderCell>
        <TableHeaderCell width="100px" horizontalAlign="End" importance={0} popinText="Price">Price</TableHeaderCell>
      </TableHeaderRow>
      {sampleProducts.slice(0, 8).map((p) => (
        <TableRow key={p.id} rowKey={p.id} interactive>
          <TableCell>{p.id}</TableCell>
          <TableCell>{p.name}</TableCell>
          <TableCell>{p.category}</TableCell>
          <TableCell>${p.price.toFixed(2)}</TableCell>
        </TableRow>
      ))}
    </Table>
  );
}

const alternateRowColorsCode = `<Table accessibleName="Striped table" alternateRowColors>
  <TableSelectionMulti />
  <TableHeaderRow>
    <TableHeaderCell width="120px">ID</TableHeaderCell>
    <TableHeaderCell minWidth="200px" importance={1}>Product Name</TableHeaderCell>
    <TableHeaderCell width="150px" popinText="Category">Category</TableHeaderCell>
    <TableHeaderCell width="100px" horizontalAlign="End" importance={0} popinText="Price">Price</TableHeaderCell>
  </TableHeaderRow>
  {products.map((p) => (
    <TableRow key={p.id} rowKey={p.id} interactive>
      <TableCell>{p.id}</TableCell>
      <TableCell>{p.name}</TableCell>
      <TableCell>{p.category}</TableCell>
      <TableCell>\${p.price.toFixed(2)}</TableCell>
    </TableRow>
  ))}
</Table>`;

// ─── Combined Features ───────────────────────────────────────────────────────

const statusTagDesign: Record<Product["status"], TagDesign> = {
  active: TagDesign.Positive,
  inactive: TagDesign.None,
  discontinued: TagDesign.Negative,
};

function CombinedFeaturesDemo() {
  const tableRef = useRef<TableRef>(null);
  const [allProducts, setAllProducts] = useState(() => generateProducts(24));
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [navigatedRow, setNavigatedRow] = useState<string | null>(allProducts[0]?.id ?? null);
  // Delete confirmation popover state
  const [deleteRowKey, setDeleteRowKey] = useState<string | null>(null);
  const [deleteOpener, setDeleteOpener] = useState<HTMLElement | null>(null);

  const filtered = useMemo(
    () => searchQuery
      ? allProducts.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
      : allProducts,
    [allProducts, searchQuery],
  );

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setVisibleCount(5);
  }, []);

  const filteredLengthRef = useRef(filtered.length);
  filteredLengthRef.current = filtered.length;

  const handleLoadMore = useCallback(async () => {
    await new Promise((r) => setTimeout(r, 500));
    setVisibleCount((prev) => Math.min(prev + 5, filteredLengthRef.current));
  }, []);

  const handleDeleteClick = useCallback((rowKey: string) => {
    setDeleteRowKey(rowKey);
    setDeleteOpener(document.activeElement as HTMLElement);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (!deleteRowKey) return;
    const rowKeyToDelete = deleteRowKey;
    setDeleteRowKey(null);
    setDeleteOpener(null);
    setIsLoading(true);

    setTimeout(() => {
      setAllProducts((prev) => prev.filter((p) => p.id !== rowKeyToDelete));
      setIsLoading(false);
      // After React re-renders with the row removed, focus the table
      requestAnimationFrame(() => {
        tableRef.current?.focus();
      });
    }, 1000);
  }, [deleteRowKey]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteRowKey(null);
    setDeleteOpener(null);
  }, []);

  const handleNavigate = useCallback((rowKey: string) => {
    setNavigatedRow(rowKey);
  }, []);

  return (
    <div>
      <Table
        ref={tableRef}
        accessibleNameRef="combined-table-title"
        rowActionCount={2}
        loading={isLoading}
        loadingDelay={0}
        stickyTop="-32px"
        onRowClick={(detail) => handleNavigate(detail.rowKey)}
        noData={
          <NoData
            design={IllustrationDesign.ExtraSmall}
            titleText="No Orders Found"
            subtitleText="Try adjusting your search criteria."
          />
        }
      >
        <TableToolbar sticky>
          <Title id="combined-table-title" level="H4" wrappingType="None">Sales Orders ({filtered.length})</Title>
          <ToolbarSpacer />
          <SearchField placeholder="Search" value={searchQuery} onInput={handleSearch} showClearIcon size="Medium" style={{ width: "200px" }} />
          <ToolbarButton text="Create" design="SecondaryNeutral" />
          <ToolbarButton text="Delete" design="SecondaryNeutral" />
          <ToolbarSeparator />
          <ToolbarButton icon={<ActivityItemsIcon />} design="SecondaryNeutral" tooltip="Activity Items" />
          <ToolbarButton icon={<ActionSettingsIcon />} design="SecondaryNeutral" tooltip="Settings" />
          <ToolbarButton icon={<ExcelAttachmentIcon />} design="SecondaryNeutral" tooltip="Export to Excel" />
          <ToolbarButton icon={<FullScreenIcon />} design="SecondaryNeutral" tooltip="Full Screen" />
        </TableToolbar>
        <TableSelectionMulti />
        {visibleCount < filtered.length && (
          <TableGrowing
            mode={TableGrowingMode.Button}
            text="Load more"
            subtext={`Showing ${Math.min(visibleCount, filtered.length)} of ${filtered.length} sales orders`}
            onLoadMore={handleLoadMore}
          />
        )}
        <TableHeaderRow sticky>
          <TableHeaderCell width="120px" importance={6} sortIndicator="Ascending">ID</TableHeaderCell>
          <TableHeaderCell minWidth="200px" importance={5}>Product Name</TableHeaderCell>
          <TableHeaderCell width="150px" importance={3}>Category</TableHeaderCell>
          <TableHeaderCell width="100px" importance={4} horizontalAlign="End">Price</TableHeaderCell>
          <TableHeaderCell width="120px" importance={2}>Status</TableHeaderCell>
        </TableHeaderRow>
        {filtered.slice(0, visibleCount).map((p) => (
          <TableRow key={p.id} rowKey={p.id} interactive navigated={navigatedRow === p.id}>
            <TableCell rowHeader><Link onClick={() => handleNavigate(p.id)}>{p.id}</Link></TableCell>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.category}</TableCell>
            <TableCell>${p.price.toFixed(2)}</TableCell>
            <TableCell>
              <Tag design={statusTagDesign[p.status]}>{p.status}</Tag>
            </TableCell>
            <TableRowAction icon={<Edit className="h-4 w-4" />} text="Edit" />
            <TableRowAction icon={<Trash2 className="h-4 w-4" />} text="Delete" onClick={() => handleDeleteClick(p.id)} />
          </TableRow>
        ))}
      </Table>

      <Popover
        open={deleteRowKey !== null}
        opener={deleteOpener}
        onClose={handleDeleteCancel}
        headerText="Confirm Deletion"
        placement="Top"
      >
        <div className="p-4 space-y-4">
          <p className="text-sm text-secondary-foreground">Are you sure you want to delete this row?</p>
          <div className="flex justify-end gap-2">
            <Button design="Tertiary" onClick={handleDeleteCancel}>Cancel</Button>
            <Button design="Primary" onClick={handleDeleteConfirm}>Delete</Button>
          </div>
        </div>
      </Popover>
    </div>
  );
}

const combinedFeaturesCode = `const [navigatedRow, setNavigatedRow] = useState<string | null>(products[0]?.id ?? null);

const handleNavigate = useCallback((rowKey: string) => {
  setNavigatedRow(rowKey);
}, []);

<Table
  accessibleNameRef="table-title"
  rowActionCount={2}
  loading={isLoading}
  loadingDelay={0}
  stickyTop="-32px"
  onRowClick={(detail) => handleNavigate(detail.rowKey)}
  noData={
    <NoData
      design={IllustrationDesign.ExtraSmall}
      titleText="No Orders Found"
      subtitleText="Try adjusting your search criteria."
    />
  }
>
  <TableToolbar sticky>
    <Title id="table-title" level="H4" wrappingType="None">Sales Orders ({filtered.length})</Title>
    <ToolbarSpacer />
    <SearchField placeholder="Search" value={searchQuery} onInput={handleSearch} showClearIcon size="Medium" style={{ width: "200px" }} />
    <ToolbarButton text="Create" design="SecondaryNeutral" />
    <ToolbarButton text="Delete" design="SecondaryNeutral" />
    <ToolbarSeparator />
    <ToolbarButton icon={<ActivityItemsIcon />} design="SecondaryNeutral" tooltip="Activity Items" />
    <ToolbarButton icon={<ActionSettingsIcon />} design="SecondaryNeutral" tooltip="Settings" />
    <ToolbarButton icon={<ExcelAttachmentIcon />} design="SecondaryNeutral" tooltip="Export to Excel" />
    <ToolbarButton icon={<FullScreenIcon />} design="SecondaryNeutral" tooltip="Full Screen" />
  </TableToolbar>
  <TableSelectionMulti />
  {visibleCount < filtered.length && (
    <TableGrowing
      mode={TableGrowingMode.Button}
      text="Load more"
      subtext={\`Showing \${visibleCount} of \${filtered.length} sales orders\`}
      onLoadMore={handleLoadMore}
    />
  )}
  <TableHeaderRow sticky>
    <TableHeaderCell width="120px" importance={6} sortIndicator="Ascending">ID</TableHeaderCell>
    <TableHeaderCell minWidth="200px" importance={5}>Product Name</TableHeaderCell>
    <TableHeaderCell width="150px" importance={3}>Category</TableHeaderCell>
    <TableHeaderCell width="100px" importance={4} horizontalAlign="End">Price</TableHeaderCell>
    <TableHeaderCell width="120px" importance={2}>Status</TableHeaderCell>
  </TableHeaderRow>
  {filtered.slice(0, visibleCount).map((p) => (
    <TableRow key={p.id} rowKey={p.id} interactive navigated={navigatedRow === p.id}>
      <TableCell rowHeader><Link onClick={() => handleNavigate(p.id)}>{p.id}</Link></TableCell>
      <TableCell>{p.name}</TableCell>
      <TableCell>{p.category}</TableCell>
      <TableCell>\${p.price.toFixed(2)}</TableCell>
      <TableCell>
        <Tag design={statusTagDesign[p.status]}>{p.status}</Tag>
      </TableCell>
      <TableRowAction icon={<Edit />} text="Edit" />
      <TableRowAction icon={<Trash2 />} text="Delete" />
    </TableRow>
  ))}
</Table>`;

// ─── Editable Fields ────────────────────────────────────────────────────────

interface EditableProduct {
  id: string;
  name: string;
  priority: "high" | "low";
  category: string;
  price: number;
  active: boolean;
  approved: boolean;
}

const initialEditableProducts: EditableProduct[] = [
  { id: "PRD-0001", name: "Premium Widget", priority: "high", category: "Electronics", price: 120, active: true, approved: true },
  { id: "PRD-0002", name: "Basic Gadget", priority: "low", category: "Clothing", price: 45, active: false, approved: false },
  { id: "PRD-0003", name: "Pro Device", priority: "high", category: "Home", price: 300, active: true, approved: true },
  { id: "PRD-0004", name: "Lite Tool", priority: "low", category: "Sports", price: 80, active: true, approved: false },
  { id: "PRD-0005", name: "Ultra Kit", priority: "high", category: "Books", price: 210, active: false, approved: true },
];

function EditableFieldsDemo() {
  const [products, setProducts] = useState(initialEditableProducts);

  const update = useCallback((id: string, patch: Partial<EditableProduct>) => {
    setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  }, []);

  return (
    <Table accessibleName="Editable products" overflowMode="Scroll">
      <TableSelectionMulti />
      <TableHeaderRow>
        <TableHeaderCell width="100px">ID</TableHeaderCell>
        <TableHeaderCell minWidth="180px">Name</TableHeaderCell>
        <TableHeaderCell width="120px">Priority</TableHeaderCell>
        <TableHeaderCell width="150px">Category</TableHeaderCell>
        <TableHeaderCell width="120px">Price</TableHeaderCell>
        <TableHeaderCell width="90px" horizontalAlign="End">Active</TableHeaderCell>
        <TableHeaderCell width="90px" horizontalAlign="Center">Approved</TableHeaderCell>
        <TableHeaderCell width="100px" horizontalAlign="End">Action</TableHeaderCell>
      </TableHeaderRow>
      {products.map((p) => (
        <TableRow key={p.id} rowKey={p.id}>
          <TableCell rowHeader><Link href="#" onClick={(e) => e.originalEvent.preventDefault()}>{p.id}</Link></TableCell>
          <TableCell>
            <Input
              value={p.name}
              onInput={(val) => update(p.id, { name: val })}
              size="Small"
              accessibleName="Product name"
            />
          </TableCell>
          <TableCell>
            <div className="flex items-center gap-3">
              <RadioButton
                checked={p.priority === "high"}
                onChange={() => update(p.id, { priority: "high" })}
                name={`${p.id}-priority`}
                accessibleName="High"
                size="Small"
              />
              <RadioButton
                checked={p.priority === "low"}
                onChange={() => update(p.id, { priority: "low" })}
                name={`${p.id}-priority`}
                accessibleName="Low"
                size="Small"
              />
            </div>
          </TableCell>
          <TableCell>
            <Select
              value={p.category}
              onChange={(detail) => update(p.id, { category: detail.selectedOption?.value ?? p.category })}
              size="Medium"
              accessibleName="Category"
            >
              <Option value="Electronics">Electronics</Option>
              <Option value="Clothing">Clothing</Option>
              <Option value="Home">Home</Option>
              <Option value="Sports">Sports</Option>
              <Option value="Books">Books</Option>
            </Select>
          </TableCell>
          <TableCell>
            <Input
              value={String(p.price)}
              onInput={(val) => update(p.id, { price: Number(val) || 0 })}
              size="Small"
              accessibleName="Price"
            />
          </TableCell>
          <TableCell>
            <Switch
              checked={p.active}
              onChange={(detail) => update(p.id, { active: detail.checked })}
              accessibleName="Active"
            />
          </TableCell>
          <TableCell>
            <CheckBox
              checked={p.approved}
              onChange={(detail) => update(p.id, { approved: detail.checked })}
              accessibleName="Approved"
            />
          </TableCell>
          <TableCell>
            <Button size="Small" design="Secondary" onClick={() => alert("five")}>Alert</Button>
          </TableCell>
        </TableRow>
      ))}
    </Table>
  );
}

const editableFieldsCode = `const [products, setProducts] = useState(initialProducts);

const update = (id: string, patch: Partial<Product>) => {
  setProducts((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p)));
};

<Table accessibleName="Editable products" overflowMode="Scroll">
  <TableSelectionMulti />
  <TableHeaderRow>
    <TableHeaderCell width="100px">ID</TableHeaderCell>
    <TableHeaderCell minWidth="180px">Name</TableHeaderCell>
    <TableHeaderCell width="120px">Priority</TableHeaderCell>
    <TableHeaderCell width="150px">Category</TableHeaderCell>
    <TableHeaderCell width="120px">Price</TableHeaderCell>
    <TableHeaderCell width="90px" horizontalAlign="End">Active</TableHeaderCell>
    <TableHeaderCell width="90px" horizontalAlign="Center">Approved</TableHeaderCell>
    <TableHeaderCell width="100px" horizontalAlign="End">Action</TableHeaderCell>
  </TableHeaderRow>
  {products.map((p) => (
    <TableRow key={p.id} rowKey={p.id}>
      <TableCell rowHeader><Link href="#" onClick={(e) => e.originalEvent.preventDefault()}>{p.id}</Link></TableCell>
      <TableCell>
        <Input
          value={p.name}
          onInput={(val) => update(p.id, { name: val })}
          size="Small"
          accessibleName="Product name"
        />
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-3">
          <RadioButton
            checked={p.priority === "high"}
            onChange={() => update(p.id, { priority: "high" })}
            name={\`\${p.id}-priority\`}
            accessibleName="High"
            size="Small"
          />
          <RadioButton
            checked={p.priority === "low"}
            onChange={() => update(p.id, { priority: "low" })}
            name={\`\${p.id}-priority\`}
            accessibleName="Low"
            size="Small"
          />
        </div>
      </TableCell>
      <TableCell>
        <Select
          value={p.category}
          onChange={(detail) => update(p.id, { category: detail.selectedOption?.value ?? p.category })}
          size="Medium"
          accessibleName="Category"
        >
          <Option value="Electronics">Electronics</Option>
          <Option value="Clothing">Clothing</Option>
          <Option value="Home">Home</Option>
          <Option value="Sports">Sports</Option>
          <Option value="Books">Books</Option>
        </Select>
      </TableCell>
      <TableCell>
        <Input
          value={String(p.price)}
          onInput={(val) => update(p.id, { price: Number(val) || 0 })}
          size="Small"
          accessibleName="Price"
        />
      </TableCell>
      <TableCell>
        <Switch
          checked={p.active}
          onChange={(detail) => update(p.id, { active: detail.checked })}
          accessibleName="Active"
        />
      </TableCell>
      <TableCell>
        <CheckBox
          checked={p.approved}
          onChange={(detail) => update(p.id, { approved: detail.checked })}
          accessibleName="Approved"
        />
      </TableCell>
      <TableCell>
        <Button size="Small" design="Secondary" onClick={() => alert("five")}>Alert</Button>
      </TableCell>
    </TableRow>
  ))}
</Table>`;

// ============================================================================
// MAIN PAGE
// ============================================================================

interface DemoSectionProps {
  title: string;
  description?: string;
  code: string;
  children: React.ReactNode;
}

function DemoSection({ title, description, code, children }: DemoSectionProps) {
  const [showCode, setShowCode] = useState(false);

  return (
    <section className="space-y-4 border-b border-border pb-8 last:border-0">
      <div>
        <h3 className="text-lg font-semibold">
          {title}
        </h3>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {children}
      <div>
        <button
          type="button"
          onClick={() => setShowCode(!showCode)}
          className="text-xs text-primary hover:underline"
        >
          {showCode ? "Hide Code" : "Show Code"}
        </button>
        {showCode && <CodeBlock code={code} language="tsx" />}
      </div>
    </section>
  );
}

export function TablePage() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Table</h2>
        <p className="text-muted-foreground mt-1">
          A composable table component built with JSX children.
        </p>
        <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside space-y-1">
          <li><code className="text-xs">TableToolbar</code> — optional toolbar above the table with title, search, and action buttons</li>
          <li><code className="text-xs">TableHeaderRow</code> / <code className="text-xs">TableHeaderCell</code> — define column headers with sorting, alignment, and popin support</li>
          <li><code className="text-xs">TableRow</code> / <code className="text-xs">TableCell</code> — render data rows, optionally interactive or navigated</li>
          <li><code className="text-xs">TableRowAction</code> / <code className="text-xs">TableRowActionNavigation</code> — add to TableRow for inline row actions</li>
          <li><code className="text-xs">TableSelectionMulti</code> / <code className="text-xs">TableSelectionSingle</code> — add to Table for single or multi selection</li>
          <li><code className="text-xs">TableGrowing</code> — add to Table for load-more button or infinite scroll</li>
          <li><code className="text-xs">NoData</code> — pass to Table's <code className="text-xs">noData</code> prop for illustrated empty states</li>
        </ul>
      </div>

      <DemoSection
        title="Combined Features"
        description="A full-featured table combining toolbar with search, multi-selection, growing, row actions, no-data illustration, and interactive rows with navigated indicator and an identifier row header cell."
        code={combinedFeaturesCode}
      >
        <CombinedFeaturesDemo />
      </DemoSection>

      <DemoSection
        title="Basic Table"
        description="A simple table with header cells and data rows. Supports column widths, alignment, and custom content."
        code={basicTableCode}
      >
        <BasicTableDemo />
      </DemoSection>

      <DemoSection
        title="Multi Selection"
        description="Multi-selection with checkboxes. Select all via header checkbox, or individual rows. Supports Shift+Click range selection."
        code={multiSelectionCode}
      >
        <MultiSelectionDemo />
      </DemoSection>

      <DemoSection
        title="Single Selection"
        description="Single-selection with radio buttons. Only one row can be selected at a time."
        code={singleSelectionCode}
      >
        <SingleSelectionDemo />
      </DemoSection>

      <DemoSection
        title="RowOnly Selection"
        description="Multi-selection without checkbox column. Clicking a row toggles its selection."
        code={rowOnlySelectionCode}
      >
        <RowOnlySelectionDemo />
      </DemoSection>

      <DemoSection
        title="Row Actions"
        description="Rows can have navigation and action buttons. Configure rowActionCount on the Table to reserve space."
        code={rowActionsCode}
      >
        <RowActionsDemo />
      </DemoSection>

      <DemoSection
        title="Interactive Rows"
        description="Rows with interactive prop become clickable. The navigated prop shows a visual indicator for the active row."
        code={interactiveRowsCode}
      >
        <InteractiveRowsDemo />
      </DemoSection>

      <DemoSection
        title="Growing (Button)"
        description="Load more data on demand with a 'More' button at the bottom of the table."
        code={growingButtonCode}
      >
        <GrowingButtonDemo />
      </DemoSection>

      <DemoSection
        title="Growing (Scroll)"
        description="Automatically load more data when the user scrolls to the bottom of the table. Set scrollHeight on the Table to use its built-in scroll container, or wrap the Table in an external scrollable element."
        code={growingScrollCode}
      >
        <GrowingScrollDemo />
      </DemoSection>

      <DemoSection
        title="Popin (Responsive Overflow)"
        description="In Popin mode, columns collapse into sub-rows when there isn't enough horizontal space. Higher importance values stay visible longer."
        code={popinCode}
      >
        <PopinDemo />
      </DemoSection>

      <DemoSection
        title="Loading & Empty States"
        description="The table handles loading and empty states internally. Loading shows an overlay after a configurable delay."
        code={loadingEmptyCode}
      >
        <LoadingEmptyDemo />
      </DemoSection>

      <DemoSection
        title="Alternate Row Colors"
        description="Striped rows for better readability with the alternateRowColors prop."
        code={alternateRowColorsCode}
      >
        <AlternateRowColorsDemo />
      </DemoSection>

      <DemoSection
        title="Editable Fields"
        description="Table cells with various interactive controls: Input, Select, Switch, CheckBox, and Button. Keyboard navigation correctly scopes to the focused control."
        code={editableFieldsCode}
      >
        <EditableFieldsDemo />
      </DemoSection>
    </div>
  );
}
