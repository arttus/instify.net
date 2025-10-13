'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SharedStateProps {
  className?: string
}

interface StateItem {
  key: string
  value: string
  type: 'string' | 'number' | 'boolean' | 'object'
  lastUpdated: Date
  updatedBy: 'user' | 'agent'
}

export function SharedState({ className }: SharedStateProps) {
  const [state, setState] = useState<StateItem[]>([
    {
      key: 'customer_name',
      value: 'John Doe',
      type: 'string',
      lastUpdated: new Date(),
      updatedBy: 'agent'
    },
    {
      key: 'conversation_count',
      value: '42',
      type: 'number',
      lastUpdated: new Date(Date.now() - 300000),
      updatedBy: 'user'
    },
    {
      key: 'automation_active',
      value: 'true',
      type: 'boolean',
      lastUpdated: new Date(Date.now() - 600000),
      updatedBy: 'agent'
    }
  ])
  
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  // Simulate real-time state updates from agent
  useEffect(() => {
    const interval = setInterval(() => {
      setState(prev => prev.map(item => {
        if (Math.random() < 0.3) { // 30% chance to update
          let newValue = item.value
          if (item.type === 'number') {
            newValue = String(parseInt(item.value) + Math.floor(Math.random() * 5))
          } else if (item.type === 'boolean') {
            newValue = String(!JSON.parse(item.value))
          }
          
          return {
            ...item,
            value: newValue,
            lastUpdated: new Date(),
            updatedBy: 'agent' as const
          }
        }
        return item
      }))
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const addStateItem = () => {
    if (newKey && newValue) {
      const newItem: StateItem = {
        key: newKey,
        value: newValue,
        type: isNaN(Number(newValue)) ? 'string' : 'number',
        lastUpdated: new Date(),
        updatedBy: 'user'
      }
      setState(prev => [...prev, newItem])
      setNewKey('')
      setNewValue('')
    }
  }

  const updateStateItem = (key: string, value: string) => {
    setState(prev => prev.map(item => 
      item.key === key 
        ? { ...item, value, lastUpdated: new Date(), updatedBy: 'user' }
        : item
    ))
  }

  const removeStateItem = (key: string) => {
    setState(prev => prev.filter(item => item.key !== key))
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
          AG-UI Shared State
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Real-time synchronized state between agent and application
        </div>
        
        <div className="space-y-3">
          {state.map((item) => (
            <div key={item.key} className="flex items-center gap-2 p-2 border rounded">
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-muted px-1 rounded">
                    {item.key}
                  </span>
                  <span className={`text-xs px-1 rounded ${
                    item.updatedBy === 'agent' 
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                      : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                  }`}>
                    {item.updatedBy}
                  </span>
                </div>
                <Input
                  value={item.value}
                  onChange={(e) => updateStateItem(item.key, e.target.value)}
                  className="h-8 text-sm"
                />
                <div className="text-xs text-muted-foreground">
                  Updated at {formatTime(item.lastUpdated)}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeStateItem(item.key)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </Button>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <Label className="text-sm font-medium">Add New State</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Key"
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              className="h-8"
            />
            <Input
              placeholder="Value"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="h-8"
            />
            <Button size="sm" onClick={addStateItem}>
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
