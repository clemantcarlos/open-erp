"use client";

import { useState } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Search,
  ArrowLeft,
  CreditCard,
  Banknote,
  QrCode,
} from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  emoji: string;
}

interface CartItem extends Product {
  quantity: number;
}

const products: Product[] = [
  { id: "1", name: "Café Americano", price: 4.5, category: "Bebidas", emoji: "☕" },
  { id: "2", name: "Cappuccino", price: 5.5, category: "Bebidas", emoji: "☕" },
  { id: "3", name: "Jugo Natural", price: 3.0, category: "Bebidas", emoji: "🧃" },
  { id: "4", name: "Agua Mineral", price: 1.5, category: "Bebidas", emoji: "💧" },
  { id: "5", name: "Sandwich Club", price: 8.0, category: "Comida", emoji: "🥪" },
  { id: "6", name: "Croissant", price: 3.5, category: "Comida", emoji: "🥐" },
  { id: "7", name: "Panini", price: 7.0, category: "Comida", emoji: "🍞" },
  { id: "8", name: "Ensalada César", price: 6.5, category: "Comida", emoji: "🥗" },
  { id: "9", name: "Muffin", price: 2.5, category: "Comida", emoji: "🧁" },
  { id: "10", name: "Tiramisú", price: 5.0, category: "Postres", emoji: "🍰" },
  { id: "11", name: "Brownie", price: 3.0, category: "Postres", emoji: "🍫" },
  { id: "12", name: "Helado", price: 4.0, category: "Postres", emoji: "🍦" },
];

const categories = ["Todos", "Bebidas", "Comida", "Postres"];

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "Todos" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  }

  function updateQuantity(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + delta } : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

  function clearCart() {
    setCart([]);
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="h-dvh flex flex-col bg-zinc-100">
      <header className="flex items-center justify-between border-b bg-white px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex size-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
          >
            <ArrowLeft className="size-4" />
          </Link>
          <h1 className="text-lg font-semibold">Punto de Venta</h1>
        </div>
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <span className="font-medium text-zinc-700">Turno: Mañana</span>
          <span>•</span>
          <span>Caja #1</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b bg-white px-4 py-3 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border bg-zinc-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-300"
              />
            </div>
            <div className="flex gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors hover:cursor-pointer ${
                    activeCategory === cat
                      ? "bg-zinc-900 text-white"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {filtered.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="flex flex-col items-center gap-1 rounded-xl border bg-white p-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:scale-95 hover:cursor-pointer"
                >
                  <span className="text-3xl">{product.emoji}</span>
                  <span className="text-xs font-medium text-zinc-700 leading-tight">
                    {product.name}
                  </span>
                  <span className="text-sm font-bold text-amber-600">
                    ${product.price.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-80 flex-col border-l bg-white shrink-0">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="size-4 text-zinc-500" />
              <span className="text-sm font-semibold">Carrito</span>
              {totalItems > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
              >
                Vaciar
              </button>
            )}
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-zinc-400">
                <ShoppingCart className="mb-2 size-8" />
                <p className="text-sm">Carrito vacío</p>
                <p className="text-xs">Toca un producto para agregarlo</p>
              </div>
            ) : (
              <div className="divide-y">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-700 truncate">
                        {item.name}
                      </p>
                      <p className="text-xs text-zinc-400">
                        ${item.price.toFixed(2)} c/u
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex size-6 items-center justify-center rounded-md bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex size-6 items-center justify-center rounded-md bg-zinc-100 text-zinc-600 hover:bg-zinc-200 transition-colors"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-zinc-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t bg-zinc-50 px-4 py-3 shrink-0">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-zinc-500">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>IVA (16%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t pt-1 text-lg font-bold text-zinc-900">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                disabled={cart.length === 0}
                className="flex flex-col items-center gap-1 rounded-lg border bg-white py-2 text-xs font-medium text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Banknote className="size-4" />
                Efectivo
              </button>
              <button
                disabled={cart.length === 0}
                className="flex flex-col items-center gap-1 rounded-lg border bg-white py-2 text-xs font-medium text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CreditCard className="size-4" />
                Tarjeta
              </button>
              <button
                disabled={cart.length === 0}
                className="flex flex-col items-center gap-1 rounded-lg border bg-white py-2 text-xs font-medium text-zinc-600 shadow-sm transition-all hover:bg-zinc-50 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <QrCode className="size-4" />
                PagoMóvil
              </button>
            </div>

            <button
              disabled={cart.length === 0}
              className="mt-2 w-full rounded-xl bg-amber-500 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-amber-600 hover:shadow-lg active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cobrar ${total.toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
