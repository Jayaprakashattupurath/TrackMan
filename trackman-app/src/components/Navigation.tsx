'use client'

import {
  Box,
  Flex,
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  IconButton,
  useColorModeValue,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Link as ChakraLink,
} from '@chakra-ui/react'
import {
  HamburgerIcon,
  CalendarIcon,
  TimeIcon,
  StarIcon,
  SettingsIcon,
  ViewIcon,
  UserIcon,
} from '@chakra-ui/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: ViewIcon },
  { name: 'Activities', href: '/activities', icon: CalendarIcon },
  { name: 'Tasks', href: '/tasks', icon: TimeIcon },
  { name: 'Health', href: '/health', icon: StarIcon },
  { name: 'Work', href: '/work', icon: SettingsIcon },
]

export default function Navigation() {
  const pathname = usePathname()
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const textColor = useColorModeValue('gray.700', 'gray.200')

  const NavLink = ({ item }: { item: typeof navigationItems[0] }) => {
    const isActive = pathname === item.href
    const Icon = item.icon
    
    return (
      <Link href={item.href} passHref>
        <ChakraLink
          as={Button}
          variant={isActive ? 'solid' : 'ghost'}
          colorScheme={isActive ? 'brand' : 'gray'}
          leftIcon={<Icon />}
          justifyContent="flex-start"
          w="full"
          size="sm"
          _hover={{
            bg: isActive ? undefined : useColorModeValue('gray.100', 'gray.700')
          }}
        >
          {item.name}
        </ChakraLink>
      </Link>
    )
  }

  return (
    <>
      {/* Desktop Navigation */}
      <Box
        as="nav"
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        px={4}
        py={3}
      >
        <Flex justify="space-between" align="center" maxW="container.xl" mx="auto">
          {/* Logo */}
          <Link href="/" passHref>
            <ChakraLink _hover={{ textDecoration: 'none' }}>
              <Heading size="md" color="brand.500">
                TrackMan
              </Heading>
            </ChakraLink>
          </Link>

          {/* Desktop Navigation Items */}
          <HStack spacing={2} display={{ base: 'none', md: 'flex' }}>
            {navigationItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </HStack>

          {/* User Menu */}
          <HStack spacing={4}>
            <Button size="sm" variant="ghost" leftIcon={<UserIcon />}>
              Profile
            </Button>
            <IconButton
              aria-label="Open menu"
              icon={<HamburgerIcon />}
              variant="ghost"
              display={{ base: 'flex', md: 'none' }}
              onClick={onOpen}
            />
          </HStack>
        </Flex>
      </Box>

      {/* Mobile Navigation Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <Heading size="md" color="brand.500">
              TrackMan
            </Heading>
          </DrawerHeader>

          <DrawerBody>
            <VStack spacing={2} align="stretch">
              {navigationItems.map((item) => (
                <Box key={item.name} onClick={onClose}>
                  <NavLink item={item} />
                </Box>
              ))}
              
              <Box pt={4} borderTop="1px" borderColor={borderColor}>
                <Button
                  variant="ghost"
                  leftIcon={<UserIcon />}
                  justifyContent="flex-start"
                  w="full"
                  size="sm"
                >
                  Profile
                </Button>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
