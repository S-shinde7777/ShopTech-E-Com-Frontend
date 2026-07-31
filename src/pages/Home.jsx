import React, { useState, useEffect } from "react";
import Banner from "../components/common/Banner";
import SearchBar from "../components/common/SearchBar";
import CategoryCard from "../components/common/CategoryCard";
import ProductCard from "../components/common/ProductCard";
import { productService } from "../services/productService";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Filtering & Sorting States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOption, setSortOption] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Load from service on mount
  useEffect(() => {
    setProducts(productService.getProducts());
    setCategories(productService.getCategories());
  }, []);

  const handleCategorySelect = (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null); // Toggle off if clicked again
    } else {
      setSelectedCategory(categoryName);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setSortOption("default");
    setMinPrice("");
    setMaxPrice("");
  };

  // Compute filtered & sorted products
  const getFilteredProducts = () => {
    let result = [...products];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category click filter
    if (selectedCategory) {
      result = result.filter(
        (p) => p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Min Price filter
    if (minPrice !== "" && !isNaN(minPrice)) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    // Max Price filter
    if (maxPrice !== "" && !isNaN(maxPrice)) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    // Sort operations
    if (sortOption === "price-low") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortOption === "rating") {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  };

  const filteredProducts = getFilteredProducts();

  return (
    <div className="min-h-screen bg-[#0F1117] text-white pb-16">
      {/* Hero Promo Banner */}
      <Banner />

      {/* Interactive Search and Filter Options */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mt-10">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOption={sortOption}
          onSortChange={setSortOption}
          minPrice={minPrice}
          onMinPriceChange={setMinPrice}
          maxPrice={maxPrice}
          onMaxPriceChange={setMaxPrice}
          onResetFilters={handleResetFilters}
        />
      </div>

      {/* Categories Horizontal Listing */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mt-12">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              Filter by Category
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Select a category to narrow down your gear choices
            </p>
          </div>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-[#F5A623] hover:underline text-sm font-semibold"
            >
              Clear Category Filter
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => handleCategorySelect(category.name)}
              active={selectedCategory?.toLowerCase() === category.name.toLowerCase()}
            />
          ))}
        </div>
      </section>

      {/* Products Grid Listings */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 mt-16">
        <div className="flex justify-between items-end mb-8 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">
              {selectedCategory ? `${selectedCategory} Collection` : "Featured Products"}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Showing {filteredProducts.length} high-fidelity products
            </p>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 ? (
          <div className="bg-[#171B26] border border-gray-800 rounded-3xl p-16 text-center max-w-lg mx-auto mt-10">
            <span className="text-5xl">🔍</span>
            <h3 className="text-xl font-bold text-white mt-4">No Products Found</h3>
            <p className="text-gray-400 mt-2 text-sm">
              We couldn't find any items matching your exact filters. Try broadening your keywords or price parameters.
            </p>
            <button
              onClick={handleResetFilters}
              className="mt-6 px-6 py-2.5 rounded-xl bg-[#F5A623] text-black font-bold text-sm hover:scale-105 transition cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;