'use client';

import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Clock, Headphones, Mic, Pencil } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const testSections = [
  { name: 'Listening', duration: 30, icon: Headphones },
  { name: 'Reading', duration: 60, icon: BookOpen },
  { name: 'Writing', duration: 60, icon: Pencil },
  { name: 'Speaking', duration: 15, icon: Mic },
];

const fullTestDuration = testSections.reduce((sum, section) => sum + section.duration, 0);

function Timer({ durationInMinutes, onComplete }: { durationInMinutes: number; onComplete: () => void }) {
  const [timeLeft, setTimeLeft] = useState(durationInMinutes * 60);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-5xl font-bold font-mono text-primary">
      {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
    </div>
  );
}

export default function MockTestsPage() {
  const [activeTest, setActiveTest] = useState<{ name: string; duration: number } | null>(null);
  const [testFinished, setTestFinished] = useState(false);

  const startTest = (name: string, duration: number) => {
    setActiveTest({ name, duration });
    setTestFinished(false);
  };

  const handleTestComplete = () => {
    setTestFinished(true);
    // Keep activeTest set to show which test was completed
  };

  const resetTest = () => {
    setActiveTest(null);
    setTestFinished(false);
  };
  
  if (activeTest) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center text-center flex-1 h-full">
            <h1 className="text-3xl font-bold font-headline mb-2">{activeTest.name} Test in Progress</h1>
            <p className="text-muted-foreground mb-8">Focus and do your best. Good luck!</p>

            <Card className="w-full max-w-md p-8">
                <CardContent className="flex flex-col items-center gap-4">
                    {testFinished ? (
                         <Alert>
                            <Clock className="h-4 w-4" />
                            <AlertTitle>Time&apos;s up!</AlertTitle>
                            <AlertDescription>
                                Your {activeTest.name} mock test has finished.
                            </AlertDescription>
                        </Alert>
                    ) : (
                        <Timer durationInMinutes={activeTest.duration} onComplete={handleTestComplete} />
                    )}
                    <Button onClick={resetTest} variant="outline" className="mt-4">
                        {testFinished ? 'Back to Tests' : 'End Test Early'}
                    </Button>
                </CardContent>
            </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold font-headline">Mock Tests</h1>
        <p className="text-muted-foreground">Simulate the real IELTS experience with our full and section-wise mock tests.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Full Mock Test</CardTitle>
          <CardDescription>A comprehensive test covering all four sections.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-muted-foreground">
              <Clock className="inline-block mr-2 h-4 w-4" />
              Duration: {fullTestDuration} minutes
            </div>
            <Button onClick={() => startTest('Full Mock', fullTestDuration)}>Start Full Test</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {testSections.map((section) => (
          <Card key={section.name}>
            <CardHeader>
              <div className="flex items-center gap-4">
                 <div className="bg-primary/10 p-2 rounded-md">
                     <section.icon className="h-6 w-6 text-primary" />
                  </div>
                <CardTitle>{section.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground mb-4">
                <Clock className="inline-block mr-2 h-4 w-4" />
                Duration: {section.duration} minutes
              </div>
              <Button onClick={() => startTest(section.name, section.duration)} className="w-full">
                Start {section.name} Test
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
