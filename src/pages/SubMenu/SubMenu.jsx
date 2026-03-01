import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import PhotoGallery from '../../components/PhotoGallery/PhotoGallery'
import Header from '../../components/Header/Header'
import styles from './SubMenu.module.css'
import subMenuImg from '../../assets/sub_menu_img.png'
import subMenuImg4k from '../../assets/sub_menu_img-4k.png'


import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import FullscreenIcon from '@mui/icons-material/Fullscreen'

function SubMenu() {
  const navigate = useNavigate()
  const [selectedPoint, setSelectedPoint] = useState(0)
  const [progressPoints, setProgressPoints] = useState([])
  const [imageSrc, setImageSrc] = useState(subMenuImg)
  const [currentTextIndex, setCurrentTextIndex] = useState(0)

  useEffect(() => {
    // Определяем, нужно ли использовать 4K изображение
    // Для экранов с шириной >= 2560px или высотой >= 1440px используем 4K версию
    const is4K = window.innerWidth >= 2560 || window.innerHeight >= 1440
    setImageSrc(is4K ? subMenuImg4k : subMenuImg)

    fetch('/data/SubMenu.json')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load')
        return res.json()
      })
      .then(data => {
        setProgressPoints(data)
      })
      .catch(err => console.error('Error loading progress points:', err))
  }, [])





  const handleNextText = () => {
    const currentPoint = progressPoints[selectedPoint]
    if (currentPoint && currentPoint.texts && currentPoint.texts.length > 0) {
      if (currentTextIndex < currentPoint.texts.length - 1) {
        setCurrentTextIndex((prev) => prev + 1)
      }
    }
  }

  const handlePrevText = () => {
    if (currentTextIndex > 0) {
      setCurrentTextIndex((prev) => prev - 1)
    }
  }

  const handleBack = () => {
    navigate('/')
  }

  const handleMainMenu = () => {
    navigate('/catalog')
  }



  const currentPoint = progressPoints[selectedPoint]

  // Получаем фото для текущей точки
  const currentPhotos = currentPoint?.photos || []

  // Проверяем, есть ли фото для текущей точки
  const hasPhotos = currentPhotos.length > 0

  // Определяем, какое фоновое изображение использовать
  const backgroundImageSrc = imageSrc

  return (
    <div className={styles.subMenu}>
      <div
        className={styles.subMenuBackground}
        style={{ backgroundImage: `url(${backgroundImageSrc})` }}
      />
      <Header />
      <div className={styles.subMenuContent}>
        {/* Основной контент: текст слева, галерея справа */}
        <div className={`${styles.subMenuMainContent} ${!hasPhotos ? styles.subMenuMainContentCentered : ''}`}>
          <div className={styles.subMenuMainContentMenu}>
            <div className={`${styles.subMenuTextBlock} ${!hasPhotos ? styles.subMenuTextBlockCentered : ''}`}>
              {currentPoint && (
                <>
                  <h2
                    className={styles.subMenuTextPoint}
                    dangerouslySetInnerHTML={{ __html: currentPoint.label }}
                  />
                  {currentPoint.texts && currentPoint.texts.length > 0 && (
                    <p
                      className={styles.subMenuTextDescription}
                      dangerouslySetInnerHTML={{ __html: currentPoint.texts[currentTextIndex] || '' }}
                    />
                  )}
                  <div className={styles.subMenuBottomNavigation}>
                    <>
                      <div className={styles.controlsNavMenu}>
                        <button className={`${styles.subMenuBtn} ${styles.subMenuBtnBack}`} onClick={handleBack}>
                          Назад
                        </button>
                        <button className={`${styles.subMenuBtn} ${styles.subMenuBtnMainMenu}`} onClick={handleMainMenu}>
                          Перейти в каталог
                        </button>
                      </div>
                      {currentPoint.texts && currentPoint.texts.length > 1 && (
                        <div className={styles.subMenuTextNavigation}>
                          <button
                            className={styles.subMenuTextNavBtn}
                            onClick={handlePrevText}
                            disabled={currentTextIndex === 0}
                            aria-label="Предыдущий текст"
                          >
                            <ArrowBackIosNewIcon />
                          </button>
                          <span className={styles.counter}>
                            {currentTextIndex + 1} / {currentPoint.texts.length}
                          </span>
                          <button
                            className={styles.subMenuTextNavBtn}
                            onClick={handleNextText}
                            disabled={currentTextIndex === currentPoint.texts.length - 1}
                            aria-label="Следующий текст"
                          >
                            <ArrowForwardIosIcon />
                          </button>
                        </div>
                      )}
                    </>

                  </div>
                </>
              )}
            </div>

          </div>


        </div>
      </div>
    </div>
  )
}

export default SubMenu
