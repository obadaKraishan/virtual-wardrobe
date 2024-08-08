document.addEventListener('DOMContentLoaded', () => {
    fetchItems();
    fetchOutfits();
  
    document.getElementById('itemForm').addEventListener('submit', function(event) {
      event.preventDefault();
      const itemId = this.dataset.id;
      if (itemId) {
        updateItem(itemId);
      } else {
        addItem();
      }
    });
  
    document.getElementById('outfitForm').addEventListener('submit', function(event) {
      event.preventDefault();
      const outfitId = this.dataset.id;
      if (outfitId) {
        updateOutfit(outfitId);
      } else {
        createOutfit();
      }
    });
  });
  
  async function fetchItems() {
    const response = await fetch('/api/items');
    const items = await response.json();
    displayItems(items);
    populateItemSelect(items);
  }
  
  async function addItem() {
    const itemName = document.getElementById('itemName').value;
    const itemCategory = document.getElementById('itemCategory').value;
    const itemColor = document.getElementById('itemColor').value;
    const itemSize = document.getElementById('itemSize').value;
    const itemImage = document.getElementById('itemImage').value;
  
    const response = await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: itemName, category: itemCategory, color: itemColor, size: itemSize, image: itemImage })
    });
  
    const newItem = await response.json();
    displayItem(newItem);
    populateItemSelect([newItem]);
  
    document.getElementById('itemForm').reset();
  }
  
  async function updateItem(id) {
    const itemName = document.getElementById('itemName').value;
    const itemCategory = document.getElementById('itemCategory').value;
    const itemColor = document.getElementById('itemColor').value;
    const itemSize = document.getElementById('itemSize').value;
    const itemImage = document.getElementById('itemImage').value;
  
    const response = await fetch(`/api/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: itemName, category: itemCategory, color: itemColor, size: itemSize, image: itemImage })
    });
  
    const updatedItem = await response.json();
    fetchItems();
  
    document.getElementById('itemForm').reset();
    document.getElementById('itemForm').removeAttribute('data-id');
  }
  
  function displayItems(items) {
    const itemList = document.getElementById('itemList');
    itemList.innerHTML = '';
    items.forEach(displayItem);
  }
  
  function displayItem(item) {
    const itemList = document.getElementById('itemList');
    const itemElement = document.createElement('li');
    itemElement.className = 'list-group-item';
    itemElement.innerHTML = `
      <div class="d-flex justify-content-between">
        <div>
          <h5>${item.name}</h5>
          <p>Category: ${item.category}</p>
          <p>Color: ${item.color}</p>
          <p>Size: ${item.size}</p>
          <img src="${item.image}" alt="${item.name}" class="img-thumbnail" style="max-width: 100px;">
        </div>
        <div>
          <button class="btn btn-warning btn-sm mr-2" onclick="editItem('${item._id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteItem('${item._id}')">Delete</button>
        </div>
      </div>
    `;
    itemList.appendChild(itemElement);
  }
  
  async function deleteItem(id) {
    await fetch(`/api/items/${id}`, { method: 'DELETE' });
    fetchItems();
  }
  
  function populateItemSelect(items) {
    const outfitItemsSelect = document.getElementById('outfitItems');
    outfitItemsSelect.innerHTML = '';
    items.forEach(item => {
      const option = document.createElement('option');
      option.value = item._id;
      option.textContent = item.name;
      outfitItemsSelect.appendChild(option);
    });
  }
  
  async function createOutfit() {
    const outfitName = document.getElementById('outfitName').value;
    const outfitItems = Array.from(document.getElementById('outfitItems').selectedOptions).map(option => option.value);
  
    const response = await fetch('/api/outfits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: outfitName, items: outfitItems })
    });
  
    const newOutfit = await response.json();
    displayOutfit(newOutfit);
  
    document.getElementById('outfitForm').reset();
  }
  
  async function updateOutfit(id) {
    const outfitName = document.getElementById('outfitName').value;
    const outfitItems = Array.from(document.getElementById('outfitItems').selectedOptions).map(option => option.value);
  
    const response = await fetch(`/api/outfits/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: outfitName, items: outfitItems })
    });
  
    const updatedOutfit = await response.json();
    fetchOutfits();
  
    document.getElementById('outfitForm').reset();
    document.getElementById('outfitForm').removeAttribute('data-id');
  }
  
  async function fetchOutfits() {
    const response = await fetch('/api/outfits');
    const outfits = await response.json();
    displayOutfits(outfits);
  }
  
  function displayOutfits(outfits) {
    const outfitList = document.getElementById('outfitList');
    outfitList.innerHTML = '';
    outfits.forEach(displayOutfit);
  }
  
  function displayOutfit(outfit) {
    const outfitList = document.getElementById('outfitList');
    const outfitElement = document.createElement('li');
    outfitElement.className = 'list-group-item';
    outfitElement.innerHTML = `
      <div class="d-flex justify-content-between">
        <div>
          <h5>${outfit.name}</h5>
          <p>Items:</p>
          <ul>
            ${outfit.items.map(item => `<li>${item.name}</li>`).join('')}
          </ul>
        </div>
        <div>
          <button class="btn btn-warning btn-sm mr-2" onclick="editOutfit('${outfit._id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteOutfit('${outfit._id}')">Delete</button>
        </div>
      </div>
    `;
    outfitList.appendChild(outfitElement);
  }
  
  async function deleteOutfit(id) {
    await fetch(`/api/outfits/${id}`, { method: 'DELETE' });
    fetchOutfits();
  }
  
  function editItem(id) {
    const itemElement = document.querySelector(`#itemList .list-group-item [onclick="editItem('${id}')"]`).parentElement.parentElement;
    const itemName = itemElement.querySelector('h5').textContent;
    const itemCategory = itemElement.querySelector('p:nth-child(2)').textContent.split(': ')[1];
    const itemColor = itemElement.querySelector('p:nth-child(3)').textContent.split(': ')[1];
    const itemSize = itemElement.querySelector('p:nth-child(4)').textContent.split(': ')[1];
    const itemImage = itemElement.querySelector('img').src;
  
    document.getElementById('itemName').value = itemName;
    document.getElementById('itemCategory').value = itemCategory;
    document.getElementById('itemColor').value = itemColor;
    document.getElementById('itemSize').value = itemSize;
    document.getElementById('itemImage').value = itemImage;
    document.getElementById('itemForm').dataset.id = id;
  }
  
  function editOutfit(id) {
    const outfitElement = document.querySelector(`#outfitList .list-group-item [onclick="editOutfit('${id}')"]`).parentElement.parentElement;
    const outfitName = outfitElement.querySelector('h5').textContent;
    const outfitItems = Array.from(outfitElement.querySelectorAll('ul li')).map(li => li.textContent);
  
    document.getElementById('outfitName').value = outfitName;
    const outfitItemsSelect = document.getElementById('outfitItems');
    Array.from(outfitItemsSelect.options).forEach(option => {
      if (outfitItems.includes(option.textContent)) {
        option.selected = true;
      } else {
        option.selected = false;
      }
    });
    document.getElementById('outfitForm').dataset.id = id;
  }
  