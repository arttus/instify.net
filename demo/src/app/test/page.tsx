export default function TestPage() {
  return (
    <html lang="en">
      <head>
        <title>Test Page</title>
      </head>
      <body>
        <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
          <h1>✅ Test Page Loaded Successfully</h1>
          <p>This is a minimal test page with no providers or complex components.</p>
          <ul>
            <li>No ThemeProvider</li>
            <li>No CopilotProvider</li>
            <li>No external fonts</li>
            <li>No complex components</li>
          </ul>
          <p>Timestamp: {new Date().toISOString()}</p>
        </div>
      </body>
    </html>
  )
}

