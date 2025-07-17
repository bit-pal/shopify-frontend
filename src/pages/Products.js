import React, { useEffect, useState } from "react";
import axios from "axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    body_html: "",
    vendor: "",
    product_type: "",
    variants: [{ price: "", sku: "" }],
    options: []
  });
  const [selectedVariant, setSelectedVariant] = useState(0);

  // Fetch products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("variant")) {
      const [_, field] = name.split(".");
      setFormData(prev => ({
        ...prev,
        variants: [{ ...prev.variants[0], [field]: value }]
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Create new product
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/products", { product: formData });
      setIsModalOpen(false);
      setFormData({
        title: "",
        body_html: "",
        vendor: "",
        product_type: "",
        variants: [{ price: "", sku: "" }],
        options: []
      });
      fetchProducts();
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  // Update product
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        product: {
          id: currentProduct.id,
          title: formData.title,
          body_html: formData.body_html,
          vendor: formData.vendor,
          product_type: formData.product_type,
          tags: formData.tags,
          status: formData.status,
          variants: formData.variants.map(variant => ({
            id: variant.id,
            price: variant.price.toString(),
            sku: variant.sku,
            option1: variant.option1,
            product_id: variant.product_id,
            title: variant.title,
            inventory_quantity: variant.inventory_quantity,
            taxable: variant.taxable,
            requires_shipping: variant.requires_shipping
          })),
          options: formData.options
        }
      };

      console.log('Updating product with data:', productData);

      await axios.put(
        `http://localhost:5000/api/products/${currentProduct.id}`,
        productData
      );
      setIsModalOpen(false);
      setCurrentProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error.message);
    }
  };

  // Delete product
  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:5000/api/products/${productId}`);
        fetchProducts();
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Open modal for editing
  const handleEdit = (product) => {
    setCurrentProduct(product);
    setFormData({
      id: product.id,
      title: product.title,
      body_html: product.body_html || "",
      vendor: product.vendor || "",
      product_type: product.product_type || "",
      variants: product.variants.map(variant => ({
        id: variant.id,
        price: variant.price || "",
        sku: variant.sku || "",
        title: variant.title || "",
        option1: variant.option1 || ""
      })),
      options: product.options || []
    });
    setSelectedVariant(0);
    setIsModalOpen(true);
  };

  // Handle variant price change
  const handleVariantChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      variants: prev.variants.map((variant, i) => 
        i === index ? { ...variant, [field]: value } : variant
      )
    }));
  };

  return (
    <div className="products-container" style={{ minHeight: '65vh' }}>
      <div className="products-header">
        <h1>Products</h1>
        <button 
          className="add-button"
          onClick={() => {
            setCurrentProduct(null);
            setFormData({
              title: "",
              body_html: "",
              vendor: "",
              product_type: "",
              variants: [{ price: "", sku: "" }],
              options: []
            });
            setIsModalOpen(true);
          }}
        >
          Add New Product
        </button>
      </div>

      <div className="products-grid">
        {products.map((product) => (
          <div key={product.id} className="product-card">
            <img src={product.image?.src} alt={product.title} />
            <h2>{product.title}</h2>
            <p>Price: ${product.variants[0]?.price}</p>
            <div className="product-actions">
              <button 
                className="edit-button"
                onClick={() => handleEdit(product)}
              >
                Edit
              </button>
              <button 
                className="delete-button"
                onClick={() => handleDelete(product.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h2>{currentProduct ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={currentProduct ? handleUpdate : handleCreate}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  name="body_html"
                  value={formData.body_html}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Vendor:</label>
                <input
                  type="text"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Product Type:</label>
                <input
                  type="text"
                  name="product_type"
                  value={formData.product_type}
                  onChange={handleInputChange}
                />
              </div>
              
              {/* Variants Section */}
              {formData.variants && formData.variants.length > 0 && (
                <div className="variants-section">
                  <h3>Variants</h3>
                  <div className="variants-tabs">
                    {formData.variants.map((variant, index) => (
                      <button
                        key={variant.id}
                        type="button"
                        className={`variant-tab ${selectedVariant === index ? 'active' : ''}`}
                        onClick={() => setSelectedVariant(index)}
                      >
                        {variant.title || `Variant ${index + 1}`}
                      </button>
                    ))}
                  </div>
                  
                  <div className="variant-details">
                    <div className="form-group">
                      <label>Price:</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.variants[selectedVariant].price}
                        onChange={(e) => handleVariantChange(selectedVariant, 'price', e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>SKU:</label>
                      <input
                        type="text"
                        value={formData.variants[selectedVariant].sku || ''}
                        onChange={(e) => handleVariantChange(selectedVariant, 'sku', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button type="submit">
                  {currentProduct ? "Update" : "Create"}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;