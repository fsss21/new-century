import { Routes, Route, useLocation } from 'react-router-dom'

import styles from './App.module.css'

import MainMenu from './pages/MainMenu/MainMenu'
import MainMenuItem from './pages/MainMenu/MainMenuItem/index'
import Header from './components/Header/Header'
import SubMenu from './pages/SubMenu/SubMenu'
import Biography from './pages/Biography/Biography'
import BiographyItem from './pages/Biography/BiographyItem/index'
import Catalog from './pages/Catalog/Catalog'
import CatalogItem from './pages/Catalog/CatalogItem/index'


function App() {

  return (
    <div className={styles.app}>
      <Header />
      <main className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<MainMenu />} />
          <Route path="/main-menu/:id" element={<MainMenuItem />} />
          <Route path="/sub-menu/" element={<SubMenu />} />
          <Route path="/biography" element={<Biography />} />
          <Route path="/biography/:id" element={<BiographyItem />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:id" element={<CatalogItem />} />
        </Routes>
      </main>
    </div >
  )
}

export default App
