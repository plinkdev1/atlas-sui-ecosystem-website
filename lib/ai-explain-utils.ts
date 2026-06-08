import type { SuiJsonRpcClient } from "@mysten/sui/jsonRpc"

type SuiClient = SuiJsonRpcClient

export interface ExplainResult {
  summary: string
  whatHappened: string
  tokenFlows: string
  risks: string
  defiDetails: string
  isPro: boolean
}

export async function explainTransaction(
  digest: string,
  client: SuiClient,
  isPro: boolean = false,
): Promise<ExplainResult> {
  try {
    // Fetch transaction details
    const txData = await client.getTransactionBlock({
      digest,
      options: {
        showInput: true,
        showEffects: true,
        showEvents: true,
        showObjectChanges: true,
        showBalanceChanges: true,
      },
    })

    // Build prompt for AI
    const prompt = buildExplainerPrompt(txData, isPro)

    // Call OpenAI or Grok API
    const explanation = await callAIExplainer(prompt)

    // Parse response into structured format
    return parseExplanation(explanation, isPro)
  } catch (error) {
    console.error("[v0] Error explaining transaction:", error)
    return {
      summary: "Error analyzing transaction",
      whatHappened: "",
      tokenFlows: "",
      risks: "",
      defiDetails: isPro ? "" : "(Pro feature)",
      isPro,
    }
  }
}

function buildExplainerPrompt(txData: any, isPro: boolean): string {
  let prompt = `Explain this Sui transaction in simple, clear English for someone new to crypto.

Transaction Data:
${JSON.stringify(txData, null, 2)}

Cover these sections:
1. **What Happened**: A simple summary of what this transaction did
2. **Token Flows**: Which tokens moved where and how much
3. **Gas Costs**: How much gas was paid
4. **Risks**: Any potential red flags or suspicious patterns

Format your response with clear sections. Be concise and avoid technical jargon.`

  if (isPro) {
    prompt += `

ADVANCED ANALYSIS (Pro Only):
- Detailed contract verification
- Smart contract interaction analysis
- Vesting or DeFi protocol detection
- Risk scoring (1-10)`
  }

  return prompt
}

async function callAIExplainer(prompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.warn("[v0] OPENAI_API_KEY not configured. Returning mock response.")
    return "This transaction appears to be a token swap. No detailed analysis available."
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [
          {
            role: "system",
            content: "You are a Sui blockchain expert helping users understand transactions.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || "Unable to generate explanation"
  } catch (error) {
    console.error("[v0] Error calling AI explainer:", error)
    return "Error generating explanation. Please try again."
  }
}

function parseExplanation(text: string, isPro: boolean): ExplainResult {
  // Simple parsing - in production, use more sophisticated parsing
  const sections = text.split(/##\s+/i)

  return {
    summary: text.substring(0, 150) + "...",
    whatHappened: extractSection(sections, "what happened") || "Transaction executed successfully",
    tokenFlows: extractSection(sections, "token flows") || "Token transfers processed",
    risks: extractSection(sections, "risks") || "No major risks detected",
    defiDetails: isPro
      ? extractSection(sections, "advanced analysis") || "No DeFi protocol interaction detected"
      : "(Pro feature - Upgrade to see advanced analysis)",
    isPro,
  }
}

function extractSection(sections: string[], keyword: string): string {
  const section = sections.find((s) => s.toLowerCase().includes(keyword.toLowerCase()))
  return section ? section.substring(0, 300) : ""
}
