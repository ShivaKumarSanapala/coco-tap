import { useState, useCallback, useEffect } from 'react'
import Landing from './components/Landing'
import Recording from './components/Recording'
import Playback from './components/Playback'
import Labeling from './components/Labeling'
import Success from './components/Success'
import { uploadSample, getDeviceMetadata } from './lib/upload'
import { RECORD_DURATION_MS } from './lib/audio'

const STEPS = { landing: 'landing', recording: 'recording', playback: 'playback', labeling: 'labeling', success: 'success' }

export default function App() {
  const [step, setStep] = useState(STEPS.landing)
  const [audio, setAudio] = useState(null) // { blob, mimeType }
  const [uploadProgress, setUploadProgress] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  // Prevent accidental refresh/close during recording (optional but helpful)
  useEffect(() => {
    const prevent = (e) => {
      if (step === STEPS.recording) e.preventDefault()
    }
    window.addEventListener('beforeunload', prevent)
    return () => window.removeEventListener('beforeunload', prevent)
  }, [step])

  const handleStartRecording = useCallback(() => setStep(STEPS.recording), [])
  const handleBackToLanding = useCallback(() => setStep(STEPS.landing), [])
  const handleBackToRecording = useCallback(() => {
    setAudio(null)
    setStep(STEPS.recording)
  }, [])
  const handleRecordingComplete = useCallback(({ blob, mimeType }) => {
    setAudio({ blob, mimeType })
    setStep(STEPS.playback)
  }, [])
  const handlePlaybackContinue = useCallback(() => setStep(STEPS.labeling), [])
  const handlePlaybackReRecord = useCallback(() => {
    setAudio(null)
    setStep(STEPS.recording)
  }, [])

  const handleSubmit = useCallback(async (form) => {
    if (!audio) return
    setSubmitError(null)
    setUploadProgress(0)
    setSubmitting(true)
    const metadata = {
      ...getDeviceMetadata(),
      recordingDurationSec: RECORD_DURATION_MS / 1000,
    }
    const result = await uploadSample(
      audio,
      { label: form.label, environment: form.environment, numTaps: form.numTaps },
      metadata,
      (p) => setUploadProgress(p)
    )
    setSubmitting(false)
    if (result.success) {
      setAudio(null)
      setStep(STEPS.success)
    } else {
      setSubmitError(result.error)
    }
  }, [audio])

  const handleRecordAnother = useCallback(() => {
    setSubmitError(null)
    setUploadProgress(0)
    setStep(STEPS.landing)
  }, [])

  if (step === STEPS.landing) {
    return <Landing onStart={handleStartRecording} />
  }
  if (step === STEPS.recording) {
    return (
      <Recording
        onComplete={handleRecordingComplete}
        onBack={handleBackToLanding}
      />
    )
  }
  if (step === STEPS.playback) {
    return (
      <Playback
        blob={audio?.blob}
        mimeType={audio?.mimeType}
        onContinue={handlePlaybackContinue}
        onReRecord={handlePlaybackReRecord}
      />
    )
  }
  if (step === STEPS.labeling) {
    return (
      <Labeling
        onSubmit={handleSubmit}
        onBack={handlePlaybackReRecord}
        isSubmitting={submitting}
        uploadProgress={uploadProgress}
        submitError={submitError}
      />
    )
  }
  if (step === STEPS.success) {
    return <Success onRecordAnother={handleRecordAnother} />
  }

  return null
}
