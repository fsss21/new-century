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
    const [resolutionMode, setResolutionMode] = useState('fullHd')
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
            // Фон оставляем на прежнем пороге, чтобы не менять текущую верстку/картинку.
            const is4kBg = window.innerWidth >= 2560 || window.innerHeight >= 1440
            // Режимы стилей: fullHd -> 2k -> 4k
            const w = window.innerWidth
            const h = window.innerHeight
            const nextMode =
                w >= 3840 || h >= 2160
                    ? '4k'
                    : (w >= 2560 || h >= 1440 ? '2k' : 'fullHd')
            setResolutionMode(nextMode)
            setBackgroundSrc(is4kBg ? mainMenuImg4k : mainMenuImg)
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
                        style={
                            itemStyles?.[sculptor.id]?.[resolutionMode]
                            ?? itemStyles?.[sculptor.id]?.fullHd
                            ?? itemStyles?.[sculptor.id]
                        }
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