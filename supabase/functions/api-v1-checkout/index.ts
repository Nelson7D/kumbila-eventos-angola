
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método não suportado" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  try {
    // Extrai o reservation_id da URL
    const url = new URL(req.url)
    const match = url.pathname.match(/\/api\/v1\/checkout\/([a-zA-Z0-9-]+)/)
    const reservationId = match ? match[1] : null

    if (!reservationId) {
      return new Response(JSON.stringify({ error: "reservation_id inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Chama a função SQL validadora
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || ""
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""

    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/validate_and_perform_checkout`, {
      method: "POST",
      headers: {
        ...corsHeaders,
        "apikey": SUPABASE_SERVICE_ROLE_KEY,
        "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reservation_id_param: reservationId }),
    })

    const result = await response.json()

    if (!response.ok || result.success === false) {
      return new Response(JSON.stringify({
        success: false,
        message: result.message || "Não foi possível realizar o check-out.",
      }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({
      success: true,
      message: result.message || "Check-out realizado com sucesso.",
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("Check-out error:", err)
    return new Response(JSON.stringify({ error: "Erro inesperado ao tentar realizar o check-out." }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
