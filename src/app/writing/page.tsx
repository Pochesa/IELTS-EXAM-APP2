'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { getWritingSuggestions, WritingSuggestionsOutput } from '@/ai/flows/writing-suggestions';
import { Loader2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  essay: z.string().min(50, {
    message: "Essay must be at least 50 characters.",
  }),
});

export default function WritingPage() {
  const [suggestions, setSuggestions] = useState<WritingSuggestionsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      essay: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setSuggestions(null);
    try {
      const result = await getWritingSuggestions({ essay: values.essay });
      setSuggestions(result);
    } catch (error) {
      console.error("Error getting writing suggestions:", error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to get AI suggestions. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold font-headline">Writing Module with AI Assistance</h1>
        <p className="text-muted-foreground">
          Submit your writing essays and leverage our AI tool for suggestions on spelling, grammar, and vocabulary.
        </p>
      </div>
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Your Essay</CardTitle>
            <CardDescription>Write your essay in the text area below.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="essay"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Start writing your essay here..."
                          className="min-h-[300px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="mr-2 h-4 w-4" />
                  )}
                  Get AI Suggestions
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Suggestions</CardTitle>
            <CardDescription>Here are the suggestions to improve your essay.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex items-center justify-center h-full min-h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {suggestions ? (
              <div className="text-sm whitespace-pre-wrap font-mono bg-muted/50 p-4 rounded-md h-full min-h-[300px]">
                {suggestions.suggestions}
              </div>
            ) : !isLoading && (
              <div className="flex items-center justify-center h-full min-h-[300px] text-muted-foreground text-center">
                <p>Submit an essay to see AI-powered suggestions.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
