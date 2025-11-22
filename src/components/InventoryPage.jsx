import React, { useState } from 'react';

export function InventoryPage(props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    // Grabs the data from props
    const clothingList = props.clothingList;

    // Debug: log the clothing list to see what data we're working with
    console.log('Clothing list:', clothingList);

    // Filter clothing items - this runs automatically when state changes
    const filteredClothingList = clothingList.filter((item) => {
        console.log('Checking item:', item);
        
        const matchesSearch = searchTerm === "" || 
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.color && item.color.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = categoryFilter === "" || 
            (item.category && item.category.toLowerCase() === categoryFilter.toLowerCase());
        
        const matchesLocation = locationFilter === "" || 
            (item.location && item.location.toLowerCase() === locationFilter.toLowerCase());
        
        console.log('Matches:', { matchesSearch, matchesCategory, matchesLocation, item });
        
        return matchesSearch && matchesCategory && matchesLocation;
    });

    console.log('Filtered list:', filteredClothingList);
    
    // This is the list that will display all of the clothing cards.
    let returnList = [];

    if (filteredClothingList.length === 0) {
        returnList.push(
            <div className="empty-inventory flex-column" key="empty">
                <h3 className="empty-message">No items match your filters</h3>
                <p className="empty-submessage">Try adjusting your search or filter criteria</p>
                <p className="empty-submessage">Total items in inventory: {clothingList.length}</p>
            </div>
        )
    } else {
        returnList = filteredClothingList.map((object, index) => {
            return (
                <div className="flex-column subsection clothing-card" key={object.id || object.description + index}>
                    <img src={object.file} className="clothing-card" alt={object.description} />
                    <h3 className="subheading clothing-card-heading">{object.description}</h3>
                    <p><strong>Category:</strong> {object.category}</p>
                    <p><strong>Location:</strong> {object.location}</p>
                    <p><strong>Color:</strong> {object.color}</p>
                    <p><strong>Size:</strong> {object.size}</p>
                    <div className="submission-box">
                        <button>Edit Item</button>
                    </div>
                </div>
            )
        })
    }

    // Item statistics
    const totalItems = filteredClothingList.length;
    const inCloset = filteredClothingList.filter(item => item.location && item.location.toLowerCase() === 'closet').length;
    const inStorage = filteredClothingList.filter(item => item.location && item.location.toLowerCase() === 'storage').length;

    // Handle search input change
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Handle category filter change
    const handleCategoryChange = (event) => {
        setCategoryFilter(event.target.value);
    };

    // Handle location filter change
    const handleLocationChange = (event) => {
        setLocationFilter(event.target.value);
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSearchTerm("");
        setCategoryFilter("");
        setLocationFilter("");
    };

    // Handle adding new item (placeholder function)
    const handleAddItem = (event) => {
        event.preventDefault();
        alert("Add item functionality will be implemented in the final version");
    };

    return (
        <div>
            {/* Top image and Title */}
            <div className="header-stack">
                <img src="/img/main-page-header.avif" alt="Background image of clothes" className="header-img"/>
                <div className="header-text">
                    <h1 className="header">Your Clothing Inventory</h1>
                    <p className="header-paragraph">Track, organize, and manage your wardrobe</p>
                </div>
            </div>

            {/* Search and Filter Section */}
            <section className="main-section flex-container">
                <div className="flex-column subsection full-width">
                    <h2 className="header">Find Your Items</h2>
                    <div className="flex-container filter-form">
                        <div className="flex-column submission-box">
                            <label htmlFor="searchInput">Search Items</label>
                            <input 
                                type="text" 
                                id="searchInput" 
                                name="search" 
                                placeholder="Enter item name or color..." 
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="flex-column submission-box">
                            <label htmlFor="categoryFilter">Category</label>
                            <select 
                                id="categoryFilter" 
                                name="category" 
                                value={categoryFilter}
                                onChange={handleCategoryChange}
                            >
                                <option value="">All Categories</option>
                                <option value="tops">Tops</option>
                                <option value="bottoms">Bottoms</option>
                                <option value="shoes">Shoes</option>
                                <option value="accessories">Accessories</option>
                                <option value="outerwear">Outerwear</option>
                            </select>
                        </div>
                        <div className="flex-column submission-box">
                            <label htmlFor="locationFilter">Location</label>
                            <select 
                                id="locationFilter" 
                                name="location" 
                                value={locationFilter}
                                onChange={handleLocationChange}
                            >
                                <option value="">All Locations</option>
                                <option value="closet">Closet</option>
                                <option value="drawer">Drawer</option>
                                <option value="laundry">Laundry</option>
                                <option value="storage">Storage</option>
                            </select>
                        </div>
                        <div className="flex-column submission-box filter-button">
                            <button type="button" onClick={handleClearFilters}>Clear Filters</button>
                        </div>
                    </div>
                    <div className="current-filters">
                        <p>Active filters: 
                            {searchTerm && ` Search: "${searchTerm}"`}
                            {categoryFilter && ` Category: ${categoryFilter}`}
                            {locationFilter && ` Location: ${locationFilter}`}
                            {!searchTerm && !categoryFilter && !locationFilter && ' None'}
                        </p>
                    </div>
                </div>
            </section>

            {/* Rest of your component remains the same */}
            <section className="main-section flex-container">
                <div className="flex-column subsection full-width">
                    <h2 className="header">Add New Clothing Item</h2>
                    <form className="flex-container add-item-form" onSubmit={handleAddItem}>
                        <div className="flex-column submission-box form-field">
                            <label htmlFor="itemName">Item Name</label>
                            <input type="text" id="itemName" name="itemName" required />
                        </div>
                        <div className="flex-column submission-box form-field">
                            <label htmlFor="itemCategory">Category</label>
                            <select id="itemCategory" name="itemCategory" required>
                                <option value="">Select Category</option>
                                <option value="tops">Tops</option>
                                <option value="bottoms">Bottoms</option>
                                <option value="shoes">Shoes</option>
                                <option value="accessories">Accessories</option>
                                <option value="outerwear">Outerwear</option>
                            </select>
                        </div>
                        <div className="flex-column submission-box form-field">
                            <label htmlFor="itemLocation">Storage Location</label>
                            <select id="itemLocation" name="itemLocation" required>
                                <option value="">Select Location</option>
                                <option value="closet">Closet</option>
                                <option value="drawer">Drawer</option>
                                <option value="laundry">Laundry</option>
                                <option value="storage">Storage</option>
                            </select>
                        </div>
                        <div className="flex-column submission-box form-field">
                            <label htmlFor="itemColor">Color</label>
                            <input type="text" id="itemColor" name="itemColor" />
                        </div>
                        <div className="flex-column submission-box form-field">
                            <label htmlFor="itemSize">Size</label>
                            <input type="text" id="itemSize" name="itemSize" />
                        </div>
                        <div className="flex-column submission-box full-width">
                            <button type="submit">Add to Inventory</button>
                        </div>
                    </form>
                </div>
            </section>
            
            <section className="main-section">
                <div className="subsection">
                    <h2 className="header">Your Clothing Items ({filteredClothingList.length})</h2>
                    <div className="flex-container inventory-grid">
                        {returnList}
                    </div>
                </div>
            </section>
            
            <section className="main-section flex-container">
                <div className="flex-column subsection stats-section">
                    <h2 className="header">Inventory Summary</h2>
                    <div className="flex-container">
                        <div className="flex-column subsection">
                            <p className="subheading">{totalItems}</p>
                            <p>Total Items</p>
                        </div>
                        <div className="flex-column subsection">
                            <p className="subheading">{inCloset}</p>
                            <p>In Closet</p>
                        </div>
                        <div className="flex-column subsection">
                            <p className="subheading">{inStorage}</p>
                            <p>In Storage</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}