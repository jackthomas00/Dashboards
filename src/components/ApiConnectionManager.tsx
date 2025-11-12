import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store'
import { addConnection, updateConnection, removeConnection } from '../store/slices/apiConnectionsSlice'
import { useLazyFetchApiDataQuery } from '../store/api/apiSlice'
import { ApiConnection } from '../store/api/apiSlice'
import { Plus, Trash2, Edit, Check, X } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { PasswordInput } from '@/components/ui/password-input'

function ApiConnectionManager() {
  const dispatch = useDispatch()
  const { toast } = useToast()
  const connections = useSelector((state: RootState) => state.apiConnections.connections)
  const [opened, setOpened] = useState(false)
  const [editingConnection, setEditingConnection] = useState<ApiConnection | null>(null)
  const [testEndpoint, setTestEndpoint] = useState('')
  const [testResult, setTestResult] = useState<any>(null)
  const [fetchData, { isLoading: isTesting }] = useLazyFetchApiDataQuery()

  const [formData, setFormData] = useState<Partial<ApiConnection>>({
    name: '',
    baseUrl: '',
    authType: 'none',
    headers: {},
    authConfig: {},
  })

  const handleOpenModal = (connection?: ApiConnection) => {
    if (connection) {
      setEditingConnection(connection)
      setFormData(connection)
    } else {
      setEditingConnection(null)
      setFormData({
        name: '',
        baseUrl: '',
        authType: 'none',
        headers: {},
        authConfig: {},
      })
    }
    setOpened(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.baseUrl) {
      toast({
        title: 'Validation Error',
        description: 'Name and Base URL are required',
        variant: 'destructive',
      })
      return
    }

    const connection: ApiConnection = {
      id: editingConnection?.id || uuidv4(),
      name: formData.name,
      baseUrl: formData.baseUrl,
      authType: formData.authType || 'none',
      headers: formData.headers || {},
      authConfig: formData.authConfig || {},
    }

    if (editingConnection) {
      dispatch(updateConnection(connection))
      toast({
        title: 'Success',
        description: 'Connection updated successfully',
      })
    } else {
      dispatch(addConnection(connection))
      toast({
        title: 'Success',
        description: 'Connection added successfully',
      })
    }

    setOpened(false)
    setEditingConnection(null)
  }

  const handleDelete = (id: string) => {
    dispatch(removeConnection(id))
    toast({
      title: 'Success',
      description: 'Connection removed',
    })
  }

  const handleTest = async () => {
    if (!editingConnection && !formData.name) {
      toast({
        title: 'Error',
        description: 'Please save the connection first',
        variant: 'destructive',
      })
      return
    }

    const connectionId = editingConnection?.id || formData.id || ''
    if (!connectionId) {
      toast({
        title: 'Error',
        description: 'Please save the connection first',
        variant: 'destructive',
      })
      return
    }

    try {
      const result = await fetchData({
        connectionId,
        endpoint: testEndpoint || '/',
        method: 'GET',
      }).unwrap()

      setTestResult(result)
      toast({
        title: 'Success',
        description: 'API test successful',
      })
    } catch (error: any) {
      setTestResult({ error: error.message || 'Test failed' })
      toast({
        title: 'Error',
        description: 'API test failed',
        variant: 'destructive',
      })
    }
  }

  const parseHeaders = (headersString: string): Record<string, string> => {
    const headers: Record<string, string> = {}
    if (!headersString.trim()) return headers

    headersString.split('\n').forEach((line) => {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length > 0) {
        headers[key.trim()] = valueParts.join(':').trim()
      }
    })

    return headers
  }

  const formatHeaders = (headers: Record<string, string>): string => {
    return Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n')
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">API Connections</h2>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="mr-2 h-4 w-4" />
          Add Connection
        </Button>
      </div>

      {connections.length === 0 ? (
        <Card className="text-center py-8">
          <CardContent>
            <p className="text-muted-foreground">No API connections yet. Add one to get started!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-2">
          {connections.map((connection) => (
            <Card key={connection.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-base">{connection.name}</CardTitle>
                      <Badge variant="secondary">{connection.authType}</Badge>
                    </div>
                    <CardDescription>{connection.baseUrl}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpenModal(connection)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(connection.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingConnection ? 'Edit Connection' : 'Add Connection'}</DialogTitle>
            <DialogDescription>
              Configure your API connection settings
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Connection Name</Label>
              <Input
                id="name"
                placeholder="My API"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="baseUrl">Base URL</Label>
              <Input
                id="baseUrl"
                placeholder="https://api.example.com"
                value={formData.baseUrl || ''}
                onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="authType">Authentication Type</Label>
              <Select
                value={formData.authType || 'none'}
                onValueChange={(value) =>
                  setFormData({ ...formData, authType: (value as any) || 'none' })
                }
              >
                <SelectTrigger id="authType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="bearer">Bearer Token</SelectItem>
                  <SelectItem value="basic">Basic Auth</SelectItem>
                  <SelectItem value="apiKey">API Key</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.authType === 'bearer' && (
              <div className="grid gap-2">
                <Label htmlFor="token">Bearer Token</Label>
                <PasswordInput
                  id="token"
                  value={formData.authConfig?.token || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      authConfig: { ...formData.authConfig, token: e.target.value },
                    })
                  }
                />
              </div>
            )}

            {formData.authType === 'basic' && (
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.authConfig?.username || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      authConfig: { ...formData.authConfig, username: e.target.value },
                    })
                  }
                />
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  value={formData.authConfig?.password || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      authConfig: { ...formData.authConfig, password: e.target.value },
                    })
                  }
                />
              </div>
            )}

            {formData.authType === 'apiKey' && (
              <div className="grid gap-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  value={formData.authConfig?.apiKey || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      authConfig: { ...formData.authConfig, apiKey: e.target.value },
                    })
                  }
                />
                <Label htmlFor="apiKeyHeader">Header Name</Label>
                <Input
                  id="apiKeyHeader"
                  placeholder="X-API-Key"
                  value={formData.authConfig?.apiKeyHeader || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      authConfig: { ...formData.authConfig, apiKeyHeader: e.target.value },
                    })
                  }
                />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="headers">Custom Headers (one per line, format: Key: Value)</Label>
              <Textarea
                id="headers"
                placeholder="Content-Type: application/json"
                value={formatHeaders(formData.headers || {})}
                onChange={(e) =>
                  setFormData({ ...formData, headers: parseHeaders(e.target.value) })
                }
                rows={3}
              />
            </div>

            <Separator />

            <div className="grid gap-2">
              <Label htmlFor="testEndpoint">Test Endpoint</Label>
              <Input
                id="testEndpoint"
                placeholder="/users"
                value={testEndpoint}
                onChange={(e) => setTestEndpoint(e.target.value)}
              />
            </div>

            <Button onClick={handleTest} disabled={isTesting}>
              {isTesting ? 'Testing...' : 'Test Connection'}
            </Button>

            {testResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Test Result:</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="text-xs font-mono whitespace-pre-wrap overflow-auto">
                    {testResult.error
                      ? `Error: ${testResult.error}`
                      : JSON.stringify(testResult.data, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Check className="mr-2 h-4 w-4" />
              {editingConnection ? 'Update' : 'Add'} Connection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ApiConnectionManager
