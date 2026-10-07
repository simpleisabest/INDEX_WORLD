import Image from "next/image";
import type { ReactNode } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function PolicyPage({ eyebrow, title, summary, children }: { eyebrow: string; title: string; summary: string; children: ReactNode }) {
  return <main className="policy-page"><header className="policy-header shell"><a href={`${basePath}/`} aria-label="INDEX WORLD Home"><Image src={`${basePath}/brand/index-world-logo.webp`} alt="INDEX WORLD" width={2172} height={724} priority /></a><nav aria-label="Policy navigation"><a href={`${basePath}/about/`}>About</a><a href={`${basePath}/methodology/`}>Methodology</a><a href={`${basePath}/privacy/`}>Privacy</a><a href={`${basePath}/terms/`}>Terms</a></nav></header><article className="policy-content shell"><p className="policy-eyebrow">{eyebrow}</p><h1>{title}</h1><p className="policy-summary">{summary}</p>{children}<p className="policy-updated">Last updated · 2026-10-07</p></article><footer className="policy-footer shell"><a href={`${basePath}/`}>← INDEX WORLD</a><a href="mailto:simpleisabest@gmail.com">Contact · simpleisabest@gmail.com</a></footer></main>;
}
