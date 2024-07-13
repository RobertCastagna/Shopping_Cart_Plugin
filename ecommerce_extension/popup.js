document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById('root');
  const container = createElement('div', 'w-[375px] h-[600px] bg-white p-4 flex flex-col overflow-y-auto');
  const API_BASE_URL = 'http://127.0.0.1:8000/api';
  document.body.style.width = '400px';
  document.body.style.height = '600px';
    
  // Create the "Save Current Website's Data" button
    const saveButton = createElement('button', 'w-full bg-blue-500 text-white py-2 px-4 rounded-md flex items-center justify-center mb-4', 'Save This Product');
    saveButton.innerHTML = `
      <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
      </svg>
      Add to Shopping List
    `;
    saveButton.addEventListener('click', saveCurrentWebsiteData);
    container.appendChild(saveButton);
  
  
  // Function to fetch products from your API
  async function fetchProducts() {
    try {
      const response = await fetch(`${API_BASE_URL}/products/`);
      const products = await response.json();
      displayProducts(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  // Function to display products
  function displayProducts(products) {

    // Remove existing product list if any
  let productList = container.querySelector('.product-list');
  if (!productList) {
    productList = createElement('div', 'product-list space-y-4');
    container.appendChild(productList);
  } else {
    // Clear existing products
    productList.innerHTML = '';
  }
    
    
    products.forEach(product => {
      const productItem = createElement('div', 'bg-gray-100 p-4 rounded-md');
        
      productItem.innerHTML = `
        <div class="flex items-center mb-2">
          <div class="w-1/2 flex items-center">
              <img src="${product.image_url}" alt="${product.title}" class="w-20 h-20 object-cover rounded-md">

            <div class="w-20 h-20 object-cover rounded-md"></div>
          </div>
          <div class="w-1/2 flex items-center justify-end">
            <span class="text-lg font-semibold">$${product.price}</span>
          </div>
        </div>
        <div class="flex items-center mb-2">
          <svg class="w-5 h-5 mr-2 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
          </svg>
          <h3 class="font-semibold text-lg">${product.brand} -- ${product.title}</h3>
        </div>
        <div class="flex items-start mb-2">
          <svg class="w-5 h-5 mr-2 mt-1 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          <p class="text-sm text-gray-600">${product.description}</p>
        </div>
        <div class="flex items-center mb-2">
          <svg class="w-5 h-5 mr-2 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
            <polyline points="2 17 12 22 22 17"></polyline>
            <polyline points="2 12 12 17 22 12"></polyline>
          </svg>
          <span class="text-sm text-gray-600">Size: ${product.size}</span>
        </div>
        <div class="flex justify-end space-x-2 mt-2">
          <button class="open-button bg-blue-500 text-white px-3 py-1 rounded-md flex items-center">
            <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
            Open
          </button>
          <button class="remove-button bg-red-500 text-white px-3 py-1 rounded-md flex items-center">
            <svg class="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
            Remove
          </button>
        </div> 
             `;
  
      const openButton = productItem.querySelector('.open-button');
      const removeButton = productItem.querySelector('.remove-button');
      
      openButton.addEventListener('click', () => window.open(product.product_url, '_blank'));
      removeButton.addEventListener('click', () => removeProduct(product.id));

      productList.appendChild(productItem);
    });

    container.appendChild(productList);
  }

  // Function to remove a product
  async function removeProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`${API_BASE_URL}/products/${id}/`, {
          method: 'DELETE'
        });
      // Refresh the product list after removal
        if (response.ok) {
          fetchProducts();
        } else {
          alert('Failed to delete product. Please try again.');
          console.error('Failed to delete product:', await response.text());
        }
      } catch (error) {
        alert('An error occurred while trying to delete the product.');
        console.error('Error removing product:', error);
      }
    }
  }
  

  // Function to save current website's data
  async function saveCurrentWebsiteData() {
    chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
      const tab = tabs[0];
      try {
        const response = await fetch(`${API_BASE_URL}/process-url/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            url: tab.url
          }),
        });
        if (response.ok) {
          fetchProducts(); // Refresh the product list
        }
      } catch (error) {
        console.error('Error saving product:', error);
      }
    });
  }

  root.appendChild(container);
  fetchProducts(); // Fetch products when the popup opens
});

// Helper function to create elements with classes
function createElement(tag, classes, text) {
  const element = document.createElement(tag);
  element.className = classes;
  if (text) element.textContent = text;
  return element;
}