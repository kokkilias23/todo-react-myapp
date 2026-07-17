import { useEffect, useRef, useState } from 'react'
import { translations, type Language } from '../i18n'

type Props = {
  onCredential: (credential: string) => void
  language: Language
}

type GoogleCredentialResponse = {
  credential: string
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (options: {
            client_id: string
            callback: (response: GoogleCredentialResponse) => void
          }) => void
          renderButton: (
            element: HTMLElement,
            options: { theme: string; size: string; width: number; text: string; locale: string },
          ) => void
        }
      }
    }
  }
}

function GoogleLoginButton({ onCredential, language }: Props) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [scriptFailed, setScriptFailed] = useState(false)
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  const t = translations[language]

  useEffect(() => {
    if (!clientId || !buttonRef.current) return

    const renderGoogleButton = () => {
      if (!window.google || !buttonRef.current) return
      buttonRef.current.innerHTML = ''
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => onCredential(response.credential),
      })
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        text: 'continue_with',
        locale: language,
      })
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://accounts.google.com/gsi/client"]',
    )

    if (existingScript) {
      if (window.google) renderGoogleButton()
      else existingScript.addEventListener('load', renderGoogleButton, { once: true })
      return
    }

    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = renderGoogleButton
    script.onerror = () => setScriptFailed(true)
    document.head.appendChild(script)
  }, [clientId, language, onCredential])

  if (!clientId) {
    return <p className="text-sm text-red-600">{t.missingGoogleId}</p>
  }

  if (scriptFailed) {
    return <p className="text-sm text-red-600">{t.googleLoadError}</p>
  }

  return <div ref={buttonRef} className="min-h-11 flex justify-center" />
}

export default GoogleLoginButton
