import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import { useNavigate } from "react-router";

export function OutfitBuilderPage(props) {

    const navigate = useNavigate();
    
    const [cityInput, setCityInput] = useState("");
    const [forecast, setForecast] = useState(null);
    const [weatherLoading, setWeatherLoading] = useState(false);
    const [weatherError, setWeatherError] = useState(null);


const handleFetchWeather = async (e) => {
    e.preventDefault();

    const city = cityInput.trim();
    if (!city) return;

    setWeatherLoading(true);
    setWeatherError(null);

    try {
        const API_KEY = import.meta.env.VITE_OPENWEATHER_KEY;

        if (!API_KEY) {
            console.error("Missing OpenWeather API key");
            setWeatherError("Weather temporarily unavailable.");
            setWeatherLoading(false);
            return;
        }

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
        )}&units=imperial&appid=${API_KEY}`;

        const res = await fetch(url);

        if (!res.ok) {
            if (res.status === 404) {
                throw new Error("City not found. Try another name.");
            }
            throw new Error("Failed to fetch weather.");
        }

        const data = await res.json();

        setForecast({
            city: data.name,
            country: data.sys?.country,
            temp: Math.round(data.main.temp),
            feelsLike: Math.round(data.main.feels_like),
            condition: data.weather[0].main,
            description: data.weather[0].description,
            icon: data.weather[0].icon,
        });
    } catch (err) {
        console.error(err);
        setForecast(null);
        setWeatherError(err.message || "Not Available");
    } finally {
        setWeatherLoading(false);
    }
};

    const layerSlots = ['hat', 'top', 'bottoms', 'shoes'];

    const [firebaseItems, setFirebaseItems] = useState([]);
    const [slots, setSlots] = useState({ hat: null, top: null, bottoms: null, shoes: null });
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    const [categoryFilter, setCategoryFilter] = useState('all'); 
    const categoryToSlot = (category = '') => {
    const c = category.toLowerCase();

    if (['hat', 'hats', 'cap', 'caps', 'beanie', 'beanies'].includes(c)) {
        return 'hat';
    }
    if (['accessories', 'accessory', 'jewelry', 'bag', 'bags', 'sunglasses'].includes(c)) {
        return 'hat';
    }

    if ([
        'tops', 't-shirt', 'tshirts', 't-shirts', 'shirt', 'shirts',
        'hoodie', 'hoodies', 'sweatshirt', 'sweatshirts', 'sweater', 'sweaters',
        'outerwear', 'coat', 'coats', 'jacket', 'jackets'
    ].includes(c)) {
        return 'top';
    }

    if (['bottoms', 'pants', 'jeans', 'trousers', 'shorts'].includes(c)) {
        return 'bottoms';
    }

    if (['shoes', 'sneakers', 'boots'].includes(c)) {
        return 'shoes';
    } 
        return null;
    };

    const mappedItems = firebaseItems
    .map((item) => {
        const slot = categoryToSlot(item.category);
        return {
            item,
            slot,    
            img: item.file,           
            name: item.description,  
        };
    })
    .filter((item) => item.slot !== null);

    const filteredItems = mappedItems.filter((item) => {
        if (categoryFilter === 'all') return true;
        return item.category && item.category.toLowerCase() === categoryFilter;
    });
    useEffect(()=>{
        const auth = getAuth();
        const database = getDatabase();

        let unsubscribeItems = null;

        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setLoading(true);

                const itemsRef = ref(database, `users/${currentUser.uid}/inventory`);
                unsubscribeItems = onValue(itemsRef, (snapshot) => {
                    const data = snapshot.val();
                    if (data) {
                        const itemsArray = Object.keys(data).map((key) => ({
                            id: key,
                            ...data[key],
                        }));
                        itemsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                        setFirebaseItems(itemsArray);
                    } else {
                        setFirebaseItems([]);
                    }
                    setLoading(false);
                });
            } else {
                setUser(null);
                setFirebaseItems([]);
                setLoading(false);
            }
        });

        return () => {
            if (unsubscribeItems) unsubscribeItems();
            unsubscribeAuth();
        };
    }, []);

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
        const itemFilter = mappedItems.filter((item) => item.slot === layer);
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
                                        <div className="add-hint"> + add {layer} </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="forecast-panel">
                        <p className="forecast-title">Today’s Forecast</p>
                        <form className="city-form" onSubmit={handleFetchWeather}>
                            <input
                                type="text"
                                placeholder="Enter city (e.g., Seattle)"
                                value={cityInput}
                                onChange={(e) =>setCityInput(e.target.value)}
                                className="city-input"
                            />
                            <button type="submit" className="city-submit"> Find </button>
                        </form>
                        <div className="forecast-box">
                            {weatherLoading && <p>Loading weather…</p>}

                            {!weatherLoading && weatherError && (
                                <p className="forecast-error">{weatherError}</p>
                            )}

                            {!weatherLoading && !weatherError && forecast && (
                                <div className="forecast-content">
                                <h4>{forecast.city} {forecast.country ? `, ${forecast.country}` : ""}</h4>
                                <div className="forecast-main">
                                    {forecast.icon && (
                                        <img src={`https://openweathermap.org/img/wn/${forecast.icon}@2x.png`}
                                        alt={forecast.description} className="forecast-icon"/>)}
                                        <div className="forecast-text">
                                            <p className="forecast-temp">{forecast.temp}°F</p>
                                            <p className="forecast-condition">{forecast.condition}</p>
                                            <p className="forecast-sub">Feels like {forecast.feelsLike}°F</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!weatherLoading&&!weatherError &&!forecast && (
                                <p className="forecast-placeholder"> Search a city to see the forecast. </p>)}
                        </div>
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
                    <button className="add-item"onClick={()=>navigate("/inventory")}> + add item</button>
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
                        <li>
                            <button type="button"className={categoryFilter === 'all' ? 'active' : ''}
                            onClick={() => setCategoryFilter('all')}>All</button>
                        </li>
                        <li>
                            <button type="button" className={categoryFilter === 'tops' ? 'active' : ''}
                                onClick={() => setCategoryFilter('tops')}> Tops </button>
                        </li>
                        <li>
                            <button
                                type="button"
                                className={categoryFilter === 'bottoms' ? 'active' : ''}
                                onClick={() => setCategoryFilter('bottoms')}
                            >
                                Bottoms
                            </button>
                        </li>
                        <li>
                            <button type="button" className={categoryFilter === 'shoes' ? 'active' : ''}
                            onClick={() => setCategoryFilter('shoes')}>Shoes</button>
                        </li>
                        <li>
                            <button type="button" className={categoryFilter === 'accessories' ? 'active' : ''} 
                            onClick={() => setCategoryFilter('accessories')}>Accessories</button>
                        </li>
                        <li>
                            <button type="button" className={categoryFilter === 'outerwear' ? 'active' : ''}
                            onClick={() => setCategoryFilter('outerwear')} >Outerwear </button>
                        </li>
                    </ul>
                </nav>

                <section className="gallery">
                    {loading && (
                        <p className="inventory-loading">Loading your inventory…</p>
                    )}
                    {!loading && mappedItems.length === 0 && (
                        <p className="inventory-empty">
                            No items in your inventory yet. Add some in the Inventory page!
                        </p>
                    )}
                    {!loading && filteredItems.map((item) => (
                        <div
                            className="clothing"
                            key={item.id}
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