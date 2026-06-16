import { ipcMain, BrowserWindow } from 'electron'
import { execSync } from 'child_process'

export class VoiceService {
  private mainWindow: BrowserWindow
  private wakeWord: string = 'hey kanha'
  private isListening: boolean = false
  private audioBuffer: Float32Array | null = null

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
    this.setupIPC()
  }

  private setupIPC() {
    // Wake word detection
    ipcMain.handle('wake-word-detected', async (event, wakeWord: string) => {
      this.wakeWord = wakeWord.toLowerCase()
      return { success: true }
    })

    // Voice state change
    ipcMain.handle('voice-state-change', async (event, state: string) => {
      this.mainWindow.webContents.send('voice-state-changed', { state })
      return { success: true }
    })
  }

  /**
   * Start listening for audio input
   */
  async startListening(): Promise<void> {
    this.isListening = true
    this.mainWindow.webContents.send('voice-state-changed', { state: 'listening' })
  }

  /**
   * Stop listening
   */
  async stopListening(): Promise<void> {
    this.isListening = false
    this.mainWindow.webContents.send('voice-state-changed', { state: 'sleeping' })
  }

  /**
   * Process audio and send to AI
   */
  async processAudio(audioData: ArrayBuffer): Promise<string> {
    try {
      this.mainWindow.webContents.send('voice-state-changed', { state: 'thinking' })

      // Downsample to 16kHz and encode
      const pcm16 = this.downsampleAudio(audioData)
      const base64Audio = Buffer.from(pcm16).toString('base64')

      // Send to Gemini Live (mock response for now)
      const response = await this.callGeminiAPI(base64Audio)

      this.mainWindow.webContents.send('voice-state-changed', { state: 'speaking' })

      return response
    } catch (error) {
      console.error('Audio processing error:', error)
      this.mainWindow.webContents.send('voice-state-changed', { state: 'sleeping' })
      throw error
    }
  }

  /**
   * Downsample audio to 16kHz PCM
   */
  private downsampleAudio(audioData: ArrayBuffer): Uint8Array {
    const audioContext = new (window as any).AudioContext()
    const sampleRate = audioContext.sampleRate
    const targetRate = 16000
    const ratio = sampleRate / targetRate

    const float32Array = new Float32Array(audioData)
    const downsampledLength = Math.floor(float32Array.length / ratio)
    const downsampled = new Float32Array(downsampledLength)

    let pointerIn = 0
    let pointerOut = 0

    while (pointerOut < downsampledLength) {
      const superSampleIndex = Math.floor(pointerIn)
      const ratio = pointerIn - superSampleIndex
      downsampled[pointerOut] =
        float32Array[superSampleIndex] * (1 - ratio) + float32Array[superSampleIndex + 1] * ratio
      pointerIn += ratio
      pointerOut++
    }

    // Convert float32 to int16
    const int16Array = new Int16Array(downsampled.length)
    for (let i = 0; i < downsampled.length; i++) {
      const s = Math.max(-1, Math.min(1, downsampled[i]))
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff
    }

    return new Uint8Array(int16Array.buffer)
  }

  /**
   * Call Gemini Live API (mock for now)
   */
  private async callGeminiAPI(base64Audio: string): Promise<string> {
    // TODO: Integrate real Gemini Live WebSocket
    // For now, return mock response
    return 'I received your audio message and processed it successfully.'
  }

  /**
   * Greet user based on time of day
   */
  getTimeBasedGreeting(): string {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning. I am KANHA, your neural operating system.'
    if (hour < 17) return 'Good afternoon. KANHA neural core online.'
    if (hour < 21) return 'Good evening. KANHA awakening.'
    return 'Good night. KANHA night mode activated.'
  }
}

export default VoiceService
