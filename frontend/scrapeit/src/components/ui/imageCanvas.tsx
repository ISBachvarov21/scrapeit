import {useEffect, useRef} from 'react'
import useState from 'react-usestateref'
import { toast } from "sonner"
import { Button } from './button'

interface Rect {
    startX: number
    startY: number
    rectWidth: number
    rectHeight: number
}

export default function ImageCanvas({src} : {src: string}) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const contextRef = useRef<CanvasRenderingContext2D | null>(null)

    const [startX, setStartX] = useState(0)
    const [startY, setStartY] = useState(0)

    const [canvasOffsetX, setCanvasOffsetX] = useState(0)
    const [canvasOffsetY, setCanvasOffsetY] = useState(0)

    const [isDrawing, setIsDrawing] = useState(false)

    const [rects, setRects, rectsRef] = useState([] as Rect[])

    const [scaleWidth, setScaleWidth, scaleWidthRef] = useState(0)
    const [scaleHeight, setScaleHeight, scaleHeightRef] = useState(0)

    const resizeCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        canvas.width = canvas.clientWidth
        canvas.height = canvas.clientHeight

        const context = canvasRef.current?.getContext('2d')

        if (!context) return
        context.lineCap = 'round'
        context.strokeStyle = 'lime'
        context.lineWidth = 1
        contextRef.current = context

        const canvasOffset = canvasRef.current?.getBoundingClientRect()
        if (!canvasOffset) return

        setCanvasOffsetX(canvasOffset.left)
        setCanvasOffsetY(canvasOffset.top)

        const img = document.getElementById('toedit') as HTMLImageElement

        if (!img) return

        const scaleWidth = canvas.width / img.naturalWidth
        const scaleHeight = canvas.height / img.naturalHeight
        setScaleWidth(scaleWidth)
        setScaleHeight(scaleHeight)
    }

    const removeLastRect = ({nativeEvent}: React.MouseEvent) => {
        nativeEvent.preventDefault()
        nativeEvent.stopPropagation()

        const newRects = [...rectsRef.current]
        newRects.pop()
        setRects(newRects)
        contextRef.current?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
        for (const rect of newRects) {
            contextRef.current?.strokeRect(rect.startX, rect.startY, rect.rectWidth, rect.rectHeight)
        }
    }

    const startDrawRect = ({nativeEvent}: React.MouseEvent) => {
        nativeEvent.preventDefault()
        nativeEvent.stopPropagation()

        const localStartX = nativeEvent.clientX - canvasOffsetX
        const localStartY = nativeEvent.clientY - canvasOffsetY

        setStartX(localStartX)
        setStartY(localStartY)

        setIsDrawing(true)
    }

    const drawRect = ({nativeEvent}: React.MouseEvent) => {
        if (!isDrawing) return
        if (!canvasRef.current) return
        
        const mouseX = nativeEvent.clientX - canvasOffsetX
        const mouseY = nativeEvent.clientY - canvasOffsetY
        
        const rectWidth = mouseX - startX
        const rectHeight = mouseY - startY
        
        contextRef.current?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)

        for (const rect of rects) {
            contextRef.current?.strokeRect(rect.startX, rect.startY, rect.rectWidth, rect.rectHeight)
        }
        contextRef.current?.strokeRect(startX, startY, rectWidth, rectHeight)
    }
    
    const stopDrawRect = async ({nativeEvent}: React.MouseEvent) => {
        if (!isDrawing) return
        if (!canvasRef.current) return

        const mouseX = nativeEvent.clientX - canvasOffsetX
        const mouseY = nativeEvent.clientY - canvasOffsetY

        const rectWidth = mouseX - startX
        const rectHeight = mouseY - startY

        const newRect: Rect = {startX, startY, rectWidth, rectHeight}

        setRects((prev) => [...prev, newRect])
        setIsDrawing(false)

        toast("Scrape box has been added", {
            description: "You can add more boxes by dragging the mouse",
            action: {
              label: "Undo",
              onClick: removeLastRect,
            },
        })
    }

    const submit = () => {
        console.log(rects)

        // TODO: send rects, scales and screenshot to backend for scraping (how? idk yet lol maybe use ky or axios and send it as form data)
    }

    return (
        <>
            <div className="relative w-full h-full bg-neutral-900 mb-5">
                <img src={src} id='toedit' className="w-full h-full object-contain" onLoad={resizeCanvas} alt="screenshot"/>
                <canvas className="w-full h-full absolute top-0 left-0" 
                        id="canvas"
                        ref={canvasRef}
                        onMouseDown={startDrawRect}
                        onMouseMove={drawRect}
                        onMouseUp={stopDrawRect}
                        onMouseLeave={stopDrawRect}
                        onContextMenu={(e)=> e.preventDefault()}>        
                </canvas>
            </div>
            <Button className='roboto text-xl'
                    onClick={submit}>
                Submit
            </Button>
        </>
    )
}