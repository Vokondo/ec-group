import { Fragment } from "react";
import { cn } from "@/lib/utils";

// Gap-free mosaic: items are split into self-contained row groups, each of which fills its full
// width at every breakpoint, so the layout never leaves an empty slot whatever the item count.
export type MosaicSize = "feature" | "wide" | "banner" | "regular";

type GroupKind = "featureLeft" | "featureRight" | "pair" | "pairReverse" | "trio" | "single";

const GROUP_SIZE: Record<GroupKind, number> = { featureLeft: 3, featureRight: 3, pair: 2, pairReverse: 2, trio: 3, single: 1 };
const PATTERN: GroupKind[] = ["featureLeft", "pair", "featureRight", "pairReverse"];
// Used when fewer items remain than the next pattern group needs.
const REMAINDER: Record<number, GroupKind> = { 1: "single", 2: "pair", 3: "trio" };

function toGroups<T>(items: T[]): { kind: GroupKind; items: T[] }[] {
  const groups: { kind: GroupKind; items: T[] }[] = [];
  for (let i = 0, step = 0; i < items.length; step++) {
    let kind = PATTERN[step % PATTERN.length];
    if (GROUP_SIZE[kind] > items.length - i) kind = REMAINDER[items.length - i];
    groups.push({ kind, items: items.slice(i, i + GROUP_SIZE[kind]) });
    i += GROUP_SIZE[kind];
  }
  return groups;
}

// `renderItem` receives the size the slot calls for and the grid classes the item must apply.
type RenderItem<T> = (item: T, size: MosaicSize, className?: string) => React.ReactNode;

export function Mosaic<T>({
  items,
  getKey,
  renderItem,
  className,
}: {
  items: T[];
  getKey: (item: T) => string;
  renderItem: RenderItem<T>;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {toGroups(items).map((group) => (
        <MosaicGroup key={getKey(group.items[0])} {...group} getKey={getKey} renderItem={renderItem} />
      ))}
    </div>
  );
}

function MosaicGroup<T>({
  kind,
  items,
  getKey,
  renderItem,
}: {
  kind: GroupKind;
  items: T[];
  getKey: (item: T) => string;
  renderItem: RenderItem<T>;
}) {
  const row = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";
  const item = (t: T, size: MosaicSize, className?: string) => (
    <Fragment key={getKey(t)}>{renderItem(t, size, className)}</Fragment>
  );
  switch (kind) {
    case "featureLeft":
    case "featureRight": {
      // Large item spanning two columns and two rows, beside two stacked items.
      const [feature, a, b] = items;
      const right = kind === "featureRight";
      return (
        <div className={cn(row, "lg:grid-rows-2")}>
          {item(feature, "feature", cn("sm:col-span-2 lg:row-span-2 lg:row-start-1", right ? "lg:col-start-2" : "lg:col-start-1"))}
          {item(a, "regular", right ? "lg:col-start-1 lg:row-start-1" : undefined)}
          {item(b, "regular", right ? "lg:col-start-1 lg:row-start-2" : undefined)}
        </div>
      );
    }
    case "pair":
    case "pairReverse": {
      // A wide item (two thirds) and a regular item (one third), alternating sides.
      const [a, b] = items;
      const wideFirst = kind === "pair";
      return (
        <div className={row}>
          {item(a, wideFirst ? "wide" : "regular", wideFirst ? "lg:col-span-2" : undefined)}
          {item(b, wideFirst ? "regular" : "wide", wideFirst ? undefined : "lg:col-span-2")}
        </div>
      );
    }
    case "trio":
      // On two-column screens the first item spans the row so the remaining two pair up.
      return <div className={row}>{items.map((t, i) => item(t, "regular", i === 0 ? "sm:col-span-2 lg:col-span-1" : undefined))}</div>;
    case "single":
      return item(items[0], "banner");
  }
}
