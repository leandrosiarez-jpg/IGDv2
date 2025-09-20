"use client"

import type React from "react"

import { useState, useRef, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronLeft, ChevronRight, Search, Leaf, Flame, Sparkles, Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  isVegetarian?: boolean
  isSpicy?: boolean
  isNew?: boolean
  isFeatured?: boolean
}

interface MenuCategory {
  id: string
  name: string
  items: MenuItem[]
}

const menuData: MenuCategory[] = [
  {
    id: "featured",
    name: "Featured Items",
    items: [
      {
        id: 1,
        name: "Wagyu Ribeye",
        description: "Premium wagyu beef with roasted vegetables and truffle jus",
        price: 85,
        image: "/wagyu-ribeye.png",
        isFeatured: true,
        isNew: true,
      },
      {
        id: 2,
        name: "Lobster Risotto",
        description: "Creamy arborio rice with fresh Maine lobster and saffron",
        price: 48,
        image: "/lobster-risotto.png",
        isFeatured: true,
      },
      {
        id: 3,
        name: "Truffle Arancini",
        description: "Crispy risotto balls with black truffle oil and aged parmesan",
        price: 16,
        image: "/truffle-arancini-appetizer.png",
        isFeatured: true,
        isVegetarian: true,
      },
    ],
  },
  {
    id: "appetizers",
    name: "Aperitivos",
    items: [
      {
        id: 4,
        name: "Truffle Arancini",
        description: "Crispy risotto balls with black truffle oil and aged parmesan",
        price: 16,
        image: "/truffle-arancini-appetizer.png",
        isVegetarian: true,
      },
      {
        id: 5,
        name: "Burrata Caprese",
        description: "Fresh burrata with heirloom tomatoes, basil, and balsamic glaze",
        price: 18,
        image: "/burrata-caprese-appetizer.jpg",
        isVegetarian: true,
      },
      {
        id: 6,
        name: "Tuna Tartare",
        description: "Yellowfin tuna with avocado, citrus vinaigrette, and jalapeño",
        price: 22,
        image: "/tuna-tartare-appetizer.png",
        isSpicy: true,
      },
      {
        id: 7,
        name: "Gambas al Ajillo",
        description: "Sizzling shrimp in garlic, olive oil, and Spanish paprika",
        price: 19,
        image: "/gambas-al-ajillo-spanish-shrimp.jpg",
        isSpicy: true,
      },
    ],
  },
  {
    id: "mains",
    name: "Platos Principales",
    items: [
      {
        id: 8,
        name: "Wagyu Ribeye",
        description: "Premium wagyu beef with roasted vegetables and truffle jus",
        price: 85,
        image: "/wagyu-ribeye.png",
        isNew: true,
      },
      {
        id: 9,
        name: "Pan-Seared Salmon",
        description: "Atlantic salmon with lemon herb butter and seasonal vegetables",
        price: 32,
        image: "/pan-seared-salmon.jpg",
      },
      {
        id: 10,
        name: "Lobster Risotto",
        description: "Creamy arborio rice with fresh Maine lobster and saffron",
        price: 48,
        image: "/lobster-risotto.png",
      },
      {
        id: 11,
        name: "Paella Valenciana",
        description: "Traditional Spanish rice with chicken, rabbit, and vegetables",
        price: 38,
        image: "/paella-valenciana-traditional-spanish.jpg",
        isSpicy: true,
      },
      {
        id: 12,
        name: "Vegetarian Paella",
        description: "Saffron rice with seasonal vegetables, beans, and artichokes",
        price: 28,
        image: "/vegetarian-paella-spanish-rice.jpg",
        isVegetarian: true,
      },
    ],
  },
  {
    id: "desserts",
    name: "Postres",
    items: [
      {
        id: 13,
        name: "Chocolate Soufflé",
        description: "Dark chocolate soufflé with vanilla bean ice cream",
        price: 14,
        image: "/chocolate-souffle.png",
        isVegetarian: true,
      },
      {
        id: 14,
        name: "Tiramisu",
        description: "Classic Italian dessert with espresso and mascarpone",
        price: 12,
        image: "/classic-tiramisu.png",
        isVegetarian: true,
      },
      {
        id: 15,
        name: "Crème Brûlée",
        description: "Vanilla custard with caramelized sugar crust",
        price: 13,
        image: "/creme-brulee-dessert.jpg",
        isVegetarian: true,
      },
      {
        id: 16,
        name: "Flan de Coco",
        description: "Coconut flan with caramel sauce and toasted coconut flakes",
        price: 11,
        image: "/flan-de-coco-coconut-dessert.jpg",
        isVegetarian: true,
        isNew: true,
      },
    ],
  },
]

// Function to normalize text for search (handles Spanish accents and ñ)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/ñ/g, "n") // Handle ñ specifically
}

export default function RestaurantMenu() {
  const [activeCategory, setActiveCategory] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState<{ x: number, y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number, y: number } | null>(null);

  const filteredMenuData = useMemo(() => {
    if (!searchQuery.trim()) return menuData

    const normalizedQuery = normalizeText(searchQuery)

    return menuData
      .map((category) => ({
        ...category,
        items: category.items.filter(
          (item) =>
            normalizeText(item.name).includes(normalizedQuery) ||
            normalizeText(item.description).includes(normalizedQuery),
        ),
      }))
      .filter((category) => category.items.length > 0)
  }, [searchQuery])

 const handleTouchStart = (e) => {
  setTouchStart({
    x: e.targetTouches[0].clientX,
    y: e.targetTouches[0].clientY,
  });
  setTouchEnd({ x: null, y: null });
};

const handleTouchMove = (e) => {
  setTouchEnd({
    x: e.targetTouches[0].clientX,
    y: e.targetTouches[0].clientY,
  });
};

const handleTouchEnd = () => {
  if (!touchStart.x || !touchEnd.x) return;

  const distanceX = touchStart.x - touchEnd.x;
  const distanceY = touchStart.y - touchEnd.y;
  const swipeThreshold = 50; // Puedes ajustar este valor

  // La lógica clave:
  // Solo si el arrastre horizontal es mayor que el vertical Y es lo suficientemente largo
  if (Math.abs(distanceX) > Math.abs(distanceY) && Math.abs(distanceX) > swipeThreshold) {
    if (distanceX > 0) {
      // Swipe a la izquierda (avanzar categoría)
      if (activeCategory < filteredMenuData.length - 1) {
        setActiveCategory((prev) => prev + 1);
      }
    } else {
      // Swipe a la derecha (retroceder categoría)
      if (activeCategory > 0) {
        setActiveCategory((prev) => prev - 1);
      }
    }
  }
};

  const nextCategory = () => {
    setActiveCategory((prev) => (prev + 1) % filteredMenuData.length)
  }

  const prevCategory = () => {
    setActiveCategory((prev) => (prev - 1 + filteredMenuData.length) % filteredMenuData.length)
  }

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const targetScroll = activeCategory * container.clientWidth
      container.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      })
    }
  }, [activeCategory])

  useEffect(() => {
    if (filteredMenuData.length > 0 && activeCategory >= filteredMenuData.length) {
      setActiveCategory(0)
    }
  }, [filteredMenuData, activeCategory])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <header className="text-center py-8 sm:py-12 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-transparent" />
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-balance mb-3 sm:mb-4 text-white bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text">
            Bella Vista
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto text-pretty leading-relaxed px-2">
            Experience culinary excellence with our carefully crafted menu featuring the finest ingredients
          </p>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <Input
            type="text"
            placeholder="Buscar platos... (ej: paella, jalapeño)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 pr-4 py-3 bg-slate-800/50 backdrop-blur-xl border-slate-600/50 rounded-2xl text-white placeholder:text-slate-400 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
          />
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex justify-center mb-6 sm:mb-8 px-4">
        <div className="flex flex-wrap justify-center gap-1 sm:gap-2 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-2 border border-slate-700/50 shadow-2xl max-w-full overflow-x-auto">
          {filteredMenuData.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(index)}
              className={cn(
                "px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 relative overflow-hidden whitespace-nowrap",
                activeCategory === index
                  ? "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/25 scale-105"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50",
              )}
            >
              <span className="relative z-10">{category.name}</span>
              {activeCategory === index && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 animate-pulse" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      <div className="relative max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Navigation Arrows - Hidden on mobile */}
        <Button
          variant="outline"
          size="icon"
          className="hidden sm:flex absolute left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-slate-800/90 backdrop-blur-xl border-slate-600/50 hover:bg-emerald-600 hover:border-emerald-500 text-slate-300 hover:text-white transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-110 rounded-2xl"
          onClick={prevCategory}
          disabled={activeCategory === 0}
        >
          <ChevronLeft className="h-5 w-5 lg:h-6 lg:w-6" />
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="hidden sm:flex absolute right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 lg:w-12 lg:h-12 bg-slate-800/90 backdrop-blur-xl border-slate-600/50 hover:bg-emerald-600 hover:border-emerald-500 text-slate-300 hover:text-white transition-all duration-300 shadow-2xl hover:shadow-emerald-500/25 hover:scale-110 rounded-2xl"
          onClick={nextCategory}
          disabled={activeCategory === filteredMenuData.length - 1}
        >
          <ChevronRight className="h-5 w-5 lg:h-6 lg:w-6" />
        </Button>

        <div
          ref={scrollContainerRef}
          className="flex overflow-x-hidden scroll-smooth"
          style={{ width: "100%" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          // Añadimos onScroll para detener el deslizamiento al hacer scroll
          onScroll={() => {
            // Aquí puedes añadir lógica para, por ejemplo, resetear el estado de         touch
            setTouchStart({ x: null, y: null });
            setTouchEnd({ x: null, y: null });
          }}
        >
          {filteredMenuData.map((category, categoryIndex) => (
          <div key={category.id} className="w-full flex-shrink-0 px-2 sm:px-4 lg:px-8" style={{ minWidth: "100%", overflowY: "auto", maxHeight: "80vh" }}>
              {category.id === "featured" && (
                <div className="text-center mb-6 sm:mb-8">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600/20 to-emerald-500/20 backdrop-blur-xl border border-emerald-500/30 rounded-full px-4 py-2 mb-4">
                    <Star className="h-4 w-4 text-emerald-400" />
                    <span className="text-emerald-400 font-medium text-sm">Chef's Recommendations</span>
                    <Star className="h-4 w-4 text-emerald-400" />
                  </div>
                </div>
              )}

              <div
                className={cn(
                  "grid gap-4 sm:gap-6",
                  category.id === "featured"
                    ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                )}
              >
                {category.items.map((item) => (
                  <Card
                    key={item.id}
                    className={cn(
                      "group relative bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border-0 transition-all duration-700 hover:scale-[1.02] sm:hover:scale-[1.03] hover:-translate-y-1 sm:hover:-translate-y-2 overflow-hidden shadow-2xl hover:shadow-emerald-500/20",
                      category.id === "featured"
                        ? "rounded-3xl border border-emerald-500/20 hover:border-emerald-500/40"
                        : "rounded-3xl",
                    )}
                  >
                    {/* Ornamental decorations */}
                    <div className="absolute inset-0 rounded-3xl">
                      <div className="absolute top-0 left-0 w-8 h-8 sm:w-12 sm:h-12">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-transparent rounded-br-full opacity-60" />
                        <div className="absolute top-1 left-1 w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400/50 rounded-full" />
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-300/40 rounded-full" />
                      </div>
                      <div className="absolute top-0 right-0 w-8 h-8 sm:w-12 sm:h-12 rotate-90">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-transparent rounded-br-full opacity-60" />
                        <div className="absolute top-1 left-1 w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400/50 rounded-full" />
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-300/40 rounded-full" />
                      </div>
                      <div className="absolute bottom-0 left-0 w-8 h-8 sm:w-12 sm:h-12 -rotate-90">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-transparent rounded-br-full opacity-60" />
                        <div className="absolute top-1 left-1 w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400/50 rounded-full" />
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-300/40 rounded-full" />
                      </div>
                      <div className="absolute bottom-0 right-0 w-8 h-8 sm:w-12 sm:h-12 rotate-180">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/30 to-transparent rounded-br-full opacity-60" />
                        <div className="absolute top-1 left-1 w-2 h-2 sm:w-3 sm:h-3 bg-emerald-400/50 rounded-full" />
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-300/40 rounded-full" />
                      </div>

                      <div className="absolute inset-0 rounded-3xl border border-emerald-400/20 group-hover:border-emerald-400/40 transition-colors duration-700" />
                      <div className="absolute inset-1 rounded-3xl border border-slate-600/30 group-hover:border-emerald-500/30 transition-colors duration-700" />
                      <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/5 via-transparent to-slate-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    </div>

                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/10 via-transparent to-slate-900/10 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                      />

                      <div className="absolute top-3 left-3 z-20 flex gap-2">
                        {item.isVegetarian && (
                          <div className="bg-green-600/90 backdrop-blur-sm text-white p-1.5 rounded-full shadow-lg border border-green-400/30">
                            <Leaf className="h-3 w-3" />
                          </div>
                        )}
                        {item.isSpicy && (
                          <div className="bg-red-600/90 backdrop-blur-sm text-white p-1.5 rounded-full shadow-lg border border-red-400/30">
                            <Flame className="h-3 w-3" />
                          </div>
                        )}
                        {item.isNew && (
                          <div className="bg-purple-600/90 backdrop-blur-sm text-white p-1.5 rounded-full shadow-lg border border-purple-400/30">
                            <Sparkles className="h-3 w-3" />
                          </div>
                        )}
                      </div>

                      <div className="absolute top-3 sm:top-4 right-3 sm:right-4 z-20 bg-gradient-to-r from-emerald-600/95 to-emerald-500/95 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold shadow-xl border border-emerald-400/30 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                        <span className="relative z-10">${item.price}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 to-emerald-300/20 rounded-full animate-pulse" />
                      </div>
                    </div>

                    <CardContent className="p-4 sm:p-6 relative">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 sm:w-16 h-px bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />

                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 gap-2 sm:gap-4">
                        <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-500 leading-tight text-balance">
                          {item.name}
                        </h3>
                        <span className="text-xl sm:text-2xl font-bold text-emerald-400 group-hover:scale-110 transition-transform duration-500 flex-shrink-0">
                          ${item.price}
                        </span>
                      </div>

                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed group-hover:text-slate-200 transition-colors duration-500 text-pretty">
                        {item.description}
                      </p>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex gap-2 text-xs text-slate-400">
                          {item.isVegetarian && (
                            <span className="flex items-center gap-1">
                              <Leaf className="h-3 w-3 text-green-400" />
                              Vegetarian
                            </span>
                          )}
                          {item.isSpicy && (
                            <span className="flex items-center gap-1">
                              <Flame className="h-3 w-3 text-red-400" />
                              Spicy
                            </span>
                          )}
                          {item.isNew && (
                            <span className="flex items-center gap-1">
                              <Sparkles className="h-3 w-3 text-purple-400" />
                              New
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1 opacity-0 group-hover:opacity-60 transition-opacity duration-700">
                        <div className="w-1 h-1 bg-emerald-400/40 rounded-full" />
                        <div className="w-1 h-1 bg-emerald-300/30 rounded-full" />
                        <div className="w-1 h-1 bg-emerald-400/40 rounded-full" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Indicators */}
      <div className="flex justify-center mt-8 sm:mt-12 mb-6 sm:mb-8 space-x-2 sm:space-x-3">
        {filteredMenuData.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveCategory(index)}
            className={cn(
              "w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 hover:scale-125 relative",
              activeCategory === index
                ? "bg-emerald-500 scale-125 shadow-lg shadow-emerald-500/50"
                : "bg-slate-600 hover:bg-slate-500",
            )}
          >
            {activeCategory === index && (
              <div className="absolute inset-0 bg-emerald-400/30 rounded-full animate-ping" />
            )}
          </button>
        ))}
      </div>

      <div className="text-center pb-8 sm:hidden">
        <p className="text-slate-400 text-xs">Swipe left or right to browse categories</p>
      </div>
    </div>
  )
}
