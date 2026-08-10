import { useState } from "react";
import {
  List,
  ListItem,
  ListItemType,
  ListSelectionMode,
  ListSelectionChangeEventDetail,
  Button,
  ButtonDesign,
  ButtonSize,
  Avatar,
  AvatarSize,
  AvatarShape,
} from "@sap-ui/fx-components";
import { MoreHorizontal, Laptop, Mouse, Cable, Keyboard, Monitor } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

const sampleProducts: Product[] = [
  { id: "1", name: "Laptop Pro 15", description: "High-performance laptop with 16GB RAM", icon: <Laptop className="h-4 w-4" /> },
  { id: "2", name: "Wireless Mouse", description: "Ergonomic design with 6-month battery", icon: <Mouse className="h-4 w-4" /> },
  { id: "3", name: "USB-C Hub", description: "7-in-1 multiport adapter", icon: <Cable className="h-4 w-4" /> },
  { id: "4", name: "Mechanical Keyboard", description: "Cherry MX switches, RGB backlight", icon: <Keyboard className="h-4 w-4" /> },
  { id: "5", name: 'Monitor 27"', description: "4K UHD, IPS Panel, 60Hz", icon: <Monitor className="h-4 w-4" /> },
];

interface Person {
  id: string;
  name: string;
  role: string;
  initials: string;
  imageUrl?: string;
}

const samplePeople: Person[] = [
  { id: "p1", name: "Alice Brown", role: "Senior Developer", initials: "AB", imageUrl: "https://i.pravatar.cc/64?u=alice" },
  { id: "p2", name: "Charlie Davis", role: "Product Manager", initials: "CD", imageUrl: "https://i.pravatar.cc/64?u=charlie" },
  { id: "p3", name: "Emily Foster", role: "UX Designer", initials: "EF" },
  { id: "p4", name: "George Hill", role: "QA Engineer", initials: "GH", imageUrl: "https://i.pravatar.cc/64?u=george" },
  { id: "p5", name: "Irene Kim", role: "DevOps Lead", initials: "IK" },
];

const overflowAction = (
  <Button
    design={ButtonDesign.TertiaryNeutral}
    size={ButtonSize.Medium}
    iconOnly
    icon={<MoreHorizontal className="h-4 w-4" />}
    accessibleName="More actions"
  />
);

export function ListPage() {
  const [singleKey, setSingleKey] = useState<string[]>([]);
  const [multiKeys, setMultiKeys] = useState<string[]>([]);

  return (
    <div className="space-y-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2">List</h1>
        <code className="text-sm text-primary/70 font-mono">{'import { List, ListItem } from "@sap-ui/fx-components"'}</code>
      </header>

      {/* Basic List */}
      <section id="basic-list" className="space-y-4">
        <h2 className="text-lg font-semibold">Basic List</h2>
        <div>
          <List
            headerText="Products"
            items={sampleProducts}
            getItemKey={(item) => item.id}
            renderItem={(product) => (
              <ListItem
                itemKey={product.id}
                text={product.name}
                description={product.description}
                image={<Avatar icon={product.icon} size={AvatarSize.XS} shape={AvatarShape.Square} />}
                action={overflowAction}
                type={ListItemType.Navigation}
              />
            )}
            accessibleName="Product list"
          />
        </div>
      </section>

      {/* Title Only List */}
      <section id="title-only-list" className="space-y-4">
        <h2 className="text-lg font-semibold">Title Only (no subtitle)</h2>
        <div>
          <List
            headerText="Title Only Items"
            items={sampleProducts}
            getItemKey={(item) => item.id}
            renderItem={(product) => (
              <ListItem
                itemKey={product.id}
                text={product.name}
                image={<Avatar icon={product.icon} size={AvatarSize.XS} shape={AvatarShape.Square} />}
                type={ListItemType.Navigation}
              />
            )}
            accessibleName="Title only list"
          />
        </div>
      </section>

      {/* List with Image / Avatar */}
      <section id="list-with-image-avatar" className="space-y-4">
        <h2 className="text-lg font-semibold">List with Image / Avatar</h2>
        <div>
          <List
            headerText="Team Members"
            items={samplePeople}
            getItemKey={(item) => item.id}
            renderItem={(person) => (
              <ListItem
                itemKey={person.id}
                text={person.name}
                description={person.role}
                image={
                  person.imageUrl
                    ? <img src={person.imageUrl} alt={person.name} className="w-full h-full object-cover" />
                    : <Avatar initials={person.initials} size={AvatarSize.XS} shape={AvatarShape.Square} />
                }
                action={overflowAction}
                type={ListItemType.Navigation}
              />
            )}
            accessibleName="Team members list"
          />
        </div>
      </section>

      {/* Single Selection */}
      <section id="single-selection" className="space-y-4">
        <h2 className="text-lg font-semibold">Single Selection</h2>
        <div>
          <List
            headerText="Single Selection"
            selectionMode={ListSelectionMode.Single}
            selectedKeys={singleKey}
            onSelectionChange={(detail: ListSelectionChangeEventDetail<Product>) => {
              setSingleKey(detail.selectedKeys || []);
            }}
            items={sampleProducts}
            getItemKey={(item) => item.id}
            renderItem={(product) => (
              <ListItem
                itemKey={product.id}
                text={product.name}
                description={product.description}
                image={<Avatar icon={product.icon} size={AvatarSize.XS} shape={AvatarShape.Square} />}
                action={overflowAction}
                type={ListItemType.Navigation}
              />
            )}
            accessibleName="Single selection product list"
          />
        </div>
      </section>

      {/* Multiple Selection */}
      <section id="multiple-selection" className="space-y-4">
        <h2 className="text-lg font-semibold">Multiple Selection</h2>
        <div>
          <List
            headerText="Multiple Selection"
            selectionMode={ListSelectionMode.Multiple}
            selectedKeys={multiKeys}
            onSelectionChange={(detail: ListSelectionChangeEventDetail<Product>) => {
              setMultiKeys(detail.selectedKeys || []);
            }}
            items={sampleProducts}
            getItemKey={(item) => item.id}
            renderItem={(product) => (
              <ListItem
                itemKey={product.id}
                text={product.name}
                description={product.description}
                image={<Avatar icon={product.icon} size={AvatarSize.XS} shape={AvatarShape.Square} />}
                action={overflowAction}
                type={ListItemType.Navigation}
              />
            )}
            accessibleName="Multiple selection product list"
          />
        </div>
      </section>
    </div>
  );
}

export default ListPage;
