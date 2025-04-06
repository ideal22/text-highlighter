import React, { useState } from 'react'

interface HighlightRange {
  start: number
  end: number
}

const text =
  'Results-driven Senior Frontend Developer with over 5 years of experience building scalable, high-performance web applications and leading frontend teams. Proven expertise in React, Next.js, TypeScript, and state management libraries. Adept at delivering elegant, maintainable code, mentoring developers, and driving product excellence. Highly skilled in remote collaboration and cross-team communication, seeking to contribute to innovative projects in a fully remote environment'

const TextHighlighter: React.FC = () => {
  const [selectedText, setSelectedText] = useState<string>('')
  const [highlightedRanges, setHighlightedRanges] = useState<HighlightRange[]>(
    [],
  )
  const [selectionRange, setSelectionRange] = useState<HighlightRange>({
    start: -1,
    end: -1,
  })

  const handleSelection = (): void => {
    const selection = window.getSelection()

    if (selection && selection.toString().length > 0) {
      const selectionText = selection.toString()
      const selectionStart = text.indexOf(selectionText)

      if (selectionStart !== -1) {
        setSelectedText(selectionText)
        setSelectionRange({
          start: selectionStart,
          end: selectionStart + selectionText.length,
        })
      }
    }
  }

  const handleHighlight = (): void => {
    if (selectionRange.start !== -1 && selectionRange.end !== -1) {
      setHighlightedRanges([...highlightedRanges, selectionRange])
      setSelectionRange({ start: -1, end: -1 })
      setSelectedText('')
    }
  }

  const clearHighlights = (): void => {
    setHighlightedRanges([])
  }

  const renderTextWithHighlights = (): React.ReactNode => {
    if (highlightedRanges.length === 0) {
      return <p className="text-lg">{text}</p>
    }

    const sortedRanges = [...highlightedRanges].sort(
      (a, b) => a.start - b.start,
    )
    const segments: React.ReactNode[] = []
    let lastIndex = 0

    sortedRanges.forEach((range, index) => {
      if (range.start > lastIndex) {
        segments.push(
          <span key={`text-${index}`}>
            {text.substring(lastIndex, range.start)}
          </span>,
        )
      }

      segments.push(
        <span key={`highlight-${index}`} className="bg-yellow-300 px-1 rounded">
          {text.substring(range.start, range.end)}
        </span>,
      )

      lastIndex = range.end
    })

    if (lastIndex < text.length) {
      segments.push(<span key="text-end">{text.substring(lastIndex)}</span>)
    }

    return <p className="text-lg">{segments}</p>
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Text Highlighter</h2>

      <div
        className="p-4 border border-gray-300 rounded-md mb-4"
        onMouseUp={handleSelection}
      >
        {renderTextWithHighlights()}
      </div>

      <div className="flex gap-3 mb-4">
        <button
          onClick={handleHighlight}
          disabled={!selectedText}
          className={`px-4 py-2 rounded font-medium ${
            selectedText
              ? 'bg-blue-500 text-white hover:bg-blue-600'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Highlight Selection
        </button>

        <button
          onClick={clearHighlights}
          className="px-4 py-2 bg-red-500 text-white rounded font-medium hover:bg-red-600"
        >
          Clear Highlights
        </button>
      </div>

      {selectedText && (
        <div className="mt-2 p-2 bg-gray-100 rounded-md">
          <p className="font-medium">Selected text:</p>
          <p className="italic">"{selectedText}"</p>
        </div>
      )}
    </div>
  )
}

export default TextHighlighter
