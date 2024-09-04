import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ImageCanvas from "@/components/ui/imageCanvas"
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  return (
    <>
      <div className="w-full max-w-x gap-1.5 roboto">
        <Label htmlFor="url" className='text-neutral-50 text-xl'>Website URL</Label>
        <Input id="url" className='dark text-neutral-50 text-lg roboto' value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com"/>
      </div>
      <ImageCanvas src='public/assets/ss.png'/>
    </>
  )
}

export default App
