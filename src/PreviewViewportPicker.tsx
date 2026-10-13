import { useEffect } from "react";
import { createPortal } from "react-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { CheckIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useMobileDevice } from "./mobile";

export type PreviewViewport = "iphone" | "pixel-10" | "ipad" | "pc";

const options: Array<{ id: PreviewViewport; label: string; size: string }> = [
  { id: "iphone", label: "iPhone", size: "393 × 852" },
  { id: "pixel-10", label: "Pixel 10", size: "412 × 915" },
  { id: "ipad", label: "iPad", size: "1024 × 768" },
  { id: "pc", label: "PC", size: "1366 × 768" },
];

export default function PreviewViewportPicker({ value, onChange }: { value: PreviewViewport; onChange: (value: PreviewViewport) => void }) {
  const { setDeviceId } = useMobileDevice();
  const selected = options.find((option) => option.id === value) ?? options[0];

  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      document.body.dataset.previewViewport = value;
      if (value === "iphone" || value === "pixel-10") {
        setDeviceId(value);
        root.style.removeProperty("--preview-canvas-width");
        root.style.removeProperty("--preview-canvas-height");
        root.style.removeProperty("--preview-canvas-scale");
        return;
      }
      const width = value === "ipad" ? 1024 : 1366;
      const height = 768;
      const scale = Math.max(.2, Math.min((window.innerWidth - 48) / width, (window.innerHeight - 76) / height, 1));
      root.style.setProperty("--preview-canvas-width", `${width}px`);
      root.style.setProperty("--preview-canvas-height", `${height}px`);
      root.style.setProperty("--preview-canvas-scale", String(scale));
    };
    update();
    window.addEventListener("resize", update);
    return () => { window.removeEventListener("resize", update); delete document.body.dataset.previewViewport; };
  }, [setDeviceId, value]);

  return createPortal(<DropdownMenu.Root>
    <div className="responsive-device-menu" data-testid="responsive-device-menu">
      <DropdownMenu.Trigger asChild><button className="responsive-device-trigger" aria-label={`Preview device: ${selected.label}`}><span>{selected.label}</span><small>{selected.size}</small><ChevronDownIcon /></button></DropdownMenu.Trigger>
    </div>
    <DropdownMenu.Portal><DropdownMenu.Content className="responsive-device-options" align="end" sideOffset={8} collisionPadding={12}>
      <DropdownMenu.RadioGroup value={value} onValueChange={(next) => onChange(next as PreviewViewport)}>
        {options.map((option) => <DropdownMenu.RadioItem className="responsive-device-option" value={option.id} key={option.id}><span><b>{option.label}</b><small>{option.size}</small></span><DropdownMenu.ItemIndicator><CheckIcon /></DropdownMenu.ItemIndicator></DropdownMenu.RadioItem>)}
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Content></DropdownMenu.Portal>
  </DropdownMenu.Root>, document.body);
}
