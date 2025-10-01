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
  SettingsIcon, 
  TimeIcon, 
  ViewIcon,
  AddIcon,
  CheckIcon
} from '@chakra-ui/icons'
import Navigation from '@/components/Navigation'

export default function WorkPage() {
  const bgColor = useColorModeValue('white', 'gray.800')

  return (
    <>
      <Navigation />
      <Box minH="100vh" bg="gray.50" py={8}>
        <Container maxW="container.xl">
          {/* Header */}
          <VStack align="start" spacing={2} mb={8}>
            <Heading size="xl" color="brand.500">
              Work & Productivity
            </Heading>
            <Text color="gray.600">
              Track your work hours, projects, and productivity metrics
            </Text>
          </VStack>

          {/* Coming Soon Card */}
          <Card maxW="600px" mx="auto">
            <CardBody textAlign="center" py={12}>
              <VStack spacing={6}>
                <SettingsIcon w={16} h={16} color="brand.500" />
                <VStack spacing={2}>
                  <Heading size="lg">Work Tracking Coming Soon</Heading>
                  <Text color="gray.600" maxW="md">
                    We're developing comprehensive work and productivity tracking features including:
                  </Text>
                </VStack>
                
                <VStack spacing={3} align="start" w="full" maxW="400px">
                  <HStack spacing={3}>
                    <CheckIcon color="green.500" />
                    <Text fontSize="sm">Time tracking and project logging</Text>
                  </HStack>
                  <HStack spacing={3}>
                    <CheckIcon color="green.500" />
                    <Text fontSize="sm">Billable hours and invoicing</Text>
                  </HStack>
                  <HStack spacing={3}>
                    <CheckIcon color="green.500" />
                    <Text fontSize="sm">Meeting and appointment scheduling</Text>
                  </HStack>
                  <HStack spacing={3}>
                    <CheckIcon color="green.500" />
                    <Text fontSize="sm">Productivity analytics and reports</Text>
                  </HStack>
                  <HStack spacing={3}>
                    <CheckIcon color="green.500" />
                    <Text fontSize="sm">Client and project management</Text>
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
