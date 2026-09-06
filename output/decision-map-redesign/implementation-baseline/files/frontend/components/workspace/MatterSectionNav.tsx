import MatterIcon, { type MatterIconName } from "./MatterIcon";
import styles from "./MatterA.module.css";

type MatterSectionNavProps = {
  entries: ReadonlyArray<{ id: string; label: string }>;
  onReveal: (id: string) => void;
};

export default function MatterSectionNav({ entries, onReveal }: MatterSectionNavProps) {
  return <nav aria-label="More matter sections" className={styles.sectionNav}>
    {entries.map((entry, index) => <button className="btn quiet" key={entry.id} onClick={() => onReveal(entry.id)} type="button"><MatterIcon name={(["file", "map", "eye", "search", "folder"] as MatterIconName[])[index] ?? "folder"} />{entry.label}<MatterIcon name="chevron" size={18} style={{ marginLeft: "auto" }} /></button>)}
  </nav>;
}
