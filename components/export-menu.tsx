"use client";
import { useRef, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { ShareButton } from "@/components/share-button";
import { buildShareUrl, type ShareState } from "@/lib/share";
import { validateExport, attributedCsv, exportPrintHtml, exportTable, type ExportArtifact } from "@/lib/export";
import { copyExportText, exportCanvas, saveExport } from "@/lib/export-browser";

export function ExportMenu({ artifact, shareState }: { artifact: ExportArtifact; shareState: ShareState }) {
  const { t, locale } = useLocale(); const menu = useRef<HTMLDetailsElement>(null);
  const [busy, setBusy] = useState(false); const [status, setStatus] = useState<"idle" | "done" | "failed">("idle");
  const run = async (action: "png" | "card" | "print" | "table" | "citation" | "csv") => {
    setBusy(true); setStatus("idle");
    try {
      validateExport(artifact);
      const url = buildShareUrl(window.location.href, shareState);
      if (action === "table") await copyExportText(exportTable(artifact, url));
      else if (action === "citation") await copyExportText(`${artifact.citation}\n${artifact.metadata}\nINDEX WORLD · ${url}`);
      else if (action === "csv") saveExport(new Blob(["\uFEFF", attributedCsv(artifact.csv, url)], { type: "text/csv;charset=utf-8" }), `${artifact.filename}.csv`);
      else {
        const canvas = await exportCanvas(artifact, url, action === "card", locale);
        if (action === "print") {
          const frame = document.createElement("iframe"); frame.className = "export-print-frame"; frame.title = artifact.title;
          frame.srcdoc = exportPrintHtml(artifact, url, canvas.toDataURL("image/png"), locale);
          await new Promise<void>((resolve, reject) => {
            frame.onload = async () => {
              try {
                const win = frame.contentWindow; if (!win) throw new Error("Print unavailable");
                await win.document.fonts.ready;
                await Promise.all([...win.document.images].map(img => img.decode()));
                win.addEventListener("afterprint", () => frame.remove(), { once: true }); win.focus(); win.print();
                window.setTimeout(() => frame.remove(), 60000); resolve();
              } catch (error) { frame.remove(); reject(error); }
            };
            document.body.append(frame);
          });
        } else {
          const blob = await new Promise<Blob>((resolve, reject) => canvas.toBlob(value => value ? resolve(value) : reject(new Error("PNG unavailable")), "image/png"));
          saveExport(blob, `${artifact.filename}${action === "card" ? "-card" : ""}.png`);
        }
      }
      setStatus("done");
    } catch { setStatus("failed"); } finally { setBusy(false); }
  };
  return <div className="export-control"><details ref={menu} onKeyDown={event => { if (event.key === "Escape") { menu.current!.open = false; menu.current?.querySelector("summary")?.focus(); } }}><summary>{t("export.menu")}</summary><div className="export-options">{(["png", "print", "table", "citation", "csv", "card"] as const).map(action => <button type="button" disabled={busy} key={action} onClick={() => void run(action)}>{t(`export.${action}`)}</button>)}<ShareButton {...shareState} title={artifact.title} description={artifact.subtitle} /></div></details><span role="status">{status === "done" ? t("export.done") : status === "failed" ? t("export.failed") : ""}</span></div>;
}
