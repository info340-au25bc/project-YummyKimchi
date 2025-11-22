import React, { useState } from 'react';

export function OutfitBuilderPage(props) {

    const layerSlots = ['hat', 'top', 'bottoms', 'shoes'];
    const items = props.clothingList || [];
    const [slots, setSlots] = useState({ hat: null, top: null, bottoms: null, shoes: null });

    const handleClear = () => {
        setSlots({ hat: null, top: null, bottoms: null, shoes: null });
    };

    const deleteItem = (layer) => {
        setSlots((prev) => ({ ...prev, [layer]: null }));
    };

    const addToOutfit = (item) => {
        setSlots((prev) => ({ ...prev, [item.slot]: item }));
    };

    const assignRandomItem = (layer) => {
        const itemFilter = items.filter((item) => item.slot === layer);
        if (itemFilter.length === 0) return null;
        const index = Math.floor(Math.random() * itemFilter.length);
        return itemFilter[index];
    };

    const generateRandomOutfit = () => {
        setSlots({
            hat: assignRandomItem('hat'),
            top: assignRandomItem('top'),
            bottoms: assignRandomItem('bottoms'),
            shoes: assignRandomItem('shoes')
        });
    };

    return (
        <div className="app">
            <section className="builder-col" aria-labelledby="builder-title">
                <div className="builder-grid">
                    <div className="layer-stack" aria-label="Outfit layers">
                        {layerSlots.map((layer) => (
                            <div className="layer-row" key={layer}>
                                <div className="control-col">
                                    <button className="icon-btn" onClick={() => {
                                        const randomItem = assignRandomItem(layer);
                                        if (randomItem) addToOutfit(randomItem);
                                    }}>🔁</button>
                                    <button 
                                        className="icon-btn delete" 
                                        onClick={() => deleteItem(layer)}
                                    >
                                        🗑
                                    </button>
                                </div>
                                <div className="slot">
                                    {slots[layer] ? (
                                        <div className="slot-filled">
                                            <img 
                                                src={slots[layer].img} 
                                                alt={slots[layer].name} 
                                                className="slot-image"
                                            />
                                            <p className="slot-name">{slots[layer].name}</p>
                                            <p className="slot-meta">{slots[layer].category}</p>
                                        </div>
                                    ) : (
                                        <div className="add-hint">
                                            + add {layer}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="forecast-panel">
                        <p className="forecast-title">Today’s Forecast</p>
                        <div className="forecast-box">Forecast widget placeholder</div>
                        <button className="gen-btn" onClick={generateRandomOutfit}>
                            <span className="gen-icon">🌤✨</span> Generate Outfit
                        </button>
                    </div>
                </div>

                <div className="actions">
                    <button className="btn clear" onClick={handleClear}>Clear</button>
                    <button className="btn save">Save Outfit</button>
                </div>
            </section>

            <div className="closet-col">
                <div className="catalog-header">
                    <button className="add-item">+ add item</button>
                    <div className="search-row">
                        <div className="chip">🔎︎</div>
                        <div className="chip">↕</div>
                        <div className="search">
                            <input type="search" placeholder="Search…" />
                            <span className="glass">🔍</span>
                        </div>
                        <div className="chip">⋯</div>
                    </div>
                </div>
                
                <nav className="categories">
                    <h4>Categories</h4>
                    <ul>
                        <li><a href="#">All</a></li>
                        <li><a href="#">T-Shirts</a></li>
                        <li><a href="#">Shirts</a></li>
                        <li><a href="#">Hoodies</a></li>
                        <li><a href="#">Sweatshirts</a></li>
                        <li><a href="#">Jeans</a></li>
                        <li><a href="#">Pants</a></li>
                        <li><a href="#">Trousers</a></li>
                        <li><a href="#">Sweaters</a></li>
                        <li><a href="#">Coats & Jackets</a></li>
                        <li><a href="#">Hats</a></li>
                        <li><a href="#">Jewelry</a></li>
                        <li><a href="#">Bags</a></li>
                        <li><a href="#">Sunglasses</a></li>
                        <li><a href="#">Shoes</a></li>
                    </ul>
                </nav>

                <section className="gallery">
                    {items.map((item, index) => (
                        <div 
                            className="clothing" 
                            key={index} 
                            onClick={() => addToOutfit(item)}
                            title={`Add ${item.name} to outfit`}
                        >
                            <img src={item.img} alt={item.name} className="clothing-item-img" />
                        </div>
                    ))}
                </section>
            </div>
        </div>
    );
}