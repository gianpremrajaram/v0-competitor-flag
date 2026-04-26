// Pre-cleaning + truncation for signal text before it hits Groq.
// 12,000 chars ≈ 3,000 tokens — well under the 6,000 TPM free-tier ceiling
// even with the system prompt + payload overhead, leaves headroom for two
// or three back-to-back analyses without throttling.
//
// Functions, not a class — single-shot transforms don't earn the ceremony.

const DEFAULT_MAX_CHARS = 12000

export function cleanSignalText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

export function truncateSignalText(text: string, maxChars: number = DEFAULT_MAX_CHARS): string {
  if (text.length <= maxChars) return text

  const slice = text.slice(0, maxChars)
  const sentenceEnd = slice.lastIndexOf(". ")
  const paragraphEnd = slice.lastIndexOf("\n\n")
  const boundary = Math.max(sentenceEnd, paragraphEnd)

  // Only honour the boundary if it falls in the last 40% of the slice —
  // otherwise we'd drop too much content for marginal grammatical gain.
  if (boundary > maxChars * 0.6) {
    return slice.slice(0, sentenceEnd === boundary ? boundary + 1 : boundary)
  }

  return slice
}

export function preprocessSignalText(text: string, maxChars: number = DEFAULT_MAX_CHARS): string {
  return truncateSignalText(cleanSignalText(text), maxChars)
}
