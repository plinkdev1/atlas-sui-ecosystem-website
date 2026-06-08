"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Search, X } from "lucide-react"

interface DocLink {
  title: string
  description: string
  href: string
  category: string
}

const ALL_DOCS: DocLink[] = [
  { title: "Overview", description: "Atlas Protocol documentation hub", href: "/docs", category: "Getting Started" },
  { title: "Introduction", description: "Overview and mission", href: "/docs#intro", category: "Getting Started" },
  {
    title: "Getting Started",
    description: "Connect wallet and quick start",
    href: "/docs#start",
    category: "Getting Started",
  },
  {
    title: "Wallet Cleanup",
    description: "Scan, classify, hide/burn assets",
    href: "/docs/wallet-cleanup",
    category: "Tools",
  },
  {
    title: "Transaction Explainer",
    description: "Decode and understand transactions",
    href: "/docs/transaction-explainer",
    category: "Tools",
  },
  {
    title: "Infra Discovery",
    description: "Browse and purchase infrastructure",
    href: "/docs/infra-discovery",
    category: "Tools",
  },
  {
    title: "Wallet Integration",
    description: "Developer integration guide",
    href: "/docs#integration",
    category: "Developers",
  },
  { title: "API & Payments", description: "JSON export and payments flow", href: "/docs#api", category: "Developers" },
  {
    title: "Blockchains",
    description: "Supported blockchain documentation",
    href: "/docs/blockchains",
    category: "Resources",
  },
  { title: "Troubleshooting", description: "FAQs and common errors", href: "/docs#faq", category: "Support" },
]

function fuzzyMatch(query: string, text: string): { score: number; highlights: Array<{ start: number; end: number }> } {
  const q = query.toLowerCase()
  const t = text.toLowerCase()
  let score = 0
  const highlights: Array<{ start: number; end: number }> = []
  let queryIdx = 0
  let textIdx = 0

  while (queryIdx < q.length && textIdx < t.length) {
    if (q[queryIdx] === t[textIdx]) {
      highlights.push({ start: textIdx, end: textIdx + 1 })
      score += 10
      queryIdx++
    }
    textIdx++
  }

  return { score: queryIdx === q.length ? score : -1, highlights }
}

export function DocsSearch() {
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const searchRef = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()

    return ALL_DOCS.map((doc) => {
      const titleMatch = fuzzyMatch(q, doc.title)
      const descMatch = fuzzyMatch(q, doc.description)
      const categoryMatch = fuzzyMatch(q, doc.category)

      const score = Math.max(titleMatch.score * 3, descMatch.score * 2, categoryMatch.score)

      return { ...doc, score, titleMatch, descMatch }
    })
      .filter((doc) => doc.score > -1)
      .sort((a, b) => b.score - a.score)
  }, [query])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0))
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1))
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault()
        window.location.href = results[selectedIndex].href
      } else if (e.key === "Escape") {
        setQuery("")
        setSelectedIndex(-1)
      }
    }

    if (!query.trim()) {
      return
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [query, selectedIndex, results])

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search docs (arrow keys to navigate)..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setSelectedIndex(-1)
          }}
          className="w-full pl-10 pr-4 py-2 bg-muted rounded-lg text-sm border border-border focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("")
              setSelectedIndex(-1)
            }}
            className="absolute right-3 top-3 h-4 w-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      {query.trim() && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {results.map((doc, idx) => (
            <a
              key={doc.href}
              href={doc.href}
              onClick={(e) => {
                e.preventDefault()
                window.location.href = doc.href
              }}
              className={`flex flex-col px-4 py-3 transition-colors border-b border-border/50 last:border-b-0 cursor-pointer ${
                idx === selectedIndex ? "bg-blue-500/10" : "hover:bg-muted"
              }`}
            >
              <p className="font-semibold text-sm text-foreground">
                {doc.titleMatch.highlights.length > 0 ? (
                  <>
                    {doc.title.split("").map((char, i) => (
                      <span
                        key={i}
                        className={
                          doc.titleMatch.highlights.some((h) => h.start === i) ? "bg-blue-500/50 font-bold" : ""
                        }
                      >
                        {char}
                      </span>
                    ))}
                  </>
                ) : (
                  doc.title
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>
              <span className="text-xs text-purple-400 mt-1">{doc.category}</span>
            </a>
          ))}
        </div>
      )}
      {query.trim() && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-50 p-4 text-center text-sm text-muted-foreground">
          No results found for "{query}"
        </div>
      )}
    </div>
  )
}
