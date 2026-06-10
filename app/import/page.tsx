"use client"
import { useState } from "react"

const VAULT_KEYS = [
  'vault_txn_rules',
  'vault_txn_overrides',
  'vault_categories',
  'vault_budget_limits',
  'vault_gym_logs',
  'vault_meals',
  'vault_eating_goals',
  'vault_habits',
  'vault_cal_events',
  'vault_notified',
]

export default function ImportPage() {
  const [json, setJson] = useState("")
  const [status, setStatus] = useState<"idle"|"success"|"error">("idle")
  const [msg, setMsg] = useState("")
  const [imported, setImported] = useState<string[]>([])

  function doImport() {
    try {
      const data = JSON.parse(json)
      const keys: string[] = []
      for (const k of VAULT_KEYS) {
        if (data[k] !== undefined && data[k] !== null) {
          localStorage.setItem(k, data[k])
          keys.push(k)
        }
      }
      if (keys.length === 0) {
        setStatus("error")
        setMsg("No recognized Vault keys found in JSON. Make sure you copied the full output.")
        return
      }
      setImported(keys)
      setStatus("success")
      setMsg(`Imported ${keys.length} keys successfully.`)
    } catch {
      setStatus("error")
      setMsg("Invalid JSON — check the format and try again.")
    }
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Vault — Import Data</title>
        <style>{`
          *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
          body { font-family: -apple-system, 'Inter', sans-serif; background: #080808; color: #f4f4f5; min-height: 100vh; display: flex; align-items: flex-start; justify-content: center; padding: 40px 24px; }
          .card { background: #0f0f0f; border: 1px solid rgba(255,255,255,.07); border-radius: 16px; padding: 36px; width: 100%; max-width: 640px; }
          .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 28px; }
          .logo-mark { width: 28px; height: 28px; background: #f4f4f5; border-radius: 7px; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #080808; }
          h2 { font-size: 18px; font-weight: 600; margin-bottom: 6px; }
          .sub { font-size: 13px; color: #71717a; margin-bottom: 24px; line-height: 1.6; }
          .step { background: #161616; border: 1px solid rgba(255,255,255,.06); border-radius: 10px; padding: 16px 18px; margin-bottom: 12px; }
          .step-num { font-size: 11px; font-weight: 600; color: #52525b; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 6px; }
          .step-desc { font-size: 13px; color: #a1a1aa; line-height: 1.5; margin-bottom: 10px; }
          code { display: block; background: #0a0a0a; border: 1px solid rgba(255,255,255,.06); border-radius: 7px; padding: 12px 14px; font-family: 'SF Mono', monospace; font-size: 11px; color: #4ade80; line-height: 1.6; white-space: pre-wrap; word-break: break-all; cursor: pointer; }
          code:hover { border-color: rgba(255,255,255,.12); }
          textarea { width: 100%; background: #161616; border: 1px solid rgba(255,255,255,.07); border-radius: 8px; padding: 12px 14px; color: #f4f4f5; font-family: 'SF Mono', monospace; font-size: 12px; outline: none; resize: vertical; transition: border-color .15s; min-height: 120px; }
          textarea:focus { border-color: rgba(255,255,255,.18); }
          textarea::placeholder { color: #3f3f46; }
          .btn { width: 100%; margin-top: 14px; padding: 12px; background: #f4f4f5; border: none; border-radius: 8px; color: #080808; font-size: 14px; font-weight: 600; cursor: pointer; transition: opacity .15s; }
          .btn:hover { opacity: .88; }
          .btn:disabled { opacity: .4; cursor: not-allowed; }
          .success { background: rgba(74,222,128,.07); border: 1px solid rgba(74,222,128,.2); border-radius: 8px; padding: 14px 16px; margin-top: 16px; }
          .success h4 { color: #4ade80; font-size: 14px; margin-bottom: 8px; }
          .success ul { list-style: none; }
          .success li { font-size: 12px; color: #71717a; padding: 2px 0; }
          .success li::before { content: "✓ "; color: #4ade80; }
          .error-box { background: rgba(248,113,113,.07); border: 1px solid rgba(248,113,113,.2); border-radius: 8px; padding: 12px 14px; margin-top: 16px; font-size: 13px; color: #f87171; }
          .dashboard-link { display: block; text-align: center; margin-top: 20px; padding: 12px; background: transparent; border: 1px solid rgba(255,255,255,.1); border-radius: 8px; color: #a1a1aa; font-size: 14px; text-decoration: none; transition: all .15s; }
          .dashboard-link:hover { border-color: rgba(255,255,255,.25); color: #f4f4f5; }
          .copy-hint { font-size: 11px; color: #52525b; margin-top: 5px; }
        `}</style>
      </head>
      <body>
        <div className="card">
          <div className="logo">
            <div className="logo-mark">V</div>
            <span style={{fontSize:'16px',fontWeight:600}}>Vault — Import Data</span>
          </div>
          <h2>Import from local</h2>
          <p className="sub">Transfers your categories, budget limits, rules, gym logs, meals, habits and calendar from localhost to this Vercel app.</p>

          <div className="step">
            <div className="step-num">Step 1 — Open localhost</div>
            <div className="step-desc">Go to <strong style={{color:'#f4f4f5'}}>http://localhost:5050</strong> in your browser and open DevTools (Cmd+Option+I → Console tab).</div>
          </div>

          <div className="step">
            <div className="step-num">Step 2 — Run this in the console</div>
            <div className="step-desc">Click to copy, paste in console, press Enter:</div>
            <code onClick={() => {
              const script = `(function(){var ks=['vault_txn_rules','vault_txn_overrides','vault_categories','vault_budget_limits','vault_gym_logs','vault_meals','vault_eating_goals','vault_habits','vault_cal_events','vault_notified'];var d={};ks.forEach(function(k){var v=localStorage.getItem(k);if(v!==null)d[k]=v;});var out=JSON.stringify(d);copy(out);console.log('✅ Copied! '+Object.keys(d).length+' keys: '+Object.keys(d).join(', '));return out;})()`;
              navigator.clipboard.writeText(script).catch(() => {});
            }}>{`(function(){var ks=['vault_txn_rules','vault_txn_overrides','vault_categories','vault_budget_limits','vault_gym_logs','vault_meals','vault_eating_goals','vault_habits','vault_cal_events','vault_notified'];var d={};ks.forEach(function(k){var v=localStorage.getItem(k);if(v!==null)d[k]=v;});var out=JSON.stringify(d);copy(out);console.log('✅ Copied! '+Object.keys(d).length+' keys: '+Object.keys(d).join(', '));return out;})()`}</code>
            <div className="copy-hint">↑ Click the code block to copy it to clipboard</div>
          </div>

          <div className="step">
            <div className="step-num">Step 3 — Paste the JSON output here</div>
            <div className="step-desc">The script auto-copies the result. Paste it below (Cmd+V):</div>
            <textarea
              value={json}
              onChange={e => setJson(e.target.value)}
              placeholder='{"vault_budget_limits":"{...}","vault_habits":"[...]",...}'
            />
            <button className="btn" onClick={doImport} disabled={!json.trim()}>
              Import to this browser
            </button>
          </div>

          {status === "success" && (
            <div className="success">
              <h4>✓ {msg}</h4>
              <ul>
                {imported.map(k => <li key={k}>{k}</li>)}
              </ul>
            </div>
          )}
          {status === "error" && (
            <div className="error-box">{msg}</div>
          )}

          {status === "success" && (
            <a href="/vault.html" className="dashboard-link">→ Go to Dashboard</a>
          )}
        </div>
      </body>
    </html>
  )
}
