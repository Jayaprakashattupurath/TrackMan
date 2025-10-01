'use client'

import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Card,
  CardBody,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Button,
  IconButton,
  useColorModeValue,
  Flex,
  Badge,
  Progress,
  Divider,
} from '@chakra-ui/react'
import { 
  CalendarIcon, 
  TimeIcon, 
  StarIcon, 
  SettingsIcon,
  ViewIcon,
  AddIcon,
  CheckIcon,
  WarningIcon,
  InfoIcon
} from '@chakra-ui/icons'
import { useState, useEffect } from 'react'

interface DashboardStats {
  activities: {
    total: number
    today: number
    thisWeek: number
  }
  tasks: {
    total: number
    completed: number
    pending: number
    overdue: number
  }
  health: {
    workouts: number
    meals: number
    sleepHours: number
  }
  work: {
    hoursToday: number
    projects: number
    billableHours: number
  }
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  // Mock data for now - will be replaced with API calls
  useEffect(() => {
    const mockStats: DashboardStats = {
      activities: {
        total: 156,
        today: 8,
        thisWeek: 42
      },
      tasks: {
        total: 23,
        completed: 15,
        pending: 6,
        overdue: 2
      },
      health: {
        workouts: 12,
        meals: 21,
        sleepHours: 7.5
      },
      work: {
        hoursToday: 6.5,
        projects: 3,
        billableHours: 5.5
      }
    }
    
    setTimeout(() => {
      setStats(mockStats)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Text>Loading dashboard...</Text>
      </Container>
    )
  }

  return (
    <Box minH="100vh" bg="gray.50" py={8}>
      <Container maxW="container.xl">
        {/* Header */}
        <Flex justify="space-between" align="center" mb={8}>
          <VStack align="start" spacing={2}>
            <Heading size="xl" color="brand.500">
              Dashboard
            </Heading>
            <Text color="gray.600">
              Welcome back! Here's your daily overview.
            </Text>
          </VStack>
          <HStack spacing={4}>
            <Button leftIcon={<AddIcon />} colorScheme="brand">
              Quick Add
            </Button>
            <IconButton
              aria-label="Refresh"
              icon={<ViewIcon />}
              variant="outline"
            />
          </HStack>
        </Flex>

        {/* Stats Overview */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} mb={8}>
          {/* Activities Card */}
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <Flex justify="space-between" align="center" mb={2}>
                    <StatLabel>Activities Today</StatLabel>
                    <CalendarIcon color="blue.500" />
                  </Flex>
                  <StatNumber color="blue.500">{stats?.activities.today || 0}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {stats?.activities.thisWeek || 0} this week
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          {/* Tasks Card */}
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <Flex justify="space-between" align="center" mb={2}>
                    <StatLabel>Tasks Completed</StatLabel>
                    <CheckIcon color="green.500" />
                  </Flex>
                  <StatNumber color="green.500">{stats?.tasks.completed || 0}</StatNumber>
                  <StatHelpText>
                    {stats?.tasks.pending || 0} pending
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          {/* Health Card */}
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <Flex justify="space-between" align="center" mb={2}>
                    <StatLabel>Workouts</StatLabel>
                    <StarIcon color="purple.500" />
                  </Flex>
                  <StatNumber color="purple.500">{stats?.health.workouts || 0}</StatNumber>
                  <StatHelpText>
                    {stats?.health.sleepHours || 0}h sleep
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>

          {/* Work Card */}
          <GridItem>
            <Card>
              <CardBody>
                <Stat>
                  <Flex justify="space-between" align="center" mb={2}>
                    <StatLabel>Work Hours</StatLabel>
                    <TimeIcon color="orange.500" />
                  </Flex>
                  <StatNumber color="orange.500">{stats?.work.hoursToday || 0}h</StatNumber>
                  <StatHelpText>
                    {stats?.work.billableHours || 0}h billable
                  </StatHelpText>
                </Stat>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>

        {/* Main Content */}
        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={8}>
          {/* Left Column */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Recent Activities */}
              <Card>
                <CardBody>
                  <Flex justify="space-between" align="center" mb={4}>
                    <Heading size="md">Recent Activities</Heading>
                    <Button size="sm" variant="ghost" colorScheme="brand">
                      View All
                    </Button>
                  </Flex>
                  <VStack spacing={3} align="stretch">
                    {[
                      { title: 'Morning Workout', time: '7:00 AM', category: 'Exercise', duration: '45 min' },
                      { title: 'Team Meeting', time: '10:00 AM', category: 'Work', duration: '1 hour' },
                      { title: 'Lunch Break', time: '12:30 PM', category: 'Personal', duration: '30 min' },
                      { title: 'Project Review', time: '2:00 PM', category: 'Work', duration: '2 hours' },
                    ].map((activity, index) => (
                      <Flex key={index} justify="space-between" align="center" py={2}>
                        <VStack align="start" spacing={1}>
                          <Text fontWeight="medium">{activity.title}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {activity.time} • {activity.category}
                          </Text>
                        </VStack>
                        <Badge colorScheme="blue">{activity.duration}</Badge>
                      </Flex>
                    ))}
                  </VStack>
                </CardBody>
              </Card>

              {/* Task Progress */}
              <Card>
                <CardBody>
                  <Flex justify="space-between" align="center" mb={4}>
                    <Heading size="md">Task Progress</Heading>
                    <Button size="sm" variant="ghost" colorScheme="brand">
                      View All
                    </Button>
                  </Flex>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Flex justify="space-between" mb={2}>
                        <Text fontSize="sm">Project Alpha</Text>
                        <Text fontSize="sm" fontWeight="medium">75%</Text>
                      </Flex>
                      <Progress value={75} colorScheme="green" size="sm" />
                    </Box>
                    <Box>
                      <Flex justify="space-between" mb={2}>
                        <Text fontSize="sm">Website Redesign</Text>
                        <Text fontSize="sm" fontWeight="medium">45%</Text>
                      </Flex>
                      <Progress value={45} colorScheme="blue" size="sm" />
                    </Box>
                    <Box>
                      <Flex justify="space-between" mb={2}>
                        <Text fontSize="sm">Mobile App</Text>
                        <Text fontSize="sm" fontWeight="medium">90%</Text>
                      </Flex>
                      <Progress value={90} colorScheme="purple" size="sm" />
                    </Box>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>

          {/* Right Column */}
          <GridItem>
            <VStack spacing={6} align="stretch">
              {/* Quick Actions */}
              <Card>
                <CardBody>
                  <Heading size="md" mb={4}>Quick Actions</Heading>
                  <VStack spacing={3} align="stretch">
                    <Button leftIcon={<AddIcon />} variant="outline" justifyContent="flex-start">
                      Log Activity
                    </Button>
                    <Button leftIcon={<CheckIcon />} variant="outline" justifyContent="flex-start">
                      Complete Task
                    </Button>
                    <Button leftIcon={<StarIcon />} variant="outline" justifyContent="flex-start">
                      Log Workout
                    </Button>
                    <Button leftIcon={<TimeIcon />} variant="outline" justifyContent="flex-start">
                      Start Timer
                    </Button>
                  </VStack>
                </CardBody>
              </Card>

              {/* Alerts & Notifications */}
              <Card>
                <CardBody>
                  <Heading size="md" mb={4}>Alerts</Heading>
                  <VStack spacing={3} align="stretch">
                    <HStack spacing={3}>
                      <WarningIcon color="orange.500" />
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          2 Overdue Tasks
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          Project deadline approaching
                        </Text>
                      </VStack>
                    </HStack>
                    <Divider />
                    <HStack spacing={3}>
                      <InfoIcon color="blue.500" />
                      <VStack align="start" spacing={1} flex={1}>
                        <Text fontSize="sm" fontWeight="medium">
                          Weekly Goal Progress
                        </Text>
                        <Text fontSize="xs" color="gray.600">
                          80% of weekly goals completed
                        </Text>
                      </VStack>
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>

              {/* Health Summary */}
              <Card>
                <CardBody>
                  <Heading size="md" mb={4}>Health Summary</Heading>
                  <VStack spacing={3} align="stretch">
                    <Flex justify="space-between">
                      <Text fontSize="sm">Water Intake</Text>
                      <Text fontSize="sm" fontWeight="medium">6/8 glasses</Text>
                    </Flex>
                    <Progress value={75} colorScheme="blue" size="sm" />
                    
                    <Flex justify="space-between">
                      <Text fontSize="sm">Steps Today</Text>
                      <Text fontSize="sm" fontWeight="medium">8,432 / 10,000</Text>
                    </Flex>
                    <Progress value={84} colorScheme="green" size="sm" />
                    
                    <Flex justify="space-between">
                      <Text fontSize="sm">Sleep Quality</Text>
                      <Badge colorScheme="green">Good</Badge>
                    </Flex>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  )
}
