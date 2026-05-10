import React from 'react'
import '../src/App.css'
import Navbar from './components/Navbar'
import Editor from '@monaco-editor/react'
import Select from 'react-select'

const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'react', label: 'React JSX' },
]

const reviewTypeOptions = [
  { value: 'all', label: 'All checks' },
  { value: 'syntax', label: 'Syntax & style' },
  { value: 'best-practices', label: 'Best practices' },
  { value: 'security', label: 'Security & safety' },
]

const sampleCode = `// Paste your JavaScript code here
const message = 'Hello LintMind'

function greet() {
  console.log(message)
}

greet()
`

const selectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#111827',
    borderColor: state.isFocused ? '#fbbf24' : '#374151',
    boxShadow: state.isFocused ? '0 0 0 1px #fbbf24' : 'none',
    minHeight: '38px',
    color: '#f8fafc',
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: '#111827',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgb(15 23 42 / 0.35)',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#1f2937' : '#111827',
    color: '#f8fafc',
    cursor: 'pointer',
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#f8fafc',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#94a3b8',
  }),
  input: (provided) => ({
    ...provided,
    color: '#f8fafc',
  }),
  menuList: (provided) => ({
    ...provided,
    padding: '4px',
  }),
}

const selectTheme = (theme) => ({
  ...theme,
  borderRadius: 14,
  colors: {
    ...theme.colors,
    primary: '#fbbf24',
    primary75: '#fde68a',
    primary50: '#fef3c7',
    primary25: '#111827',
    neutral0: '#111827',
    neutral5: '#111827',
    neutral10: '#1f2937',
    neutral20: '#374151',
    neutral30: '#4b5563',
    neutral80: '#f8fafc',
  },
})

const App = () => {
  const [selectedLanguage, setSelectedLanguage] = React.useState(languageOptions[0])
  const [selectedReviewType, setSelectedReviewType] = React.useState(reviewTypeOptions[0])
  const [code, setCode] = React.useState(sampleCode)
  const [results, setResults] = React.useState([])

  const reviewCode = (source, reviewType) => {
    if (!source || !source.trim()) {
      return [{ type: 'info', message: 'Add code on the left and click Run Review.' }]
    }

    const issues = []
    const lines = source.split('\n')
    const hasConsole = /console\.(log|error|warn|info)\(/.test(source)
    const hasVar = /\bvar\b/.test(source)
    const hasDoubleEquals = /(?<![=!])==(?!=)/.test(source) || /!=/.test(source)
    const hasEval = /\beval\(/.test(source)
    const hasTodo = /TODO|FIXME/.test(source)
    const hasFunctionExpression = /const\s+\w+\s*=\s*function\s*\(/.test(source)
    const longLine = lines.find(line => line.length > 100)

    if (reviewType === 'all' || reviewType === 'syntax') {
      if (hasVar) {
        issues.push({
          type: 'warning',
          message: 'Use `let` or `const` instead of `var` to avoid unexpected scope behavior.',
        })
      }

      if (hasDoubleEquals) {
        issues.push({
          type: 'warning',
          message: 'Use `===` and `!==` instead of `==` and `!=` to prevent type coercion bugs.',
        })
      }

      if (longLine) {
        issues.push({
          type: 'suggestion',
          message: `Line ${lines.indexOf(longLine) + 1} is ${longLine.length} characters long. Wrap or refactor long expressions for readability.`,
        })
      }
    }

    if (reviewType === 'all' || reviewType === 'best-practices') {
      if (hasConsole) {
        issues.push({
          type: 'suggestion',
          message: 'Remove `console` debug statements before shipping or replace them with a proper logger.',
        })
      }

      if (hasFunctionExpression) {
        issues.push({
          type: 'suggestion',
          message: 'Convert anonymous function expressions to arrow functions for cleaner syntax.',
        })
      }
    }

    if (reviewType === 'all' || reviewType === 'security') {
      if (hasEval) {
        issues.push({
          type: 'error',
          message: 'Avoid `eval()`. It creates security risks and makes code harder to maintain.',
        })
      }

      if (/document\.getElementById\(/.test(source) && selectedLanguage.value === 'react') {
        issues.push({
          type: 'warning',
          message: 'In React, prefer refs or state instead of direct DOM access such as `document.getElementById`.',
        })
      }
    }

    if (reviewType === 'all' || reviewType === 'syntax') {
      if (hasTodo) {
        issues.push({
          type: 'info',
          message: 'TODO/FIXME comments are still present. Resolve them before finalizing the code.',
        })
      }
    }

    if (issues.length === 0) {
      return [{ type: 'success', message: 'No issues found. Your code looks good!' }]
    }

    return issues
  }

  const getIssueMeta = (type) => {
    return {
      error: {
        label: 'Error',
        style: { border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.1)', color: '#fee2e2' },
      },
      warning: {
        label: 'Warning',
        style: { border: '1px solid rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.1)', color: '#fef3c7' },
      },
      suggestion: {
        label: 'Suggestion',
        style: { border: '1px solid rgba(14,165,233,0.3)', background: 'rgba(14,165,233,0.1)', color: '#e0f2fe' },
      },
      info: {
        label: 'Info',
        style: { border: '1px solid rgba(148,163,184,0.2)', background: '#1e293b', color: '#e2e8f0' },
      },
      success: {
        label: 'Success',
        style: { border: '1px solid rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.1)', color: '#d1fae5' },
      },
    }[type] || {
      label: 'Note',
      style: { border: '1px solid rgba(148,163,184,0.2)', background: '#1e293b', color: '#e2e8f0' },
    }
  }

  const handleRunReview = () => {
    const reviewResults = reviewCode(code, selectedReviewType.value)
    setResults(reviewResults)
  }

  return (
    <>
      <Navbar />
      <div style={{ 
        minHeight: 'calc(100vh - 90px)', 
        display: 'grid', 
        gridTemplateColumns: '1.5fr 1fr',
        alignItems: 'stretch',
        gap: '10px'
      }}>
  <div className='left flex flex-col' style={{ 
    borderRadius: '20px', 
    background: '#0d131f', 
    padding: '20px', 
    minHeight: '100%',
    boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
  }}>
          <div className='mb-4 flex flex-col gap-3 rounded-[16px] border border-white/10 bg-[#111827] p-4 sm:flex-row sm:items-center sm:justify-between' style={{ flexWrap: 'nowrap', gap: '16px' }}>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4 w-full sm:w-auto' style={{ flex: 1, gap: '12px' }}>
              <div className='w-full min-w-[140px] sm:w-[160px]'>
                <Select
                  value={selectedLanguage}
                  options={languageOptions}
                  onChange={setSelectedLanguage}
                  styles={selectStyles}
                  theme={selectTheme}
                />
              </div>
              <div className='w-full min-w-[140px] sm:w-[180px]'>
                <Select
                  value={selectedReviewType}
                  options={reviewTypeOptions}
                  onChange={setSelectedReviewType}
                  styles={selectStyles}
                  theme={selectTheme}
                />
              </div>
            </div>
            <div className='flex justify-center sm:justify-end' style={{ flexShrink: 0 }}>
              <button
                onClick={handleRunReview}
                className='rounded-full bg-[#fcd34d] font-semibold text-black transition hover:bg-[#facc15]'
                style={{ padding: '7px 20px', fontSize: '14px', whiteSpace: 'nowrap', flexShrink: 0 }}
              >
                Run Review
              </button>
            </div>
          </div>

          <div className='flex-1 overflow-hidden rounded-[20px] border border-white/10 bg-[#0b101f]'>
            <Editor
              height='100%'
              theme='vs-dark'
              language={selectedLanguage.value === 'react' ? 'javascript' : selectedLanguage.value}
              value={code}
              onChange={(value) => setCode(value ?? '')}
              options={{ minimap: { enabled: false }, fontSize: 14, wordWrap: 'on' }}
            />
          </div>
        </div>

       <div className='right' style={{ 
         borderRadius: '20px', 
         background: '#0f172a', 
         padding: '24px', 
         border: '1px solid rgba(255,255,255,0.08)', 
         minHeight: '100%',
         boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.25)'
       }}>
           <div className='mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
            <div>
              <h2 className='text-2xl font-bold text-white'>Code Review</h2>
              <p className='text-sm text-gray-400'>Review results for {selectedLanguage.label}</p>
            </div>
            <span className='rounded-full bg-white/10 px-3 py-1 text-sm font-medium text-white'>{results.length} items</span>
          </div>

          <div className='space-y-3 overflow-y-auto max-h-[calc(100%-140px)] pr-2'>
            {results.map((result, index) => {
              const meta = getIssueMeta(result.type)
              return (
                <div key={`${result.type}-${index}`} style={{ ...meta.style, borderRadius: '16px', padding: '24px' }}>
                  <div className='mb-4 flex items-center justify-between'>
                    <span style={{ borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', padding: '6px 16px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.05em', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>
                      {meta.label}
                    </span>
                    <span className='flex-shrink-0 text-xs font-medium uppercase tracking-wider text-white/60'>Item {index + 1}</span>
                  </div>
                  <p className='text-sm leading-6 text-gray-100'>{result.message}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default App