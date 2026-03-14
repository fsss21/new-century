import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'

import styles from './MainMenu.module.css'
import mainMenuImg from '../../assets/main_menu_img.png'
import mainMenuImg4k from '../../assets/main_menu_img-4k.png'
import MainMenuItem from './MainMenuItem/Index'

import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';

const MainMenu = () => {
    const [sculptors, setSculptors] = useState([])
    const [itemStyles, setItemStyles] = useState({})
    const [backgroundSrc, setBackgroundSrc] = useState(mainMenuImg)
    const [selectedItem, setSelectedItem] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        fetch('/data/MainMenu.json')
            .then((res) => (res.ok ? res.json() : null))
            .then((json) => setSculptors(json?.sculptors ?? []))
            .catch(() => setSculptors([]))

        fetch('/data/MainMenuStyles.json')
            .then((res) => (res.ok ? res.json() : null))
            .then((json) => setItemStyles(json?.sculptorsStyles ?? {}))
            .catch(() => setItemStyles({}))
    }, [])

    useEffect(() => {
        const updateBackground = () => {
            const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
            setBackgroundSrc(is4K ? mainMenuImg4k : mainMenuImg)
        }
        updateBackground()
        window.addEventListener('resize', updateBackground)
        return () => window.removeEventListener('resize', updateBackground)
    }, [])

    const handleClickPetersburg = () => {
        navigate('/sub-menu')
    }
    const handleClickBiography = () => {
        navigate('/biography')
    }
    const handleClickCatalog = () => {
        navigate('/catalog')
    }

    return (
        <div className={styles.mainMenu}>
            <div className={styles.mainMenuFrame}>
                <div
                    className={styles.mainMenuBackground}
                    style={{ backgroundImage: `url(${backgroundSrc})` }}
                />
                {sculptors.map((sculptor, idx) => (
                    <div
                        key={`${sculptor.id}-${idx}`}
                        className={styles.sculptorItem}
                        style={itemStyles[sculptor.id]}
                        onClick={() => setSelectedItem(sculptor)}
                    />
                ))}
            </div>
            <div className={styles.buttons}>
                <div className={styles.navigationBtns}>
                    <button className={styles.navigateBtn} onClick={handleClickPetersburg}>Развитие петербургской <br /> скульптуры XX-XXI веков</button>
                    <button className={styles.navigateBtn} onClick={handleClickBiography}>Биографические справки <br /> о современных скульпторах</button>
                    <button className={styles.navigateBtn} onClick={handleClickCatalog}>Каталог <br /> скульптуры этого зала</button>
                </div>
                <div className={styles.menuBtns}>
                    <button className={styles.menuBtn}><MenuIcon fontSize='large' /></button>
                    <button className={styles.searchBtn}><SearchIcon fontSize='large' /></button>
                </div>
            </div>

            {selectedItem && (
                <MainMenuItem
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                />
            )}
        </div>
    )
}

export default MainMenu