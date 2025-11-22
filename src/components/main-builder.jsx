import React, {useState} from 'react';
import { clothes } from '../data/clothes.js'

export function OutfitBuilderPage(){

    const toWear = ['hat', 'shirt', 'pants', 'shoes'];

    const outfitBuilderPage = () => {
        const [items] = useState = {clothes};
        const [slots, setSlots] = useState({
        hat: null, shirt: null, pants: null, shoes: null})
    };

    const handleClear = () => {
        setSlots({hat: null, top: null, bottoms: null, shoes: null});
    };

    const assignRandomItem = (layer) => {
        const itemFilter = items.filter((item) => item.slot === layer)
        if (itemFilter.length === 0) return null;
        const index = Math.floor(Math.random() * candidates.length);
        return itemFilter[index];
    };

    const generateRandomOutfit = () => {
        setSlots({hat: assignRandomItem('hat'), top: assignRandomItem('top'),
            bottoms: assignRandomItem('bottoms'), shoes: assignRandomItem('shoes')
        });
    };

    return (
    <section className="builder-col" aria-label="Outfit builder">
        <div className="builder-grid">
        <div className="layer-stack" aria-label="Outfit layers">
            {LAYERS.map((layer) => (
            <div className="layer-row" key={layer}>
                <div className="control-col">
                <button className="icon-btn">🔁</button>
                <button
                    className="icon-btn delete"
                    onClick={() => setSlots((prev) => ({ ...prev, [layer]: null }))}
                ></button>
                </div>
                <div className="slot">
                {slots[layer] ? (
                    <div className="slot-filled">
                    <p className="slot-name">{slots[layer].name}</p>
                    <p className="slot-meta">{slots[layer].category}</p>
                    </div>
                ) : (
                    <div className="add-hint">+ add {layer}</div>
                )}
                </div>
            </div>
            ))}
        </div>
        <div className="forecast-panel">
            <p className="forecast-title">Today’s Forecast</p>
            <div className="forecast-box">Forecast widget placeholder</div>
            <button className="gen-btn" onClick={handleGenerateOutfit}>
            <span className="gen-icon">🌤✨</span> Generate Outfit
            </button>
        </div>
        </div>

        <div className="actions">
        <button className="btn clear" onClick={handleClear}>
            Clear
        </button>
        <button className="btn save">Save Outfit (later)</button>
        </div>
    </section>
    );
}