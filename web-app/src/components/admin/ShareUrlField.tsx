'use client'
import { useState } from 'react'
import { useFormFields } from '@payloadcms/ui'

// Read-only sidebar field that shows the invite's full shareable URL with a copy button.
// The slug is auto-generated on first save, so before that we prompt the user to save.
export const ShareUrlField = () => {
  const slug = useFormFields(([fields]) => fields?.slug?.value) as string | undefined
  const [copied, setCopied] = useState(false)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = slug ? `${origin}/convite/${slug}` : ''

  const copy = async () => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="field-type" style={{ marginBottom: 'var(--base)' }}>
      <label className="field-label">Shareable link</label>
      {url ? (
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ wordBreak: 'break-all', fontSize: 13 }}
          >
            {url}
          </a>
          <button
            type="button"
            onClick={copy}
            className="btn btn--size-small btn--style-secondary"
            style={{ margin: 0 }}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      ) : (
        <p style={{ fontSize: 13, opacity: 0.7, margin: 0 }}>
          Save the invite to generate its shareable link.
        </p>
      )}
    </div>
  )
}
