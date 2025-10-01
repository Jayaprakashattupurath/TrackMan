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
  Divider,
} from '@chakra-ui/react'
import { 
  AddIcon, 
  CalendarIcon, 
  TimeIcon, 
  LocationIcon,
  EditIcon,
  DeleteIcon
} from '@chakra-ui/icons'
import { useState, useEffect } from 'react'

interface Activity {
  id: string
  title: string
  description?: string
  category: string
  duration_minutes?: number
  date: string
  time_start?: string
  time_end?: string
  location?: string
  tags?: string[]
  created_at: string
}

const categories = [
  'Work',
  'Exercise',
  'Personal',
  'Learning',
  'Social',
  'Health',
  'Hobbies',
  'Travel',
  'Other'
]

export default function ActivityTracker() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration_minutes: '',
    date: new Date().toISOString().split('T')[0],
    time_start: '',
    time_end: '',
    location: '',
    tags: ''
  })
  
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  // Mock data for now
  useEffect(() => {
    const mockActivities: Activity[] = [
      {
        id: '1',
        title: 'Morning Workout',
        description: 'Cardio and strength training',
        category: 'Exercise',
        duration_minutes: 45,
        date: new Date().toISOString().split('T')[0],
        time_start: '07:00',
        time_end: '07:45',
        location: 'Home Gym',
        tags: ['cardio', 'strength'],
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        title: 'Team Meeting',
        description: 'Weekly project review',
        category: 'Work',
        duration_minutes: 60,
        date: new Date().toISOString().split('T')[0],
        time_start: '10:00',
        time_end: '11:00',
        location: 'Conference Room',
        tags: ['meeting', 'project'],
        created_at: new Date().toISOString()
      }
    ]
    setActivities(mockActivities)
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
      // TODO: Replace with actual API call
      const newActivity: Activity = {
        id: Date.now().toString(),
        title: formData.title,
        description: formData.description,
        category: formData.category,
        duration_minutes: formData.duration_minutes ? parseInt(formData.duration_minutes) : undefined,
        date: formData.date,
        time_start: formData.time_start || undefined,
        time_end: formData.time_end || undefined,
        location: formData.location,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : undefined,
        created_at: new Date().toISOString()
      }

      setActivities(prev => [newActivity, ...prev])
      
      toast({
        title: 'Activity added successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        duration_minutes: '',
        date: new Date().toISOString().split('T')[0],
        time_start: '',
        time_end: '',
        location: '',
        tags: ''
      })
      
      onClose()
    } catch (error) {
      toast({
        title: 'Error adding activity',
        description: 'Please try again',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = (id: string) => {
    setActivities(prev => prev.filter(activity => activity.id !== id))
    toast({
      title: 'Activity deleted',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Work': 'blue',
      'Exercise': 'green',
      'Personal': 'purple',
      'Learning': 'orange',
      'Social': 'pink',
      'Health': 'red',
      'Hobbies': 'yellow',
      'Travel': 'cyan',
      'Other': 'gray'
    }
    return colors[category] || 'gray'
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="container.xl">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <VStack align="start" spacing={2}>
            <Heading size="xl" color="brand.500">
              Activity Tracker
            </Heading>
            <Text color="gray.600">
              Track your daily activities and routines
            </Text>
          </VStack>
          <Button 
            leftIcon={<AddIcon />} 
            colorScheme="brand" 
            onClick={onOpen}
          >
            Add Activity
          </Button>
        </Flex>

        {/* Stats Overview */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap={6} mb={8}>
          <GridItem>
            <Card>
              <CardBody>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">Today's Activities</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="brand.500">
                    {activities.filter(a => a.date === new Date().toISOString().split('T')[0]).length}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {activities
                      .filter(a => a.date === new Date().toISOString().split('T')[0])
                      .reduce((sum, a) => sum + (a.duration_minutes || 0), 0)} minutes
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card>
              <CardBody>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">This Week</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">
                    {activities.length}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    {activities.reduce((sum, a) => sum + (a.duration_minutes || 0), 0)} minutes
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
          
          <GridItem>
            <Card>
              <CardBody>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color="gray.600">Categories</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.500">
                    {new Set(activities.map(a => a.category)).size}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Different types
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Activities List */}
        <Card>
          <CardBody>
            <Heading size="md" mb={6}>Recent Activities</Heading>
            <VStack spacing={4} align="stretch">
              {activities.length === 0 ? (
                <Text color="gray.500" textAlign="center" py={8}>
                  No activities recorded yet. Add your first activity to get started!
                </Text>
              ) : (
                activities.map((activity) => (
                  <Box key={activity.id} p={4} border="1px" borderColor="gray.200" borderRadius="lg">
                    <Flex justify="space-between" align="start" mb={2}>
                      <VStack align="start" spacing={1} flex={1}>
                        <HStack spacing={2}>
                          <Text fontWeight="medium" fontSize="lg">{activity.title}</Text>
                          <Badge colorScheme={getCategoryColor(activity.category)}>
                            {activity.category}
                          </Badge>
                        </HStack>
                        {activity.description && (
                          <Text color="gray.600" fontSize="sm">{activity.description}</Text>
                        )}
                        <HStack spacing={4} fontSize="sm" color="gray.500">
                          <HStack spacing={1}>
                            <CalendarIcon />
                            <Text>{new Date(activity.date).toLocaleDateString()}</Text>
                          </HStack>
                          {activity.time_start && (
                            <HStack spacing={1}>
                              <TimeIcon />
                              <Text>{activity.time_start}</Text>
                            </HStack>
                          )}
                          {activity.duration_minutes && (
                            <Text>{formatDuration(activity.duration_minutes)}</Text>
                          )}
                          {activity.location && (
                            <HStack spacing={1}>
                              <LocationIcon />
                              <Text>{activity.location}</Text>
                            </HStack>
                          )}
                        </HStack>
                        {activity.tags && activity.tags.length > 0 && (
                          <HStack spacing={1} mt={2}>
                            {activity.tags.map((tag, index) => (
                              <Badge key={index} variant="subtle" colorScheme="gray" size="sm">
                                {tag}
                              </Badge>
                            ))}
                          </HStack>
                        )}
                      </VStack>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Edit activity"
                          icon={<EditIcon />}
                          size="sm"
                          variant="ghost"
                        />
                        <IconButton
                          aria-label="Delete activity"
                          icon={<DeleteIcon />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => handleDelete(activity.id)}
                        />
                      </HStack>
                    </Flex>
                  </Box>
                ))
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Add Activity Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add New Activity</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Activity Title</FormLabel>
                    <Input
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Morning Workout"
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
                    <FormControl isRequired>
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

                    <FormControl>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <Input
                        name="duration_minutes"
                        type="number"
                        value={formData.duration_minutes}
                        onChange={handleInputChange}
                        placeholder="45"
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Date</FormLabel>
                      <Input
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleInputChange}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Location</FormLabel>
                      <Input
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Home, Office"
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Start Time</FormLabel>
                      <Input
                        name="time_start"
                        type="time"
                        value={formData.time_start}
                        onChange={handleInputChange}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>End Time</FormLabel>
                      <Input
                        name="time_end"
                        type="time"
                        value={formData.time_end}
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </Grid>

                  <FormControl>
                    <FormLabel>Tags (comma-separated)</FormLabel>
                    <Input
                      name="tags"
                      value={formData.tags}
                      onChange={handleInputChange}
                      placeholder="e.g., cardio, strength, morning"
                    />
                  </FormControl>
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit" colorScheme="brand" isLoading={loading}>
                  Add Activity
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  )
}
