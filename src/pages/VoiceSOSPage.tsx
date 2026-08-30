import { useState, useRef, useEffect } from 'react';
import { Mic, Square, MicOff, AlertCircle, Droplet, MapPin, Siren, CheckCircle, Volume2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { parseVoiceCommand, classNames } from '@/utils/helpers';
import { bloodGroups } from '@/data/mockData';
import type { BloodGroup, UrgencyLevel } from '@/types';

// Minimal type declarations for the Web Speech API (not in standard TS lib)
interface SpeechRecognitionResult {
  0: { transcript: string };
  isFinal: boolean;
}
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: { length: number; [index: number]: SpeechRecognitionResult };
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}
type SpeechRecognitionConstructor = new () => SpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  }
}

const exampleCommands = [
  '"Emergency, I need O positive blood near Chennai."',
  '"Critical! Need AB negative blood at Apollo Hospital, Greams Road."',
  '"Urgent requirement for B positive blood in Velachery."',
];

export default function VoiceSOSPage() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState('');
  const [parsed, setParsed] = useState<{ bloodGroup?: BloodGroup; location?: string; urgency?: UrgencyLevel }>({});
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SR = window.SpeechRecognition ?? window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalText = '';
      let interimText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalText += result[0].transcript;
        } else {
          interimText += result[0].transcript;
        }
      }
      if (finalText) {
        setTranscript((prev) => (prev + finalText).trim());
        setInterimTranscript('');
      } else {
        setInterimTranscript(interimText);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'no-speech') return;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('Microphone access denied. Please allow microphone permissions.');
      } else {
        setError(`Recognition error: ${event.error}`);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  useEffect(() => {
    if (transcript) {
      setParsed(parseVoiceCommand(transcript));
    }
  }, [transcript]);

  const handleStart = () => {
    setError('');
    setTranscript('');
    setParsed({});
    try {
      recognitionRef.current?.start();
      setIsListening(true);
    } catch {
      setError('Failed to start microphone. Please try again.');
    }
  };

  const handleStop = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const handleClear = () => {
    setTranscript('');
    setInterimTranscript('');
    setParsed({});
    setError('');
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-gray-900">Voice SOS</h1>
          <p className="mt-1 text-sm text-gray-600">
            Speak your emergency. Our AI extracts blood group, location, and urgency automatically.
          </p>
        </div>

        {!supported && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-warning-200 bg-warning-50 p-4">
            <AlertCircle className="h-5 w-5 text-warning-600" />
            <p className="text-sm text-warning-800">
              Your browser doesn't support voice recognition. Try Chrome or Edge for the best experience.
            </p>
          </div>
        )}

        {/* Microphone Button */}
        <div className="card flex flex-col items-center p-8">
          <button
            onClick={isListening ? handleStop : handleStart}
            disabled={!supported}
            className={classNames(
              'relative flex h-32 w-32 items-center justify-center rounded-full transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-50',
              isListening
                ? 'bg-accent-600 shadow-emergency'
                : 'bg-primary-600 shadow-lg hover:bg-primary-700 hover:shadow-xl'
            )}
          >
            {isListening && (
              <>
                <span className="absolute inset-0 animate-ping rounded-full bg-accent-400 opacity-30" />
                <span className="absolute inset-0 animate-pulse-slow rounded-full bg-accent-500/20" />
              </>
            )}
            {isListening ? (
              <Mic className="relative h-12 w-12 text-white" />
            ) : (
              <Mic className="relative h-12 w-12 text-white" />
            )}
          </button>

          <p className="mt-4 text-sm font-medium text-gray-700">
            {isListening ? 'Listening... Tap to stop' : 'Tap to start speaking'}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {isListening ? 'Speak clearly into your microphone' : 'Make sure your microphone is enabled'}
          </p>

          {isListening && (
            <div className="mt-4 flex items-center gap-2">
              <span className="flex h-2 w-2 animate-bounce rounded-full bg-accent-500" style={{ animationDelay: '0ms' }} />
              <span className="flex h-2 w-2 animate-bounce rounded-full bg-accent-500" style={{ animationDelay: '150ms' }} />
              <span className="flex h-2 w-2 animate-bounce rounded-full bg-accent-500" style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>

        {/* Transcript */}
        {(transcript || interimTranscript) && (
          <div className="card mt-6 p-6">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-primary-600" />
                <h2 className="text-sm font-semibold text-gray-900">Transcript</h2>
              </div>
              <button onClick={handleClear} className="text-xs font-medium text-gray-500 hover:text-primary-600">
                Clear
              </button>
            </div>
            <p className="rounded-lg bg-gray-50 p-4 text-sm text-gray-700">
              {transcript}
              <span className="text-gray-400">{interimTranscript}</span>
              {isListening && <span className="ml-1 inline-block h-4 w-0.5 animate-pulse bg-primary-500" />}
            </p>
          </div>
        )}

        {/* Parsed Results */}
        {transcript && (
          <div className="card mt-6 p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100">
                <CheckCircle className="h-4 w-4 text-primary-600" />
              </div>
              <h2 className="text-sm font-semibold text-gray-900">AI Parsed Information</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className={classNames(
                'rounded-lg border-2 p-4',
                parsed.bloodGroup ? 'border-primary-200 bg-primary-50' : 'border-gray-200 bg-gray-50'
              )}>
                <div className="flex items-center gap-1.5">
                  <Droplet className="h-4 w-4 text-primary-600" fill="currentColor" />
                  <span className="text-xs font-medium text-gray-600">Blood Group</span>
                </div>
                <p className="mt-2 text-lg font-bold text-gray-900">
                  {parsed.bloodGroup ?? 'Not detected'}
                </p>
              </div>

              <div className={classNames(
                'rounded-lg border-2 p-4',
                parsed.urgency ? 'border-accent-200 bg-accent-50' : 'border-gray-200 bg-gray-50'
              )}>
                <div className="flex items-center gap-1.5">
                  <Siren className="h-4 w-4 text-accent-600" />
                  <span className="text-xs font-medium text-gray-600">Urgency</span>
                </div>
                <p className="mt-2 text-lg font-bold capitalize text-gray-900">
                  {parsed.urgency ?? 'Not detected'}
                </p>
              </div>

              <div className={classNames(
                'rounded-lg border-2 p-4',
                parsed.location ? 'border-success-200 bg-success-50' : 'border-gray-200 bg-gray-50'
              )}>
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-success-600" />
                  <span className="text-xs font-medium text-gray-600">Location</span>
                </div>
                <p className="mt-2 text-lg font-bold capitalize text-gray-900">
                  {parsed.location ?? 'Not detected'}
                </p>
              </div>
            </div>

            {/* Auto-fill preview */}
            {parsed.bloodGroup && (
              <div className="mt-6 border-t border-gray-100 pt-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Pre-filled SOS Form Preview</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-400">Blood Group Required</label>
                    <select value={parsed.bloodGroup} disabled className="input-field text-sm">
                      {bloodGroups.map((g) => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  {parsed.location && (
                    <div>
                      <label className="text-xs text-gray-400">Location</label>
                      <input type="text" value={parsed.location} disabled className="input-field text-sm capitalize" />
                    </div>
                  )}
                  {parsed.urgency && (
                    <div>
                      <label className="text-xs text-gray-400">Urgency Level</label>
                      <input type="text" value={parsed.urgency} disabled className="input-field text-sm capitalize" />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 flex items-center gap-3 rounded-xl border border-accent-200 bg-accent-50 p-4">
            <AlertCircle className="h-5 w-5 text-accent-600" />
            <p className="text-sm text-accent-800">{error}</p>
          </div>
        )}

        {/* Example Commands */}
        <div className="mt-8">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">Try saying</h3>
          <div className="space-y-2">
            {exampleCommands.map((cmd) => (
              <div key={cmd} className="card flex items-center gap-3 p-3">
                <MicOff className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-600">{cmd}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
