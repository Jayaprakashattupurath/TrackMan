'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Card,
  CardBody,
  VStack,
  HStack,
  Button,
  Input,
  Select,
  Textarea,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast,
  Flex,
  Checkbox,
  Progress,
  Divider,
} from '@chakra-ui/react'
import { 
  AddIcon, 
  CalendarIcon, 
  TimeIcon, 
  EditIcon,
  DeleteIcon,
  CheckIcon,
  WarningIcon
} from '@chakra-ui/icons'
import { useState, useEffect } from 'react'

interface Task {
  id: string
  title: string
  description?: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  due_date?: string
  estimated_duration_minutes?: number
  actual_duration_minutes?: number
  category?: string
  tags?: string[]
  created_at: string
  completed_at?: string
}

const priorities = [
  { value: 'low', label: 'Low', color: 'gray' },
  { value: 'medium', label: 'Medium', color: 'blue' },
  { value: 'high', label: 'High', color: 'orange' },
  { value: 'urgent', label: 'Urgent', color: 'red' }
]

const statuses = [
  { value: 'pending', label: 'Pending', color: 'gray' },
  { value: 'in_progress', label: 'In Progress', color: 'blue' },
  { value: 'completed', label: 'Completed', color: 'green' },
  { value: 'cancelled', label: 'Cancelled', color: 'red' }
]

const categories = [
  'Work',
  'Personal',
  'Health',
  'Learning',
  'Finance',
  'Home',
  'Social',
  'Other'
]

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    due_date: '',
    estimated_duration_minutes: '',
    category: '',
    tags: ''
  })
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  // Mock data for now
  useEffect(() => {
    const mockTasks: Task[] = [
      {
        id: '1',
        title: 'Complete project proposal',
        description: 'Write and submit the Q1 project proposal by Friday',
        status: 'in_progress',
        priority: 'high',
        due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estimated_duration_minutes: 120,
        category: 'Work',
        tags: ['proposal', 'deadline'],
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Grocery shopping',
        description: 'Buy ingredients for weekend meal prep',
        status: 'pending',
        priority: 'medium',
        due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estimated_duration_minutes: 45,
        category: 'Personal',
        tags: ['shopping', 'food'],
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        title: 'Review code changes',
        description: 'Review pull requests from team members',
        status: 'completed',
        priority: 'high',
        due_date: new Date().toISOString().split('T')[0],
        estimated_duration_minutes: 90,
        actual_duration_minutes: 85,
        category: 'Work',
        tags: ['code', 'review'],
        created_at: new Date().toISOString(),
        completed_at: new Date().toISOString()
      }
    ]
    setTasks(mockTasks)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newTask: Task = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        status: 'pending',
        priority: formData.priority as Task['priority'],
        due_date: formData.due_date || undefined,
        estimated_duration_minutes: formData.estimated_duration_minutes ? parseInt(formData.estimated_duration_minutes) : undefined,
        category: formData.category || undefined,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : undefined,
        created_at: new Date().toISOString()
      }

      setTasks(prev => [newTask, ...prev])
      
      toast({
        title: 'Task created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        due_date: '',
        estimated_duration_minutes: '',
        category: '',
        tags: ''
      })
      
      onClose()
    } catch (error) {
      toast({
        title: 'Error creating task',
        description: 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { 
            ...task, 
            status: newStatus,
            completed_at: newStatus === 'completed' ? new Date().toISOString() : undefined
          }
        : task
    ))

    toast({
      title: `Task marked as ${newStatus}`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    })
  }

  const handleDelete = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id))
    toast({
      title: 'Task deleted',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'overdue') {
      return task.status !== 'completed' && task.due_date && new Date(task.due_date) < new Date()
    }
    return task.status === filter
  })

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find(p => p.value === priority)
    return priorityObj?.color || 'gray'
  }

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(s => s.value === status)
    return statusObj?.color || 'gray'
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date()
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    overdue: tasks.filter(t => t.status !== 'completed' && t.due_date && isOverdue(t.due_date)).length
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="container.xl">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <VStack align="start" spacing={2}>
            <Heading size="xl" color="brand.500">
              Task Manager
            </Heading>
            <Text color="gray.600">
              Organize and track your tasks efficiently
            </Text>
          </VStack>
          <Button 
            leftIcon={<AddIcon />} 
            colorScheme="brand" 
            onClick={onOpen}
          >
            Add Task
          </Button>
        </Flex>

        {/* Stats Overview */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(5, 1fr)' }} gap={4} mb={8}>
          <GridItem>
            <Card>
              <CardBody>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">Total</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                    {stats.total}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card>
              <CardBody>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">Completed</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">
                    {stats.completed}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card>
              <CardBody>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">Pending</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                    {stats.pending}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card>
              <CardBody>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">In Progress</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="orange.500">
                    {stats.inProgress}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card>
              <CardBody>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">Overdue</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="red.500">
                    {stats.overdue}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Progress Overview */}
        <Card mb={8}>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Text fontWeight="medium">Overall Progress</Text>
              <Box w="full">
                <Flex justify="space-between" mb={2}>
                  <Text fontSize="sm">Task Completion</Text>
                  <Text fontSize="sm" fontWeight="medium">
                    {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                  </Text>
                </Flex>
                <Progress 
                  value={stats.total > 0 ? (stats.completed / stats.total) * 100 : 0} 
                  colorScheme="green" 
                  size="lg" 
                />
              </Box>
            </VStack>
          </CardBody>
        </Card>

        {/* Filter Tabs */}
        <HStack spacing={2} mb={6}>
          {[
            { key: 'all', label: 'All Tasks', color: 'gray' },
            { key: 'pending', label: 'Pending', color: 'blue' },
            { key: 'in_progress', label: 'In Progress', color: 'orange' },
            { key: 'completed', label: 'Completed', color: 'green' },
            { key: 'overdue', label: 'Overdue', color: 'red' }
          ].map(filterOption => (
            <Button
              key={filterOption.key}
              size="sm"
              variant={filter === filterOption.key ? 'solid' : 'outline'}
              colorScheme={filter === filterOption.key ? filterOption.color : 'gray'}
              onClick={() => setFilter(filterOption.key)}
            >
              {filterOption.label}
            </Button>
          ))}
        </HStack>

        {/* Tasks List */}
        <Card>
          <CardBody>
            <VStack spacing={4} align="stretch">
              {filteredTasks.length === 0 ? (
                <Text color="gray.500" textAlign="center" py={8}>
                  {filter === 'all' 
                    ? 'No tasks created yet. Add your first task to get started!'
                    : `No ${filter} tasks found.`
                  }
                </Text>
              ) : (
                filteredTasks.map((task) => (
                  <Box key={task.id} p={4} border="1px" borderColor="gray.200" borderRadius="lg">
                    <Flex justify="space-between" align="start" mb={3}>
                      <HStack spacing={3} flex={1}>
                        <Checkbox
                          isChecked={task.status === 'completed'}
                          onChange={(e) => handleStatusChange(
                            task.id, 
                            e.target.checked ? 'completed' : 'pending'
                          )}
                          colorScheme="green"
                        />
                        <VStack align="start" spacing={1} flex={1}>
                          <HStack spacing={2}>
                            <Text 
                              fontWeight="medium" 
                              fontSize="lg"
                              textDecoration={task.status === 'completed' ? 'line-through' : 'none'}
                              color={task.status === 'completed' ? 'gray.500' : 'inherit'}
                            >
                              {task.title}
                            </Text>
                            {task.due_date && isOverdue(task.due_date) && task.status !== 'completed' && (
                              <WarningIcon color="red.500" />
                            )}
                          </HStack>
                          {task.description && (
                            <Text 
                              color="gray.600" 
                              fontSize="sm"
                              textDecoration={task.status === 'completed' ? 'line-through' : 'none'}
                            >
                              {task.description}
                            </Text>
                          )}
                          <HStack spacing={4} fontSize="sm" color="gray.500">
                            <Badge colorScheme={getPriorityColor(task.priority)}>
                              {priorities.find(p => p.value === task.priority)?.label}
                            </Badge>
                            <Badge colorScheme={getStatusColor(task.status)}>
                              {statuses.find(s => s.value === task.status)?.label}
                            </Badge>
                            {task.category && (
                              <Badge variant="outline" colorScheme="gray">
                                {task.category}
                              </Badge>
                            )}
                            {task.due_date && (
                              <HStack spacing={1}>
                                <CalendarIcon />
                                <Text 
                                  color={isOverdue(task.due_date) && task.status !== 'completed' ? 'red.500' : 'inherit'}
                                >
                                  {new Date(task.due_date).toLocaleDateString()}
                                </Text>
                              </HStack>
                            )}
                            {task.estimated_duration_minutes && (
                              <HStack spacing={1}>
                                <TimeIcon />
                                <Text>{formatDuration(task.estimated_duration_minutes)}</Text>
                              </HStack>
                            )}
                          </HStack>
                          {task.tags && task.tags.length > 0 && (
                            <HStack spacing={1} mt={2}>
                              {task.tags.map((tag, index) => (
                                <Badge key={index} variant="subtle" colorScheme="gray" size="sm">
                                  {tag}
                                </Badge>
                              ))}
                            </HStack>
                          )}
                        </VStack>
                      </HStack>
                      <HStack spacing={2}>
                        <Select
                          size="sm"
                          value={task.status}
                          onChange={(e) => handleStatusChange(task.id, e.target.value as Task['status'])}
                          w="140px"
                        >
                          {statuses.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </Select>
                        <IconButton
                          aria-label="Edit task"
                          icon={<EditIcon />}
                          size="sm"
                          variant="ghost"
                        />
                        <IconButton
                          aria-label="Delete task"
                          icon={<DeleteIcon />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDelete(task.id)}
                        />
                      </HStack>
                    </Flex>
                  </Box>
                ))
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Add Task Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Task</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Task Title</FormLabel>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Complete project proposal"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Description</FormLabel>
                    <Textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Optional description..."
                    />
                  </FormControl>

                  <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                    <FormControl>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        name="priority"
                        value={formData.priority}
                        onChange={handleInputChange}
                      >
                        {priorities.map(priority => (
                          <option key={priority.value} value={priority.value}>
                            {priority.label}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Due Date</FormLabel>
                      <Input
                        name="due_date"
                        type="date"
                        value={formData.due_date}
                        onChange={handleInputChange}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Estimated Duration (minutes)</FormLabel>
                      <Input
                        name="estimated_duration_minutes"
                        type="number"
                        value={formData.estimated_duration_minutes}
                        onChange={handleInputChange}
                        placeholder="60"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Category</FormLabel>
                      <Select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="Select category"
                      >
                        {categories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <FormControl>
                    <FormLabel>Tags (comma-separated)</FormLabel>
                    <Input
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="e.g., urgent, project, deadline"
                    />
                  </FormControl>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" colorScheme="brand" isLoading={loading}>
                  Create Task
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  )
}
