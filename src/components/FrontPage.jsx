import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

const tabs = [
  {label: "Inventory", content: "A place to organize, store, and track pieces of clothing!\nHere, you can upload pieces of clothing with a custom image, size, color, etc!"},
  {label: "Wardrobe Builder", content:"The Wardrobe Builder can build different combinations of clothing for different occasions, then save them!\nAn integrated weather app can help you decide what outfit to build and which saved oufit may fit you the bet for the day!"},
  {label: "Account", content: "Save your clothing inventory and wardrobe combinations by signing up and logging in!\nAccounts will need a unique email and passwords that are at least 6 characters to be valid."}
];

export function FrontPage() {
  const [selectedTab, setSelectedTab] = useState(tabs[0]);

  return (
    <div>
        <div className="header-stack">
            <img src="/img/main-page-header.avif" alt="Background image of clothes" className="header-img"/>
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="header-text">
                <h1 className="header">The App to Manage your Wardrobe</h1>
                <p className="header-paragraph">Keep Track. Build Outfits. Save.</p>
            </motion.div>
        </div>
        <motion.section initial={{ scale: 0 }} animate={{ scale: 1 }} className="main-section flex-container-main-textbox">
            <div className="flex-column subsection">
                <h2 className="header">FEATURES</h2>
                <p className="subsection-paragraph">The app offers key features needed to manage and sort through a wardrobe. As of now, there is an Inventory, Wardrobe Builder, and Account.</p>
            </div>
            <div className="info-carousel subsection">
                <div className="tabs">
                    <ul className="tab-list subheading">
                        {tabs.map((tab) => (<motion.li key={tab.label} className='tab-item' initial={false} animate={{ backgroundColor: tab === selectedTab ? "#381818" : "#252525" }} onClick={() => setSelectedTab(tab)}> {tab.label} {tab === selectedTab && (<motion.div layoutId="underline" className="underline"/>)}</motion.li>))}
                    </ul>
                </div>

                <div className="tab-content subsection-paragraph">
                    <AnimatePresence mode="wait">
                        <motion.div key={selectedTab.label} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }} className="content-card subsection-paragraph">{selectedTab.content.split('\n').map((line, i) => (<p key={i}>{line}</p>))}</motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </motion.section>
    </div>
  );
}
