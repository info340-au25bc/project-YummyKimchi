import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue, set, push, remove } from 'firebase/database';
import { motion } from "motion/react"

export function InventoryPage(props) {
    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");
    const [clothingList, setClothingList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(4);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [dateNewest, setDateSort] = useState(true);
    
    const navigate = useNavigate();
    const auth = getAuth();
    const database = getDatabase();
    const fileInputRef = useRef(null);

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
                navigate('/login');
            }
        });

        return () => unsubscribe();
    }, [auth, navigate, dateNewest]);

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
                // Sort by creation date, newest first if dateNewest is true
                if (dateNewest) {
                    itemsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                } else {
                    itemsArray.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                }
                setClothingList(itemsArray);
            } else {
                setClothingList([]);
            }
            setLoading(false);
            setCurrentPage(1);
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

    // Pagination calculations
    const totalPages = Math.ceil(filteredClothingList.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredClothingList.slice(indexOfFirstItem, indexOfLastItem);

    // Handle page change
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Handle image file selection
    const handleImageSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file size (limit to 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("Image size should be less than 5MB");
                return;
            }

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setImagePreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Upload image to Firebase and return data URL
    const uploadImageToFirebase = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const dataUrl = reader.result;
                resolve(dataUrl);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    // Handle adding new item to Firebase
    const handleAddItem = async (event) => {
        event.preventDefault();
        if (!user) {
            alert("Please log in to add items");
            return;
        }

        const form = event.target;
        const fileInput = form.querySelector('input[type="file"]');
        const file = fileInput.files[0];

        let imageUrl = "/img/default-clothing.jpg";
        
        if (file) {
            setUploadingImage(true);
            try {
                imageUrl = await uploadImageToFirebase(file);
            } catch (error) {
                alert("Failed to upload image: " + error.message);
                setUploadingImage(false);
                return;
            }
            setUploadingImage(false);
        }

        const newItem = {
            description: form.itemName.value,
            category: form.itemCategory.value,
            location: form.itemLocation.value,
            color: form.itemColor.value,
            size: form.itemSize.value,
            file: imageUrl,
            createdAt: new Date().toISOString()
        };

        try {
            const newItemRef = push(ref(database, `users/${user.uid}/inventory`));
            await set(newItemRef, newItem);
            
            // Reset form and preview
            form.reset();
            setImagePreview(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
            
        } catch (error) {
            alert("Failed to add item: " + error.message);
        }
    };

    // Handle deleting item
    const handleDeleteItem = async (itemId) => {
        if (!user) return;

        if (window.confirm("Are you sure you want to delete this item?")) {
            try {
                const itemRef = ref(database, `users/${user.uid}/inventory/${itemId}`);
                await remove(itemRef);
                alert("Item deleted successfully!");
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
        setCurrentPage(1);
    };

    // Generate page numbers for pagination
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Display list based on view mode
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
        returnList = currentItems.map((item) => {
            if (viewMode === 'list') {
                return (
                    <div className="flex-row subsection clothing-card list-view" key={item.id}>
                        <div className="clothing-card-content">
                            <h3 className="subheading clothing-card-list-heading">{item.description}</h3>
                            <div className="clothing-card-details">
                                <p><span className='clothing-card-span-styling'>Category:</span> {item.category} | <span className='clothing-card-span-styling'>Location:</span> {item.location} | <span className='clothing-card-span-styling'>Color:</span> {item.color} | <span className='clothing-card-span-styling'>Size:</span> {item.size} | <span className='clothing-card-span-styling'>Date Created:</span> {item.createdAt.split("T")[0]}</p>
                            </div>
                            <div className="submission-box">
                                <button onClick={() => handleDeleteItem(item.id)}>Delete</button>
                            </div>
                        </div>
                    </div>
                );
            } else {
                return (
                    <div className="flex-column subsection clothing-card grid-view" key={item.id}>
                        <img src={item.file} className="clothing-card-img" alt={item.description} />
                        <h3 className="subheading clothing-card-heading">{item.description}</h3>
                        <p><span className='clothing-card-span-styling'>Category:</span> {item.category}</p>
                        <p><span className='clothing-card-span-styling'>Location:</span> {item.location}</p>
                        <p><span className='clothing-card-span-styling'>Color:</span> {item.color}</p>
                        <p><span className='clothing-card-span-styling'>Size:</span> {item.size}</p>
                        <div className="submission-box">
                            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }} onClick={() => handleDeleteItem(item.id)}>Delete</motion.button>
                        </div>
                    </div>
                );
            }
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
                <img src="/img/inventoryheader.jpg" alt="Background image of clothes" className="header-img"/>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="header-text">
                    <h1 className="header">Your Clothing Inventory</h1>
                    <p className="header-paragraph">Track, organize, and manage your wardrobe</p>
                </motion.div>
            </div>

            {/* Search and Filter Section */}
            <motion.section initial={{ scale: 0 }} animate={{ scale: 1 }} className="main-section flex-container">
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
                                onChange={(e) => {
                                    setSearchTerm(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                        <div className="flex-column submission-box">
                            <label htmlFor="categoryFilter">Category</label>
                            <select 
                                id="categoryFilter" 
                                value={categoryFilter}
                                onChange={(e) => {
                                    setCategoryFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
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
                                onChange={(e) => {
                                    setLocationFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                            >
                                <option value="">All Locations</option>
                                <option value="closet">Closet</option>
                                <option value="drawer">Drawer</option>
                                <option value="storage">Storage</option>
                                <option value="laundry">Laundry</option>
                            </select>
                        </div>
                        <div className="flex-column submission-box filter-button">
                            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }} className='button-styling' type="button" onClick={handleClearFilters}>Clear Filters</motion.button>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* Add New Item Section */}
            <motion.section initial={{ scale: 0 }} animate={{ scale: 1 }} className="main-section flex-container">
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
                        <div className="flex-column submission-box form-field">
                            <label htmlFor="itemImage">Image</label>
                            <motion.input initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}
                                type="file" 
                                id="itemImage" 
                                name="itemImage" 
                                accept="image/*"
                                onChange={handleImageSelect}
                                ref={fileInputRef}
                            />
                            {imagePreview && (
                                <div className="image-preview">
                                    <img src={imagePreview} alt="Preview" className="inventory-image" />
                                </div>
                            )}
                        </div>
                        <div className="flex-column submission-box full-width">
                            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.8 }} type="submit" disabled={uploadingImage} className='button-styling'>
                                {uploadingImage ? "Uploading Image..." : "Add to Inventory"}
                            </motion.button>
                        </div>
                    </form>
                </div>
            </motion.section>
            
            {/* Inventory Display Section */}
            <section className="main-section">
                <div className="subsection">
                    <div className="inventory-header">
                        <h2 className="header">Your Clothing Items ({filteredClothingList.length})</h2>
                        <div className="view-controls">
                            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}
                                className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                                onClick={() => setViewMode('grid')}>
                                Picture
                            </motion.button>
                            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setViewMode('list')}>
                                List
                            </motion.button>
                            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}
                                className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                                onClick={() => setDateSort(!dateNewest)}>
                                Date Sort
                            </motion.button>
                        </div>
                    </div>
                    
                    <div className={`inventory-display ${viewMode === 'grid' ? 'inventory-grid' : 'inventory-list'}`}>
                        {returnList}
                    </div>
                    
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.8 }}
                                onClick={() => paginate(currentPage - 1)} 
                                disabled={currentPage === 1}
                                className="page-btn"
                            >
                                Previous
                            </motion.button>
                            
                            <div className="page-numbers">
                                {pageNumbers.map(number => (
                                    <button
                                        key={number}
                                        onClick={() => paginate(number)}
                                        className={`page-number ${currentPage === number ? 'active' : ''}`}
                                    >
                                        {number}
                                    </button>
                                ))}
                            </div>
                            
                            <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.8 }}
                                onClick={() => paginate(currentPage + 1)} 
                                disabled={currentPage === totalPages}
                                className="page-btn"
                            >
                                Next
                            </motion.button>
                        </div>
                    )}
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