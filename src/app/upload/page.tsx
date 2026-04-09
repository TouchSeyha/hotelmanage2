'use client';

import type { PutBlobResult } from '@vercel/blob';
import { useState, useRef } from 'react';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
import { Reveal } from '~/components/motion/reveal';

export default function UploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [blob, setBlob] = useState<PutBlobResult | null>(null);

  return (
    <div className="container py-10">
      <Reveal variant="hero" className="mb-6">
        <h1 className="text-3xl font-bold">Upload Your Image</h1>
        <p className="text-muted-foreground mt-2">
          Simple asset upload utility for testing Vercel Blob image storage.
        </p>
      </Reveal>

      <Reveal delay={1} variant="panel" className="max-w-xl">
        <Card className="motion-card-hover">
          <CardHeader>
            <CardTitle>Image Upload</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={async (event) => {
                event.preventDefault();

                if (!inputFileRef.current?.files) {
                  throw new Error('No file selected');
                }

                const file = inputFileRef.current.files[0];

                if (!file) {
                  throw new Error('No file selected');
                }

                const response = await fetch(`/api/upload?filename=${file.name}`, {
                  method: 'POST',
                  body: file,
                });

                const newBlob = (await response.json()) as PutBlobResult;

                setBlob(newBlob);
              }}
            >
              <input
                name="file"
                ref={inputFileRef}
                type="file"
                accept="image/jpeg, image/png, image/webp"
                required
                className="block w-full rounded-md border p-3"
              />
              <Button type="submit">Upload</Button>
            </form>
            {blob && (
              <p className="text-muted-foreground mt-4 text-sm">
                Blob url:{' '}
                <a href={blob.url} className="text-primary underline">
                  {blob.url}
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      </Reveal>
    </div>
  );
}
