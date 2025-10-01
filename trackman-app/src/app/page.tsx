'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Flex,
} from '@chakra-ui/react'
import { 
  CalendarIcon, 
  TimeIcon, 
  StarIcon, 
  SettingsIcon,
  ViewIcon,
  AddIcon
} from '@chakra-ui/icons'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function Home() {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const features = [
    {
      icon: CalendarIcon,
      title: 'Daily Activities',
      description: 'Track your daily routines and habits',
      color: 'blue',
    },
    {
      icon: TimeIcon,
      title: 'Time Management',
      description: 'Monitor how you spend your time',
      color: 'green',
    },
    {
      icon: StarIcon,
      title: 'Health & Fitness',
      description: 'Log workouts, diet, and health metrics',
      color: 'purple',
    },
    {
      icon: SettingsIcon,
      title: 'Work Tracking',
      description: 'Manage tasks and productivity',
      color: 'orange',
    },
  ]

  return (
    <Box minH="100vh" bg="gray.50">
      <Navigation />

      {/* Hero Section */}
      <Container maxW="container.xl" py={20}>
        <VStack spacing={8} textAlign="center">
          <Heading size="2xl" color="brand.500">
            Take Control of Your Day
          </Heading>
          <Text fontSize="xl" color="gray.600" maxW="2xl">
            Track your activities, manage tasks, monitor health, and boost productivity 
            with our comprehensive personal tracking platform.
          </Text>
          <HStack spacing={4}>
            <Link href="/dashboard" passHref>
              <Button as="a" size="lg" colorScheme="brand" leftIcon={<AddIcon />}>
                Start Tracking
              </Button>
            </Link>
            <Link href="/dashboard" passHref>
              <Button as="a" size="lg" variant="outline" leftIcon={<ViewIcon />}>
                View Dashboard
              </Button>
            </Link>
          </HStack>
        </VStack>
      </Container>

      {/* Features Section */}
      <Container maxW="container.xl" py={16}>
        <VStack spacing={12}>
          <VStack spacing={4} textAlign="center">
            <Heading size="xl">Everything You Need to Track</Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Comprehensive tracking tools designed to help you understand and improve your daily life.
            </Text>
          </VStack>

          <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6} w="full">
            {features.map((feature, index) => (
              <GridItem key={index}>
                <Card h="full" _hover={{ transform: 'translateY(-4px)', shadow: 'lg' }} transition="all 0.2s">
                  <CardBody>
                    <VStack spacing={4} align="stretch" h="full">
                      <Icon 
                        as={feature.icon} 
                        w={8} 
                        h={8} 
                        color={`${feature.color}.500`}
                      />
                      <VStack spacing={2} align="stretch" flex={1}>
                        <Heading size="md">{feature.title}</Heading>
                        <Text color="gray.600" flex={1}>
                          {feature.description}
                        </Text>
                      </VStack>
                      <Link href={`/${feature.title.toLowerCase().replace(' & ', '-').replace(' ', '-')}`} passHref>
                        <Button 
                          as="a"
                          variant="ghost" 
                          colorScheme={feature.color}
                          size="sm"
                          alignSelf="flex-start"
                        >
                          Learn More
                        </Button>
                      </Link>
                    </VStack>
                  </CardBody>
                </Card>
              </GridItem>
            ))}
          </Grid>
        </VStack>
      </Container>

      {/* CTA Section */}
      <Box bg="brand.500" py={16}>
        <Container maxW="container.xl">
          <VStack spacing={6} textAlign="center" color="white">
            <Heading size="xl">Ready to Start Tracking?</Heading>
            <Text fontSize="lg" maxW="2xl">
              Join thousands of users who are already improving their lives with TrackMan.
            </Text>
            <Link href="/dashboard" passHref>
              <Button as="a" size="lg" colorScheme="white" variant="outline">
                Get Started Today
              </Button>
            </Link>
          </VStack>
        </Container>
      </Box>
    </Box>
  )
}