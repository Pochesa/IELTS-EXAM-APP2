'use client';

import { useState, useEffect, useRef } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, Pause, Play, Square, RotateCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function SpeakingPage() {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioAvailable, setAudioAvailable] = useState(false);
  const [time, setTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRecording) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
    setAudioAvailable(false);
    setTime(0);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setAudioAvailable(true);
  };
  
  const handleTogglePlayback = () => {
    setIsPlaying(prev => !prev);
  }

  const handleReset = () => {
    setIsRecording(false);
    setIsPlaying(false);
    setAudioAvailable(false);
    setTime(0);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold font-headline">Speaking Module</h1>
        <p className="text-muted-foreground">Practice for the speaking test. Record your response and play it back to review.</p>
      </div>
      <Card className="max-w-xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Part 2: Cue Card</CardTitle>
          <CardDescription>Describe a memorable trip you have taken. You should say: where you went, who you went with, what you did there, and explain why it was so memorable. You have 1 to 2 minutes to talk about this topic.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 pt-6">
            <div className="relative h-32 w-32">
                <div className={`absolute inset-0 flex items-center justify-center rounded-full transition-all duration-300 ${isRecording ? 'bg-red-500/20' : 'bg-muted'}`}>
                    <Mic className={`h-12 w-12 transition-colors duration-300 ${isRecording ? 'text-red-500' : 'text-muted-foreground'}`}/>
                </div>
                {isRecording && <Progress value={(time/120) * 100} className="absolute h-full w-full rounded-full [&>div]:bg-red-500/50 opacity-50" />}
            </div>

            <div className="font-mono text-2xl font-bold">{formatTime(time)}</div>
            
            <div className="flex w-full gap-4">
                {!isRecording && !audioAvailable && (
                    <Button onClick={handleStartRecording} className="w-full">
                        <Mic className="mr-2 h-4 w-4" /> Start Recording
                    </Button>
                )}
                {isRecording && (
                    <Button onClick={handleStopRecording} variant="destructive" className="w-full">
                        <Square className="mr-2 h-4 w-4" /> Stop Recording
                    </Button>
                )}
                {audioAvailable && (
                  <>
                    <Button onClick={handleTogglePlayback} className="w-full">
                        {isPlaying ? <><Pause className="mr-2 h-4 w-4" /> Pause</> : <><Play className="mr-2 h-4 w-4" /> Playback</>}
                    </Button>
                    <Button onClick={handleReset} variant="outline" size="icon">
                        <RotateCw className="h-4 w-4" />
                    </Button>
                  </>
                )}
            </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
