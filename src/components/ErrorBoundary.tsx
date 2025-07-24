// src/components/ErrorBoundary.tsx
import { Alert, Button } from 'antd'
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            padding: '20px',
          }}
        >
          <Alert
            message="Something went wrong"
            description={
              <div>
                <p>The application encountered an unexpected error.</p>
                {this.state.error && (
                  <details style={{ marginTop: '10px' }}>
                    <summary>Error details</summary>
                    <pre style={{ fontSize: '12px', marginTop: '10px' }}>
                      {this.state.error.message}
                    </pre>
                  </details>
                )}
                <Button
                  type="primary"
                  onClick={this.handleReload}
                  style={{ marginTop: '16px' }}
                >
                  Reload Page
                </Button>
              </div>
            }
            type="error"
            showIcon
            style={{ maxWidth: '500px' }}
          />
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
