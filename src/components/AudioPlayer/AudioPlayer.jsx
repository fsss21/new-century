import { useState, useRef, useCallback } from 'react'
import styles from './AudioPlayer.module.css'

import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import VolumeUpIcon from '@mui/icons-material/VolumeUp'
import VolumeOffIcon from '@mui/icons-material/VolumeOff'

const AudioPlayer = ({ src, title, creator, year }) => {
    const audioRef = useRef(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [progress, setProgress] = useState(0)
    const [volume, setVolume] = useState(1)
    const [isMuted, setIsMuted] = useState(false)
    const [showVolume, setShowVolume] = useState(false)

    const togglePlay = useCallback(() => {
        const a = audioRef.current
        if (!a) return
        if (a.paused) { a.play(); setIsPlaying(true) }
        else { a.pause(); setIsPlaying(false) }
    }, [])

    const toggleMute = useCallback(() => {
        const a = audioRef.current
        if (!a) return
        a.muted = !a.muted
        setIsMuted(a.muted)
    }, [])

    const handleVolumeChange = useCallback((e) => {
        const val = parseFloat(e.target.value)
        setVolume(val)
        if (audioRef.current) {
            audioRef.current.volume = val
            setIsMuted(val === 0)
        }
    }, [])

    const handleTimeUpdate = useCallback(() => {
        const a = audioRef.current
        if (!a || !a.duration) return
        setProgress((a.currentTime / a.duration) * 100)
    }, [])

    const handleSeek = useCallback((e) => {
        const a = audioRef.current
        if (!a || !a.duration) return
        const rect = e.currentTarget.getBoundingClientRect()
        a.currentTime = ((e.clientX - rect.left) / rect.width) * a.duration
    }, [])

    return (
        <div className={styles.wrap}>
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onEnded={() => setIsPlaying(false)}
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
                </div>
            </div>
        </div>
    )
}

export default AudioPlayer
