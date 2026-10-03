"use client";

import { useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { buildShareUrl, createShareEvent, type ShareState } from "@/lib/share";

type ShareButtonProps = ShareState & { title: string; description: string; tone?: "light" | "dark" };

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(value);
  const input = document.createElement("textarea");
  input.value = value;
  input.style.position = "fixed";
  input.style.opacity = "0";
  document.body.append(input);
  input.select();
  document.execCommand("copy");
  input.remove();
}

export function ShareButton({ title, description, tone = "light", ...state }: ShareButtonProps) {
  const { t } = useLocale();
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");

  const share = async () => {
    const url = buildShareUrl(window.location.href, state);
    try {
      if (navigator.share) {
        await navigator.share({ title: `INDEX WORLD · ${title}`, text: description, url });
        createShareEvent(state, "web-share");
        setStatus("idle");
      } else {
        await copyText(`INDEX WORLD · ${title}\n${description}\n${url}`);
        createShareEvent(state, "clipboard");
        setStatus("copied");
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setStatus("failed");
    }
  };

  return (
    <div className={`share-control share-control-${tone}`}>
      <button type="button" onClick={share} aria-label={`${t("share.action")}: ${title}`}><span aria-hidden="true">↗</span>{t("share.action")}</button>
      <span role="status" aria-live="polite">{status === "copied" ? t("share.copied") : status === "failed" ? t("share.failed") : ""}</span>
    </div>
  );
}
