export function InventoryPage(props) {
    return (
        <div>
            {/* Search and Filter Section */}
            <section className="main-section flex-container">
                <div className="flex-column subsection" style="width: 100%;">
                    <h2 className="header">Find Your Items</h2>
                    <form className="flex-container" style="justify-content: flex-start; gap: 2rem;">
                        <div className="flex-column submission-box">
                            <label for="searchInput">Search Items</label>
                            <input type="text" id="searchInput" name="search" placeholder="Enter item name..." />
                        </div>
                        <div className="flex-column submission-box">
                            <label for="categoryFilter">Category</label>
                            <select id="categoryFilter" name="category">
                                <option value="">All Categories</option>
                                <option value="tops">Tops</option>
                                <option value="bottoms">Bottoms</option>
                                <option value="shoes">Shoes</option>
                                <option value="accessories">Accessories</option>
                                <option value="outerwear">Outerwear</option>
                            </select>
                        </div>
                        <div className="flex-column submission-box">
                            <label for="locationFilter">Location</label>
                            <select id="locationFilter" name="location">
                                <option value="">All Locations</option>
                                <option value="closet">Closet</option>
                                <option value="drawer">Drawer</option>
                                <option value="laundry">Laundry</option>
                                <option value="storage">Storage</option>
                            </select>
                        </div>
                        <div className="flex-column submission-box" style="align-self: flex-end;">
                            <button type="submit" style="margin-top: 1.5rem;">Filter Items</button>
                        </div>
                    </form>
                </div>
            </section>
            {/* Add New Item Section */}
            <section className="main-section flex-container">
                <div className="flex-column subsection" style="width: 100%;">
                    <h2 className="header">Add New Clothing Item</h2>
                    <form className="flex-container" style="flex-wrap: wrap; gap: 1rem;">
                        <div className="flex-column submission-box" style="flex: 1 1 200px;">
                            <label for="itemName">Item Name</label>
                            <input type="text" id="itemName" name="itemName" required />
                        </div>
                        <div className="flex-column submission-box" style="flex: 1 1 200px;">
                            <label for="itemCategory">Category</label>
                            <select id="itemCategory" name="itemCategory" required>
                                <option value="">Select Category</option>
                                <option value="tops">Tops</option>
                                <option value="bottoms">Bottoms</option>
                                <option value="shoes">Shoes</option>
                                <option value="accessories">Accessories</option>
                                <option value="outerwear">Outerwear</option>
                            </select>
                        </div>
                        <div className="flex-column submission-box" style="flex: 1 1 200px;">
                            <label for="itemLocation">Storage Location</label>
                            <select id="itemLocation" name="itemLocation" required>
                                <option value="">Select Location</option>
                                <option value="closet">Closet</option>
                                <option value="drawer">Drawer</option>
                                <option value="laundry">Laundry</option>
                                <option value="storage">Storage</option>
                            </select>
                        </div>
                        <div className="flex-column submission-box" style="flex: 1 1 200px;">
                            <label for="itemColor">Color</label>
                            <input type="text" id="itemColor" name="itemColor" />
                        </div>
                        <div className="flex-column submission-box" style="flex: 1 1 200px;">
                            <label for="itemSize">Size</label>
                            <input type="text" id="itemSize" name="itemSize" />
                        </div>
                        <div className="flex-column submission-box" style="width: 100%;">
                            <button type="submit">Add to Inventory</button>
                        </div>
                    </form>
                </div>
            </section>
            
            {/* Empty Inventory Display Section */}
            <section className="main-section">
                <div className="subsection">
                    <h2 className="header">Your Clothing Items</h2>
                    <div className="flex-container" style="gap: 2rem; justify-content: flex-start;">
                        <div className="empty-inventory flex-column">
                        <h3 className="empty-message">Your inventory is empty</h3>
                        <p className="empty-submessage">Add your first clothing item using the form above to get started!</p>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Statistics Section */}
            <section className="main-section flex-container">
                <div className="flex-column subsection" style="text-align: center;">
                    <h2 className="header">Inventory Summary</h2>
                    <div className="flex-container">
                        <div className="flex-column subsection">
                            <p className="subheading">0</p>
                            <p>Total Items</p>
                        </div>
                        <div className="flex-column subsection">
                            <p className="subheading">0</p>
                            <p>In Closet</p>
                        </div>
                        <div className="flex-column subsection">
                            <p className="subheading">0</p>
                            <p>In Storage</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}