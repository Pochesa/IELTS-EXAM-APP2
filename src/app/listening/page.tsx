'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const questions = [
  { id: 'q1', question: 'What is the main topic of the conversation?', options: ['University life', 'Booking a hotel', 'Planning a trip', 'A new job'], answer: 'Planning a trip' },
  { id: 'q2', question: 'Where do they decide to go?', options: ['The mountains', 'The beach', 'The city', 'A national park'], answer: 'The mountains' },
  { id: 'q3', question: 'When are they planning to travel?', options: ['Next week', 'Next month', 'In the summer', 'In two weeks'], answer: 'Next month' },
];

export default function ListeningPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleValueChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    setSubmitted(false);
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const getScore = () => {
    return questions.reduce((score, q) => {
      return score + (answers[q.id] === q.answer ? 1 : 0);
    }, 0);
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold font-headline">Listening Module</h1>
        <p className="text-muted-foreground">
          Listen to the audio and answer the questions below. Click "Check Answers" to see your score.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Audio Section 1</CardTitle>
            <CardDescription>Listen to the conversation carefully.</CardDescription>
          </CardHeader>
          <CardContent>
            <audio controls className="w-full">
              <source src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Questions</CardTitle>
            <CardDescription>Select the best answer for each question.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((q) => (
              <div key={q.id}>
                <Label className="font-semibold">{q.question}</Label>
                <RadioGroup
                  value={answers[q.id]}
                  onValueChange={(value) => handleValueChange(q.id, value)}
                  className="mt-2 space-y-2"
                >
                  {q.options.map((option) => (
                    <div
                      key={option}
                      className={`flex items-center space-x-2 p-2 rounded-md transition-colors ${
                        submitted
                          ? option === q.answer
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : answers[q.id] === option
                            ? 'bg-red-100 dark:bg-red-900/30'
                            : ''
                          : ''
                      }`}
                    >
                      <RadioGroupItem value={option} id={`${q.id}-${option}`} />
                      <Label htmlFor={`${q.id}-${option}`} className="flex-1 cursor-pointer">{option}</Label>
                      {submitted && option === q.answer && <Check className="h-4 w-4 text-green-600" />}
                      {submitted && answers[q.id] === option && option !== q.answer && <X className="h-4 w-4 text-red-600" />}
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
            <Button onClick={handleSubmit} className="w-full">Check Answers</Button>
            {submitted && (
              <Alert>
                <AlertTitle>Results</AlertTitle>
                <AlertDescription>You scored {getScore()} out of {questions.length}.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
