/**
 * Browser-Native Voice Navigation Guidance Engine
 * Uses Web Speech Synthesis API for turn-by-turn audio cues
 */

class VoiceGuidanceEngine {
  private isMuted: boolean = false;
  private voice: SpeechSynthesisVoice | null = null;
  private isSupported: boolean = false;
  private lastSpokenPhrase: string = '';

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.isSupported = true;
      this.initVoice();
      if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = () => this.initVoice();
      }
    }
  }

  private initVoice() {
    if (!this.isSupported) return;
    const voices = window.speechSynthesis.getVoices();
    // Prefer clear natural English voice
    this.voice =
      voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Samantha'))) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0] ||
      null;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && this.isSupported) {
      window.speechSynthesis.cancel();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public speak(phrase: string, priority: boolean = false) {
    if (!this.isSupported || this.isMuted || !phrase) return;

    // Avoid repetitive back-to-back spamming of identical phrase
    if (this.lastSpokenPhrase === phrase && !priority) return;
    this.lastSpokenPhrase = phrase;

    try {
      window.speechSynthesis.cancel(); // Cancel any lingering utterances for crisp immediate delivery
      const utterance = new SpeechSynthesisUtterance(phrase);
      if (this.voice) {
        utterance.voice = this.voice;
      }
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Voice guidance speech failed:', err);
    }
  }

  public announceNavigationStart(destinationName: string, etaMins: number, distanceKm: string) {
    this.speak(
      `Starting GPS navigation to ${destinationName}. Distance is ${distanceKm} kilometers, estimated arrival in ${etaMins} minutes.`,
      true
    );
  }

  public announceManeuver(direction: 'left' | 'right' | 'straight' | 'arrived', distanceMeters: number, streetName: string) {
    if (direction === 'arrived') {
      this.speak(`You have arrived at your destination!`, true);
      return;
    }
    this.speak(`In ${distanceMeters} meters, turn ${direction} onto ${streetName}.`);
  }
}

export const voiceGuidance = new VoiceGuidanceEngine();
