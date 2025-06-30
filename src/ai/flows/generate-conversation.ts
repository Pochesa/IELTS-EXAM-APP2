'use server';

/**
 * @fileOverview Generates a conversational audio file for the listening module.
 *
 * - generateConversation - A function that returns a data URI for a WAV audio file.
 */

import { ai } from '@/ai/genkit';
import { googleAI } from '@genkit-ai/googleai';
import { z } from 'zod';
import wav from 'wav';

const ConversationOutputSchema = z.object({
  audioDataUri: z.string().describe("The generated conversation audio as a data URI in WAV format."),
});

export type ConversationOutput = z.infer<typeof ConversationOutputSchema>;

export async function generateConversation(): Promise<ConversationOutput> {
  return generateConversationFlow();
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateConversationFlow = ai.defineFlow(
  {
    name: 'generateConversationFlow',
    inputSchema: z.void(),
    outputSchema: ConversationOutputSchema,
  },
  async () => {
    const conversationPrompt = `Speaker1: Hi Alex, have you had any thoughts about our vacation?
Speaker2: Hey! I was just thinking about that. I was thinking we could plan a trip somewhere exciting.
Speaker1: I love that idea. I was getting tired of the city. What about going to the mountains? The scenery would be amazing.
Speaker2: The mountains sound perfect! A nice escape. When were you thinking of going?
Speaker1: I have some time off next month. Would that work for you?
Speaker2: Next month is great for me too. Let's start looking at cabins!`;

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: 'Speaker1',
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Algenib' },
                },
              },
              {
                speaker: 'Speaker2',
                voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Achernar' },
                },
              },
            ],
          },
        },
      },
      prompt: conversationPrompt,
    });

    if (!media) {
      throw new Error('No media was generated.');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    const wavData = await toWav(audioBuffer);

    return {
      audioDataUri: 'data:audio/wav;base64,' + wavData,
    };
  }
);
