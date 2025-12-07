import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, set, push, remove } from 'firebase/database';

export function InventoryPage(props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [clothingList, setClothingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    
    const navigate = useNavigate();
    const auth = getAuth();
    const database = getDatabase();

    // Check authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                loadUserInventory(currentUser.uid);
            } else {
                setUser(null);
                setClothingList([]);
                setLoading(false);
                // Redirect to login if not authenticated
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [auth, navigate]);

    // Load user's inventory from Firebase
    const loadUserInventory = (userId) => {
        setLoading(true);
        const itemsRef = ref(database, `users/${userId}/inventory`);
        
        const unsubscribe = onValue(itemsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const itemsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setClothingList(itemsArray);
            } else {
                setClothingList([]);
            }
            setLoading(false);
        });

        return unsubscribe;
    };

    // Filter clothing items
    const filteredClothingList = clothingList.filter((item) => {
        const matchesSearch = searchTerm === "" || 
            (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (item.color && item.color.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesCategory = categoryFilter === "" || 
            (item.category && item.category.toLowerCase() === categoryFilter.toLowerCase());
        
        const matchesLocation = locationFilter === "" || 
            (item.location && item.location.toLowerCase() === locationFilter.toLowerCase());
        
        return matchesSearch && matchesCategory && matchesLocation;
    });

    // Handle adding new item to Firebase
    const handleAddItem = (event) => {
        event.preventDefault();
        if (!user) {
            alert("Please log in to add items");
            return;
        }

        const form = event.target;
        const newItem = {
            description: form.itemName.value,
            category: form.itemCategory.value,
            location: form.itemLocation.value,
            color: form.itemColor.value,
            size: form.itemSize.value,
            file: "/img/default-clothing.jpg",
            createdAt: new Date().toISOString()
        };

        try {
            const newItemRef = push(ref(database, `users/${user.uid}/inventory`));
            set(newItemRef, newItem);
            
            // Reset form
            form.reset();
        } catch (error) {
            alert("Failed to add item: " + error.message);
        }
    };

    // Handle editing item
    const handleEditItem = (item) => {
        // You can implement edit functionality here if needed
        alert("Edit functionality would be implemented here");
    };

    // Handle deleting item
    const handleDeleteItem = async (itemId) => {
        if (!user) return;

        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                const itemRef = ref(database, `users/${user.uid}/inventory/${itemId}`);
                await remove(itemRef);
            } catch (error) {
                alert("Failed to delete item: " + error.message);
            }
        }
    };

    // Clear all filters
    const handleClearFilters = () => {
        setSearchTerm("");
        setCategoryFilter("");
        setLocationFilter("");
    };

    // Display list
    let returnList = [];

    if (loading) {
        returnList.push(
            <div className="empty-inventory flex-column" key="loading">
                <h3 className="empty-message">Loading your inventory...</h3>
            </div>
        );
    } else if (filteredClothingList.length === 0) {
        returnList.push(
            <div className="empty-inventory flex-column" key="empty">
                <h3 className="empty-message">
                    {clothingList.length === 0 ? "Your inventory is empty" : "No items match your filters"}
                </h3>
                <p className="empty-submessage">
                    {clothingList.length === 0 
                        ? "Add your first clothing item using the form above!" 
                        : "Try adjusting your search or filter criteria"}
                </p>
            </div>
        );
    } else {
        returnList = filteredClothingList.map((item) => {
            return (
                <div className="flex-column subsection clothing-card" key={item.id}>
                    <img src={item.file} className="clothing-card-img" alt={item.description} />
                    <h3 className="subheading clothing-card-heading">{item.description}</h3>
                    <p><strong>Category:</strong> {item.category}</p>
                    <p><strong>Location:</strong> {item.location}</p>
                    <p><strong>Color:</strong> {item.color}</p>
                    <p><strong>Size:</strong> {item.size}</p>
                    <div className="submission-box">
                        <button onClick={() => handleEditItem(item)}>Edit Item</button>
                        <button onClick={() => handleDeleteItem(item.id)} style={{marginLeft: '10px'}}>Delete</button>
                    </div>
                </div>
            );
        });
    }

    // Statistics
    const totalItems = filteredClothingList.length;
    const inCloset = filteredClothingList.filter(item => item.location === 'closet').length;
    const inStorage = filteredClothingList.filter(item => item.location === 'storage').length;

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
                                placeholder="Enter item name or color..." 
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex-column submission-box">
                            <label htmlFor="categoryFilter">Category</label>
                            <select 
                                id="categoryFilter" 
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
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
                                value={locationFilter}
                                onChange={(e) => setLocationFilter(e.target.value)}
                            >
                                <option value="">All Locations</option>
                                <option value="closet">Closet</option>
                                <option value="drawer">Drawer</option>
                                <option value="storage">Storage</option>
                                <option value="laundry">Laundry</option>
                            </select>
                        </div>
                        <div className="flex-column submission-box filter-button">
                            <button type="button" onClick={handleClearFilters}>Clear Filters</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Add New Item Section */}
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
                                <option value="storage">Storage</option>
                                <option value="laundry">Laundry</option>
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
            
            {/* Inventory Display Section */}
            <section className="main-section">
                <div className="subsection">
                    <h2 className="header">Your Clothing Items ({filteredClothingList.length})</h2>
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