import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { getInventory } from "@/lib/data";
import { getUser } from "@/lib/auth";
import { Package, Star } from "lucide-react";
import { toast } from "sonner";

export default function PublicListings() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const providerId = searchParams.get("provider");

  useEffect(() => {
    const loadData = async () => {
      const currentUser = getUser();
      setUserInfo(currentUser);

      const inventoryData = await getInventory();
      setItems(inventoryData);
    };
    loadData();
  }, [providerId]);

  const getAverageRating = () => {
    return 4.8;
  };

  const getTotalOrders = () => {
    return 247;
  };

  const getCategories = () => {
    const categories = new Set();
    items.forEach((item) => {
      if (item.category) {
        categories.add(item.category);
      }
    });
    return Array.from(categories);
  };

  const getDisplayedItems = () => {
    if (selectedCategory === "all") {
      return items;
    }
    return items.filter((item) => item.category === selectedCategory);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border sticky top-0 z-50 bg-card/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">Script</h1>
            <p className="text-xs text-muted-foreground">Business Directory</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/")}
            className="text-xs md:text-sm"
          >
            Back to home
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Products Section */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-lg p-6 md:p-8">
              {/* Business Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold">
                    {userInfo?.name || "Business"}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Premium product provider with quality products and reliable
                    service
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="text-sm text-muted-foreground mb-6">
                {getTotalOrders()} orders • {items.length} active products
              </div>

              {/* Products */}
              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Products</h3>
                  {getCategories().length > 0 && (
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedCategory("all")}
                        className={`text-xs px-3 py-1 rounded-full transition-colors ${
                          selectedCategory === "all"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        All
                      </button>
                      {getCategories().map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`text-xs px-3 py-1 rounded-full transition-colors capitalize ${
                            selectedCategory === category
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:bg-accent"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {getDisplayedItems().length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getDisplayedItems().map((item) => (
                      <div
                        key={item.sku}
                        className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Package className="w-4 h-4 text-primary" />
                              <h4 className="font-semibold text-sm">
                                {item.name}
                              </h4>
                            </div>
                            {item.category && (
                              <p className="text-xs text-muted-foreground mt-1 capitalize">
                                {item.category}
                              </p>
                            )}
                          </div>
                          {item.qty > 0 && (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              In Stock
                            </span>
                          )}
                        </div>

                        <div className="mt-3 pt-3 border-t border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-primary">
                              ₦{item.value?.replace("₦", "").trim()}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {item.qty} units
                            </span>
                          </div>
                        </div>

                        <Button
                          size="sm"
                          className="w-full mt-3 text-xs"
                          onClick={() => {
                            toast.info("Ordering feature coming soon!");
                          }}
                        >
                          Order now
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      No products available
                    </p>
                  </div>
                )}
              </div>

              {/* About */}
              <div className="mt-6 border-t border-border pt-6">
                <h3 className="font-semibold text-lg mb-4">About</h3>
                <p className="text-sm text-muted-foreground">
                  We are a trusted product provider committed to delivering
                  high-quality products and excellent customer service. With
                  over {getTotalOrders()} satisfied customers, we guarantee
                  reliability and product excellence.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar Stats */}
          <div className="lg:col-span-1">
            <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
              <h3 className="font-semibold text-lg mb-4">Business Info</h3>

              <div className="border-b border-border pb-6 mb-6">
                <h4 className="text-sm font-medium mb-3">Contact</h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Email: </span>
                    <span className="font-medium break-all">
                      {userInfo?.email || "N/A"}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Phone: </span>
                    <span className="font-medium">
                      {userInfo?.phone || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-b border-border pb-6 mb-6">
                <h4 className="font-semibold text-sm mb-3">Stats</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Total products
                    </span>
                    <span className="font-bold">{items.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Total orders</span>
                    <span className="font-bold">{getTotalOrders()}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-bold">{getAverageRating()}/5.0</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2">Inventory Value</h4>
                <div className="text-2xl font-bold text-primary">
                  ₦
                  {items
                    .reduce((sum, item) => {
                      const value = parseInt(
                        item.value?.replace(/[^0-9]/g, "") || 0,
                      );
                      return sum + value;
                    }, 0)
                    .toLocaleString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 bg-card/50">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-semibold text-foreground mb-1">Script</p>
              <p className="text-xs">Complete business management platform</p>
            </div>
            <div className="flex items-center gap-6 text-xs">
              <a href="/" className="hover:text-primary transition-colors">
                Home
              </a>
              <a href="/" className="hover:text-primary transition-colors">
                About
              </a>
              <a href="/" className="hover:text-primary transition-colors">
                Contact
              </a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground text-center">
            © 2024 Script. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
