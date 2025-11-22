export function InventoryPage(props) {
    // I've done a large chunk of your page at this point, which I'll list below:
    // Props data has been taken care of (it's based on your clothing examples from last time).
    // React routing has been done.
    // Automatic display of the props data has been done.
    // Took care of the case where there may be no data (displays the empty inventory card you made).
    // Fixed inline styling and changed to css styling.

    // Your goal is to implement the search function (which should then filter the inventory display).
    // This should likely use a onSubmit callback function which you can find an example of in my Login.jsx code or from Problem Set 7.
    // This is a critical part of Project Draft 2 as we need to have on one of these features done.

    // I've created a starting point below with comments explaining what things are already doing:

    // Grabs the data from props
    const clothingList = props.clothingList

    // This is the list that will display all of the clothing cards.
    let returnList = [];

    // This will just check in the beginning if there is literally no items to be displayed, otherwise just fill the returnList with information.
    if (clothingList.length === 0) {
        returnList.push(
            <div className="empty-inventory flex-column">
                <h3 className="empty-message">Your inventory is empty</h3>
                <p className="empty-submessage">Add your first clothing item using the form above to get started!</p>
            </div>
        )
    }

    // If the list of clothes isn't empty, populate with the Map function (you will need to user either filter or map, depending on how you want to do the filter)
    // The card html is from your inventory page.
    if (clothingList.length !== 0) {
        returnList = clothingList.map((object) => {
            return (
                <div className="flex-column subsection clothing-card" key={object.description}>
                    <img src={object.file} className="clothing-card" />
                    <h3 className="subheading clothing-card-heading">{object.description}</h3>
                    <p><strong>Category:</strong>{object.category}</p>
                    <p><strong>Location:</strong>{object.location}</p>
                    <p><strong>Color:</strong>{object.color}</p>
                    <p><strong>Size:</strong>{object.size}</p>
                    <div className="submission-box">
                        <button>Edit Item</button>
                    </div>
                </div>
            )
        })
    }

    // The code I've written will change depending on the json, essentially. Your job is to now make it so that it filters once more based on criteria.
    // Feel free to move around code I've written and whatnot.

    return (
        <div>
            {/* Top image and Title */}
            <div className="header-textbox">
                <div className="textbox-width">
                    <h1 className="header">Your Clothing Inventory</h1>
                    <p className="header-paragraph">Track, organize, and manage your wardrobe</p>
                </div>
            </div>
            {/* Search and Filter Section */}
            <section className="main-section flex-container">
                <div className="flex-column subsection full-width">
                    <h2 className="header">Find Your Items</h2>
                    <form className="flex-container filter-form">
                        <div className="flex-column submission-box">
                            <label htmlFor="searchInput">Search Items</label>
                            <input type="text" id="searchInput" name="search" placeholder="Enter item name..." />
                        </div>
                        <div className="flex-column submission-box">
                            <label htmlFor="categoryFilter">Category</label>
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
                            <label htmlFor="locationFilter">Location</label>
                            <select id="locationFilter" name="location">
                                <option value="">All Locations</option>
                                <option value="closet">Closet</option>
                                <option value="drawer">Drawer</option>
                                <option value="laundry">Laundry</option>
                                <option value="storage">Storage</option>
                            </select>
                        </div>
                        <div className="flex-column submission-box filter-button">
                            <button type="submit inventory-button-styling">Filter Items</button>
                        </div>
                    </form>
                </div>
            </section>
            {/* Add New Item Section */}
            <section className="main-section flex-container">
                <div className="flex-column subsection full-width">
                    <h2 className="header">Add New Clothing Item</h2>
                    <form className="flex-container add-item-form">
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
            
            {/* Empty Inventory Display Section */}
            <section className="main-section">
                <div className="subsection">
                    <h2 className="header">Your Clothing Items</h2>
                    <div className="flex-container inventory-grid">
                        {returnList}
                    </div>
                </div>
            </section>
            
            {/* Statistics Section */}
            <section className="main-section flex-container">
                <div className="flex-column subsection stats-section">
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