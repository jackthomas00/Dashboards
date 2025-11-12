import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addDashboard, setActiveDashboard } from '../store/slices/dashboardSlice'
import { RootState } from '../store'
import { v4 as uuidv4 } from 'uuid'
import { Plus, LayoutDashboard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useToast } from '@/components/ui/use-toast'

function HomePage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { toast } = useToast()
  const dashboards = useSelector((state: RootState) => state.dashboard.dashboards)
  const [opened, setOpened] = useState(false)
  const [dashboardName, setDashboardName] = useState('')

  const handleCreateDashboard = () => {
    if (!dashboardName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a dashboard name",
        variant: "destructive",
      })
      return
    }

    const newDashboard = {
      id: uuidv4(),
      name: dashboardName,
      widgets: [],
      layout: [],
    }

    dispatch(addDashboard(newDashboard))
    dispatch(setActiveDashboard(newDashboard.id))
    setDashboardName('')
    setOpened(false)
    navigate(`/dashboard/${newDashboard.id}`)
  }

  const handleOpenDashboard = (id: string) => {
    dispatch(setActiveDashboard(id))
    navigate(`/dashboard/${id}`)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col gap-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold">Dashboard Builder</h1>
          <Button onClick={() => setOpened(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Dashboard
          </Button>
        </div>

        {dashboards.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="flex flex-col items-center gap-4 pt-6">
              <LayoutDashboard className="h-16 w-16 opacity-50" />
              <p className="text-muted-foreground text-lg">
                No dashboards yet. Create your first dashboard to get started!
              </p>
              <Button onClick={() => setOpened(true)}>Create Dashboard</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboards.map((dashboard) => (
              <Card
                key={dashboard.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleOpenDashboard(dashboard.id)}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>{dashboard.name}</CardTitle>
                    <LayoutDashboard className="h-5 w-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {dashboard.widgets.length} widget{dashboard.widgets.length !== 1 ? 's' : ''}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={opened} onOpenChange={setOpened}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Dashboard</DialogTitle>
            <DialogDescription>
              Enter a name for your new dashboard
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Dashboard Name</Label>
              <Input
                id="name"
                placeholder="Enter dashboard name"
                value={dashboardName}
                onChange={(e) => setDashboardName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCreateDashboard()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpened(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateDashboard}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default HomePage
