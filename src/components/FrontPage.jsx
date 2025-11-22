import React from "react"

export function FrontPage() {
    return (
        <div>
            <div className="header-stack">
                <img src="/img/main-page-header.avif" alt="Background image of clothes" className="header-img"/>
                <div className="header-text">
                    <h1 className="header">The App to Manage your Wardrobe</h1>
                    <p className="header-paragraph">Keep Track. Build Outfits. Save.</p>
                </div>
            </div>
            <section className="main-section flex-container-main-textbox">
                <div className="flex-column subsection">
                    <h2 className="header">FEATURES</h2>
                    <p className="subsection-paragraph">The app offers key features needed to manage and sort through a wardrobe. As of now, there is an Inventory, Wardrobe Builder, and Account.</p>
                </div>
                <div className="flex-column subsection">
                    <div className="flex-column">
                        <p className="subheading">Inventory</p>
                        <p className="subsection-paragraph">A place to organize, store, and track pieces of clothing!</p>
                    </div>
                    <div className="flex-column">
                        <p className="subheading">Wardrobe Builder</p>
                        <p className="subsection-paragraph">Here, you can build different combinations of clothing with custom tags to signify different occasions. There is an integrated weather forecast that will help you choose your combination!</p>
                    </div>
                    <div className="flex-column">
                        <p className="subheading">Account</p>
                        <p className="subsection-paragraph">Save your clothing inventory and wardrobe combinations by signing up and logging in!</p>
                    </div>
                </div>
            </section>
        </div>
    )
}