import { NextResponse } from "next/server"
import OpenAI from "openai"
import { SYSTEM_PROMPT } from "@/lib/system-prompt"
import { validateAnalysisResult, fallbackResult } from "@/lib/validate-result"
import type { CompanyProfile, Signal } from "@/lib/types"

export const runtime = "nodejs"

const DEFAULT_SYSTEM_PROMPT = "You are a competitor analysis assistant. Return JSON."

export async function POST(req: Request) {
  let profile: CompanyProfile | undefined
  let signal: Signal | undefined

  try {
    const body = (await req.json()) as { profile?: CompanyProfile; signal?: Signal }
    profile = body.profile
    signal = body.signal
  } catch {
    return NextResponse.json(fallbackResult("invalid request body"))
  }

  if (!profile || !signal || !signal.raw_text) {
    return NextResponse.json(fallbackResult("missing profile or signal"))
  }

  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json(fallbackResult("GROQ_API_KEY is not configured"))
  }

  const systemPrompt = SYSTEM_PROMPT && SYSTEM_PROMPT.trim().length > 0 ? SYSTEM_PROMPT : DEFAULT_SYSTEM_PROMPT

  const userPayload = {
    instruction:
      "Analyse the signal against the company profile. Return JSON matching the AnalysisResult shape with keys: overlap_score (0-100 integer), threat_type (one of feature_parity, positioning_collision, adjacent_noise, non_threat), confidence (low|medium|high), why_it_matters (1-2 sentences), evidence_lines (array of 2-4 short quoted lines from the signal), recommended_action (ignore|monitor|investigate|reposition).",
    profile,
    signal,
  }

  try {
    const client = new OpenAI({
      apiKey,
      baseURL: "https://api.groq.com/openai/v1",
    })

    const completion = await client.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.2,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: JSON.stringify(userPayload) },
      ],
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      return NextResponse.json(fallbackResult("empty model response"))
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(content)
    } catch {
      return NextResponse.json(fallbackResult("model returned invalid JSON"))
    }

    const validated = validateAnalysisResult(parsed)
    if (!validated) {
      return NextResponse.json(fallbackResult("model response failed schema validation"))
    }

    return NextResponse.json(validated)
  } catch (err) {
    const message = err instanceof Error ? err.message : "unknown error"
    return NextResponse.json(fallbackResult(message))
  }
}
