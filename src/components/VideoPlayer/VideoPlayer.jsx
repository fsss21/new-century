import { useState, useRef, useCallback } from 'react'
import styles from './VideoPlayer.module.css'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'
import FullscreenIcon from '@mui/icons-material/Fullscreen'

const VideoPlayer = ({ src, title, creator, year }) => {
    const videoRef = useRef(null)
    const wrapRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [showVolume, setShowVolume] = useState(false)

    const togglePlay = useCallback(() => {
        const v = videoRef.current
        if (!v) return
        if (v.paused) { v.play(); setIsPlaying(true) }
        else { v.pause(); setIsPlaying(false) }
    }, [])

    const toggleMute = useCallback(() => {
        const v = videoRef.current
        if (!v) return
        v.muted = !v.muted
        setIsMuted(v.muted)
    }, [])

    const handleVolumeChange = useCallback((e) => {
        const val = parseFloat(e.target.value)
        setVolume(val)
        if (videoRef.current) {
            videoRef.current.volume = val
            setIsMuted(val === 0)
        }
    }, [])

    const handleFullscreen = useCallback(() => {
        const el = wrapRef.current
        if (!el) return

        const doc = document
        const active =
            doc.fullscreenElement ??
            doc.webkitFullscreenElement ??
            doc.mozFullScreenElement ??
            doc.msFullscreenElement

        if (active === el) {
            if (doc.exitFullscreen) doc.exitFullscreen()
            else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen()
            else if (doc.mozCancelFullScreen) doc.mozCancelFullScreen()
            else if (doc.msExitFullscreen) doc.msExitFullscreen()
        } else if (el.requestFullscreen) el.requestFullscreen()
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
        else if (el.mozRequestFullScreen) el.mozRequestFullScreen()
        else if (el.msRequestFullscreen) el.msRequestFullscreen()
    }, [])

    const handleTimeUpdate = useCallback(() => {
        const v = videoRef.current
        if (!v || !v.duration) return
        setProgress((v.currentTime / v.duration) * 100)
    }, [])

    const handleSeek = useCallback((e) => {
        const v = videoRef.current
        if (!v || !v.duration) return
        const rect = e.currentTarget.getBoundingClientRect()
        v.currentTime = ((e.clientX - rect.left) / rect.width) * v.duration
    }, [])

    return (
        <div className={styles.wrap} ref={wrapRef}>
            <video
                ref={videoRef}
                className={styles.video}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
                onClick={togglePlay}
            />

            <div className={styles.seekBar} onClick={handleSeek}>
                <div className={styles.seekFill} style={{ width: `${progress}%` }} />
            </div>

            <div
                className={styles.controls}
                style={{
                    background: `linear-gradient(to right, #8c6c44 ${progress}%, #987a5b ${progress}%)`
                }}
            >
                <div className={styles.controlsInfo}>
                    <span className={styles.controlsTitle}>{title}</span>
                    <span className={styles.controlsCreator}>{creator}, {year}</span>
                </div>

                <button className={styles.ctrlBtn} onClick={togglePlay}>
                    {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}

                </button>
                <div className={styles.controlsBtns}>


                    <div
                        className={styles.volumeWrap}
                        onMouseEnter={() => setShowVolume(true)}
                        onMouseLeave={() => setShowVolume(false)}
                    >
                        <button className={styles.ctrlBtn} onClick={toggleMute}>
                            {isMuted || volume === 0 ? <VolumeOffIcon /> : <VolumeUpIcon />}
                        </button>
                        {showVolume && (
                            <input
                                type="range"
                                className={styles.volumeSlider}
                                min="0" max="1" step="0.05"
                                value={isMuted ? 0 : volume}
                                onChange={handleVolumeChange}
                            />
                        )}
                    </div>

                    <button className={styles.ctrlBtn} onClick={handleFullscreen}>
                        <FullscreenIcon />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VideoPlayer
