"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Menu, X, User, Search, Globe, Compass, Camera, Utensils } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigationItems = [
    {
      title: "Destinations",
      href: "/destinations",
      icon: Globe,
      description: "Explore amazing places around the world",
    },
    {
      title: "Melanin Compass",
      href: "/melanin",
      icon: Compass,
      description: "Cultural travel experiences for Black travelers",
    },
    {
      title: "Stories",
      href: "/stories",
      icon: Camera,
      description: "Travel stories and inspiration from our community",
    },
    {
      title: "Restaurants",
      href: "/restaurants",
      icon: Utensils,
      description: "Discover amazing dining experiences worldwide",
    },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/UTrippin_Logo_bg_removed.png" alt="Utrippin" width={120} height={40} className="h-8 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.title}>
                <NavigationMenuTrigger className="h-10">
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px]">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                        >
                          <item.icon className="h-6 w-6 mb-2" />
                          <div className="mb-2 mt-4 text-lg font-medium">{item.title}</div>
                          <p className="text-sm leading-tight text-muted-foreground">{item.description}</p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <User className="h-4 w-4" />
            Sign In
          </Button>
          <Button size="sm" className="bg-travel-blue hover:bg-travel-blue/90">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container py-4 space-y-4">
            {navigationItems.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                <div>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-sm text-muted-foreground">{item.description}</div>
                </div>
              </Link>
            ))}
            <div className="pt-4 border-t space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <Button className="w-full bg-travel-blue hover:bg-travel-blue/90">Get Started</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
