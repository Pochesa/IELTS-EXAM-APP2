'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Check, X } from 'lucide-react';

const questions = [
  { id: 'q1', question: 'What is the primary function of a city as described in the text?', options: ['Economic hub', 'Residential area', 'Cultural center', 'Administrative center'], answer: 'Economic hub' },
  { id: 'q2', question: 'According to the passage, what is a major challenge for growing cities?', options: ['Lack of entertainment', 'Housing shortages', 'Transportation infrastructure', 'Political instability'], answer: 'Transportation infrastructure' },
  { id: 'q3', question: 'The passage suggests that future cities will likely be more...', options: ['Sprawling and large', 'Technologically integrated', 'Focused on industry', 'Culturally isolated'], answer: 'Technologically integrated' },
];

export default function ReadingPage() {
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
        <h1 className="text-3xl font-bold font-headline">Reading Module</h1>
        <p className="text-muted-foreground">Read the passage and answer the questions. Click "Check Answers" to see your score.</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>The Urban Phenomenon</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full pr-4">
              <p className="text-justify leading-relaxed">
                The city has been a cornerstone of human civilization for millennia. From the ancient metropolises of Mesopotamia to the sprawling urban centers of today, cities serve as engines of innovation, culture, and commerce. They are the physical embodiment of our collective aspirations, concentrating human talent and capital in ways that foster unprecedented growth. A city’s primary function has always been economic. It provides a marketplace for goods, services, and ideas, creating a virtuous cycle of production and consumption that drives regional and even global economies. The density of population in urban areas facilitates specialization and division of labor, leading to increased efficiency and productivity.
                <br /><br />
                However, this rapid urbanization is not without its challenges. As cities grow, they place immense strain on resources and infrastructure. Housing shortages, traffic congestion, and pollution are common ailments of the modern city. The most significant challenge for a growing city is arguably its transportation infrastructure. An efficient transport network is the circulatory system of a metropolis, essential for moving people and goods. Without it, a city chokes on its own success, leading to gridlock that stifles economic activity and degrades quality of life. Planners and engineers are constantly seeking innovative solutions, from expanding public transit to implementing smart traffic management systems.
                <br /><br />
                Looking to the future, the concept of the "smart city" has gained traction. This vision involves leveraging technology, particularly the Internet of Things (IoT) and data analytics, to create more efficient, sustainable, and livable urban environments. Future cities will likely be more technologically integrated, with sensors monitoring everything from air quality to traffic flow, providing real-time data to optimize city services. While the path to this future is complex, the goal remains clear: to build cities that are not only economically prosperous but also inclusive and resilient for all their inhabitants.
              </p>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Comprehension Questions</CardTitle>
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
