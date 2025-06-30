import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, BookOpen, Clock, Headphones, Mic, Pencil } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const modules = [
  {
    title: 'Listening',
    description: 'Hone your listening skills with our interactive exercises.',
    icon: Headphones,
    href: '/listening',
    image: {
      src: 'https://placehold.co/600x400.png',
      hint: 'person headphones'
    }
  },
  {
    title: 'Reading',
    description: 'Practice with a wide range of academic reading passages.',
    icon: BookOpen,
    href: '/reading',
    image: {
      src: 'https://placehold.co/600x400.png',
      hint: 'person reading'
    }
  },
  {
    title: 'Writing',
    description: 'Get AI-powered feedback on your writing tasks.',
    icon: Pencil,
    href: '/writing',
    image: {
      src: 'https://placehold.co/600x400.png',
      hint: 'person writing'
    }
  },
  {
    title: 'Speaking',
    description: 'Record and review your responses for the speaking test.',
    icon: Mic,
    href: '/speaking',
    image: {
      src: 'https://placehold.co/600x400.png',
      hint: 'microphone podcast'
    }
  },
];

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold font-headline">Welcome back!</h1>
          <p className="text-muted-foreground">Here&apos;s your progress overview. Keep up the great work!</p>
        </div>
        <Button asChild>
          <Link href="/mock-tests">
            Start Mock Test <Clock className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>You have completed 65% of your study plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={65} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        {modules.map((module) => (
          <Card key={module.title} className="flex flex-col">
            <CardHeader className="p-0">
               <Image
                  src={module.image.src}
                  alt={module.title}
                  width={600}
                  height={400}
                  className="rounded-t-lg object-cover aspect-[3/2]"
                  data-ai-hint={module.image.hint}
                />
            </CardHeader>
            <div className="p-6 flex flex-col flex-grow">
              <div className="flex items-center gap-4 mb-2">
                <div className="bg-primary/10 p-2 rounded-md">
                    <module.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="font-headline">{module.title}</CardTitle>
              </div>
              <CardDescription className="flex-grow">{module.description}</CardDescription>
            </div>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={module.href}>
                  Go to Module <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </AppLayout>
  );
}
