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
  useColorModeValue,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Progress,
  Badge,
} from '@chakra-ui/react'
import { 
  StarIcon, 
  TimeIcon, 
  ViewIcon,
  AddIcon,
  CheckIcon
} from '@chakra-ui/icons'
import Navigation from '@/components/Navigation'

export default function HealthPage() {
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <>
      <Navigation />
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="container.xl">
          {/* Header */}
          <VStack align="start" spacing={2} mb={8}>
            <Heading size="xl" color="brand.500">
              Health & Fitness
            </Heading>
            <Text color="gray.600">
              Track your workouts, nutrition, and wellness metrics
            </Text>
          </VStack>

          {/* Coming Soon Card */}
          <Card maxW="600px" mx="auto">
            <CardBody textAlign="center" py={12}>
              <VStack spacing={6}>
                <StarIcon w={16} h={16} color="brand.500" />
                <VStack spacing={2}>
                  <Heading size="lg">Health Tracking Coming Soon</Heading>
                  <Text color="gray.600" maxW="md">
                    We're working on comprehensive health and fitness tracking features including:
                  </Text>
                </VStack>
                
                <VStack spacing={3} align="start" w="full" maxW="400px">
                  <HStack spacing={3}>
                    <CheckIcon color="green.500" />
                    <Text fontSize="sm">Workout logging and progress tracking</Text>
                  </HStack>
                  <HStack spacing={3}>
                    <CheckIcon color="green.500" />
                    <Text fontSize="sm">Nutrition and meal planning</Text>
                  </HStack>
                  <HStack spacing={3}>
                    <CheckIcon color="green.500" />
                    <Text fontSize="sm">Sleep quality monitoring</Text>
                  </HStack>
                  <HStack spacing={3}>
                    <CheckIcon color="green.500" />
                    <Text fontSize="sm">Health metrics and goals</Text>
                  </HStack>
                  <HStack spacing={3}>
                    <CheckIcon color="green.500" />
                    <Text fontSize="sm">Mood and wellness tracking</Text>
                  </HStack>
                </VStack>

                <Button colorScheme="brand" leftIcon={<AddIcon />}>
                  Get Notified When Available
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </Container>
      </Box>
    </>
  )
}
