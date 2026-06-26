"use client";

import { useState, useEffect } from "react";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Search,
  CreditCard,
  Banknote,
  QrCode,
  CircleDollarSign,
} from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";

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

const emojiMap: Record<string, string> = {
  Bebidas: "☕",
  Comida: "🥪",
  Postres: "🍰",
  Limpieza: "🧹",
  Empaques: "📦",
};

const categories = ["Todos", "Bebidas", "Comida", "Postres"];

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: Number(p.price),
          category: p.category,
          emoji: emojiMap[p.category] || "📦",
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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

  async function handleCheckout(paymentMethod: string) {
    if (cart.length === 0) return;

    const saleData = {
      customer: null,
      items: cart.map((item) => ({
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal,
      tax,
      total,
      status: "paid",
      paymentMethod,
    };

    try {
      await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(saleData),
      });
      clearCart();
      alert("Venta registrada exitosamente");
    } catch {
      alert("Error al registrar la venta");
    }
  }

  if (loading) {
    return (
      <div className="h-dvh flex items-center justify-center bg-linen">
        <p className="text-espresso-light">Cargando productos...</p>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col bg-linen">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-sand bg-cream/80 backdrop-blur-sm px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <CircleDollarSign  className="text-amber-500"/>
          <Breadcrumbs items={[{ label: "Inicio", href: "/" }, { label: "Punto de Venta" }]} />
        </div>
        <div className="flex items-center gap-2 text-sm text-espresso-light">
          <span className="font-medium text-espresso">Turno: Mañana</span>
          <span>•</span>
          <span>Caja #1</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center gap-3 border-b border-sand bg-white px-4 py-3 shrink-0">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-espresso-light" />
              <input
                type="text"
                placeholder="Buscar producto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-sand bg-linen py-2 pl-9 pr-3 text-sm text-espresso outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30"
              />
            </div>
            <div className="flex gap-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors hover:cursor-pointer ${
                    activeCategory === cat
                      ? "bg-amber-500 text-white"
                      : "bg-sand text-espresso-light hover:bg-sand/80"
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
                  className="flex flex-col items-center gap-1 rounded-xl border border-sand bg-white p-3 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:shadow-md active:scale-95 hover:cursor-pointer"
                >
                  <span className="text-3xl">{product.emoji}</span>
                  <span className="text-xs font-medium text-espresso leading-tight">
                    {product.name}
                  </span>
                  <span className="font-mono text-sm font-bold text-amber-600">
                    ${product.price.toFixed(2)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex w-80 flex-col border-l border-sand bg-white shrink-0">
          <div className="flex items-center justify-between border-b border-sand px-4 py-3">
            <div className="flex items-center gap-2">
              <ShoppingCart className="size-4 text-espresso-light" />
              <span className="text-sm font-semibold text-espresso">Carrito</span>
              {totalItems > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                  {totalItems}
                </span>
              )}
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-espresso-light hover:text-terracotta transition-colors"
              >
                Vaciar
              </button>
            )}
          </div>

          {/* Cart items */}
          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-espresso-light">
                <ShoppingCart className="mb-2 size-8" />
                <p className="text-sm">Carrito vacío</p>
                <p className="text-xs">Toca un producto para agregarlo</p>
              </div>
            ) : (
              <div className="divide-y divide-sand">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                    <span className="text-xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-espresso truncate">
                        {item.name}
                      </p>
                      <p className="font-mono text-xs text-espresso-light">
                        ${item.price.toFixed(2)} c/u
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="flex size-6 items-center justify-center rounded-md bg-sand text-espresso hover:bg-sand/80 transition-colors"
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium text-espresso">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="flex size-6 items-center justify-center rounded-md bg-sand text-espresso hover:bg-sand/80 transition-colors"
                      >
                        <Plus className="size-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-espresso-light hover:text-terracotta transition-colors"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-sand bg-linen px-4 py-3 shrink-0">
            <div className="space-y-1 text-sm">
              <div className="flex justify-between text-espresso-light">
                <span>Subtotal</span>
                <span className="font-mono">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-espresso-light">
                <span>IVA (16%)</span>
                <span className="font-mono">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between border-t border-sand pt-1 text-lg font-bold text-espresso">
                <span>Total</span>
                <span className="font-mono">${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                disabled={cart.length === 0}
                onClick={() => handleCheckout("cash")}
                className="flex flex-col items-center gap-1 rounded-lg border border-sand bg-white py-2 text-xs font-medium text-espresso shadow-sm transition-all hover:bg-sand/30 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Banknote className="size-4" />
                Efectivo
              </button>
              <button
                disabled={cart.length === 0}
                onClick={() => handleCheckout("card")}
                className="flex flex-col items-center gap-1 rounded-lg border border-sand bg-white py-2 text-xs font-medium text-espresso shadow-sm transition-all hover:bg-sand/30 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CreditCard className="size-4" />
                Tarjeta
              </button>
              <button
                disabled={cart.length === 0}
                onClick={() => handleCheckout("movil")}
                className="flex flex-col items-center gap-1 rounded-lg border border-sand bg-white py-2 text-xs font-medium text-espresso shadow-sm transition-all hover:bg-sand/30 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <QrCode className="size-4" />
                PagoMóvil
              </button>
            </div>

            <button
              disabled={cart.length === 0}
              onClick={() => handleCheckout("cash")}
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
