import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import ImageCanvas from "@/components/ui/imageCanvas"
import './App.css'

function App() {
  const [url, setUrl] = useState('')
  return (
    <>
      <div className="grid w-full max-w-x gap-1.5 roboto mb-5">
        <Label htmlFor="url" className='text-neutral-50 text-xl ml-2'>Website URL</Label>
        <Input id="url" className='dark text-neutral-50 text-lg text-center' value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com"/>
      </div>
      <ImageCanvas src='/ss.png'/>
    </>
  )
}

export default App