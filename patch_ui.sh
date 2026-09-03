#!/bin/bash
# First, comment out or replace the title block and form.
# Wait, I'll use a Node script to replace it precisely.
node -e "
const fs = require('fs');
let code = fs.readFileSync('src/features/auth/Login.tsx', 'utf8');
const search = '<div className=\"mb-8\">';
const endForm = '</form>';
const startIndex = code.indexOf(search);
const endIndex = code.indexOf(endForm, startIndex) + endForm.length;

const replacement = \`
          {!mfaChallenge ? (
            <>
              <div className=\"mb-8\">
                <h2 className=\"text-3xl font-bold text-foreground tracking-tight\">Sign In</h2>
                <p className=\"mt-2 text-sm text-muted-foreground\">
                  Enter your credentials to access your account.
                </p>
              </div>
              \` + code.substring(code.indexOf('<form onSubmit={handleLogin}'), endIndex) + \`
            </>
          ) : (
            <>
              <div className=\"mb-8\">
                <h2 className=\"text-3xl font-bold text-foreground tracking-tight\">Two-Factor Authentication</h2>
                <p className=\"mt-2 text-sm text-muted-foreground\">
                  {recoveryMode ? 'Enter one of your 10-digit recovery codes.' : 'Enter the 6-digit code from your authenticator app.'}
                </p>
              </div>
              <form onSubmit={handleMfaSubmit} className=\"space-y-5\">
                <div className=\"space-y-2\">
                  <label className=\"text-xs font-semibold uppercase tracking-wider text-muted-foreground\">
                    {recoveryMode ? 'Recovery Code' : 'Authentication Code'}
                  </label>
                  <div className=\"relative\">
                    <ShieldCheck className=\"absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground\" />
                    <input
                      type=\"text\"
                      required
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\\D/g, ''))}
                      className=\"w-full rounded-xl border border-border bg-secondary/50 px-12 py-3.5 text-sm text-foreground outline-none transition focus:border-primary focus:ring-1 focus:ring-primary\"
                      placeholder={recoveryMode ? 'e.g. 1234567890' : 'e.g. 123456'}
                      maxLength={recoveryMode ? 10 : 6}
                    />
                  </div>
                </div>

                {error && (
                  <div className=\"rounded-xl bg-destructive/10 p-4 text-sm text-destructive border border-destructive/20\">
                    {error}
                  </div>
                )}

                <button
                  type=\"submit\"
                  disabled={loading || (recoveryMode ? mfaCode.length !== 10 : mfaCode.length !== 6)}
                  className=\"group w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed\"
                >
                  {loading ? (
                    <Loader2 className=\"w-5 h-5 animate-spin\" />
                  ) : (
                    <>
                      Verify <ArrowRight className=\"w-4 h-4 transition-transform group-hover:translate-x-1\" />
                    </>
                  )}
                </button>
                <div className=\"text-center mt-4\">
                  <button
                    type=\"button\"
                    onClick={() => {
                      setRecoveryMode(!recoveryMode);
                      setMfaCode('');
                      setError(null);
                    }}
                    className=\"text-sm text-sky-400 hover:underline\"
                  >
                    {recoveryMode ? 'Use Authenticator App Instead' : 'Use a Recovery Code'}
                  </button>
                </div>
              </form>
            </>
          )}
\`;

code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
fs.writeFileSync('src/features/auth/Login.tsx', code);
"
