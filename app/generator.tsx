/* eslint-disable @next/next/no-img-element */
'use client'
import { useEffect, useRef, useState } from 'react'

export default function Generator() {
  const [username, setUsername] = useState('michael-scott-12')
  const [dark, setDark] = useState(false)
  const [tempUsername, setTempUsername] = useState(username)
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setUsername(tempUsername)
        }}
        className="flex flex-col space-y-1 p-2"
      >
        <label htmlFor="username">Your GitHub username:</label>
        <div className="flex space-x-2">
          <input
            id="username"
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            required
          />
          <button type="submit">Go</button>
        </div>
      </form>

      <div className="text-center text-sm text-slate-700">
        Here is your GitHub business card:
        <br />
        <small>(it’s an image!)</small>
      </div>
      {isBrowser && (
        <div
          dangerouslySetInnerHTML={{
            __html: htmlCodeForUserName(username, dark),
          }}
        />
      )}

      <div className="flex space-x-4">
        <div className="flex space-x-2 items-center">
          <input
            id="dark"
            type="checkbox"
            checked={dark}
            onChange={(e) => setDark(e.target.checked)}
          />
          <label htmlFor="dark">Dark mode</label>
        </div>
        <a
          href={imageUrlForUsername(username, dark)}
          download={`${username}-github-business-card.png`}
          className="button"
        >
          Download
        </a>
      </div>

      <div className="flex flex-col space-y-4 w-full max-w-md p-2">
        <div className="flex flex-col space-y-1">
          <label htmlFor="imageUrl">Image URL:</label>
          <CopyInput
            id="imageUrl"
            readOnly
            value={imageUrlForUsername(username, dark)}
          />
        </div>
        <div className="flex flex-col space-y-1">
          <label htmlFor="htmlCode">Embed HTML code:</label>
          <CopyInput
            id="htmlCode"
            readOnly
            value={htmlCodeForUserName(username, dark)}
          />
        </div>
        <div className="flex flex-col space-y-1 items-stretch">
          <label htmlFor="markdownCode">Embed Markdown code:</label>
          <CopyInput
            id="markdownCode"
            readOnly
            value={markdownCodeForUserName(username, dark)}
          />
        </div>
      </div>
    </>
  )
}

function CopyInput(props: JSX.IntrinsicElements['input']) {
  const [buttonText, setButtonText] = useState('Copy')
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div className="flex space-x-2">
      <input className="flex-1" {...props} />
      <button
        type="button"
        onClick={() => {
          if (timeoutRef.current) clearTimeout(timeoutRef.current)

          if (props.value && 'clipboard' in navigator) {
            navigator.clipboard.writeText(String(props.value))
            setButtonText('Copied!')
            timeoutRef.current = setTimeout(() => {
              setButtonText('Copy')
            }, 5000)
          }
        }}
      >
        {buttonText}
      </button>
    </div>
  )
}

function imageUrlForUsername(username: string, dark: boolean) {
  return `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/github?username=${encodeURIComponent(username)}${dark ? '&dark' : ''}`
}

function imageAltForUsername(username: string) {
  return `${username}’s GitHub image`
}

function htmlCodeForUserName(username: string, dark: boolean) {
  const imageUrl = imageUrlForUsername(username, dark)
  const imageAlt = imageAltForUsername(username)
  return `<a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer"><img src="${imageUrl}" alt="${imageAlt}" width="600" height="314" />`
}

function markdownCodeForUserName(username: string, dark: boolean) {
  const imageUrl = imageUrlForUsername(username, dark)
  const imageAlt = imageAltForUsername(username)
  return `![${imageAlt}](${imageUrl})`
}
